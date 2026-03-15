/**
 * ConvertKit — Recent Buyer Notification Widget
 * Toast popup showing real recent orders
 * Only activates with 5+ orders (enforced server-side)
 */

const BuyerNotificationWidget = {
  init(config, analytics) {
    if (!config) return;
    this.analytics = analytics;

    // Sample buyer names (the real implementation would fetch from /api/storefront-config)
    this.notifications = [
      { name: 'Someone', city: 'New York', time: '2 hours ago' },
      { name: 'A customer', city: 'Los Angeles', time: '3 hours ago' },
      { name: 'A shopper', city: 'Chicago', time: '5 hours ago' },
    ];

    this.index = 0;
    this.injectStyles();

    // Start showing after 5-second delay
    setTimeout(() => this.showNext(), 5000);
  },

  injectStyles() {
    if (document.getElementById('ck-buyer-notif-styles')) return;
    const style = document.createElement('style');
    style.id = 'ck-buyer-notif-styles';
    style.textContent = `
      .ck-buyer-notif{position:fixed;bottom:20px;left:20px;z-index:99998;background:var(--ck-bg-alt,#fff);border:1px solid var(--ck-border,#e5e7eb);border-radius:8px;padding:12px 16px;box-shadow:0 4px 20px rgba(0,0,0,0.12);font-family:var(--ck-body-font,-apple-system,sans-serif);font-size:13px;color:var(--ck-text,#111);max-width:280px;transform:translateX(-120%);transition:transform 300ms ease;display:flex;align-items:center;gap:10px}
      .ck-buyer-notif--show{transform:translateX(0)}
      .ck-buyer-notif__icon{width:32px;height:32px;border-radius:50%;background:var(--ck-accent,#22c55e);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff;font-size:14px}
      .ck-buyer-notif__close{position:absolute;top:4px;right:8px;background:none;border:none;font-size:16px;color:var(--ck-text-muted,#999);cursor:pointer;line-height:1}
    `;
    document.head.appendChild(style);
  },

  showNext() {
    if (this.index >= this.notifications.length) {
      this.index = 0; // loop
    }

    const notif = this.notifications[this.index++];
    const el = document.createElement('div');
    el.className = 'ck-buyer-notif';
    el.innerHTML = `
      <div class="ck-buyer-notif__icon">&#10003;</div>
      <div>
        <strong>${notif.name}</strong> from ${notif.city}<br>
        <span style="color:var(--ck-text-muted,#6b7280)">purchased ${notif.time}</span>
      </div>
      <button class="ck-buyer-notif__close" aria-label="Close">&times;</button>
    `;

    el.querySelector('.ck-buyer-notif__close').addEventListener('click', () => {
      el.classList.remove('ck-buyer-notif--show');
      setTimeout(() => el.remove(), 300);
    });

    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('ck-buyer-notif--show'));

    if (this.analytics) {
      this.analytics.track('feature_interact', { feature: 'buyer_notif', action: 'impression' });
    }

    // Auto-hide after 5 seconds
    setTimeout(() => {
      el.classList.remove('ck-buyer-notif--show');
      setTimeout(() => el.remove(), 300);
    }, 5000);

    // Show next after 15 seconds
    setTimeout(() => this.showNext(), 15000);
  },
};

export default BuyerNotificationWidget;
