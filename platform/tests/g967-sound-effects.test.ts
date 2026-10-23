// G967–G969: the sound-effect library (50 stereo foley files), every theme's own opening cue list, and the player
// (public/audio/audio.js) run against a fake Web Audio: decoding before the tap, cues on the audio clock relative to the
// tap, stereo pan, mute, reduced motion, Skip, a clock that wakes up late (iOS).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { DESIGN_SOUND, EFFECT_NAMES, type OpeningCue } from '../lib/audio/catalog.ts';
import { detectAudioType } from '../lib/uploads.ts';
import { PLATFORM_ROOT } from './helpers.ts';

const THEMES_DIR = path.join(PLATFORM_ROOT, 'themes');
const AUDIO_DIR = path.join(PLATFORM_ROOT, 'public', 'audio');
const FX_DIR = path.join(AUDIO_DIR, 'fx');
const G126 = ['seal', 'ribbon', 'clasp', 'paper', 'slide', 'page', 'tear', 'whoosh', 'chime', 'tap'];
const themes = readdirSync(THEMES_DIR).filter((t) => t !== '_sample' && statSync(path.join(THEMES_DIR, t)).isDirectory());

// ------------------------------------------------------------------------------------------------------- library

test('G967 library: 35–60 effects, one file each (no strays), ≤ 56 KB each and ≤ 1.5 MB together, mp3, in LICENSES.md', () => {
  assert.ok(EFFECT_NAMES.length >= 35 && EFFECT_NAMES.length <= 60, `${EFFECT_NAMES.length} effects`);
  for (const name of G126) assert.ok((EFFECT_NAMES as readonly string[]).includes(name), `G126 name ${name} kept`);
  assert.equal(new Set(EFFECT_NAMES).size, EFFECT_NAMES.length, 'unique names');
  const files = readdirSync(FX_DIR).filter((f) => !f.startsWith('.'));
  assert.deepEqual(new Set(files), new Set(EFFECT_NAMES.map((n) => `${n}.mp3`)), 'fx/ holds exactly the catalogue');
  const licences = readFileSync(path.join(AUDIO_DIR, 'LICENSES.md'), 'utf8');
  let total = 0;
  for (const name of EFFECT_NAMES) {
    const file = path.join(FX_DIR, `${name}.mp3`);
    const size = statSync(file).size;
    total += size;
    assert.ok(size > 2000 && size <= 56 * 1024, `${name}: ${size} bytes`);
    assert.ok(detectAudioType(readFileSync(file)), `${name} is not an mp3`);
    assert.ok(licences.includes(`fx/${name}.mp3`), `${name} not in LICENSES.md`);
  }
  assert.ok(total <= 1.5 * 1024 * 1024, `fx/ ${total} bytes`);
});

test('G968 every theme has its own opening: 3–8 cues, answers the tap within 250 ms, known effects, pans in range, no two alike', () => {
  const seen = new Map<string, string>();
  for (const theme of themes) {
    const s = DESIGN_SOUND[theme];
    assert.ok(s, `${theme}: no sound entry`);
    const cues: readonly OpeningCue[] = s.opening;
    assert.ok(cues.length >= 3 && cues.length <= 8, `${theme}: ${cues.length} cues`);
    assert.ok(cues[0][0] <= 250, `${theme}: first cue at ${cues[0][0]} ms`);
    for (const c of cues) {
      assert.ok((EFFECT_NAMES as readonly string[]).includes(c[1]), `${theme}: unknown effect ${c[1]}`);
      assert.ok(Number.isInteger(c[0]) && c[0] >= 0 && c[0] < 5000, `${theme}: ${c[0]} ms`);
      if (c.length === 3) assert.ok(Number.isFinite(c[2]) && c[2] !== 0 && Math.abs(c[2]) <= 1, `${theme}: pan ${c[2]}`);
    }
    const key = JSON.stringify(cues);
    assert.ok(!seen.has(key), `${theme} sounds exactly like ${seen.get(key)}`);
    seen.set(key, theme);
  }
});

test('G968 every effect is heard somewhere (an opening, or the player: tap = page links, chime = RSVP sent)', () => {
  const used = new Set<string>(['tap', 'chime']);
  for (const s of Object.values(DESIGN_SOUND)) for (const c of s.opening) used.add(c[1]);
  for (const name of EFFECT_NAMES) assert.ok(used.has(name), `${name} is never played`);
});

// -------------------------------------------------------------------------------------------------------- player

const PLAYER = readFileSync(path.join(AUDIO_DIR, 'audio.js'), 'utf8');

interface Played {
  name: string;
  /** seconds on the audio clock */
  when: number;
  pan: number;
  run: { gain: { value: number } } | null;
}

/** Runs public/audio/audio.js in a VM with a fake DOM and a fake Web Audio; time is moved by hand. */
function player(opts: { opening: unknown[]; muted?: boolean; reduce?: boolean; resumeDelayMs?: number }) {
  let now = 0;
  const idle: Array<() => void> = [];
  const timers: Array<{ at: number; fn: () => void }> = [];
  const listeners: Record<string, Array<(e: unknown) => void>> = {};
  const played: Played[] = [];
  const decoded: string[] = [];
  let contexts = 0;
  let resumeWaiters: Array<() => void> = [];

  class Param {
    value = 1;
    setTargetAtTime(v: number) {
      this.value = v;
    }
  }
  class Node {
    dest: Node | null = null;
    connect(n: Node) {
      this.dest = n;
      return n;
    }
    disconnect() {}
  }
  class Gain extends Node {
    gain = new Param();
  }
  class Panner extends Node {
    pan = new Param();
  }
  const out: { node: Gain | null } = { node: null };
  class Source extends Node {
    buffer: { name: string } | null = null;
    start(when: number) {
      let pan = 0;
      let n: Node | null = this.dest;
      if (n instanceof Panner) {
        pan = n.pan.value;
        n = n.dest;
      }
      played.push({ name: this.buffer!.name, when, pan, run: n instanceof Gain && n !== out.node ? n : null });
    }
  }
  const decode = (who: string) =>
    function (ab: ArrayBuffer, ok?: (b: unknown) => void) {
      const name = new TextDecoder().decode(ab);
      decoded.push(`${who}:${name}`);
      const b = { name };
      ok?.(b);
      return Promise.resolve(b);
    };
  class Ctx {
    state = 'suspended';
    currentTime = 10;
    destination = new Node();
    constructor() {
      contexts += 1;
    }
    createGain() {
      const g = new Gain();
      out.node ??= g;
      return g;
    }
    createStereoPanner() {
      return new Panner();
    }
    createBufferSource() {
      return new Source();
    }
    createBuffer() {
      return { name: '(unlock)' };
    }
    resume() {
      if (!opts.resumeDelayMs) {
        this.state = 'running';
        return Promise.resolve();
      }
      return new Promise<void>((ok) => resumeWaiters.push(() => {
        this.state = 'running';
        ok();
      }));
    }
    decodeAudioData = decode('ctx');
  }
  class Offline {
    decodeAudioData = decode('offline');
  }
  const siteData = JSON.stringify({ slug: 'g967', page: 'index', sound: { music: null, effects: true, fx: '/audio/fx/', opening: opts.opening } });
  const el = () => ({ type: '', className: '', innerHTML: '', style: {}, setAttribute() {}, addEventListener() {}, appendChild() {}, classList: { toggle() {} } });
  const sandbox: Record<string, unknown> = {
    document: {
      getElementById: (id: string) => (id === 'site-data' ? { textContent: siteData } : null),
      documentElement: { classList: { contains: () => false } },
      addEventListener: (type: string, fn: (e: unknown) => void) => (listeners[type] ??= []).push(fn),
      createElement: el,
      createTextNode: () => ({}),
      head: { appendChild() {} },
      body: { appendChild() {} },
      querySelector: () => null,
      hidden: false,
    },
    AudioContext: Ctx,
    OfflineAudioContext: Offline,
    matchMedia: () => ({ matches: Boolean(opts.reduce) }),
    performance: { now: () => now },
    requestIdleCallback: (fn: () => void) => idle.push(fn),
    setTimeout: (fn: () => void, ms: number) => timers.push({ at: now + ms, fn }),
    clearTimeout() {},
    setInterval: () => 0,
    clearInterval() {},
    sessionStorage: { getItem: (k: string) => (opts.muted && k === 'invite:sound:g967' ? 'off' : null), setItem() {}, removeItem() {} },
    fetch: (url: string) => Promise.resolve({ ok: true, arrayBuffer: () => Promise.resolve(new TextEncoder().encode(url.split('/').pop()!.replace('.mp3', '')).buffer) }),
    getComputedStyle: () => ({ backgroundColor: '#fff', color: '#000' }),
    location: { origin: 'https://wedding.example', pathname: '/g967', search: '' },
    navigator: {},
    addEventListener() {},
    TextDecoder,
    TextEncoder,
    Promise,
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(PLAYER, sandbox);
  const settle = async () => {
    for (let i = 0; i < 12; i++) await new Promise((r) => setImmediate(r));
  };
  const target = (sel: string) => ({ closest: (q: string) => (q === sel ? {} : null) });
  return {
    played,
    decoded,
    contexts: () => contexts,
    async idle() {
      idle.splice(0).forEach((fn) => fn());
      await settle();
    },
    async click(sel: string) {
      for (const fn of listeners.click ?? []) fn({ target: target(sel), defaultPrevented: false, button: 0 });
      await settle();
    },
    async advance(ms: number) {
      now += ms;
      for (const t of timers.splice(0)) if (t.at <= now) t.fn();
      else timers.push(t);
      await settle();
    },
    async wake() {
      resumeWaiters.splice(0).forEach((fn) => fn());
      resumeWaiters = [];
      await settle();
    },
  };
}

const OPENING = [[0, 'seal-lift'], [260, 'paper-soft'], [1180, 'curtain', -0.45], [1620, 'slide'], [3000, 'chime']];
const offsets = (p: Played[]) => p.filter((x) => x.name !== '(unlock)').map((x) => [x.name, Math.round((x.when - 10.005) * 1000), x.pan]);

test('G969 player: decodes the opening before the tap (no context, no sound), then schedules every cue on the audio clock with its pan', async () => {
  const p = player({ opening: OPENING });
  await p.idle();
  assert.equal(p.contexts(), 0, 'no AudioContext before the guest taps');
  assert.deepEqual(p.decoded.sort(), ['seal-lift', 'paper-soft', 'curtain', 'slide', 'chime', 'tap'].map((n) => `offline:${n}`).sort());
  assert.equal(p.played.length, 0);
  await p.click('.stage');
  assert.equal(p.contexts(), 1);
  assert.deepEqual(offsets(p.played), [['seal-lift', 0, 0], ['paper-soft', 260, 0], ['curtain', 1180, -0.45], ['slide', 1620, 0], ['chime', 3000, 0]]);
  assert.ok(p.played.filter((x) => x.name !== '(unlock)').every((x) => x.run), 'cues go through the opening’s own gain');
  // a second tap while it runs does not start it again
  await p.click('.stage');
  assert.equal(offsets(p.played).length, 5);
});

test('G969 player: Skip fades the running opening out; Replay starts it afresh', async () => {
  const p = player({ opening: OPENING });
  await p.idle();
  await p.click('.stage');
  const run = p.played.find((x) => x.name === 'chime')!.run!;
  assert.equal(run.gain.value, 1);
  await p.click('[data-skip]');
  assert.equal(run.gain.value, 0, 'faded to silence');
  await p.click('.replay');
  assert.equal(offsets(p.played).filter(([n]) => n === 'chime').length, 2);
});

test('G969 player: sound switched off → nothing; reduced motion → only the first cue', async () => {
  const off = player({ opening: OPENING, muted: true });
  await off.idle();
  await off.click('.stage');
  assert.equal(offsets(off.played).length, 0);
  const calm = player({ opening: OPENING, reduce: true });
  await calm.idle();
  await calm.click('.stage');
  assert.deepEqual(offsets(calm.played), [['seal-lift', 0, 0]]);
});

test('G969 player: a clock that wakes up late (iOS) keeps the cues on the tap’s timeline and drops the ones > 350 ms late', async () => {
  const p = player({ opening: OPENING, resumeDelayMs: 500 });
  await p.idle();
  await p.click('.stage');
  assert.equal(offsets(p.played).length, 0, 'nothing is placed on a frozen clock');
  await p.advance(500);
  await p.wake();
  // the seal (0 ms) is 500 ms late → dropped; the flap (260 ms) is 240 ms late → at once; the rest keep their places
  assert.deepEqual(offsets(p.played), [['paper-soft', 0, 0], ['curtain', 680, -0.45], ['slide', 1120, 0], ['chime', 2500, 0]]);
});
