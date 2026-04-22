/**
 * ConvertKit — Time-Sensitive Offer Banner Widget
 * Dismissible top banner with session-based countdown
 */

const OfferBannerWidget = {
  init(config, analytics) {
    if (!config || !config.message) return;
    this.analytics = analytics;

    // Check if dismissed this session
    if (sessionStorage.getItem('ck-banner-dismissed')) return;

    // Session-based countdown: starts when user first lands
    let startTime = parseInt(sessionStorage.getItem('ck-banner-start'), 10);
    if (!startTime) {
      startTime = Date.now();
      sessionStorage.setItem('ck-banner-start', String(startTime));
    }

    this.endTime = startTime + 2 * 60 * 60 * 1000; // 2 hours from first visit
    this.message = config.message;

    if (Date.now() >= this.endTime) return;

    this.render();
    this.interval = setInterval(() => this.tick(), 1000);

    if (analytics) {
      analytics.track('feature_interact', { feature: 'offer_banner', action: 'impression' });
    }
  },

  render() {
    this.el = document.createElement('div');
    this.el.style.cssText = 'position:relative;padding:10px 40px 10px 16px;background:var(--ck-accent,#111827);color:var(--ck-accent-text,#fff);text-align:center;font-family:var(--ck-body-font,-apple-system,sans-serif);font-size:14px;z-index:99997';

    const close = document.createElement('button');
    close.textContent = '\u00d7';
    close.style.cssText = 'position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:inherit;font-size:20px;cursor:pointer;opacity:0.7';
    close.setAttribute('aria-label', 'Dismiss');
    close.addEventListener('click', () => {
      sessionStorage.setItem('ck-banner-dismissed', '1');
      this.destroy();
    });

    this.el.appendChild(close);
    document.body.insertBefore(this.el, document.body.firstChild);
    this.tick();
  },

  tick() {
    const diff = this.endTime - Date.now();
    if (diff <= 0) {
      this.destroy();
      return;
    }

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const timeStr = `${h}h ${String(m).padStart(2, '0')}m`;
    const text = this.message.replace('{time}', timeStr);

    // Preserve close button
    const closeBtn = this.el.querySelector('button');
    this.el.textContent = '';
    this.el.appendChild(document.createTextNode(text));
    if (closeBtn) this.el.appendChild(closeBtn);
  },

  destroy() {
    clearInterval(this.interval);
    if (this.el) this.el.remove();
  },
};

export default OfferBannerWidget;
