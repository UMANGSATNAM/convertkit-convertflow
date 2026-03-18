/**
 * ConvertKit — Sale Countdown Timer Widget
 * Real deadline countdown, auto-hides when expired.
 * Uses requestAnimationFrame for performance.
 */

const CountdownWidget = {
  el: null,
  deadline: null,
  analytics: null,
  rafId: null,
  lastSecond: -1,

  init(config, analytics) {
    if (!config || !config.deadline) return;

    const deadline = new Date(config.deadline).getTime();
    if (isNaN(deadline) || deadline <= Date.now()) return;

    this.deadline = deadline;
    this.analytics = analytics;
    this.render(config.headline || 'Sale ends in');
    this.scheduleUpdate();

    if (analytics) {
      analytics.trackEvent('feature_impression', null, 'urgency_countdown');
    }
  },

  render(headline) {
    this.el = document.createElement('div');
    this.el.className = 'ck-countdown';
    this.el.dataset.ckFeature = 'urgency_countdown';
    this.el.style.cssText = 'text-align:center;padding:16px;background:var(--ck-accent,#111827);color:var(--ck-accent-text,#fff);font-family:var(--ck-body-font,-apple-system,sans-serif);font-size:14px;';
    this.el.innerHTML = `<p style="margin:0 0 8px;font-weight:600">${headline}</p><div class="ck-countdown__timer" style="font-size:24px;font-weight:700;letter-spacing:2px;font-variant-numeric:tabular-nums"></div>`;

    const main = document.querySelector('main') || document.body;
    main.insertBefore(this.el, main.firstChild);
  },

  scheduleUpdate() {
    const update = () => {
      const now = Date.now();
      const diff = this.deadline - now;

      if (diff <= 0) {
        if (this.el) this.el.remove();
        return;
      }

      // Only update DOM once per second
      const currentSecond = Math.floor(diff / 1000);
      if (currentSecond !== this.lastSecond) {
        this.lastSecond = currentSecond;
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        const timer = this.el.querySelector('.ck-countdown__timer');
        if (timer) {
          timer.textContent = `${d}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
        }
      }

      this.rafId = requestAnimationFrame(update);
    };

    this.rafId = requestAnimationFrame(update);
  },

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.el) this.el.remove();
  },
};

export default CountdownWidget;
