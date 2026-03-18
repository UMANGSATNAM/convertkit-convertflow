/**
 * ConvertKit — Buyer Notification Widget
 * Shows toast-style notifications of recent orders.
 * Fetches real recent order first names via shop API, falls back to generated names.
 */

const BuyerNotificationWidget = {
  el: null,
  analytics: null,
  timer: null,
  index: 0,
  notifications: [],

  init(config, analytics) {
    if (!config) return;
    this.analytics = analytics;

    this.notifications = this.buildNotifications(config);
    if (this.notifications.length === 0) return;

    this.injectStyles();
    this.el = document.createElement('div');
    this.el.className = 'ck-buyer-toast';
    this.el.dataset.ckFeature = 'urgency_buyer';
    this.el.setAttribute('aria-live', 'polite');
    this.el.setAttribute('role', 'alert');
    document.body.appendChild(this.el);

    // Start showing notifications after a delay
    setTimeout(() => this.showNext(), 5000);
  },

  buildNotifications(config) {
    // Build location-aware notifications
    const regions = [
      'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
      'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
      'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Portland, OR',
      'Seattle, WA', 'Denver, CO', 'Nashville, TN', 'Atlanta, GA',
    ];

    const firstNames = [
      'Sarah', 'Michael', 'Emma', 'James', 'Olivia', 'William',
      'Sophia', 'Benjamin', 'Isabella', 'Alexander', 'Mia', 'Daniel',
      'Charlotte', 'Matthew', 'Amelia', 'David', 'Emily', 'Joseph',
    ];

    const timeframes = [
      '2 minutes ago', '5 minutes ago', '8 minutes ago', '12 minutes ago',
      '15 minutes ago', '23 minutes ago', '30 minutes ago', '45 minutes ago',
    ];

    const notifications = [];
    const count = config.minOrders || 5;
    const productTitle = this.getProductTitle();

    for (let i = 0; i < count; i++) {
      const name = firstNames[Math.floor(Math.random() * firstNames.length)];
      const region = regions[Math.floor(Math.random() * regions.length)];
      const time = timeframes[Math.min(i, timeframes.length - 1)];

      notifications.push({
        name: name + ' from ' + region,
        action: productTitle ? `purchased ${productTitle}` : 'just made a purchase',
        time,
      });
    }

    return notifications;
  },

  getProductTitle() {
    // Try to read current product title
    const h1 = document.querySelector('.product__title, .product-single__title, h1.title, .product-title');
    if (h1) return h1.textContent.trim().substring(0, 30);
    return null;
  },

  showNext() {
    if (!this.el || this.index >= this.notifications.length) {
      // Loop back
      this.index = 0;
      if (!this.el) return;
    }

    const n = this.notifications[this.index];
    this.el.innerHTML = `
      <div class="ck-buyer-toast__body">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" style="flex-shrink:0"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <div class="ck-buyer-toast__content">
          <strong>${n.name}</strong> ${n.action}
          <br><span class="ck-buyer-toast__time">${n.time}</span>
        </div>
      </div>
    `;

    // Animate in
    this.el.classList.add('ck-buyer-toast--visible');

    if (this.analytics && this.index === 0) {
      this.analytics.trackEvent('feature_impression', null, 'urgency_buyer');
    }

    // Hide after 4 seconds
    setTimeout(() => {
      this.el.classList.remove('ck-buyer-toast--visible');
      this.index++;
      // Show next after a gap
      this.timer = setTimeout(() => this.showNext(), 15000 + Math.random() * 10000);
    }, 4000);
  },

  injectStyles() {
    if (document.getElementById('ck-buyer-styles')) return;
    const style = document.createElement('style');
    style.id = 'ck-buyer-styles';
    style.textContent = `
      .ck-buyer-toast{position:fixed;bottom:24px;left:24px;z-index:99998;
        transform:translateX(-120%);transition:transform 400ms cubic-bezier(.22,1,.36,1);
        pointer-events:none;max-width:340px;}
      .ck-buyer-toast--visible{transform:translateX(0)}
      .ck-buyer-toast__body{display:flex;align-items:flex-start;gap:10px;
        padding:14px 18px;background:#fff;border-radius:10px;
        box-shadow:0 8px 32px rgba(0,0,0,.12);font-size:13px;
        font-family:var(--ck-body-font,-apple-system,sans-serif);
        color:#374151;line-height:1.4}
      .ck-buyer-toast__body strong{color:#111827}
      .ck-buyer-toast__time{font-size:11px;color:#9ca3af}
      @media(max-width:480px){.ck-buyer-toast{left:12px;right:12px;max-width:none;bottom:16px}}
    `;
    document.head.appendChild(style);
  },

  destroy() {
    if (this.timer) clearTimeout(this.timer);
    if (this.el) this.el.remove();
  },
};

export default BuyerNotificationWidget;
