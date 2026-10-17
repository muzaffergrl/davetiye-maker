'use client';
// G126: "Music & sound" on the Our Story editor page — the story music (one of the design-friendly tracks, the couple's
// own MP3 / M4A, or none) with a listen button, and the sound effects switch. Everything is content.audio (docs/03),
// saved and published like any other field.

import { Music, Pause, Play, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { designSound, findTrack, MUSIC_TRACKS } from '../../lib/audio/catalog.ts';
import { previewPhotoUrl } from '../../lib/panel/model.ts';
import { Group, Switch, usePanelContext } from './fields.tsx';
import { MUSIC_ACCEPT, musicFileProblem } from './music-upload.ts';
import { Button, Segmented } from './ui.tsx';
import styles from './panel.module.css';
import own from './music.module.css';
import { t } from '../../lib/i18n/client.ts';

type Choice = string; // track id | 'custom' | 'off'

export function MusicFields() {
  const { content, edit, locked, online, previewToken, uploadMusic, themeId, opening } = usePanelContext();
  const audio = content.audio ?? {};
  const fallback = designSound(themeId ?? '').music;
  const stored = audio.music ?? fallback;
  const choice: Choice = stored === 'custom' || stored === 'off' || findTrack(stored) ? stored : fallback;
  const file = typeof audio.music_file === 'string' && audio.music_file ? audio.music_file : null;
  const storyOn = content.optional_blocks?.our_story === true;
  const effects = audio.effects !== false;

  const player = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => () => player.current?.pause(), []);

  const listenUrl = choice === 'custom' ? (file ? previewPhotoUrl(file, previewToken) : null) : (findTrack(choice)?.url ?? null);
  const stop = () => {
    player.current?.pause();
    setPlaying(null);
  };
  const listen = () => {
    if (!listenUrl) return;
    if (playing === listenUrl) return stop();
    player.current?.pause();
    const a = new Audio(listenUrl);
    a.volume = 0.7;
    a.onended = () => setPlaying(null);
    player.current = a;
    a.play().then(
      () => setPlaying(listenUrl),
      () => setMessage(t('This file could not be played here. Please try another MP3 or M4A file.')),
    );
  };

  const choose = (v: Choice) => {
    stop();
    setMessage(null);
    edit((c) => void (c.audio = { ...(c.audio ?? {}), music: v }));
    if (v === 'custom' && !file) input.current?.click();
  };

  const onFile = async (f: File | undefined) => {
    if (!f || !uploadMusic) return;
    const problem = musicFileProblem(f);
    if (problem) return setMessage(problem);
    stop();
    setMessage(null);
    setBusy(0);
    const res = await uploadMusic(f, (share) => setBusy(share));
    setBusy(null);
    if (!res.ok) setMessage(res.message ? t(res.message) : t('The music could not be uploaded.'));
  };

  const options = [
    ...MUSIC_TRACKS.map((tr) => ({
      value: tr.id,
      label: tr.id === fallback ? t('{track} (suggested for this design)', { track: t(tr.label) }) : t(tr.label),
      hint: t(tr.mood),
    })),
    { value: 'custom', label: t('Your own music'), hint: t('Upload an MP3 or M4A file, up to 10 MB.') },
    { value: 'off', label: t('No music'), hint: t('The Our Story page stays quiet.') },
  ];

  return (
    <Group title={t('Music & sound')} data-music-fields="">
      <p className={styles.hint}>
        {t('Music plays softly on your Our Story page. Guests can pause it at any time; some phones wait for a tap before it starts.')}
      </p>
      {!storyOn ? <p className={styles.note}>{t('The Our Story page is off, so guests will not hear the music.')}</p> : null}
      <Segmented label={t('Story music')} value={choice} options={options} onChange={choose} disabled={locked} stacked />

      {choice === 'custom' ? (
        <div className={own.file}>
          <Music size={18} aria-hidden="true" />
          <span className={own.fileName}>{file ? (audio.music_name || t('Your music file')) : t('No file yet')}</span>
          <input
            ref={input}
            type="file"
            accept={MUSIC_ACCEPT}
            className={styles.fileInput}
            aria-label={t('Choose a music file')}
            onChange={(e) => {
              void onFile(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
          <Button
            small
            icon={Upload}
            disabled={locked || !online || !uploadMusic}
            busy={busy !== null}
            busyLabel={busy !== null ? t('Uploading… {percent}%', { percent: Math.round(busy * 100) }) : undefined}
            onClick={() => input.current?.click()}
          >
            {file ? t('Replace file') : t('Choose a file')}
          </Button>
        </div>
      ) : null}
      {choice === 'custom' ? <p className={styles.hint}>{t('Only upload music you have the right to use (your own recording or a licence that allows it).')}</p> : null}

      {listenUrl ? (
        <Button small icon={playing === listenUrl ? Pause : Play} onClick={listen} aria-pressed={playing === listenUrl}>
          {playing === listenUrl ? t('Stop') : t('Listen')}
        </Button>
      ) : null}
      {message ? (
        <p className={styles.issueError} role="alert">
          {message}
        </p>
      ) : null}

      <Switch
        id="audio-effects"
        label={t('Sound effects')}
        hint={t('Soft sounds when guests open the {thing}, move between pages and send their reply.', { thing: opening ? t(opening) : t('invitation') })}
        checked={effects}
        onChange={(on) => edit((c) => void (c.audio = { ...(c.audio ?? {}), effects: on }))}
      />
    </Group>
  );
}
