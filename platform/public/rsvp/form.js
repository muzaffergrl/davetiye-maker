/* Platform RSVP form script (G042). Served at /rsvp/form.js; themes include it on their RSVP page:
 *
 *   <script src="/rsvp/form.js" defer></script>
 *   <form data-rsvp-form method="post"> inputs by name: name, email, attending, guests, message </form>
 *   <div data-rsvp-state="success" hidden> ... </div>   (also: closed, error, preview)
 *
 * Full contract: platform/README.md, section "RSVP". No dependencies, no inline handlers (CSP).
 * The script reads the slug from the page's #site-data block and talks to /api/rsvp/<slug>.
 * The browser's own validation bubbles are turned off (form.noValidate): the same English messages
 * as the server go into the theme's [data-rsvp-error-for] slots, linked to their fields with
 * aria-describedby. A closed form also gets data-rsvp-reason="deadline|disabled" (theme CSS hook).
 */
(function () {
  'use strict';

  var FIELDS = ['name', 'email', 'attending', 'guests', 'message'];
  var PLAIN_SLUG = /^[a-z0-9-]+$/;
  var slotSeq = 0;
  var HONEYPOT = 'website';
  var TEXT = {
    success: 'Thank you! Your reply has been sent.',
    closed: 'Replies are closed. If you still need to reply, please contact the couple directly.',
    error: 'We could not send your reply. Please check your connection and try again.',
    preview: 'This is a preview, so replies are not sent. Guests can reply once the site is published.'
  };

  function siteData() {
    var el = document.getElementById('site-data');
    if (!el) return null;
    try {
      return JSON.parse(el.textContent || '{}');
    } catch (e) {
      return null;
    }
  }

  function each(list, fn) {
    Array.prototype.forEach.call(list, fn);
  }

  function isRadioList(f) {
    return typeof RadioNodeList !== 'undefined' && f instanceof RadioNodeList;
  }

  function fieldValue(form, name) {
    var f = form.elements.namedItem(name);
    if (!f) return '';
    if (isRadioList(f)) return f.value;
    if (f.type === 'radio') return f.checked ? f.value : '';
    if (f.type === 'checkbox') {
      if (name === 'attending') return f.checked ? 'yes' : 'no';
      return f.checked ? f.value : '';
    }
    return f.value == null ? '' : String(f.value);
  }

  function replyOf(value) {
    var v = String(value || '').toLowerCase();
    if (v === 'yes' || v === 'true') return 'yes';
    if (v === 'no' || v === 'false') return 'no';
    return '';
  }

  function firstControl(f) {
    return isRadioList(f) ? f[0] : f;
  }

  function ensureHoneypot(form) {
    if (form.elements.namedItem(HONEYPOT)) return;
    var wrap = document.createElement('div');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.setAttribute('data-rsvp-honeypot', '');
    wrap.style.cssText = 'position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;';
    var label = document.createElement('label');
    label.textContent = 'Website';
    var input = document.createElement('input');
    input.type = 'text';
    input.name = HONEYPOT;
    input.tabIndex = -1;
    input.autocomplete = 'off';
    label.appendChild(input);
    wrap.appendChild(label);
    form.appendChild(wrap);
  }

  function setup(form, ctx) {
    var root = form.closest('[data-rsvp]');
    var scope = root || document;
    var busy = false;

    function panels() {
      return scope.querySelectorAll('[data-rsvp-state]');
    }

    function setReason(reason) {
      each(root ? [form, root] : [form], function (el) {
        if (reason) el.setAttribute('data-rsvp-reason', reason);
        else el.removeAttribute('data-rsvp-reason');
      });
    }

    function setStatus(state) {
      form.setAttribute('data-rsvp-status', state);
      if (root) root.setAttribute('data-rsvp-status', state);
      var ev;
      try {
        ev = new CustomEvent('rsvp:state', { bubbles: true, detail: { state: state } });
      } catch (e) {
        ev = null;
      }
      if (ev) form.dispatchEvent(ev);
    }

    function removeFallback() {
      each(scope.querySelectorAll('[data-rsvp-fallback]'), function (el) {
        el.parentNode.removeChild(el);
      });
    }

    function fallback(state, message) {
      removeFallback();
      var p = document.createElement('p');
      p.setAttribute('data-rsvp-fallback', state);
      p.setAttribute('role', state === 'error' ? 'alert' : 'status');
      p.textContent = message;
      form.parentNode.insertBefore(p, form.nextSibling);
      return p;
    }

    function show(state, message, opts) {
      opts = opts || {};
      var active = null;
      each(panels(), function (p) {
        var on = p.getAttribute('data-rsvp-state') === state;
        p.hidden = !on;
        if (!on) return;
        active = p;
        if (!p.hasAttribute('role')) p.setAttribute('role', state === 'error' ? 'alert' : 'status');
        if (message) {
          each(p.querySelectorAll('[data-rsvp-message]'), function (m) {
            m.textContent = message;
          });
        }
      });
      if (active) removeFallback();
      else if (state !== 'ready') active = fallback(state, message || TEXT[state]);
      each(scope.querySelectorAll('[data-rsvp-reply]'), function (el) {
        el.hidden = el.getAttribute('data-rsvp-reply') !== (opts.reply || '');
      });
      form.hidden = state === 'success' || state === 'closed';
      setStatus(state);
      if (opts.focus && active && form.hidden) {
        if (!active.hasAttribute('tabindex')) active.setAttribute('tabindex', '-1');
        active.focus();
      }
    }

    function hidePanels() {
      each(panels(), function (p) {
        p.hidden = true;
      });
      removeFallback();
    }

    function syncAttending() {
      var no = replyOf(fieldValue(form, 'attending')) === 'no';
      each(scope.querySelectorAll('[data-rsvp-if-attending]'), function (el) {
        el.hidden = no;
        each(el.querySelectorAll('input, select, textarea'), function (c) {
          c.disabled = no;
        });
      });
    }

    function describedBy(c, id, on) {
      var ids = (c.getAttribute('aria-describedby') || '').split(/\s+/).filter(function (x) {
        return x && x !== id;
      });
      if (on) ids.push(id);
      if (ids.length) c.setAttribute('aria-describedby', ids.join(' '));
      else c.removeAttribute('aria-describedby');
    }

    function slotId(el) {
      if (!el.id) el.id = 'rsvp-error-' + el.getAttribute('data-rsvp-error-for') + '-' + ++slotSeq;
      return el.id;
    }

    function clearInvalid(target) {
      var name = target && target.name;
      if (!name || FIELDS.indexOf(name) === -1) return;
      var f = form.elements.namedItem(name);
      if (!f) return;
      var slots = scope.querySelectorAll('[data-rsvp-error-for="' + name + '"]');
      each(isRadioList(f) ? f : [f], function (c) {
        c.removeAttribute('aria-invalid');
        if (c.setCustomValidity) c.setCustomValidity('');
        each(slots, function (el) {
          describedBy(c, slotId(el), false);
        });
      });
      each(slots, function (el) {
        el.textContent = '';
      });
    }

    /** Field messages from the browser's constraint check, worded like the server's (lib/rsvp/validate.ts). */
    function clientErrors() {
      var out = null;
      FIELDS.forEach(function (name) {
        var f = form.elements.namedItem(name);
        if (!f) return;
        var list = isRadioList(f) ? Array.prototype.slice.call(f) : [f];
        var bad = list.filter(function (c) {
          return c.willValidate && c.validity && !c.validity.valid;
        })[0];
        if (!bad) return;
        var v = bad.validity;
        var msg;
        if (name === 'name') msg = v.tooLong ? 'Please keep your name to ' + bad.maxLength + ' characters or fewer.' : 'Please enter your name.';
        else if (name === 'email') msg = 'Please check your email address.';
        else if (name === 'attending') msg = 'Please let us know if you can attend.';
        else if (name === 'guests') msg = 'Please enter a number of guests from ' + (bad.min || 1) + (bad.max ? ' to ' + bad.max : '') + '.';
        else msg = 'Please keep your message to ' + (bad.maxLength > 0 ? bad.maxLength : 500) + ' characters or fewer.';
        out = out || {};
        out[name] = msg;
      });
      return out;
    }

    function markInvalid(fields) {
      if (!fields) return;
      var first = null;
      var firstHasSlot = false;
      FIELDS.forEach(function (name) {
        var msg = fields[name];
        if (!msg) return;
        var f = form.elements.namedItem(name);
        var slots = scope.querySelectorAll('[data-rsvp-error-for="' + name + '"]');
        each(slots, function (el) {
          el.textContent = msg;
        });
        if (!f) return;
        each(isRadioList(f) ? f : [f], function (c) {
          c.setAttribute('aria-invalid', 'true');
          // Screen readers read the reason with the field, not only "invalid".
          each(slots, function (el) {
            describedBy(c, slotId(el), true);
          });
        });
        var c0 = firstControl(f);
        // No theme slot for this field: fall back to the browser's own validation bubble.
        if (!slots.length && c0 && c0.setCustomValidity) c0.setCustomValidity(msg);
        if (!first) {
          first = c0;
          firstHasSlot = slots.length > 0;
        }
      });
      if (!first) return;
      if (!firstHasSlot && first.reportValidity) first.reportValidity();
      else if (first.focus) first.focus();
    }

    function setBusy(on) {
      if (on) form.setAttribute('aria-busy', 'true');
      else form.removeAttribute('aria-busy');
      each(form.querySelectorAll('button[type="submit"], button:not([type]), input[type="submit"]'), function (b) {
        b.disabled = on;
      });
    }

    function payload() {
      var out = {};
      FIELDS.concat([HONEYPOT]).forEach(function (name) {
        out[name] = fieldValue(form, name);
      });
      return out;
    }

    function onSubmit(e) {
      e.preventDefault();
      if (busy) return;
      var invalid = clientErrors();
      if (invalid) {
        markInvalid(invalid);
        return;
      }
      if (ctx.preview) {
        show('preview', TEXT.preview, { focus: false });
        return;
      }
      var data = payload();
      var reply = replyOf(data.attending);
      hidePanels();
      busy = true;
      setBusy(true);
      setStatus('sending');
      fetch(ctx.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
        credentials: 'same-origin'
      })
        .then(function (res) {
          return res.json().catch(function () {
            return null;
          });
        })
        .then(function (b) {
          b = b || {};
          if (b.ok && b.state === 'success') {
            form.reset();
            syncAttending();
            show('success', b.message, { reply: reply, focus: true });
          } else if (b.state === 'closed') {
            setReason(b.reason || 'deadline');
            show('closed', b.message, { focus: true });
          } else {
            show('error', b.message || TEXT.error);
            markInvalid(b.fields);
          }
        })
        .catch(function () {
          show('error', TEXT.error);
        })
        .then(function () {
          busy = false;
          setBusy(false);
        });
    }

    function again(e) {
      if (e) e.preventDefault();
      form.reset();
      hidePanels();
      form.hidden = false;
      syncAttending();
      setReason(null);
      setStatus('ready');
      var n = form.elements.namedItem('name');
      if (n && n.focus) n.focus();
    }

    function checkStatus() {
      var url = ctx.endpoint + (ctx.previewKey ? '?preview=' + encodeURIComponent(ctx.previewKey) : '');
      fetch(url, { headers: { Accept: 'application/json' }, credentials: 'same-origin' })
        .then(function (res) {
          return res.json();
        })
        .then(function (b) {
          if (!b || !b.ok) return;
          var g = form.elements.namedItem('guests');
          if (b.maxGuests && g && g.type === 'number' && (!g.max || Number(g.max) > b.maxGuests)) {
            g.max = String(b.maxGuests);
            if (!g.min) g.min = '1';
          }
          if (b.open === false) {
            setReason(b.reason || 'deadline');
            show('closed', b.message, { focus: false });
          }
        })
        .catch(function () {
          /* the server checks again on submit */
        });
    }

    ensureHoneypot(form);
    // Styled, English messages in the theme's slots instead of the browser bubble (device language).
    form.noValidate = true;
    hidePanels();
    each(scope.querySelectorAll('[data-rsvp-reply]'), function (el) {
      el.hidden = true;
    });
    syncAttending();
    form.addEventListener('change', function (e) {
      if (e.target && e.target.name === 'attending') syncAttending();
      clearInvalid(e.target);
    });
    form.addEventListener('input', function (e) {
      clearInvalid(e.target);
    });
    form.addEventListener('submit', onSubmit);
    each(scope.querySelectorAll('[data-rsvp-again]'), function (b) {
      b.addEventListener('click', again);
    });
    setStatus('ready');
    if (ctx.statusCheck) checkStatus();
  }

  function init() {
    var forms = document.querySelectorAll('form[data-rsvp-form]');
    if (!forms.length) return;
    var data = siteData();
    if (!data || !data.slug) return;
    var previewKey = null;
    try {
      previewKey = new URLSearchParams(window.location.search).get('preview');
    } catch (e) {
      previewKey = null;
    }
    var ctx = {
      endpoint: '/api/rsvp/' + encodeURIComponent(data.slug),
      preview: Boolean(data.preview),
      previewKey: data.preview ? previewKey : null,
      // A theme demo (/start/demo/<theme>, slug "start/demo/…") has no site to ask: it only previews.
      statusCheck: PLAIN_SLUG.test(String(data.slug))
    };
    each(forms, function (form) {
      setup(form, ctx);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
