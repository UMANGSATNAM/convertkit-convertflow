/**
 * DEWIA · CELLULAR GLASS SKIN ROUTINE
 * Interactive Engine: Bundle Calculator, Glow Slider, Shade Switcher & Drawer Cart
 */

document.addEventListener('DOMContentLoaded', () => {
  // ── State Management ──
  const routineProducts = {
    1: { id: 1, title: "Milky Jelly Cleanser", price: 26, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80", selected: true },
    2: { id: 2, title: "Multi-Peptide Glazing Fluid", price: 48, img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80", selected: true },
    3: { id: 3, title: "Barrier Cloud Seal Cream", price: 36, img: "https://images.unsplash.com/photo-1608248597359-0e6d526a67e3?w=600&auto=format&fit=crop&q=80", selected: true }
  };

  let cartItems = [
    { title: "Milky Jelly Cleanser (150ml)", price: 26, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=120&auto=format&fit=crop&q=80" },
    { title: "Multi-Peptide Glazing Fluid (50ml)", price: 48, img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=120&auto=format&fit=crop&q=80" },
    { title: "Barrier Cloud Seal Cream (60ml)", price: 36, img: "https://images.unsplash.com/photo-1608248597359-0e6d526a67e3?w=120&auto=format&fit=crop&q=80" }
  ];

  // ── Elements ──
  const siteHeader = document.getElementById('siteHeader');
  const stepCards = document.querySelectorAll('.step-card');
  const stepCheckboxes = document.querySelectorAll('.step-checkbox');
  const calcBundleBadge = document.getElementById('calcBundleBadge');
  const calcItemCountText = document.getElementById('calcItemCountText');
  const calcSavingsAlert = document.getElementById('calcSavingsAlert');
  const savingsText = document.getElementById('savingsText');
  const calcComparePrice = document.getElementById('calcComparePrice');
  const calcFinalPrice = document.getElementById('calcFinalPrice');
  const addBundleBtn = document.getElementById('addBundleBtn');
  const addBundleBtnText = document.getElementById('addBundleBtnText');

  const stickyAtcDock = document.getElementById('stickyAtcDock');
  const dockBuyBtn = document.getElementById('dockBuyBtn');
  const heroBuyBtn = document.getElementById('heroBuyBtn');

  const cartDrawerBackdrop = document.getElementById('cartDrawerBackdrop');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const bagTrigger = document.getElementById('bagTrigger');
  const bagCount = document.getElementById('bagCount');
  const drawerBody = document.getElementById('drawerBody');
  const drawerItemCount = document.getElementById('drawerItemCount');
  const drawerTotalPrice = document.getElementById('drawerTotalPrice');

  // ── 1. Sticky Header On Scroll ──
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    // Sticky Bottom Conversion Dock Visibility
    if (stickyAtcDock) {
      if (window.scrollY > 550) {
        stickyAtcDock.classList.add('visible');
      } else {
        stickyAtcDock.classList.remove('visible');
      }
    }
  });

  // ── 2. Interactive 3-Step Routine Bundle Calculator ──
  function updateBundleCalculator() {
    let selectedCount = 0;
    let originalSum = 0;

    stepCheckboxes.forEach(cb => {
      const step = cb.dataset.step;
      const isChecked = cb.checked;
      routineProducts[step].selected = isChecked;

      const card = document.getElementById('stepCard' + step);
      if (card) {
        if (isChecked) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      }

      if (isChecked) {
        selectedCount++;
        originalSum += routineProducts[step].price;
      }
    });

    let finalPrice = originalSum;
    let savingsAmount = 0;

    if (selectedCount === 3) {
      // Full 3-Step Routine: 30% bundle discount ($110 -> $78)
      finalPrice = 78;
      savingsAmount = originalSum - finalPrice;
      calcBundleBadge.textContent = "FULL 3-STEP ROUTINE (30% OFF)";
      calcBundleBadge.className = "badge-pill badge-peach";
      calcSavingsAlert.style.display = "inline-flex";
      savingsText.textContent = `You're saving $${savingsAmount.toFixed(2)} with the Routine Bundle!`;
      calcComparePrice.style.display = "inline";
      calcComparePrice.textContent = `$${originalSum.toFixed(2)}`;
      addBundleBtnText.textContent = "Add Complete Routine to Bag";
    } else if (selectedCount === 2) {
      // 2-Step Routine: 15% discount
      finalPrice = Math.round(originalSum * 0.85);
      savingsAmount = originalSum - finalPrice;
      calcBundleBadge.textContent = "DUO ROUTINE (15% OFF)";
      calcBundleBadge.className = "badge-pill badge-sage";
      calcSavingsAlert.style.display = "inline-flex";
      savingsText.textContent = `You're saving $${savingsAmount.toFixed(2)} with Duo discount!`;
      calcComparePrice.style.display = "inline";
      calcComparePrice.textContent = `$${originalSum.toFixed(2)}`;
      addBundleBtnText.textContent = "Add Custom Routine to Bag";
    } else if (selectedCount === 1) {
      // Single Item
      calcBundleBadge.textContent = "INDIVIDUAL PRODUCT";
      calcBundleBadge.className = "badge-pill badge-sage";
      calcSavingsAlert.style.display = "none";
      calcComparePrice.style.display = "none";
      addBundleBtnText.textContent = "Add Selected Product to Bag";
    } else {
      // None selected
      calcBundleBadge.textContent = "SELECT AT LEAST 1 STEP";
      calcBundleBadge.className = "badge-pill badge-peach";
      calcSavingsAlert.style.display = "none";
      calcComparePrice.style.display = "none";
      addBundleBtnText.textContent = "Select Products Above";
    }

    calcItemCountText.textContent = `${selectedCount} Product${selectedCount === 1 ? '' : 's'} Selected`;
    calcFinalPrice.textContent = `$${finalPrice.toFixed(2)}`;
  }

  stepCheckboxes.forEach(cb => {
    cb.addEventListener('change', updateBundleCalculator);
  });

  // Add Bundle To Cart Action
  if (addBundleBtn) {
    addBundleBtn.addEventListener('click', () => {
      const selected = Object.values(routineProducts).filter(p => p.selected);
      if (selected.length === 0) {
        alert('Please select at least 1 routine step to add to bag.');
        return;
      }

      cartItems = selected.map(p => ({
        title: p.title,
        price: p.price,
        img: p.img
      }));

      renderCartDrawer();
      openCartDrawer();
    });
  }

  if (dockBuyBtn) {
    dockBuyBtn.addEventListener('click', () => {
      renderCartDrawer();
      openCartDrawer();
    });
  }

  // ── 3. Interactive 14-Day Before / After Glow Slider ──
  const sliderPane = document.getElementById('glowSliderPane');
  const beforeWrap = document.getElementById('beforeWrap');
  const sliderHandle = document.getElementById('sliderHandle');

  if (sliderPane && beforeWrap && sliderHandle) {
    let isSliding = false;

    function setSliderPosition(clientX) {
      const rect = sliderPane.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      let percentage = (offsetX / rect.width) * 100;

      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;

      beforeWrap.style.width = percentage + '%';
      sliderHandle.style.left = percentage + '%';
    }

    sliderPane.addEventListener('mousedown', (e) => {
      isSliding = true;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isSliding) return;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isSliding = false;
    });

    // Touch Support for Mobile
    sliderPane.addEventListener('touchstart', (e) => {
      isSliding = true;
      if (e.touches[0]) setSliderPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isSliding || !e.touches[0]) return;
      setSliderPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isSliding = false;
    });
  }

  // ── 4. Interactive Shade / Tint Swatch Selector ──
  const swatchBtns = document.querySelectorAll('.swatch-btn');
  const tintMainImg = document.getElementById('tintMainImg');
  const tintName = document.getElementById('tintName');
  const tintDesc = document.getElementById('tintDesc');
  const addTintBtn = document.getElementById('addTintBtn');

  let activeTint = {
    name: "01 • Clear Glass Glaze",
    price: 22,
    img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80"
  };

  swatchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      swatchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const name = btn.dataset.name;
      const img = btn.dataset.img;
      const desc = btn.dataset.desc;

      activeTint = { name, price: 22, img };

      if (tintName) tintName.textContent = name;
      if (tintDesc) tintDesc.textContent = desc;
      if (tintMainImg) {
        tintMainImg.style.opacity = '0.4';
        setTimeout(() => {
          tintMainImg.src = img;
          tintMainImg.style.opacity = '1';
        }, 150);
      }
    });
  });

  if (addTintBtn) {
    addTintBtn.addEventListener('click', () => {
      cartItems.push({
        title: `Peptide Lip Tint (${activeTint.name})`,
        price: activeTint.price,
        img: activeTint.img
      });
      renderCartDrawer();
      openCartDrawer();
    });
  }

  // ── 5. UGC Concern Filter Tabs ──
  const concernTabs = document.querySelectorAll('.concern-tab');
  const ugcCards = document.querySelectorAll('.ugc-card');

  concernTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      concernTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const concern = tab.dataset.concern;

      ugcCards.forEach(card => {
        const cardConcern = card.dataset.concern;
        if (concern === 'all' || cardConcern === concern) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // ── 6. Clinical FAQ Accordion ──
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(el => {
        el.classList.remove('active');
        const icon = el.querySelector('.faq-icon i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-plus');
        }
      });

      if (!isActive) {
        item.classList.add('active');
        const icon = item.querySelector('.faq-icon i');
        if (icon) {
          icon.classList.remove('fa-plus');
          icon.classList.add('fa-xmark');
        }
      }
    });
  });

  // ── 7. Slide-Out Cart Drawer Logic ──
  function openCartDrawer() {
    if (cartDrawerBackdrop) {
      cartDrawerBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCartDrawer() {
    if (cartDrawerBackdrop) {
      cartDrawerBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (bagTrigger) bagTrigger.addEventListener('click', openCartDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeCartDrawer);
  if (cartDrawerBackdrop) {
    cartDrawerBackdrop.addEventListener('click', (e) => {
      if (e.target === cartDrawerBackdrop) closeCartDrawer();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCartDrawer();
  });

  function renderCartDrawer() {
    if (!drawerBody) return;

    let subtotal = 0;
    drawerBody.innerHTML = '';

    cartItems.forEach((item, index) => {
      subtotal += item.price;
      const itemEl = document.createElement('div');
      itemEl.className = 'drawer-item';
      itemEl.innerHTML = `
        <img src="${item.img}" alt="${item.title}" class="drawer-item-img">
        <div class="drawer-item-info">
          <h4 class="drawer-item-title">${item.title}</h4>
          <span class="drawer-item-price">$${item.price.toFixed(2)}</span>
        </div>
        <button class="remove-cart-item" data-index="${index}" style="color: #948b81; font-size: 1.1rem; padding: 4px;">
          <i class="fa-solid fa-xmark"></i>
        </button>
      `;
      drawerBody.appendChild(itemEl);
    });

    if (bagCount) bagCount.textContent = cartItems.length;
    if (drawerItemCount) drawerItemCount.textContent = cartItems.length;
    
    // Apply 30% routine bundle discount if all 3 routine items are in cart
    if (cartItems.length >= 3) {
      subtotal = 78 + (cartItems.length > 3 ? (cartItems.slice(3).reduce((acc, curr) => acc + curr.price, 0)) : 0);
    }

    if (drawerTotalPrice) drawerTotalPrice.textContent = `$${subtotal.toFixed(2)}`;

    // Attach remove handlers
    document.querySelectorAll('.remove-cart-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        cartItems.splice(idx, 1);
        renderCartDrawer();
      });
    });
  }

  // Initial render
  renderCartDrawer();
});
