(function(){
'use strict';
const CF=window.CF||{};

// Utility
const $=(s,p=document)=>p.querySelector(s);
const $$=(s,p=document)=>[...p.querySelectorAll(s)];
const on=(el,ev,fn)=>el&&el.addEventListener(ev,fn);
const emit=(name,detail={})=>document.dispatchEvent(new CustomEvent(name,{detail,bubbles:true}));

// Cart API
const Cart={
  async get(){const r=await fetch(CF.routes.cart_url+'.js');return r.json();},
  async add(items){const r=await fetch(CF.routes.cart_add_url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items})});const d=await r.json();emit('cart:updated',d);return d;},
  async change(id,qty){const r=await fetch(CF.routes.cart_change_url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,quantity:qty})});const d=await r.json();emit('cart:updated',d);return d;},
  async update(updates){const r=await fetch(CF.routes.cart_update_url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({updates})});const d=await r.json();emit('cart:updated',d);return d;}
};

// Toast
function toast(msg,dur=3000){
  let el=$('#Toast');if(!el)return;
  el.textContent=msg;el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'),dur);
}

// Cart Drawer
function initCartDrawer(){
  const drawer=$('#CartDrawer');
  if(!drawer)return;
  const close=$('#CartDrawerClose');
  const overlay=$('#OverlayBg');
  function open(){drawer.classList.add('open');overlay.classList.add('active');document.body.style.overflow='hidden';}
  function closeD(){drawer.classList.remove('open');overlay.classList.remove('active');document.body.style.overflow='';}
  on(close,'click',closeD);
  on(overlay,'click',closeD);
  on(document,'click',e=>{if(e.target.closest('[data-open-cart]'))open();});
  document.addEventListener('cart:updated',async()=>{
    const cart=await Cart.get();
    const badge=$('.cart-count__badge');
    if(badge)badge.textContent=cart.item_count;
    renderCartDrawer(cart);
  });
}

function renderCartDrawer(cart){
  const body=$('#CartDrawerBody');if(!body)return;
  if(!cart.item_count){body.innerHTML='<p style="padding:32px;text-align:center;color:var(--c-subtle)">Your cart is empty</p>';return;}
  body.innerHTML=cart.items.map(item=>`
    <div class="cart-item" style="display:flex;gap:16px;padding:16px 24px;border-bottom:1px solid var(--c-border)">
      <img src="${item.image}" alt="${item.title}" style="width:72px;height:72px;object-fit:cover;border-radius:4px">
      <div style="flex:1">
        <div style="font-size:14px;font-weight:600;margin-bottom:4px">${item.product_title}</div>
        <div style="font-size:12px;color:var(--c-subtle);margin-bottom:8px">${item.variant_title||''}</div>
        <div style="display:flex;align-items:center;gap:12px">
          <button class="qty-btn" data-key="${item.key}" data-qty="${item.quantity-1}" style="width:28px;height:28px;border:1px solid var(--c-border);background:#fff;cursor:pointer">-</button>
          <span style="font-size:14px;font-weight:600">${item.quantity}</span>
          <button class="qty-btn" data-key="${item.key}" data-qty="${item.quantity+1}" style="width:28px;height:28px;border:1px solid var(--c-border);background:#fff;cursor:pointer">+</button>
          <button class="remove-btn" data-key="${item.key}" style="margin-left:auto;font-size:12px;color:var(--c-subtle);background:none;border:none;cursor:pointer">Remove</button>
        </div>
      </div>
      <div style="font-size:16px;font-weight:700">${formatMoney(item.final_line_price)}</div>
    </div>`).join('');
  $$('.qty-btn',body).forEach(btn=>on(btn,'click',()=>Cart.change(btn.dataset.key,+btn.dataset.qty)));
  $$('.remove-btn',body).forEach(btn=>on(btn,'click',()=>Cart.change(btn.dataset.key,0)));
}

// Format money
function formatMoney(cents){return(CF.moneyFormat||'${amount}').replace('{{amount}}',((cents||0)/100).toFixed(2)).replace('${amount}',((cents||0)/100).toFixed(2));}

// ATC
function initATC(){
  on(document,'click',async e=>{
    const btn=e.target.closest('[data-atc]');if(!btn)return;
    e.preventDefault();
    const form=btn.closest('form[action="/cart/add"]');
    if(!form)return;
    btn.disabled=true;btn.textContent='Adding...';
    const varId=form.querySelector('[name="id"]')?.value;
    const qty=+(form.querySelector('[name="quantity"]')?.value||1);
    if(!varId){btn.disabled=false;btn.textContent=btn.dataset.text||'Add to Cart';return;}
    try{
      await Cart.add([{id:varId,quantity:qty}]);
      toast('Added to cart!');
      if(CF.settings.slideOutCart){const d=$('#CartDrawer');d&&d.classList.add('open');$('#OverlayBg')?.classList.add('active');}
    }catch(err){toast('Could not add to cart.');}
    btn.disabled=false;btn.textContent=btn.dataset.text||'Add to Cart';
  });
}

// Search Overlay
function initSearch(){
  const overlay=$('#SearchOverlay');if(!overlay)return;
  const input=$('#SearchInput');
  const results=$('#SearchResults');
  const close=$('#SearchClose');
  const bg=$('#OverlayBg');
  function openS(){overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');setTimeout(()=>input?.focus(),100);}
  function closeS(){overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');}
  on(close,'click',closeS);
  on(bg,'click',closeS);
  on(document,'click',e=>{if(e.target.closest('[data-open-search]'))openS();});
  on(document,'keydown',e=>{if(e.key==='Escape')closeS();});
  let timer;
  on(input,'input',()=>{
    clearTimeout(timer);
    const q=input.value.trim();
    if(q.length<3){results.innerHTML='';return;}
    timer=setTimeout(async()=>{
      const r=await fetch(`${CF.routes.predictive_search_url}?q=${encodeURIComponent(q)}&resources[type]=product&resources[limit]=6&section_id=predictive-search`);
      const html=await r.text();
      const doc=new DOMParser().parseFromString(html,'text/html');
      results.innerHTML=doc.querySelector('#shopify-section-predictive-search')?.innerHTML||'';
    },300);
  });
}

// Quick View
function initQuickView(){
  const modal=$('#QuickViewModal');if(!modal)return;
  const body=$('#QuickViewBody');
  const close=$('#QuickViewClose');
  const overlay=$('#QuickViewOverlay');
  function closeQV(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
  on(close,'click',closeQV);on(overlay,'click',closeQV);
  on(document,'click',async e=>{
    const btn=e.target.closest('[data-quick-view]');if(!btn)return;
    const url=btn.dataset.quickView;if(!url)return;
    modal.classList.add('open');modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    body.innerHTML='<div style="display:flex;justify-content:center;padding:60px"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg></div>';
    try{
      const r=await fetch(`${url}?view=quick-view`);
      const html=await r.text();
      const doc=new DOMParser().parseFromString(html,'text/html');
      body.innerHTML=doc.querySelector('.product-main-qv,.product__info-wrapper,main')?.innerHTML||html;
    }catch{body.innerHTML='<p style="padding:40px;text-align:center">Unable to load product.</p>';}
  });
}

// Sticky Header
function initStickyHeader(){
  const header=$('.site-header');if(!header)return;
  window.addEventListener('scroll',()=>{header.classList.toggle('scrolled',window.scrollY>50);},{ passive:true });
}

// Back to Top
function initBackToTop(){
  const btn=$('#BackToTop');if(!btn)return;
  window.addEventListener('scroll',()=>{btn.hidden=window.scrollY<400;},{passive:true});
  on(btn,'click',()=>window.scrollTo({top:0,behavior:'smooth'}));
}

// Animations
function initAnimations(){
  if(!CF.settings.animationsEnabled)return;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('animate-fadeup');});
  },{threshold:0.1});
  $$('[data-animate]').forEach(el=>obs.observe(el));
}

// Quantity selectors
function initQtySelectors(){
  on(document,'click',e=>{
    const btn=e.target.closest('.qty-selector__btn');if(!btn)return;
    const input=btn.closest('.qty-selector')?.querySelector('input');if(!input)return;
    const v=+input.value+(btn.dataset.dir==='up'?1:-1);
    input.value=Math.max(1,v);
  });
}

// Mobile Menu
function initMobileMenu(){
  on(document,'click',e=>{
    const btn=e.target.closest('[data-mobile-menu-toggle]');if(!btn)return;
    const menu=$('.mobile-menu');
    menu?.classList.toggle('open');
  });
}

// Countdown Timer
function initCountdowns(){
  $$('[data-countdown]').forEach(el=>{
    const end=new Date(el.dataset.countdown).getTime();
    function tick(){
      const diff=end-Date.now();
      if(diff<=0){el.textContent='Ended';return;}
      const d=Math.floor(diff/86400000),h=Math.floor((diff%86400000)/3600000),m=Math.floor((diff%3600000)/60000),s=Math.floor((diff%60000)/1000);
      el.querySelector('[data-days]')&&(el.querySelector('[data-days]').textContent=String(d).padStart(2,'0'));
      el.querySelector('[data-hours]')&&(el.querySelector('[data-hours]').textContent=String(h).padStart(2,'0'));
      el.querySelector('[data-minutes]')&&(el.querySelector('[data-minutes]').textContent=String(m).padStart(2,'0'));
      el.querySelector('[data-seconds]')&&(el.querySelector('[data-seconds]').textContent=String(s).padStart(2,'0'));
      setTimeout(tick,1000);
    }
    tick();
  });
}

// Promo Popup
function initPromoPopup(){
  const popup=$('#PromoPopup');if(!popup)return;
  const delay=+(popup.dataset.delay||5000);
  const key='cf_popup_'+popup.dataset.id;
  if(sessionStorage.getItem(key))return;
  setTimeout(()=>{popup.classList.add('open');},delay);
  on(popup.querySelector('.popup-close'),'click',()=>{popup.classList.remove('open');sessionStorage.setItem(key,'1');});
}

// Slide show
function initSlideshows(){
  $$('.slideshow').forEach(el=>{
    const slides=$$('.slide',el);
    let cur=0;const total=slides.length;if(total<2)return;
    const auto=+(el.dataset.auto||5000);
    function go(n){slides[cur].classList.remove('active');cur=(n+total)%total;slides[cur].classList.add('active');}
    slides[0].classList.add('active');
    const iv=setInterval(()=>go(cur+1),auto);
    on(el.querySelector('.slide-prev'),'click',()=>{clearInterval(iv);go(cur-1);});
    on(el.querySelector('.slide-next'),'click',()=>{clearInterval(iv);go(cur+1);});
  });
}

// Collection Filter toggle
function initFilters(){
  on(document,'click',e=>{
    const btn=e.target.closest('[data-filter-toggle]');if(!btn)return;
    $('[data-filter-drawer]')?.classList.toggle('open');
    $('[data-filter-overlay]')?.classList.toggle('active');
  });
  on(document,'click',e=>{
    if(e.target.matches('[data-filter-overlay]'))$('[data-filter-drawer]')?.classList.remove('open');
  });
  on(document,'change',e=>{
    const inp=e.target.closest('[data-filter-input]');if(!inp)return;
    const form=inp.closest('form');if(!form)return;
    const url=new URL(window.location);
    new FormData(form).forEach((v,k)=>url.searchParams.set(k,v));
    window.location.href=url.toString();
  });
}

// Image zoom
function initImageZoom(){
  $$('[data-zoom]').forEach(el=>{
    on(el,'mousemove',e=>{
      const r=el.getBoundingClientRect();
      const x=((e.clientX-r.left)/r.width*100).toFixed(2);
      const y=((e.clientY-r.top)/r.height*100).toFixed(2);
      el.style.transformOrigin=`${x}% ${y}%`;
      el.style.transform='scale(2)';
    });
    on(el,'mouseleave',()=>{el.style.transform='';});
  });
}

// Product gallery
function initProductGallery(){
  on(document,'click',e=>{
    const thumb=e.target.closest('[data-thumb]');if(!thumb)return;
    const main=thumb.closest('[data-gallery]')?.querySelector('[data-main-img]');if(!main)return;
    main.src=thumb.dataset.src;main.srcset='';
    $$('[data-thumb]',thumb.closest('[data-gallery]')).forEach(t=>t.classList.remove('active'));
    thumb.classList.add('active');
  });
}

// Variant selector
function initVariants(){
  on(document,'change',e=>{
    const sel=e.target.closest('[data-variant-select]');if(!sel)return;
    const form=sel.closest('form');if(!form)return;
    const id=sel.value;
    const priceEl=form.querySelector('[data-price]');
    const compareEl=form.querySelector('[data-compare-price]');
    const idInput=form.querySelector('[name="id"]');
    if(idInput)idInput.value=id;
    // Price update would need variant data exposed via JSON
  });
  on(document,'click',e=>{
    const btn=e.target.closest('[data-swatch]');if(!btn)return;
    $$('[data-swatch]',btn.closest('[data-swatches]')).forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const sel=btn.closest('form')?.querySelector('[data-variant-select]');
    if(sel){
      $$('option',sel).forEach(o=>{if(o.text===btn.dataset.swatch)sel.value=o.value;});
      sel.dispatchEvent(new Event('change'));
    }
  });
}

// Init all
document.addEventListener('DOMContentLoaded',()=>{
  initStickyHeader();
  initCartDrawer();
  initATC();
  initSearch();
  initQuickView();
  initBackToTop();
  initAnimations();
  initQtySelectors();
  initMobileMenu();
  initCountdowns();
  initPromoPopup();
  initSlideshows();
  initFilters();
  initImageZoom();
  initProductGallery();
  initVariants();
});
})();
