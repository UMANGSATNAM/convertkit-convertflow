class CountdownTimer {
  constructor(element) {
    this.container = element;
    this.endDateStr = element.getAttribute("data-date");
    this.daysEl = element.querySelector(".countdown-days");
    this.hoursEl = element.querySelector(".countdown-hours");
    this.minutesEl = element.querySelector(".countdown-minutes");
    this.secondsEl = element.querySelector(".countdown-seconds");
    
    if (!this.endDateStr) return;
    this.endTime = new Date(this.endDateStr).getTime();
    
    if (isNaN(this.endTime)) {
      console.warn("[CountdownTimer] Invalid date format:", this.endDateStr);
      return;
    }

    this.start();
  }

  start() {
    this.update();
    this.intervalId = setInterval(() => this.update(), 1000);
  }

  update() {
    const now = new Date().getTime();
    const diff = this.endTime - now;

    if (diff <= 0) {
      clearInterval(this.intervalId);
      this.container.classList.add("countdown-timer--expired");
      const expiredMsg = this.container.querySelector(".countdown-expired-message");
      if (expiredMsg) expiredMsg.classList.remove("visually-hidden");
      
      // Zero out
      if (this.daysEl) this.daysEl.textContent = "00";
      if (this.hoursEl) this.hoursEl.textContent = "00";
      if (this.minutesEl) this.minutesEl.textContent = "00";
      if (this.secondsEl) this.secondsEl.textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (this.daysEl) this.daysEl.textContent = this.pad(days);
    if (this.hoursEl) this.hoursEl.textContent = this.pad(hours);
    if (this.minutesEl) this.minutesEl.textContent = this.pad(minutes);
    if (this.secondsEl) this.secondsEl.textContent = this.pad(seconds);
  }

  pad(num) {
    return num.toString().padStart(2, "0");
  }
}

window.domReady(() => {
  document.querySelectorAll("[data-date]").forEach(timer => {
    new CountdownTimer(timer);
  });
});
