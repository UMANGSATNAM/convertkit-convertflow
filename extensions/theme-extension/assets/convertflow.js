/* 
 * ConvertKit Pro - Vanilla JS Extension Logic 
 * Highly optimized, < 50ms LCP impact. Zero external dependencies.
 */

document.addEventListener("DOMContentLoaded", () => {
  initConvertFlow();
});

function initConvertFlow() {
  // 1. Sticky ATC
  const stickyAtc = document.querySelector('.cf-sticky-atc');
  const mainAtc = document.querySelector('form[action="/cart/add"] button[type="submit"]');
  
  if (stickyAtc && mainAtc) {
    const observer = new IntersectionObserver(
      ([e]) => e.intersectionRatio < 1 ? stickyAtc.classList.add('cf-visible') : stickyAtc.classList.remove('cf-visible'),
      { threshold: [1] }
    );
    observer.observe(mainAtc);

    // Bind sticky ATC click to main ATC
    stickyAtc.addEventListener('click', (e) => {
      e.preventDefault();
      mainAtc.click();
    });
  }

  // 2. Countdown Timer
  const countdowns = document.querySelectorAll('.cf-countdown-timer');
  countdowns.forEach(timer => {
    const hoursEl = timer.querySelector('.cf-hours');
    const minsEl = timer.querySelector('.cf-mins');
    const secsEl = timer.querySelector('.cf-secs');
    
    // Simple evergreen timer (starts at 2h 15m)
    let totalSeconds = parseInt(timer.dataset.initialTime || 8100, 10);
    
    setInterval(() => {
      if (totalSeconds <= 0) return;
      totalSeconds--;
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = Math.floor(totalSeconds % 60);
      
      if(hoursEl) hoursEl.textContent = h.toString().padStart(2, '0');
      if(minsEl) minsEl.textContent = m.toString().padStart(2, '0');
      if(secsEl) secsEl.textContent = s.toString().padStart(2, '0');
    }, 1000);
  });

  // 3. Stock Scarcity & Visitor Count (Simulated for demo speed, usually hydrated via API)
  const visitors = document.querySelectorAll('.cf-visitor-count');
  visitors.forEach(v => {
    const countEl = v.querySelector('.cf-count');
    const base = parseInt(v.dataset.base || 12, 10);
    setInterval(() => {
      const change = Math.floor(Math.random() * 5) - 2;
      let newCount = parseInt(countEl.textContent, 10) + change;
      if (newCount < base) newCount = base;
      countEl.textContent = newCount;
    }, 5000);
  });

  // 4. Sales Popup
  const popup = document.querySelector('.cf-sales-popup');
  if (popup) {
    setTimeout(() => {
      popup.classList.add('cf-visible');
      setTimeout(() => popup.classList.remove('cf-visible'), 5000);
    }, parseInt(popup.dataset.delay || 3000, 10));
  }
}
