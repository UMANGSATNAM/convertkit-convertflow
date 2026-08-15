/*
  countdown.js — one engine for every countdown in the theme.

  Markup contract:
    <span data-countdown
          data-countdown-mode="evergreen|fixed|daily"
          data-countdown-hours="4"                  (evergreen)
          data-countdown-end="2026-08-31T23:59:00"  (fixed)
          data-countdown-daily="23:59"              (daily)
          data-countdown-expired="hide|message|restart"
          data-countdown-expired-text="Offer ended"
          data-countdown-prefix="🔥 "></span>

  Modes
    evergreen  X hours from this visitor's first view of the page. Stored in
               localStorage per path, so a refresh does not reset it.
    fixed      a real deadline set by the merchant. Same for every visitor.
    daily      resets every day at the given local time.

  On expiry
    hide       remove the whole timer block from view
    message    swap in data-countdown-expired-text
    restart    begin the interval again (evergreen/daily only)

  Digits are rendered with fixed-width tabular numerals so nothing shifts as
  the seconds tick. Respects prefers-reduced-motion by simply not animating —
  the value still updates.
*/
(function () {
  'use strict';

  var SEL = '[data-countdown]';
  var STORE = 'cf_countdown_';

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function endFor(el) {
    var mode = el.dataset.countdownMode || 'evergreen';

    if (mode === 'fixed') {
      var raw = el.dataset.countdownEnd;
      if (!raw) return null;
      var t = new Date(raw).getTime();
      return isNaN(t) ? null : t;
    }

    if (mode === 'daily') {
      var hhmm = (el.dataset.countdownDaily || '23:59').split(':');
      var d = new Date();
      d.setHours(parseInt(hhmm[0], 10) || 0, parseInt(hhmm[1], 10) || 0, 0, 0);
      if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
      return d.getTime();
    }

    // evergreen
    var hours = parseFloat(el.dataset.countdownHours || '4');
    var key = STORE + (el.dataset.countdownKey || window.location.pathname);
    var stored = null;
    try { stored = localStorage.getItem(key); } catch (e) {}

    if (stored && !isNaN(parseInt(stored, 10)) && parseInt(stored, 10) > Date.now()) {
      return parseInt(stored, 10);
    }
    var end = Date.now() + hours * 3600 * 1000;
    try { localStorage.setItem(key, String(end)); } catch (e) {}
    return end;
  }

  function expire(el) {
    var how = el.dataset.countdownExpired || 'message';

    if (how === 'restart') {
      var mode = el.dataset.countdownMode || 'evergreen';
      if (mode === 'evergreen') {
        try { localStorage.removeItem(STORE + (el.dataset.countdownKey || window.location.pathname)); } catch (e) {}
      }
      start(el);
      return;
    }

    if (how === 'hide') {
      var block = el.closest('[data-countdown-block]') || el;
      block.style.display = 'none';
      return;
    }

    el.textContent = el.dataset.countdownExpiredText || 'Offer ended';
  }

  function start(el) {
    if (el._cfTimer) clearInterval(el._cfTimer);

    var end = endFor(el);
    if (!end) return;

    var prefix = el.dataset.countdownPrefix || '';

    function tick() {
      var diff = end - Date.now();

      if (diff <= 0) {
        clearInterval(el._cfTimer);
        el._cfTimer = null;
        expire(el);
        return;
      }

      var h = Math.floor(diff / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);

      var d = Math.floor(h / 24);
      var out;
      if (d >= 1) {
        out = d + 'd ' + pad(h % 24) + 'h ' + pad(m) + 'm';
      } else {
        out = pad(h) + 'h ' + pad(m) + 'm ' + pad(s) + 's';
      }
      el.textContent = prefix + out;
    }

    tick();
    el._cfTimer = setInterval(tick, 1000);
  }

  function boot() {
    document.querySelectorAll(SEL).forEach(start);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  document.addEventListener('shopify:section:load', boot);

  window.CFCountdown = { refresh: boot, start: start };
})();
