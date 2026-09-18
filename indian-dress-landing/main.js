/**
 * RIWAAYAT LUXURY COUTURE - INTERACTIVE ENGINE
 * Handcrafted Indian Ethnic Wear Landing Page
 */

document.addEventListener('DOMContentLoaded', () => {
  // Product Catalog Data for Quick View & Inquiries
  const productCatalog = {
    1: {
      id: 1,
      title: "The Padmavati Vermilion Lehenga",
      collection: "Varanasi Bridal Vault",
      category: "bridal",
      price: "₹1,45,000",
      originalPrice: "₹1,75,000",
      img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
      desc: "An heirloom bridal masterpiece inspired by Rajput royal courts. Hand-embroidered using pure gold zari, dabka, and hand-cut gota patti on 100% Katan Silk.",
      specs: {
        "Fabric": "Pure Katan Silk & Velvet Border",
        "Weave / Craft": "Handloom Zardozi & Pitta Work",
        "Atelier": "Varanasi Master Karigars (450+ Hours)",
        "Components": "Lehenga Skirt, Custom Blouse & Dual Dupattas",
        "Certification": "100% Silk Mark Authenticated"
      }
    },
    2: {
      id: 2,
      title: "Shahi Emerald Shikargah Saree",
      collection: "Shahi Dastakaar",
      category: "sarees",
      price: "₹68,500",
      originalPrice: "₹82,000",
      img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      desc: "Depicting historic Mughal flora and royal hunting grounds (Shikargah), hand-woven on a traditional wooden pit loom with antique Roopa-Sona zari.",
      specs: {
        "Fabric": "12-Ply Tested Pure Katan Silk",
        "Weave / Craft": "Authentic Kadwa Handloom Technique",
        "Origin": "Varanasi, Uttar Pradesh",
        "Length": "6.5 Metres (Includes Contrast Blouse Piece)",
        "Certification": "Silk Mark & Handloom India Certified"
      }
    },
    3: {
      id: 3,
      title: "Chandrika Ivory Kalidar Anarkali",
      collection: "Jashn-e-Bahaar",
      category: "festive",
      price: "₹48,900",
      originalPrice: "₹56,000",
      img: "https://images.unsplash.com/photo-1583391733975-dd26487e83db?auto=format&fit=crop&w=800&q=80",
      desc: "Designed for joyous festive evenings and royal sangeets. 32 flaring kalis of sheer Chanderi silk with delicate silver mukaish work and handcrafted tassels.",
      specs: {
        "Fabric": "Chanderi Silk & Organza Dupatta",
        "Work": "Hand-hammered Mukaish & Resham Thread",
        "Silhouette": "32-Kali Floor-length Anarkali",
        "Includes": "Anarkali, Churidar & Scalloped Dupatta",
        "Care": "Strict Dry Clean Only"
      }
    },
    4: {
      id: 4,
      title: "Gulaab Baagh Rose Gold Lehenga",
      collection: "Jaipur Rajwada",
      category: "bridal",
      price: "₹1,85,000",
      originalPrice: "₹2,20,000",
      img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
      desc: "Crafted for the modern bride seeking regality with contemporary softness. Plush micro velvet accented with champagne gold dabka and natural seed pearls.",
      specs: {
        "Fabric": "Micro Velvet & Handwoven Tissue",
        "Embroidery": "Jaipuri Gota Patti & Moti Work",
        "Flair": "6.5 Metre Circumference",
        "Customization": "Bespoke color dyeing available",
        "Delivery": "Worldwide Insured Air Express"
      }
    },
    5: {
      id: 5,
      title: "Swarnam Kanjeevaram Saree",
      collection: "Kanchipuram Heritage",
      category: "sarees",
      price: "₹74,000",
      originalPrice: "₹89,000",
      img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
      desc: "An icon of South Indian bridal majesty. Hand-woven using three shuttles (Korvai technique) with solid 24k gold zari temple motifs.",
      specs: {
        "Fabric": "Heavyweight Mulberry Silk",
        "Technique": "Interlocking Korvai Weave",
        "Zari": "Tested Silver-core 24k Electroplated Gold",
        "Weight": "Approx. 950 grams",
        "Certification": "Silk Mark Registered"
      }
    },
    6: {
      id: 6,
      title: "Zoya Brocade Cape & Sharara Set",
      collection: "Modern Riwaayat",
      category: "contemporary",
      price: "₹52,000",
      originalPrice: "₹62,000",
      img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      desc: "A stunning fusion ensemble blending a structured Banarasi brocade cape over fluid, crushed chiffon sharara trousers with mirror embroidery.",
      specs: {
        "Fabric": "Raw Silk Brocade & Pure Georgette",
        "Style": "Contemporary Indo-Western Couture",
        "Occasion": "Sangeet, Cocktail & Reception",
        "Fit": "Tailored Relaxed Fit",
        "Includes": "Cape Jacket, Crop Bustier & Sharara"
      }
    }
  };

  // State Management
  let wishlist = new Set();
  const WHATSAPP_PHONE = "919876543210";

  // Elements
  const siteHeader = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  const wishlistCount = document.getElementById('wishlistCount');
  const quickModal = document.getElementById('quickModal');
  const modalClose = document.getElementById('modalClose');
  const modalBody = document.getElementById('modalBody');
  const appointmentForm = document.getElementById('appointmentForm');
  const formSuccess = document.getElementById('formSuccess');

  // Sticky Header Scroll Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // Mobile Drawer Navigation
  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
    });
  }

  if (drawerClose && mobileDrawer) {
    drawerClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  }

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  });

  // Category Filter Functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.category;

      productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // Wishlist Handling
  document.querySelectorAll('.save-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const icon = btn.querySelector('i');

      if (wishlist.has(id)) {
        wishlist.delete(id);
        btn.classList.remove('saved');
        icon.classList.replace('fa-solid', 'fa-regular');
      } else {
        wishlist.add(id);
        btn.classList.add('saved');
        icon.classList.replace('fa-regular', 'fa-solid');
        showMiniToast('Added to your Private Wishlist');
      }

      wishlistCount.textContent = wishlist.size;
    });
  });

  // Direct WhatsApp Inquiry Buttons
  document.querySelectorAll('.btn-inquire-direct').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.dataset.title;
      const price = btn.dataset.price;
      const message = `Namaste Riwaayat Team, I am interested in inquiring about "${title}" (${price}). Could you please share fabric video, custom sizing options, and delivery timeline?`;
      const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    });
  });

  // Quick View Modal
  document.querySelectorAll('.btn-quick-view').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.product;
      const item = productCatalog[productId];
      if (!item) return;

      let specsHtml = '';
      for (const [key, val] of Object.entries(item.specs)) {
        specsHtml += `
          <li>
            <span class="spec-label">${key}</span>
            <span class="spec-val">${val}</span>
          </li>
        `;
      }

      modalBody.innerHTML = `
        <div class="modal-grid">
          <div class="modal-img-wrap">
            <img src="${item.img}" alt="${item.title}">
          </div>
          <div class="modal-content-pane">
            <span class="modal-category">${item.collection}</span>
            <h2 class="modal-title">${item.title}</h2>
            <div class="modal-prices">
              <span class="modal-current-price">${item.price}</span>
              <span class="modal-old-price">${item.originalPrice}</span>
            </div>
            <p style="font-size: 0.9rem; color: #5e6b66; line-height: 1.6; margin-bottom: 1.25rem;">
              ${item.desc}
            </p>
            <ul class="modal-specs-list">
              ${specsHtml}
            </ul>
            <div class="modal-cta-group">
              <button class="btn btn-gold modal-wa-btn" id="modalWaBtn">
                <i class="fa-brands fa-whatsapp"></i> Inquire via WhatsApp Concierge
              </button>
              <a href="#appointment-section" class="btn btn-outline-gold" id="modalBookFitting">
                <i class="fa-regular fa-calendar-check"></i> Book Salon Fitting
              </a>
            </div>
          </div>
        </div>
      `;

      quickModal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Attach WhatsApp handler inside modal
      document.getElementById('modalWaBtn').addEventListener('click', () => {
        const msg = `Namaste Riwaayat Team, I am looking at "${item.title}" (${item.price}). Please connect me with a senior stylist for draping details and custom tailoring.`;
        window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
      });

      document.getElementById('modalBookFitting').addEventListener('click', () => {
        closeModal();
      });
    });
  });

  function closeModal() {
    quickModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (quickModal) {
    quickModal.addEventListener('click', (e) => {
      if (e.target === quickModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && quickModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Appointment Form Submission
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('userName').value;
      const phone = document.getElementById('userPhone').value;
      const event = document.getElementById('eventType').value;
      const city = document.getElementById('userCity').value;

      appointmentForm.style.display = 'none';
      formSuccess.style.display = 'block';

      // Auto trigger WhatsApp confirmation option
      const consultMsg = `Namaste Riwaayat, I have requested a VIP salon consultation for ${name} from ${city} for ${event}. Mobile: ${phone}.`;
      console.log("Appointment confirmed:", consultMsg);
    });
  }

  // Lightweight Toast Notification
  function showMiniToast(message) {
    const toast = document.createElement('div');
    toast.className = 'mini-toast';
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '90px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = '#082018';
    toast.style.color = '#dfba73';
    toast.style.padding = '0.65rem 1.4rem';
    toast.style.borderRadius = '100px';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    toast.style.fontSize = '0.85rem';
    toast.style.fontWeight = '600';
    toast.style.zIndex = '9999';
    toast.style.border = '1px solid #c5a059';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.3s ease';

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(-10px)';
    }, 10);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
});
