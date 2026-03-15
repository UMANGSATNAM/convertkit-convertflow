/**
 * ConvertKit — Sale Countdown Timer Widget
 * Real deadline countdown, auto-hides when expired
 */

const CountdownWidget = {
  init(config, analytics) {
    if (!config || !config.deadline) return;

    const deadline = new Date(config.deadline).getTime();
    if (isNaN(deadline) || deadline <= Date.now()) return;

    this.deadline = deadline;
    this.analytics = analytics;
    this.render();
    this.tick();
    this.interval = setInterval(() => this.tick(), 1000);

    if (analytics) {
      analytics.track('feature_interact', { feature: 'countdown', action: 'impression' });
    }
  },

  render() {
    this.el = document.createElement('div');
    this.el.className = 'ck-countdown';
    this.el.style.cssText = 'text-align:center;padding:16px;background:var(--ck-accent,#111827);color:var(--ck-accent-text,#fff);font-family:var(--ck-body-font,-apple-system,sans-serif);font-size:14px;';
    this.el.innerHTML = '<p style="margin:0 0 8px;font-weight:600">Sale ends in</p><div class="ck-countdown__timer" style="font-size:24px;font-weight:700;letter-spacing:2px;font-variant-numeric:tabular-nums"></div>';

    // Insert at top of main content
    const main = document.querySelector('main') || document.body;
    main.insertBefore(this.el, main.firstChild);
  },

  tick() {
    const now = Date.now();
    const diff = this.deadline - now;

    if (diff <= 0) {
      clearInterval(this.interval);
      if (this.el) this.el.remove();
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const timer = this.el.querySelector('.ck-countdown__timer');
    if (timer) {
      timer.textContent = `${d}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
    }
  },

  destroy() {
    clearInterval(this.interval);
    if (this.el) this.el.remove();
  },
};

export default CountdownWidget;
