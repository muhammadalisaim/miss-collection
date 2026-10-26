/**
 * Miss Collection - Advanced Frontend Application Logic
 * Ella Theme Mobile Touch UX, Mega-Menu, Dual-Image Swap,
 * Mobile Bottom Sheet Quick Add, In-Cart Upsells & Review Engine
 */

document.addEventListener("DOMContentLoaded", function () {
  App.init();
});

const App = {
  currentCategory: "all",
  activeFilters: {
    cup: null,
    band: null,
    maxPrice: 8000,
    inStockOnly: false,
    fabric: null,
    sort: "featured",
    search: ""
  },
  activeProductForModal: null,
  activeProductForSheet: null,

  init: function () {
    this.initAmbientSparkles();
    this.bindEvents();
    this.renderNavigation();
    this.renderHeroSlider();
    this.renderCategoryCircles();
    this.renderProducts();
    this.updateCartUI();
    this.updateWishlistUI();
    this.renderReviewsSection();
    this.initStickyHeader();
    this.initMobileFilterDrawer();
  },

  bindEvents: function () {
    const self = this;

    // Listen to store updates
    window.addEventListener("cart_updated", () => self.updateCartUI());
    window.addEventListener("wishlist_updated", () => {
      self.updateWishlistUI();
      self.renderProducts();
    });
    window.addEventListener("products_updated", () => self.renderProducts());
    window.addEventListener("coupon_applied", () => self.updateCartUI());
    window.addEventListener("coupon_removed", () => self.updateCartUI());
    window.addEventListener("reviews_updated", () => self.renderReviewsSection());
    window.addEventListener("nav_items_updated", () => self.renderNavigation());
    window.addEventListener("banners_updated", () => self.renderHeroSlider());
    window.addEventListener("storage", (e) => {
      if (typeof Store !== "undefined" && Store.KEYS) {
        if (e.key === Store.KEYS.NAV_ITEMS) {
          self.renderNavigation();
        } else if (e.key === Store.KEYS.BANNERS) {
          self.renderHeroSlider();
        } else if (e.key === Store.KEYS.PRODUCTS) {
          self.renderProducts();
        }
      }
    });

    // Category Tabs / Pills
    document.querySelectorAll("[data-category-filter]").forEach(btn => {
      btn.addEventListener("click", function () {
        const cat = this.getAttribute("data-category-filter");
        self.filterByCategory(cat);
      });
    });

    // Sort Dropdown
    const sortSelect = document.getElementById("catalogSortSelect");
    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        self.activeFilters.sort = this.value;
        self.renderProducts();
      });
    }

    // Predictive Search Input
    const searchInputs = document.querySelectorAll(".site-search-input");
    searchInputs.forEach(input => {
      input.addEventListener("input", function () {
        const query = this.value.trim();
        self.handlePredictiveSearch(query);
      });
    });

    // Close drawers when clicking backdrop
    document.querySelectorAll(".drawer-backdrop").forEach(backdrop => {
      backdrop.addEventListener("click", function (e) {
        if (e.target === this) {
          self.closeAllDrawers();
        }
      });
    });

    // Close bottom sheet
    const sheetBackdrop = document.getElementById("mobileQuickAddSheetBackdrop");
    if (sheetBackdrop) {
      sheetBackdrop.addEventListener("click", function (e) {
        if (e.target === this) {
          self.closeBottomSheet();
        }
      });
    }

    // Close modals on backdrop click
    document.querySelectorAll(".modal-backdrop").forEach(modal => {
      modal.addEventListener("click", function (e) {
        if (e.target === this) {
          self.closeAllModals();
        }
      });
    });

    // ESC key closes modals/drawers
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        self.closeAllModals();
        self.closeAllDrawers();
        self.closeBottomSheet();
        self.closeMegaMenus();
      }
    });

    // Close Mega Menus when clicking outside
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".nav-item-has-mega")) {
        self.closeMegaMenus();
      }
    });

    // Checkout Form Submission
    const checkoutForm = document.getElementById("checkoutOrderForm");
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", function (e) {
        e.preventDefault();
        self.handleCheckoutSubmission(this);
      });
    }

    // Bra Size Calculator Form
    const calculatorForm = document.getElementById("braCalculatorForm");
    if (calculatorForm) {
      calculatorForm.addEventListener("submit", function (e) {
        e.preventDefault();
        self.calculateBraSize();
      });
    }

    // Order Tracking Form
    const trackingForm = document.getElementById("orderTrackingForm");
    if (trackingForm) {
      trackingForm.addEventListener("submit", function (e) {
        e.preventDefault();
        self.lookupOrderTracking();
      });
    }

    // Review Form Submission
    const reviewForm = document.getElementById("writeReviewForm");
    if (reviewForm) {
      reviewForm.addEventListener("submit", function (e) {
        e.preventDefault();
        self.handleReviewSubmission(this);
      });
    }
  },

  initStickyHeader: function () {
    const header = document.querySelector(".header-sticky");
    if (!header) return;
    window.addEventListener("scroll", () => {
      if (window.scrollY > 30) {
        header.classList.add("header-shadow");
      } else {
        header.classList.remove("header-shadow");
      }
    });
  },

  // Ambient Haute Stardust Particle Engine - Subtle Champagne Gold Shimmer
  initAmbientSparkles: function () {
    const canvas = document.getElementById("ambientSparklesCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = -1000;
    let mouseY = -1000;

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
      mouseX = -1000;
      mouseY = -1000;
    });

    const particles = [];
    const count = Math.min(50, Math.max(25, Math.floor(width / 32)));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseRadius: Math.random() * 1.6 + 0.6,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: -Math.random() * 0.35 - 0.08,
        baseAlpha: Math.random() * 0.45 + 0.25,
        alpha: 0.3,
        twinkleSpeed: Math.random() * 0.018 + 0.008,
        phase: Math.random() * Math.PI * 2,
        isWarmAmber: Math.random() > 0.65
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.phase += p.twinkleSpeed;
        p.alpha = p.baseAlpha + Math.sin(p.phase) * (p.baseAlpha * 0.7);
        p.alpha = Math.max(0.08, Math.min(0.85, p.alpha));

        p.x += p.speedX + Math.sin(p.phase * 0.5) * 0.15;
        p.y += p.speedY;

        // Gentle cursor deflection
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110 && dist > 0) {
          const force = ((110 - dist) / 110) * 0.8;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        // Screen wrap
        if (p.y < -15) {
          p.y = height + 15;
          p.x = Math.random() * width;
        }
        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;

        // Radial gradient: luminous core fading into champagne gold halo
        const currentRadius = p.baseRadius * (0.85 + 0.3 * Math.sin(p.phase));
        const glowRadius = currentRadius * 3.2;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        if (p.isWarmAmber) {
          grad.addColorStop(0, `rgba(255, 255, 255, ${p.alpha * 0.95})`);
          grad.addColorStop(0.35, `rgba(230, 194, 117, ${p.alpha * 0.75})`);
          grad.addColorStop(1, "rgba(212, 175, 55, 0)");
        } else {
          grad.addColorStop(0, `rgba(255, 255, 255, ${p.alpha})`);
          grad.addColorStop(0.4, `rgba(243, 229, 171, ${p.alpha * 0.7})`);
          grad.addColorStop(1, "rgba(243, 229, 171, 0)");
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();
  },

  // Mega-Menu HTML Templates for Desktop Navigation
  MEGA_MENU_TEMPLATES: {
    bras: `
      <div class="mega-menu-wrapper">
        <div class="max-w-7xl mx-auto px-8 py-7 grid grid-cols-4 gap-8 text-left whitespace-normal">
          <div>
            <h4 class="text-xs font-semibold text-white uppercase tracking-[0.2em] border-b border-[#D4AF37]/30 pb-2 mb-3 font-serif-luxury">Styles</h4>
            <ul class="space-y-2 text-xs text-stone-300 font-light">
              <li><a href="javascript:void(0)" onclick="App.filterByCategory('bras')" class="hover:text-[#D4AF37] transition">Feather-Light Wireless Bras</a></li>
              <li><a href="javascript:void(0)" onclick="App.filterByCategory('bras')" class="hover:text-[#D4AF37] transition">Chantilly Lace Plunge Bras</a></li>
              <li><a href="javascript:void(0)" onclick="App.filterByCategory('bras')" class="hover:text-[#D4AF37] transition">Invisible T-Shirt Contour Bras</a></li>
              <li><a href="javascript:void(0)" onclick="App.filterByCategory('bras')" class="hover:text-[#D4AF37] transition">Front-Closure Comfort Bras</a></li>
              <li><a href="javascript:void(0)" onclick="App.filterByCategory('bras')" class="hover:text-[#D4AF37] transition">Bandeau & Strapless Support</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-xs font-semibold text-white uppercase tracking-[0.2em] border-b border-[#D4AF37]/30 pb-2 mb-3 font-serif-luxury">Shop By Cup Size</h4>
            <div class="grid grid-cols-3 gap-2">
              <button onclick="App.currentCategory='bras'; App.activeFilters.cup='B'; App.renderProducts(); App.closeMegaMenus();" class="py-2 text-center text-xs font-semibold border border-white/10 bg-white/5 hover:border-[#D4AF37] hover:text-[#D4AF37] text-stone-200 rounded">Cup B</button>
              <button onclick="App.currentCategory='bras'; App.activeFilters.cup='C'; App.renderProducts(); App.closeMegaMenus();" class="py-2 text-center text-xs font-semibold border border-white/10 bg-white/5 hover:border-[#D4AF37] hover:text-[#D4AF37] text-stone-200 rounded">Cup C</button>
              <button onclick="App.currentCategory='bras'; App.activeFilters.cup='D'; App.renderProducts(); App.closeMegaMenus();" class="py-2 text-center text-xs font-semibold border border-white/10 bg-white/5 hover:border-[#D4AF37] hover:text-[#D4AF37] text-stone-200 rounded">Cup D</button>
              <button onclick="App.currentCategory='bras'; App.activeFilters.cup='DD'; App.renderProducts(); App.closeMegaMenus();" class="py-2 text-center text-xs font-semibold border border-white/10 bg-white/5 hover:border-[#D4AF37] hover:text-[#D4AF37] text-stone-200 rounded">Cup DD</button>
              <button onclick="App.currentCategory='bras'; App.activeFilters.cup='E'; App.renderProducts(); App.closeMegaMenus();" class="py-2 text-center text-xs font-semibold border border-white/10 bg-white/5 hover:border-[#D4AF37] hover:text-[#D4AF37] text-stone-200 rounded">Cup E</button>
              <button onclick="App.openBraCalculatorModal()" class="py-2 text-center text-xs font-bold bg-[#D4AF37]/15 text-[#F3E5AB] border border-[#D4AF37]/40 rounded hover:bg-[#D4AF37]/25 transition">Guide</button>
            </div>
          </div>
          <div class="col-span-2 relative rounded-lg overflow-hidden group/card cursor-pointer border border-white/10" onclick="App.openQuickView('mc-bra-01')">
            <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80" alt="Seamless Cloud Lift" class="w-full h-44 object-cover group-hover/card:scale-105 transition duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
              <span class="text-[9px] uppercase font-bold tracking-[0.2em] text-[#D4AF37]">Signature Bestseller</span>
              <h5 class="text-sm font-semibold text-white">Cloud-Soft Zero Wire T-Shirt Bra</h5>
              <span class="text-xs font-bold text-[#F3E5AB]">Rs. 2,450</span>
            </div>
          </div>
        </div>
      </div>
    `,
    panties: `
      <div class="mega-menu-wrapper">
        <div class="max-w-7xl mx-auto px-8 py-7 grid grid-cols-4 gap-8 text-left whitespace-normal">
          <div>
            <h4 class="text-xs font-semibold text-white uppercase tracking-[0.2em] border-b border-[#D4AF37]/30 pb-2 mb-3 font-serif-luxury">Styles</h4>
            <ul class="space-y-2 text-xs text-stone-300 font-light">
              <li><a href="javascript:void(0)" onclick="App.filterByCategory('panties')" class="hover:text-[#D4AF37] transition">Laser-Cut No-Show (Pack of 3)</a></li>
              <li><a href="javascript:void(0)" onclick="App.filterByCategory('panties')" class="hover:text-[#D4AF37] transition">Combed Cotton High-Waist Briefs</a></li>
              <li><a href="javascript:void(0)" onclick="App.filterByCategory('panties')" class="hover:text-[#D4AF37] transition">French Scalloped Lace Bikinis</a></li>
              <li><a href="javascript:void(0)" onclick="App.filterByCategory('panties')" class="hover:text-[#D4AF37] transition">Breathable Micro-Modal Boyshorts</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-xs font-semibold text-white uppercase tracking-[0.2em] border-b border-[#D4AF37]/30 pb-2 mb-3 font-serif-luxury">Value Bundles</h4>
            <div class="bg-[#181716] p-4 rounded-lg border border-[#D4AF37]/25 space-y-2">
              <span class="text-[10px] font-bold uppercase text-[#D4AF37] tracking-wider">Multi-Pack Savings</span>
              <h5 class="text-xs font-bold text-white">Buy 3 Panties & Save 15%</h5>
              <p class="text-[11px] text-stone-400 font-light leading-snug">Automatic discount at checkout on selected comfort cotton panties.</p>
            </div>
          </div>
          <div class="col-span-2 relative rounded-lg overflow-hidden group/card cursor-pointer border border-white/10" onclick="App.openQuickView('mc-pant-01')">
            <img src="https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80" alt="Laser Cut Panties" class="w-full h-44 object-cover group-hover/card:scale-105 transition duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
              <span class="text-[9px] uppercase font-bold tracking-[0.2em] text-[#D4AF37]">100% Invisible Guarantee</span>
              <h5 class="text-sm font-semibold text-white">Seamless Laser-Cut Cheeky Brief</h5>
              <span class="text-xs font-bold text-[#F3E5AB]">Rs. 950</span>
            </div>
          </div>
        </div>
      </div>
    `,
    bridal: `
      <div class="mega-menu-wrapper">
        <div class="max-w-7xl mx-auto px-8 py-7 grid grid-cols-4 gap-8 text-left whitespace-normal">
          <div>
            <h4 class="text-xs font-semibold text-white uppercase tracking-[0.2em] border-b border-[#D4AF37]/30 pb-2 mb-3 font-serif-luxury">Trousseau Collections</h4>
            <ul class="space-y-2 text-xs text-stone-300 font-light">
              <li><a href="javascript:void(0)" onclick="App.filterByCategory('bridal')" class="hover:text-[#D4AF37] transition">Royal Crimson Satin Robe Set</a></li>
              <li><a href="javascript:void(0)" onclick="App.filterByCategory('bridal')" class="hover:text-[#D4AF37] transition">Ivory French Lace Chemise</a></li>
              <li><a href="javascript:void(0)" onclick="App.filterByCategory('bridal')" class="hover:text-[#D4AF37] transition">Embroidered Babydoll & G-String</a></li>
              <li><a href="javascript:void(0)" onclick="App.filterByCategory('bridal')" class="hover:text-[#D4AF37] transition">Bridal Honeymoon 5-Piece Hamper</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-xs font-semibold text-white uppercase tracking-[0.2em] border-b border-[#D4AF37]/30 pb-2 mb-3 font-serif-luxury">Bridal Gifting</h4>
            <div class="bg-[#181716] p-4 rounded-lg border border-[#D4AF37]/25 space-y-2">
              <span class="text-[10px] font-bold uppercase text-[#D4AF37] tracking-wider">Luxury Gift Box</span>
              <h5 class="text-xs font-bold text-white">Custom Trousseau Packaging</h5>
              <p class="text-[11px] text-stone-400 font-light leading-snug">Includes satin ribbon, scented sachets, and confidential outer carton.</p>
            </div>
          </div>
          <div class="col-span-2 relative rounded-lg overflow-hidden group/card cursor-pointer border border-white/10" onclick="App.openQuickView('mc-bridal-01')">
            <img src="https://images.unsplash.com/photo-1616150840617-a0684f0f089d?auto=format&fit=crop&w=800&q=80" alt="Bridal Robe" class="w-full h-44 object-cover group-hover/card:scale-105 transition duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
              <span class="text-[9px] uppercase font-bold tracking-[0.2em] text-[#D4AF37]">Haute Trousseau</span>
              <h5 class="text-sm font-semibold text-white">Royal Crimson Silk Satin Robe</h5>
              <span class="text-xs font-bold text-[#F3E5AB]">Rs. 4,950</span>
            </div>
          </div>
        </div>
      </div>
    `,
    nightwear: `
      <div class="mega-menu-wrapper">
        <div class="max-w-7xl mx-auto px-8 py-7 grid grid-cols-4 gap-8 text-left whitespace-normal">
          <div>
            <h4 class="text-xs font-semibold text-white uppercase tracking-[0.2em] border-b border-[#D4AF37]/30 pb-2 mb-3 font-serif-luxury">Styles</h4>
            <ul class="space-y-2 text-xs text-stone-300 font-light">
              <li><a href="javascript:void(0)" onclick="App.filterByCategory('nightwear')" class="hover:text-[#D4AF37] transition">Pure Silk Camisole & Shorts Set</a></li>
              <li><a href="javascript:void(0)" onclick="App.filterByCategory('nightwear')" class="hover:text-[#D4AF37] transition">Modal Cotton Button-Down Sleepshirt</a></li>
              <li><a href="javascript:void(0)" onclick="App.filterByCategory('nightwear')" class="hover:text-[#D4AF37] transition">Satin Kimono Loungewear</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-xs font-semibold text-white uppercase tracking-[0.2em] border-b border-[#D4AF37]/30 pb-2 mb-3 font-serif-luxury">Fabric Excellence</h4>
            <div class="bg-[#181716] p-4 rounded-lg border border-white/10 space-y-1.5 text-xs">
              <div class="font-semibold text-white"><i class="fa-solid fa-feather text-[#D4AF37] mr-1.5"></i> 100% Breathable</div>
              <p class="text-[11px] text-stone-400 font-light leading-snug">Thermo-regulating fabric designed for Pakistan's climate.</p>
            </div>
          </div>
          <div class="col-span-2 relative rounded-lg overflow-hidden group/card cursor-pointer border border-white/10" onclick="App.openQuickView('mc-night-01')">
            <img src="https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&w=800&q=80" alt="Silk Sleepwear" class="w-full h-44 object-cover group-hover/card:scale-105 transition duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
              <span class="text-[9px] uppercase font-bold tracking-[0.2em] text-[#D4AF37]">Pure Silk</span>
              <h5 class="text-sm font-semibold text-white">Midnight Black Cami & French Shorts</h5>
              <span class="text-xs font-bold text-[#F3E5AB]">Rs. 3,250</span>
            </div>
          </div>
        </div>
      </div>
    `,
    shapewear: `
      <div class="mega-menu-wrapper">
        <div class="max-w-7xl mx-auto px-8 py-7 grid grid-cols-4 gap-8 text-left whitespace-normal">
          <div>
            <h4 class="text-xs font-semibold text-white uppercase tracking-[0.2em] border-b border-[#D4AF37]/30 pb-2 mb-3 font-serif-luxury">Targeted Sculpting</h4>
            <ul class="space-y-2 text-xs text-stone-300 font-light">
              <li><a href="javascript:void(0)" onclick="App.filterByCategory('shapewear')" class="hover:text-[#D4AF37] transition">High-Waist Tummy Tamer Short</a></li>
              <li><a href="javascript:void(0)" onclick="App.filterByCategory('shapewear')" class="hover:text-[#D4AF37] transition">Seamless Anti-Chafing Thigh Slimmer</a></li>
              <li><a href="javascript:void(0)" onclick="App.filterByCategory('shapewear')" class="hover:text-[#D4AF37] transition">Hourglass Latex-Free Waist Cincher</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-xs font-semibold text-white uppercase tracking-[0.2em] border-b border-[#D4AF37]/30 pb-2 mb-3 font-serif-luxury">Zero Rolling Guarantee</h4>
            <div class="bg-[#181716] p-4 rounded-lg border border-[#D4AF37]/25 space-y-1.5 text-xs">
              <div class="font-semibold text-white"><i class="fa-solid fa-check-double text-[#D4AF37] mr-1.5"></i> Silicone Grip Band</div>
              <p class="text-[11px] text-stone-400 font-light leading-snug">Stays firmly anchored all day without digging or rolling under formals.</p>
            </div>
          </div>
          <div class="col-span-2 relative rounded-lg overflow-hidden group/card cursor-pointer border border-white/10" onclick="App.openQuickView('mc-shape-01')">
            <img src="https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&w=800&q=80" alt="Shapewear" class="w-full h-44 object-cover group-hover/card:scale-105 transition duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
              <span class="text-[9px] uppercase font-bold tracking-[0.2em] text-[#D4AF37]">Level 3 Compression</span>
              <h5 class="text-sm font-semibold text-white">High-Waist Tummy Tamer Short</h5>
              <span class="text-xs font-bold text-[#F3E5AB]">Rs. 2,650</span>
            </div>
          </div>
        </div>
      </div>
    `
  },

  getMegaMenuHtml: function (category, title) {
    if (this.MEGA_MENU_TEMPLATES && this.MEGA_MENU_TEMPLATES[category]) {
      return this.MEGA_MENU_TEMPLATES[category];
    }
    // Generic Mega Menu for any custom added categories
    return `
      <div class="mega-menu-wrapper">
        <div class="max-w-7xl mx-auto px-8 py-7 grid grid-cols-3 gap-8 text-left whitespace-normal">
          <div>
            <h4 class="text-xs font-semibold text-white uppercase tracking-[0.2em] border-b border-[#D4AF37]/30 pb-2 mb-3 font-serif-luxury">${title} Collection</h4>
            <p class="text-xs text-stone-300 font-light leading-relaxed mb-4">Browse our premium curated selection designed for everyday luxury and supreme all-day comfort.</p>
            <button onclick="App.filterByCategory('${category}')" class="px-4 py-2 bg-[#D4AF37] text-stone-950 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#F3E5AB] transition">View All Products &rarr;</button>
          </div>
          <div>
            <h4 class="text-xs font-semibold text-white uppercase tracking-[0.2em] border-b border-[#D4AF37]/30 pb-2 mb-3 font-serif-luxury">Miss Collection Promise</h4>
            <div class="bg-[#181716] p-4 rounded-lg border border-[#D4AF37]/25 space-y-2 text-xs">
              <div class="font-semibold text-white"><i class="fa-solid fa-shield-halved text-[#D4AF37] mr-1.5"></i> 100% Confidential Delivery</div>
              <p class="text-[11px] text-stone-400 font-light">All orders are sealed inside discreet unbranded outer boxes for maximum privacy.</p>
            </div>
          </div>
          <div class="relative rounded-lg overflow-hidden group/card cursor-pointer border border-white/10" onclick="App.filterByCategory('${category}')">
            <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80" alt="${title}" class="w-full h-44 object-cover group-hover/card:scale-105 transition duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
              <span class="text-[9px] uppercase font-bold tracking-[0.2em] text-[#D4AF37]">Featured Edit</span>
              <h5 class="text-sm font-semibold text-white">${title}</h5>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  getMobileSubLinksHtml: function (category) {
    if (category === "bras") {
      return `
        <a href="javascript:void(0)" onclick="App.closeAllDrawers(); App.filterByCategory('bras')" class="block font-semibold text-[#D4AF37] uppercase tracking-wider text-[11px]">View All Bras &rarr;</a>
        <a href="javascript:void(0)" onclick="App.closeAllDrawers(); App.filterByCategory('bras')" class="block text-stone-300 hover:text-white">Feather-Light Wireless Bras</a>
        <a href="javascript:void(0)" onclick="App.closeAllDrawers(); App.filterByCategory('bras')" class="block text-stone-300 hover:text-white">Chantilly Lace Plunge Bras</a>
        <a href="javascript:void(0)" onclick="App.closeAllDrawers(); App.filterByCategory('bras')" class="block text-stone-300 hover:text-white">Invisible T-Shirt Contour Bras</a>
        <div class="pt-1 flex items-center gap-1.5 font-bold uppercase text-[10px]">
          <span class="text-stone-400">Cups:</span>
          <button onclick="App.closeAllDrawers(); App.currentCategory='bras'; App.activeFilters.cup='B'; App.renderProducts();" class="px-2 py-0.5 border border-white/10 bg-white/5 rounded text-stone-200">Cup B</button>
          <button onclick="App.closeAllDrawers(); App.currentCategory='bras'; App.activeFilters.cup='C'; App.renderProducts();" class="px-2 py-0.5 border border-white/10 bg-white/5 rounded text-stone-200">Cup C</button>
          <button onclick="App.closeAllDrawers(); App.currentCategory='bras'; App.activeFilters.cup='D'; App.renderProducts();" class="px-2 py-0.5 border border-white/10 bg-white/5 rounded text-stone-200">Cup D</button>
        </div>
      `;
    }
    if (category === "panties") {
      return `
        <a href="javascript:void(0)" onclick="App.closeAllDrawers(); App.filterByCategory('panties')" class="block font-semibold text-[#D4AF37] uppercase tracking-wider text-[11px]">View All Panties &rarr;</a>
        <a href="javascript:void(0)" onclick="App.closeAllDrawers(); App.filterByCategory('panties')" class="block text-stone-300 hover:text-white">Laser-Cut No-Show (Pack of 3)</a>
        <a href="javascript:void(0)" onclick="App.closeAllDrawers(); App.filterByCategory('panties')" class="block text-stone-300 hover:text-white">Combed Cotton High-Waist Briefs</a>
        <a href="javascript:void(0)" onclick="App.closeAllDrawers(); App.filterByCategory('panties')" class="block text-stone-300 hover:text-white">French Scalloped Lace Bikinis</a>
      `;
    }
    if (category === "bridal") {
      return `
        <a href="javascript:void(0)" onclick="App.closeAllDrawers(); App.filterByCategory('bridal')" class="block font-semibold text-[#D4AF37] uppercase tracking-wider text-[11px]">View All Bridal Trousseau &rarr;</a>
        <a href="javascript:void(0)" onclick="App.closeAllDrawers(); App.filterByCategory('bridal')" class="block text-stone-300 hover:text-white">Royal Crimson Satin Robe Set</a>
        <a href="javascript:void(0)" onclick="App.closeAllDrawers(); App.filterByCategory('bridal')" class="block text-stone-300 hover:text-white">Ivory French Lace Chemise</a>
      `;
    }
    if (category === "nightwear") {
      return `
        <a href="javascript:void(0)" onclick="App.closeAllDrawers(); App.filterByCategory('nightwear')" class="block font-semibold text-[#D4AF37] uppercase tracking-wider text-[11px]">View All Sleepwear &rarr;</a>
        <a href="javascript:void(0)" onclick="App.closeAllDrawers(); App.filterByCategory('nightwear')" class="block text-stone-300 hover:text-white">Pure Silk Camisole & Shorts Set</a>
        <a href="javascript:void(0)" onclick="App.closeAllDrawers(); App.filterByCategory('nightwear')" class="block text-stone-300 hover:text-white">Modal Cotton Sleepshirt</a>
      `;
    }
    if (category === "shapewear") {
      return `
        <a href="javascript:void(0)" onclick="App.closeAllDrawers(); App.filterByCategory('shapewear')" class="block font-semibold text-[#D4AF37] uppercase tracking-wider text-[11px]">View All Shapewear &rarr;</a>
        <a href="javascript:void(0)" onclick="App.closeAllDrawers(); App.filterByCategory('shapewear')" class="block text-stone-300 hover:text-white">High-Waist Tummy Tamer Short</a>
        <a href="javascript:void(0)" onclick="App.closeAllDrawers(); App.filterByCategory('shapewear')" class="block text-stone-300 hover:text-white">Seamless Anti-Chafing Thigh Slimmer</a>
      `;
    }
    return `
      <a href="javascript:void(0)" onclick="App.closeAllDrawers(); App.filterByCategory('${category}')" class="block font-semibold text-[#D4AF37] uppercase tracking-wider text-[11px]">View All ${category} &rarr;</a>
    `;
  },

  renderNavigation: function () {
    const desktopContainer = document.getElementById("desktopNavContainer");
    const mobileContainer = document.getElementById("mobileNavItemsContainer");

    const navItems = (typeof Store !== "undefined" && Store.getNavItems)
      ? Store.getNavItems().filter(item => item.visible !== false).sort((a, b) => (a.order || 0) - (b.order || 0))
      : [];

    if (!desktopContainer && !mobileContainer) return;

    // 1. Desktop Navigation
    if (desktopContainer) {
      desktopContainer.innerHTML = navItems.map(item => {
        const highlightClass = item.highlightClass || "";
        const iconHtml = item.icon ? `<i class="fa-solid ${item.icon} mr-1.5"></i>` : "";

        if (item.isMega) {
          return `
            <div class="nav-item-has-mega group py-3">
              <a href="javascript:void(0)" onclick="App.toggleMegaMenu(this, '${item.category}')" class="nav-link flex items-center gap-1.5 ${highlightClass}">
                ${item.title} <i class="fa-solid fa-angle-down text-[9px] text-stone-400 transition-transform group-hover:rotate-180"></i>
              </a>
              ${this.getMegaMenuHtml(item.category, item.title)}
            </div>
          `;
        }

        if (item.targetType === "modal") {
          const actionFn = item.action || "openBraCalculatorModal";
          return `
            <a href="javascript:void(0)" onclick="App.${actionFn}()" class="nav-link py-3 flex items-center gap-1.5 ${highlightClass || 'text-stone-600 hover:text-stone-900'}">
              ${iconHtml} ${item.title}
            </a>
          `;
        }

        if (item.targetType === "category") {
          return `
            <a href="javascript:void(0)" onclick="App.filterByCategory('${item.category || 'all'}')" class="nav-link py-3 ${highlightClass}">
              ${iconHtml} ${item.title}
            </a>
          `;
        }

        return `
          <a href="${item.action || 'javascript:void(0)'}" class="nav-link py-3 ${highlightClass}">
            ${iconHtml} ${item.title}
          </a>
        `;
      }).join("");
    }

    // 2. Mobile Drawer Navigation
    if (mobileContainer) {
      mobileContainer.innerHTML = navItems.map(item => {
        const highlightClass = item.highlightClass || "";
        const iconHtml = item.icon ? `<i class="fa-solid ${item.icon} mr-2"></i>` : "";

        if (item.isMega) {
          const subLinks = this.getMobileSubLinksHtml(item.category);
          return `
            <div class="py-2">
              <div class="mobile-accordion-toggle py-1" onclick="App.toggleMobileAccordion('mob-${item.id}')">
                <span class="${highlightClass}">${item.title}</span>
                <i id="mob-${item.id}-icon" class="mobile-accordion-icon fa-solid fa-angle-down text-stone-400 text-xs"></i>
              </div>
              <div id="mob-${item.id}" class="mobile-accordion-content hidden pl-3 pt-2 space-y-2 text-xs font-normal normal-case text-stone-600">
                ${subLinks}
              </div>
            </div>
          `;
        }

        if (item.targetType === "modal") {
          const actionFn = item.action || "openBraCalculatorModal";
          return `
            <a href="javascript:void(0)" onclick="App.closeAllDrawers(); App.${actionFn}()" class="block py-3 flex items-center ${highlightClass || 'text-stone-700'}">
              ${iconHtml} ${item.title}
            </a>
          `;
        }

        if (item.targetType === "category") {
          return `
            <a href="javascript:void(0)" onclick="App.closeAllDrawers(); App.filterByCategory('${item.category || 'all'}')" class="block py-3 hover:text-rose-600 ${highlightClass}">
              ${iconHtml} ${item.title}
            </a>
          `;
        }

        return `
          <a href="${item.action || 'javascript:void(0)'}" class="block py-3 hover:text-rose-600 ${highlightClass}">
            ${iconHtml} ${item.title}
          </a>
        `;
      }).join("");
    }
  },

  getBadgeColorClasses: function (color) {
    switch (color) {
      case "amber":
        return "bg-amber-500/20 text-amber-300 border border-amber-500/40";
      case "emerald":
        return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40";
      case "purple":
        return "bg-purple-500/20 text-purple-300 border border-purple-500/40";
      case "rose":
      default:
        return "bg-rose-500/20 text-rose-300 border border-rose-500/40";
    }
  },

  heroSliderInterval: null,

  renderHeroSlider: function () {
    const slidesContainer = document.getElementById("heroSlidesWrapper");
    const dotsContainer = document.getElementById("heroDotsWrapper");
    if (!slidesContainer || !dotsContainer) return;

    const banners = (typeof Store !== "undefined" && Store.getBanners)
      ? Store.getBanners().filter(b => b.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0))
      : [];

    if (!banners.length) {
      slidesContainer.innerHTML = `
        <div class="hero-slide absolute inset-0 opacity-100 flex items-center justify-center text-center p-8">
          <div>
            <h2 class="text-3xl font-serif-luxury font-bold">Miss Collection Lingerie</h2>
            <p class="text-stone-400 mt-2 text-sm">Discover luxurious undergarments designed for supreme everyday comfort.</p>
          </div>
        </div>
      `;
      dotsContainer.innerHTML = "";
      return;
    }

    slidesContainer.innerHTML = banners.map((banner, idx) => {
      const isFirst = idx === 0;
      const badgeClasses = this.getBadgeColorClasses(banner.badgeColor);
      return `
        <div class="hero-slide absolute inset-0 ${isFirst ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity duration-1000 flex items-center">
          <img 
            src="${banner.imageUrl}" 
            alt="${banner.title || 'Miss Collection Banner'}" 
            class="absolute inset-0 w-full h-full object-cover object-center brightness-75 scale-105 transition-transform duration-7000 ease-out"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/60 to-transparent"></div>
          <div class="relative max-w-7xl mx-auto px-5 sm:px-12 w-full py-12">
            <div class="max-w-xl space-y-3 sm:space-y-4">
              ${banner.badge ? `
              <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#F3E5AB] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] backdrop-blur-md">
                ${banner.badge}
              </span>` : ''}
              <h1 class="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight font-serif-luxury leading-[1.1] text-white">
                ${banner.title}
              </h1>
              ${banner.subtitle ? `
              <p class="text-xs sm:text-sm md:text-base text-stone-300 font-light leading-relaxed max-w-lg tracking-wide">
                ${banner.subtitle}
              </p>` : ''}
              <div class="pt-3 flex flex-wrap gap-3 sm:gap-4 items-center">
                ${banner.btnText ? `
                <button onclick="App.filterByCategory('${banner.btnCategory || 'all'}')" class="gold-btn-luxury text-stone-950 font-bold text-xs uppercase tracking-[0.2em] px-7 py-3.5 rounded-sm transition-all duration-300 shadow-xl inline-flex items-center gap-2 group">
                  <span>${banner.btnText}</span>
                  <i class="fa-solid fa-arrow-right-long text-[11px] transition-transform group-hover:translate-x-1"></i>
                </button>` : ''}
                ${banner.secondaryBtnText ? `
                <button onclick="App.${banner.secondaryBtnAction || 'openBraCalculatorModal'}()" class="frosted-btn-luxury text-white hover:text-[#D4AF37] font-semibold text-xs uppercase tracking-[0.18em] px-6 py-3.5 rounded-sm transition-all duration-300 inline-flex items-center gap-2">
                  <i class="fa-solid fa-ruler-horizontal text-[#D4AF37]/80"></i>
                  <span>${banner.secondaryBtnText}</span>
                </button>` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    dotsContainer.innerHTML = banners.map((banner, idx) => `
      <button class="hero-dot ${idx === 0 ? 'w-8 bg-[#D4AF37]' : 'w-2.5 bg-white/40 hover:bg-white'} h-1 rounded-full transition-all duration-300" aria-label="Go to Slide ${idx + 1}"></button>
    `).join("");

    this.initHeroSlider();
  },

  // Touch-Swipe Enabled Hero Slider
  initHeroSlider: function () {
    if (this.heroSliderInterval) {
      clearInterval(this.heroSliderInterval);
      this.heroSliderInterval = null;
    }

    let currentSlide = 0;
    const sliderContainer = document.getElementById("heroSliderContainer");
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".hero-dot");
    if (!slides.length) return;

    function showSlide(index) {
      slides.forEach((slide, idx) => {
        if (idx === index) {
          slide.classList.remove("opacity-0", "pointer-events-none");
          slide.classList.add("opacity-100", "pointer-events-auto");
        } else {
          slide.classList.add("opacity-0", "pointer-events-none");
          slide.classList.remove("opacity-100", "pointer-events-auto");
        }
      });
      dots.forEach((dot, idx) => {
        if (idx === index) {
          dot.classList.add("bg-rose-600", "w-8");
          dot.classList.remove("bg-white/60", "w-2.5");
        } else {
          dot.classList.remove("bg-rose-600", "w-8");
          dot.classList.add("bg-white/60", "w-2.5");
        }
      });
      currentSlide = index;
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener("click", () => showSlide(idx));
    });

    // Touch Swipe Gesture Detection for Mobile
    if (sliderContainer && !sliderContainer.dataset.swipeBound) {
      sliderContainer.dataset.swipeBound = "true";
      let touchStartX = 0;
      let touchEndX = 0;

      sliderContainer.addEventListener("touchstart", function (e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      sliderContainer.addEventListener("touchend", function (e) {
        touchEndX = e.changedTouches[0].screenX;
        const threshold = 40;
        const currentSlides = document.querySelectorAll(".hero-slide");
        if (!currentSlides.length) return;
        if (touchEndX < touchStartX - threshold) {
          // Swipe Left -> Next
          showSlide((currentSlide + 1) % currentSlides.length);
        } else if (touchEndX > touchStartX + threshold) {
          // Swipe Right -> Prev
          showSlide((currentSlide - 1 + currentSlides.length) % currentSlides.length);
        }
      }, { passive: true });
    }

    // Auto Advance every 5.5s if multiple slides
    if (slides.length > 1) {
      this.heroSliderInterval = setInterval(() => {
        const currentSlides = document.querySelectorAll(".hero-slide");
        if (!currentSlides.length) return;
        let next = (currentSlide + 1) % currentSlides.length;
        showSlide(next);
      }, 5500);
    }
  },

  renderCategoryCircles: function () {
    const container = document.getElementById("categoryCirclesContainer");
    if (!container) return;

    const categories = [
      { id: "all", name: "All Silhouettes", img: "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=300&q=80", count: "22+ Designs" },
      { id: "bras", name: "Luxury Bras", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80", count: "Seamless & Lace" },
      { id: "panties", name: "Comfort Panties", img: "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=300&q=80", count: "No-Show & Cotton" },
      { id: "bridal", name: "Bridal Trousseau", img: "https://images.unsplash.com/photo-1616150840617-a0684f0f089d?auto=format&fit=crop&w=300&q=80", count: "Royal Velvet" },
      { id: "nightwear", name: "Silky Sleepwear", img: "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&w=300&q=80", count: "Satin PJ Sets" },
      { id: "shapewear", name: "Tummy Shapewear", img: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=300&q=80", count: "Hourglass Fit" },
      { id: "accessories", name: "Intimate Care", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80", count: "Pasties & Bags" }
    ];

    container.innerHTML = categories.map(cat => `
      <div class="category-circle-item shrink-0 text-center select-none" onclick="App.filterByCategory('${cat.id}')">
        <div class="category-circle-img-wrapper p-1 rounded-full border-2 ${this.currentCategory === cat.id ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30' : 'border-white/10 hover:border-[#D4AF37]/50'} transition-all">
          <img src="${cat.img}" alt="${cat.name}" class="category-circle-img" loading="lazy" />
        </div>
        <span class="text-xs font-semibold text-stone-200 tracking-tight block mt-1">${cat.name}</span>
        <span class="text-[10px] text-stone-400 block -mt-1 font-medium">${cat.count}</span>
      </div>
    `).join("");
  },

  closeMegaMenus: function () {
    document.querySelectorAll(".nav-item-has-mega").forEach(m => m.classList.remove("is-open"));
  },

  toggleMegaMenu: function (el, categoryId) {
    const parent = el.closest(".nav-item-has-mega");
    if (!parent) {
      this.filterByCategory(categoryId);
      return;
    }
    const isOpen = parent.classList.contains("is-open");
    this.closeMegaMenus();
    if (!isOpen) {
      parent.classList.add("is-open");
    } else {
      this.filterByCategory(categoryId);
    }
  },

  toggleMobileAccordion: function (id) {
    const target = document.getElementById(id);
    const icon = document.getElementById(id + "-icon");
    if (!target) return;
    const isHidden = target.classList.contains("hidden");

    // Close other accordion panels
    document.querySelectorAll(".mobile-accordion-content").forEach(el => el.classList.add("hidden"));
    document.querySelectorAll(".mobile-accordion-icon").forEach(el => el.classList.remove("rotate-180"));

    if (isHidden) {
      target.classList.remove("hidden");
      if (icon) icon.classList.add("rotate-180");
    }
  },

  filterByCategory: function (categoryId) {
    this.closeMegaMenus();
    this.currentCategory = categoryId;

    // Reset cup/band filters if switching to a non-bra category
    if (categoryId !== "bras" && categoryId !== "all") {
      this.activeFilters.cup = "all";
      this.activeFilters.band = "all";
    }

    // Update filter pills
    document.querySelectorAll("[data-category-filter]").forEach(b => {
      const bCat = b.getAttribute("data-category-filter");
      if (bCat === categoryId) {
        b.classList.add("active", "bg-rose-600", "text-white");
        b.classList.remove("bg-white", "text-stone-700");
      } else {
        b.classList.remove("active", "bg-rose-600", "text-white");
        b.classList.add("bg-white", "text-stone-700");
      }
    });

    // Update top desktop navigation bar active indicators
    document.querySelectorAll(".nav-link").forEach(link => {
      const onclick = link.getAttribute("onclick") || "";
      if (onclick.includes(`'${categoryId}'`)) {
        link.classList.add("active");
      } else if (!onclick.includes("openBraCalculatorModal") && !onclick.includes("openOrderTrackingModal")) {
        link.classList.remove("active");
      }
    });

    this.renderCategoryCircles();
    this.renderProducts();
    const catalogEl = document.getElementById("catalogSection");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  },

  renderProducts: function () {
    const grid = document.getElementById("productsGrid");
    const countEl = document.getElementById("productCountDisplay");
    const filterBtnCount = document.getElementById("mobileFilterBtnCount");
    if (!grid) return;

    let products = Store.getProducts();

    // 1. Category Filter
    if (this.currentCategory !== "all") {
      products = products.filter(p => p.category === this.currentCategory);
    }

    // 2. Cup Filter
    if (this.activeFilters.cup) {
      products = products.filter(p => p.cupSizes && p.cupSizes.includes(this.activeFilters.cup));
    }

    // 3. Band Filter
    if (this.activeFilters.band) {
      products = products.filter(p => p.bandSizes && p.bandSizes.includes(this.activeFilters.band));
    }

    // 4. Max Price Filter
    if (this.activeFilters.maxPrice) {
      products = products.filter(p => p.price <= this.activeFilters.maxPrice);
    }

    // 5. In-Stock Only
    if (this.activeFilters.inStockOnly) {
      products = products.filter(p => p.inStock);
    }

    // 6. Fabric Filter
    if (this.activeFilters.fabric) {
      products = products.filter(p => p.fabric && p.fabric.toLowerCase().includes(this.activeFilters.fabric.toLowerCase()));
    }

    // 7. Search Filter
    if (this.activeFilters.search) {
      const q = this.activeFilters.search.toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // 8. Sorting
    if (this.activeFilters.sort === "price-low") {
      products.sort((a, b) => a.price - b.price);
    } else if (this.activeFilters.sort === "price-high") {
      products.sort((a, b) => b.price - a.price);
    } else if (this.activeFilters.sort === "rating") {
      products.sort((a, b) => b.rating - a.rating);
    } else if (this.activeFilters.sort === "reviews") {
      products.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    if (countEl) {
      countEl.textContent = `Showing ${products.length} Items`;
    }
    if (filterBtnCount) {
      filterBtnCount.textContent = `(${products.length})`;
    }

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-16 text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 text-2xl">
            <i class="fa-solid fa-sparkles"></i>
          </div>
          <h3 class="text-base sm:text-lg font-bold text-stone-900 font-serif-luxury">No intimates found matching your criteria</h3>
          <p class="text-xs text-stone-500 mt-1 max-w-sm mx-auto">Try clearing selected filters or searching for terms like "seamless", "lace", or "cotton".</p>
          <button onclick="App.resetFilters()" class="mt-4 px-5 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-lg uppercase tracking-wider hover:bg-rose-600 transition shadow-md">
            Reset All Filters
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = products.map(p => this.generateProductCardHTML(p)).join("");
  },

  quickSelectSizeAndAdd: function (productId, size) {
    const p = Store.getProductById(productId);
    if (!p) return;
    const defaultColor = (p.colors && p.colors.length > 0) ? p.colors[0].name : "Standard";
    Store.addToCart(p, size, defaultColor, 1);
    this.showToast(`Added ${p.title} (${size}) to Bag! 🛍️`);
    this.openCartDrawer();
  },

  // Dual-Image 3:4 Vertical Card HTML with Hover Look Swap & Quick-Size Selector Chips
  generateProductCardHTML: function (p) {
    const isWishlisted = Store.isInWishlist(p.id);
    const discountPercent = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
    const badgeColorClass = p.badgeColor === "red" 
      ? "sale" 
      : (p.badgeColor === "amber" ? "ochre" : "dark");

    const img1 = p.images[0];
    const img2 = p.images[1] || p.images[0];

    const sizesList = (p.sizes && p.sizes.length > 0) ? p.sizes.slice(0, 5) : ["XS", "S", "M", "L", "XL"];
    const sizeChipsHTML = sizesList.map(sz => `
      <button 
        type="button" 
        onclick="event.stopPropagation(); App.quickSelectSizeAndAdd('${p.id}', '${sz}')" 
        class="quick-size-chip"
        title="Add size ${sz} to Bag"
      >${sz}</button>
    `).join("");

    return `
      <div class="product-card group flex flex-col justify-between" data-product-id="${p.id}">
        <!-- 3:4 Vertical Image & Dual Look Swap -->
        <div class="product-card-img-wrapper" onclick="App.openQuickView('${p.id}')">
          <img src="${img1}" alt="${p.title}" class="product-card-img-primary" loading="lazy" />
          <img src="${img2}" alt="${p.title} alternate look" class="product-card-img-secondary" loading="lazy" />
          
          <!-- Top Badges -->
          <div class="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            ${p.badge ? `<span class="badge-pill-khaadi ${badgeColorClass}">${p.badge}</span>` : ""}
            ${discountPercent > 0 ? `<span class="badge-pill-khaadi sale">-${discountPercent}%</span>` : ""}
          </div>

          <!-- Wishlist Heart Button -->
          <button 
            type="button" 
            onclick="event.stopPropagation(); App.toggleWishlist('${p.id}')"
            class="wishlist-btn-khaadi absolute top-2.5 right-2.5 z-10 ${isWishlisted ? "active" : ""}"
            title="${isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}"
          >
            <i class="${isWishlisted ? "fa-solid" : "fa-regular"} fa-heart text-xs"></i>
          </button>

          <!-- Desktop Quick-Size Selector Chips on Hover -->
          <div class="product-size-chips-bar" onclick="event.stopPropagation()">
            <span class="text-[9px] font-bold uppercase tracking-wider text-stone-500 mr-1 hidden lg:inline">Quick Add:</span>
            ${sizeChipsHTML}
          </div>
        </div>

        <!-- Product Details -->
        <div class="pt-3 pb-2 px-1 flex flex-col flex-1 justify-between">
          <div>
            <div class="flex items-center justify-between gap-1 mb-1">
              <span class="card-fabric-line truncate">${p.fabric ? p.fabric.split(',')[0] : p.subCategory}</span>
              <div class="flex items-center gap-1 text-[11px] text-stone-300 font-semibold shrink-0">
                <i class="fa-solid fa-star text-[9px] text-[#D4AF37]"></i>
                <span>${p.rating}</span>
                <span class="text-stone-400 font-normal text-[10px]">(${p.reviewsCount})</span>
              </div>
            </div>

            <h4 class="card-title-line line-clamp-2 cursor-pointer mb-2" onclick="App.openQuickView('${p.id}')">
              ${p.title}
            </h4>

            ${p.colors && p.colors.length > 0 ? `
              <div class="flex items-center gap-1.5 mb-2">
                ${p.colors.slice(0, 4).map(c => `
                  <span class="swatch-circle" style="background-color: ${c.hex};" title="${c.name}"></span>
                `).join("")}
                ${p.colors.length > 4 ? `<span class="text-[10px] text-stone-400 font-medium">+${p.colors.length - 4}</span>` : ""}
              </div>
            ` : ""}
          </div>

          <div class="pt-2 border-t border-white/10 flex items-center justify-between mt-auto">
            <div class="flex items-baseline gap-1.5 flex-wrap">
              <span class="card-price-primary">${Store.formatPKR(p.price)}</span>
              ${p.originalPrice ? `<span class="card-price-original">${Store.formatPKR(p.originalPrice)}</span>` : ""}
            </div>

            <!-- Mobile Quick Add Trigger -->
            <button 
              type="button" 
              onclick="event.stopPropagation(); App.openMobileQuickAddSheet('${p.id}')"
              class="md:hidden px-2.5 py-1 bg-[#181716] text-[#D4AF37] border border-white/10 hover:border-[#D4AF37]/50 rounded text-[10px] font-bold uppercase tracking-wider transition"
            >
              + Add
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // Mobile Quick-Add Bottom Sheet (Frictionless Size Selection)
  openMobileQuickAddSheet: function (productId) {
    const p = Store.getProductById(productId);
    if (!p) return;

    this.activeProductForSheet = p;
    const sheetContent = document.getElementById("mobileQuickAddSheetContent");
    const sheetBackdrop = document.getElementById("mobileQuickAddSheetBackdrop");
    if (!sheetContent || !sheetBackdrop) return;

    sheetContent.innerHTML = `
      <div class="p-4 sm:p-5 text-white">
        <!-- Header -->
        <div class="flex gap-3 pb-3 border-b border-white/10">
          <img src="${p.images[0]}" alt="${p.title}" class="w-16 h-20 object-cover rounded bg-[#181716] shrink-0" />
          <div class="flex-1 min-w-0">
            <span class="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider">${p.subCategory}</span>
            <h4 class="text-xs sm:text-sm font-bold text-white line-clamp-1">${p.title}</h4>
            <div class="text-xs font-extrabold text-[#D4AF37] mt-0.5">${Store.formatPKR(p.price)}</div>
            <span class="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-1">
              <i class="fa-solid fa-circle-check"></i> In Stock (${p.stockCount} units)
            </span>
          </div>
          <button onclick="App.closeBottomSheet()" class="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-stone-400 hover:text-white shrink-0">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <!-- Size Selection Chips -->
        <div class="py-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold uppercase text-stone-300 tracking-wider">Tap Your Size to Add:</span>
            <button onclick="App.closeBottomSheet(); App.openBraCalculatorModal();" class="text-xs text-[#D4AF37] font-bold hover:underline flex items-center gap-1">
              <i class="fa-solid fa-ruler-combined"></i> Size Guide
            </button>
          </div>

          <div class="grid grid-cols-4 gap-2">
            ${(p.sizes || ["Standard"]).map(s => `
              <button 
                type="button" 
                onclick="App.quickAddFromSheet('${s}')"
                class="py-2.5 px-2 bg-[#181716] hover:bg-[#D4AF37] hover:text-[#0A0908] border border-white/10 rounded-lg text-xs font-bold text-stone-200 transition active:scale-95 flex items-center justify-center"
              >
                ${s}
              </button>
            `).join("")}
          </div>
        </div>

        <div class="p-2.5 bg-[#181716] rounded-lg border border-[#D4AF37]/30 flex items-center gap-2 text-[11px] text-[#D4AF37] font-medium">
          <i class="fa-solid fa-lock"></i>
          100% Discreet Packaging: Plain brown parcel, zero product labels.
        </div>
      </div>
    `;

    sheetBackdrop.classList.add("open");
  },

  quickAddFromSheet: function (selectedSize) {
    if (!this.activeProductForSheet) return;
    const p = this.activeProductForSheet;
    const color = p.colors ? p.colors[0].name : "Standard";
    Store.addToCart(p, selectedSize, color, 1);
    this.closeBottomSheet();
    this.showToast(`Added ${p.title} (${selectedSize}) to bag! 🛍️`);
    this.openCartDrawer();
  },

  closeBottomSheet: function () {
    const sheetBackdrop = document.getElementById("mobileQuickAddSheetBackdrop");
    if (sheetBackdrop) sheetBackdrop.classList.remove("open");
  },

  // Predictive Live Search
  handlePredictiveSearch: function (query) {
    const resultsContainer = document.getElementById("predictiveSearchResults");
    if (!resultsContainer) return;

    if (!query || query.length < 2) {
      resultsContainer.classList.add("hidden");
      resultsContainer.innerHTML = "";
      return;
    }

    const q = query.toLowerCase();
    const products = Store.getProducts().filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subCategory.toLowerCase().includes(q)
    ).slice(0, 5);

    if (products.length === 0) {
      resultsContainer.innerHTML = `
        <div class="p-4 text-center text-xs text-stone-500">
          No intimates found matching "<strong>${query}</strong>"
        </div>
      `;
      resultsContainer.classList.remove("hidden");
      return;
    }

    resultsContainer.innerHTML = `
      <div class="p-2 border-b border-stone-100 text-[10px] uppercase font-bold text-stone-400 tracking-wider">
        Found ${products.length} suggestions
      </div>
      <div class="divide-y divide-stone-100">
        ${products.map(p => `
          <div 
            onclick="App.openQuickView('${p.id}'); App.closeSearchModal();" 
            class="p-2.5 flex items-center gap-3 hover:bg-rose-50/60 transition cursor-pointer"
          >
            <img src="${p.images[0]}" alt="${p.title}" class="w-10 h-12 object-cover rounded bg-stone-100 shrink-0" />
            <div class="flex-1 min-w-0">
              <div class="text-xs font-semibold text-stone-900 truncate">${p.title}</div>
              <div class="text-[10px] text-rose-600 font-medium">${p.subCategory}</div>
              <div class="text-xs font-bold text-stone-800">${Store.formatPKR(p.price)}</div>
            </div>
            <i class="fa-solid fa-angle-right text-stone-300 text-xs"></i>
          </div>
        `).join("")}
      </div>
      <div class="p-2 bg-stone-50 text-center">
        <button 
          onclick="App.applySearchFilter('${query}'); App.closeSearchModal();" 
          class="text-xs font-semibold text-rose-600 hover:text-rose-700"
        >
          View all results for "${query}" &rarr;
        </button>
      </div>
    `;
    resultsContainer.classList.remove("hidden");
  },

  applySearchFilter: function (query) {
    this.activeFilters.search = query;
    this.renderProducts();
    const catalogEl = document.getElementById("catalogSection");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    }
  },

  resetFilters: function () {
    this.currentCategory = "all";
    this.activeFilters = {
      cup: null,
      band: null,
      maxPrice: 8000,
      inStockOnly: false,
      fabric: null,
      sort: "featured",
      search: ""
    };
    const sortSelect = document.getElementById("catalogSortSelect");
    if (sortSelect) sortSelect.value = "featured";
    document.querySelectorAll(".site-search-input").forEach(i => i.value = "");
    this.renderCategoryCircles();
    this.renderProducts();
    this.closeAllDrawers();
  },

  // Mobile Filter & Sort Drawer
  initMobileFilterDrawer: function () {
    const slider = document.getElementById("mobilePriceRangeSlider");
    const label = document.getElementById("mobilePriceRangeValue");
    if (slider && label) {
      slider.addEventListener("input", (e) => {
        this.activeFilters.maxPrice = parseInt(e.target.value);
        label.textContent = Store.formatPKR(e.target.value);
        this.renderProducts();
      });
    }
  },

  openFilterDrawer: function () {
    this.closeAllDrawers();
    const drawer = document.getElementById("filterDrawerBackdrop");
    if (drawer) drawer.classList.add("open");
  },

  // Quick View Modal
  openQuickView: function (productId) {
    const p = Store.getProductById(productId);
    if (!p) return;

    this.activeProductForModal = p;
    let selectedSize = p.sizes ? p.sizes[0] : "Standard";
    let selectedColor = p.colors ? p.colors[0].name : "Standard";
    let selectedImage = (p.colors && p.colors[0].image) || p.images[0];

    const modalContent = document.getElementById("quickViewModalContent");
    if (!modalContent) return;

    modalContent.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 relative text-white">
        <!-- Close Button -->
        <button onclick="App.closeAllModals()" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-20">
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>

        <!-- Product Gallery -->
        <div class="space-y-3">
          <div class="aspect-[3/4] rounded-lg overflow-hidden bg-[#181716] border border-white/10 relative">
            <img id="modalMainImage" src="${selectedImage}" alt="${p.title}" class="w-full h-full object-cover" />
            <span class="absolute bottom-3 left-3 bg-[#0A0908]/90 backdrop-blur-xs text-[11px] font-semibold text-stone-200 px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1.5 border border-white/10">
              <i class="fa-solid fa-lock text-[#D4AF37]"></i> 100% Discreet Packaging
            </span>
          </div>

          <!-- Thumbnails -->
          ${p.images.length > 1 ? `
            <div class="flex gap-2 overflow-x-auto pb-1">
              ${p.images.map((img, idx) => `
                <img 
                  src="${img}" 
                  alt="Thumb ${idx}" 
                  onclick="document.getElementById('modalMainImage').src='${img}'"
                  class="w-14 h-18 object-cover rounded border border-white/10 cursor-pointer hover:border-[#D4AF37] transition" 
                />
              `).join("")}
            </div>
          ` : ""}
        </div>

        <!-- Product Information & Options -->
        <div class="flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="text-[#D4AF37] font-bold tracking-wider uppercase">${p.subCategory}</span>
              <div class="flex items-center gap-1 text-[#D4AF37] font-bold">
                <i class="fa-solid fa-star text-xs"></i>
                <span class="text-white">${p.rating}</span>
                <span class="text-stone-400">(${p.reviewsCount} reviews)</span>
              </div>
            </div>

            <h2 class="text-lg sm:text-xl font-bold text-white leading-snug mb-2 font-serif-luxury">
              ${p.title}
            </h2>

            <!-- Pricing -->
            <div class="flex items-baseline gap-3 mb-3">
              <span class="text-xl sm:text-2xl font-bold text-white">${Store.formatPKR(p.price)}</span>
              ${p.originalPrice ? `
                <span class="text-sm text-stone-400 line-through">${Store.formatPKR(p.originalPrice)}</span>
                <span class="px-2 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold rounded">
                  Save ${Store.formatPKR(p.originalPrice - p.price)}
                </span>
              ` : ""}
            </div>

            <!-- Stock Status Pill -->
            <div class="mb-4 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              In Stock & Ready for Confidential Dispatch (${p.stockCount} left)
            </div>

            <!-- Color Options -->
            ${p.colors && p.colors.length > 0 ? `
              <div class="mb-4">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-xs font-bold text-stone-300 uppercase tracking-wider">Color:</span>
                  <span id="modalSelectedColorLabel" class="text-xs text-[#D4AF37] font-semibold">${selectedColor}</span>
                </div>
                <div class="flex items-center gap-2">
                  ${p.colors.map(c => `
                    <button 
                      type="button" 
                      onclick="App.selectModalColor('${c.name}', '${c.image}')"
                      class="swatch-circle modal-color-swatch ${c.name === selectedColor ? "active" : ""}" 
                      style="background-color: ${c.hex};" 
                      title="${c.name}"
                      data-color="${c.name}"
                    ></button>
                  `).join("")}
                </div>
              </div>
            ` : ""}

            <!-- Size Selector -->
            ${p.sizes && p.sizes.length > 0 ? `
              <div class="mb-4">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-xs font-bold text-stone-300 uppercase tracking-wider">Select Size:</span>
                  <button onclick="App.openBraCalculatorModal()" class="text-xs text-[#D4AF37] hover:underline font-semibold flex items-center gap-1">
                    <i class="fa-solid fa-ruler"></i> Find My Exact Size
                  </button>
                </div>
                <div class="flex flex-wrap gap-1.5">
                  ${p.sizes.map(s => `
                    <button 
                      type="button" 
                      onclick="App.selectModalSize('${s}')"
                      class="size-pill modal-size-btn ${s === selectedSize ? "active" : ""}"
                      data-size="${s}"
                    >
                      ${s}
                    </button>
                  `).join("")}
                </div>
              </div>
            ` : ""}

            <p class="text-xs text-stone-300 leading-relaxed mb-3">
              ${p.description}
            </p>

            <div class="text-[11px] text-stone-400 mb-4 bg-[#181716] p-2.5 rounded border border-white/10">
              <strong class="text-stone-200">Fabric & Care:</strong> ${p.fabric}. Hand wash cold, line dry in shade.
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-2.5 pt-3 border-t border-white/10">
            <div class="flex items-center gap-3">
              <div class="flex items-center border border-white/20 rounded h-11 bg-[#181716]">
                <button type="button" onclick="App.stepModalQty(-1)" class="w-10 h-full text-stone-300 hover:text-white transition flex items-center justify-center font-bold">
                  &minus;
                </button>
                <input id="modalQtyInput" type="number" value="1" min="1" max="10" readonly class="w-10 text-center text-xs font-bold text-white bg-transparent focus:outline-none" />
                <button type="button" onclick="App.stepModalQty(1)" class="w-10 h-full text-stone-300 hover:text-white transition flex items-center justify-center font-bold">
                  &#43;
                </button>
              </div>

              <button 
                type="button" 
                onclick="App.addActiveModalToCart()"
                class="flex-1 h-11 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0A0908] font-bold text-xs uppercase tracking-wider rounded transition flex items-center justify-center gap-2 shadow-lg"
              >
                <i class="fa-solid fa-bag-shopping"></i> Add to Shopping Bag
              </button>
            </div>

            <button 
              type="button" 
              onclick="App.orderViaWhatsApp(App.activeProductForModal)"
              class="w-full h-10 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded transition flex items-center justify-center gap-2 shadow-xs"
            >
              <i class="fa-brands fa-whatsapp text-sm"></i> Order via WhatsApp Assistance
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("quickViewModalBackdrop").classList.add("open");
  },

  selectModalColor: function (colorName, imageUrl) {
    document.querySelectorAll(".modal-color-swatch").forEach(s => {
      s.classList.toggle("active", s.getAttribute("data-color") === colorName);
    });
    const label = document.getElementById("modalSelectedColorLabel");
    if (label) label.textContent = colorName;
    if (imageUrl) {
      const mainImg = document.getElementById("modalMainImage");
      if (mainImg) mainImg.src = imageUrl;
    }
  },

  selectModalSize: function (size) {
    document.querySelectorAll(".modal-size-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-size") === size);
    });
  },

  stepModalQty: function (delta) {
    const input = document.getElementById("modalQtyInput");
    if (!input) return;
    let val = parseInt(input.value) + delta;
    if (val < 1) val = 1;
    if (val > 10) val = 10;
    input.value = val;
  },

  addActiveModalToCart: function () {
    if (!this.activeProductForModal) return;
    const activeSizeBtn = document.querySelector(".modal-size-btn.active");
    const activeColorSwatch = document.querySelector(".modal-color-swatch.active");
    const qtyInput = document.getElementById("modalQtyInput");

    const size = activeSizeBtn ? activeSizeBtn.getAttribute("data-size") : (this.activeProductForModal.sizes ? this.activeProductForModal.sizes[0] : "Standard");
    const color = activeColorSwatch ? activeColorSwatch.getAttribute("data-color") : (this.activeProductForModal.colors ? this.activeProductForModal.colors[0].name : "Standard");
    const qty = qtyInput ? parseInt(qtyInput.value) : 1;

    Store.addToCart(this.activeProductForModal, size, color, qty);
    this.closeAllModals();
    this.showToast(`Added ${this.activeProductForModal.title} to bag! 🛍️`);
    this.openCartDrawer();
  },

  // Wishlist Logic
  toggleWishlist: function (productId) {
    const { added } = Store.toggleWishlist(productId);
    if (added) {
      this.showToast("Saved to your Wishlist ❤️");
    } else {
      this.showToast("Removed from Wishlist");
    }
  },

  updateWishlistUI: function () {
    const wishlist = Store.getWishlist();
    const countBadges = document.querySelectorAll(".wishlist-count-badge");
    countBadges.forEach(b => {
      b.textContent = wishlist.length;
      b.classList.toggle("hidden", wishlist.length === 0);
    });

    const wishlistContainer = document.getElementById("wishlistItemsContainer");
    if (!wishlistContainer) return;

    if (wishlist.length === 0) {
      wishlistContainer.innerHTML = `
        <div class="py-12 text-center text-stone-400">
          <i class="fa-regular fa-heart text-4xl mb-3 text-stone-300"></i>
          <p class="text-sm font-semibold text-stone-600">Your wishlist is empty</p>
          <p class="text-xs text-stone-400 mt-1">Tap the heart on any intimates you love to save them here.</p>
        </div>
      `;
      return;
    }

    const allProducts = Store.getProducts();
    const wishlistedProducts = allProducts.filter(p => wishlist.includes(p.id));

    wishlistContainer.innerHTML = wishlistedProducts.map(p => `
      <div class="flex items-center gap-3 p-3 bg-white border border-stone-200 rounded-lg">
        <img src="${p.images[0]}" alt="${p.title}" class="w-16 h-20 object-cover rounded bg-stone-50 shrink-0" />
        <div class="flex-1 min-w-0">
          <h4 class="text-xs font-bold text-stone-900 truncate">${p.title}</h4>
          <span class="text-[11px] text-rose-600 font-semibold">${p.subCategory}</span>
          <div class="text-xs font-bold text-stone-800 mt-1">${Store.formatPKR(p.price)}</div>
        </div>
        <div class="flex flex-col gap-1.5 shrink-0">
          <button 
            onclick="App.openMobileQuickAddSheet('${p.id}'); Store.toggleWishlist('${p.id}');" 
            class="px-2.5 py-1.5 bg-rose-600 text-white rounded text-[10px] font-bold uppercase hover:bg-rose-700 transition"
          >
            Move to Bag
          </button>
          <button 
            onclick="Store.toggleWishlist('${p.id}')" 
            class="text-[11px] text-stone-400 hover:text-stone-700 font-medium"
          >
            Remove
          </button>
        </div>
      </div>
    `).join("");
  },

  // Cart Drawer UI & In-Cart Smart Upsells
  updateCartUI: function () {
    const cart = Store.getCart();
    const totals = Store.getCartTotals();
    const cartCount = Store.getCartCount();

    document.querySelectorAll(".cart-count-badge").forEach(b => {
      b.textContent = cartCount;
      b.classList.toggle("hidden", cartCount === 0);
    });

    const itemsContainer = document.getElementById("cartDrawerItemsContainer");
    const subtotalEl = document.getElementById("cartSubtotalDisplay");
    const shippingEl = document.getElementById("cartShippingDisplay");
    const discountRow = document.getElementById("cartDiscountRow");
    const discountEl = document.getElementById("cartDiscountDisplay");
    const grandTotalEl = document.getElementById("cartGrandTotalDisplay");
    const shippingProgressFill = document.getElementById("freeShippingProgressFill");
    const shippingThresholdText = document.getElementById("freeShippingThresholdText");
    const upsellSection = document.getElementById("cartUpsellSection");

    // Free shipping thermometer
    if (shippingProgressFill && shippingThresholdText) {
      shippingProgressFill.style.width = `${totals.freeShippingProgress}%`;
      if (totals.isFreeShipping) {
        shippingThresholdText.innerHTML = `
          <span class="text-emerald-700 font-bold flex items-center gap-1.5">
            <i class="fa-solid fa-circle-check text-emerald-600"></i> You unlocked FREE Discreet Shipping across Pakistan!
          </span>
        `;
      } else {
        shippingThresholdText.innerHTML = `
          Add <strong>${Store.formatPKR(totals.amountForFreeShipping)}</strong> more to unlock <strong>FREE Discreet Delivery</strong>!
        `;
      }
    }

    if (subtotalEl) subtotalEl.textContent = Store.formatPKR(totals.subtotal);
    if (shippingEl) shippingEl.textContent = totals.shipping === 0 ? "FREE" : Store.formatPKR(totals.shipping);
    if (grandTotalEl) grandTotalEl.textContent = Store.formatPKR(totals.total);

    if (discountRow && discountEl) {
      if (totals.discount > 0) {
        discountRow.classList.remove("hidden");
        discountEl.textContent = `-${Store.formatPKR(totals.discount)}`;
      } else {
        discountRow.classList.add("hidden");
      }
    }

    // In-Cart Upsell Recommendations ("Frequently Bought Together")
    if (upsellSection) {
      const upsellItems = Store.getCartCrossSells();
      if (upsellItems.length > 0 && cart.length > 0) {
        upsellSection.innerHTML = `
          <div class="mt-4 pt-3 border-t border-white/10">
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-2">
              Frequently Bought Together
            </span>
            <div class="space-y-2">
              ${upsellItems.map(item => `
                <div class="cart-upsell-item bg-[#181716] p-2 rounded border border-white/10 flex items-center gap-2">
                  <img src="${item.images[0]}" alt="${item.title}" class="w-10 h-12 object-cover rounded bg-[#100F0E] shrink-0" />
                  <div class="flex-1 min-w-0 text-left">
                    <h5 class="text-xs font-bold text-white truncate">${item.title}</h5>
                    <span class="text-xs font-semibold text-[#D4AF37]">${Store.formatPKR(item.price)}</span>
                  </div>
                  <button 
                    onclick="Store.addToCart(Store.getProductById('${item.id}'), 'Standard', 'Standard', 1); App.showToast('Added ${item.title}!');" 
                    class="px-2.5 py-1 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0A0908] rounded text-[10px] font-bold uppercase shrink-0 transition"
                  >
                    + Add
                  </button>
                </div>
              `).join("")}
            </div>
          </div>
        `;
        upsellSection.classList.remove("hidden");
      } else {
        upsellSection.classList.add("hidden");
      }
    }

    if (!itemsContainer) return;

    if (cart.length === 0) {
      itemsContainer.innerHTML = `
        <div class="py-16 text-center text-stone-400">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] text-2xl">
            <i class="fa-solid fa-bag-shopping"></i>
          </div>
          <h4 class="text-sm font-bold text-white">Your shopping bag is empty</h4>
          <p class="text-xs text-stone-400 mt-1 max-w-xs mx-auto">Discover ultra-comfortable bras, seamless knickers, and bridal trousseau.</p>
          <button onclick="App.closeAllDrawers(); App.filterByCategory('bras');" class="mt-4 px-5 py-2.5 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0A0908] text-xs font-bold uppercase tracking-wider rounded transition shadow-md">
            Shop Bras Collection
          </button>
        </div>
      `;
      return;
    }

    itemsContainer.innerHTML = cart.map(item => `
      <div class="flex gap-3 py-3 border-b border-white/10">
        <img src="${item.image}" alt="${item.title}" class="w-16 h-20 object-cover rounded bg-[#181716] shrink-0" />
        <div class="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between gap-2">
              <h4 class="text-xs font-semibold text-white line-clamp-1">${item.title}</h4>
              <button onclick="Store.removeFromCart('${item.cartItemId}')" class="text-stone-400 hover:text-rose-400 text-xs shrink-0 p-1" title="Remove">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
            <div class="flex items-center gap-2 mt-0.5 text-[11px] text-stone-400">
              <span class="bg-[#181716] border border-white/10 px-1.5 py-0.5 rounded font-medium text-stone-300">Size: ${item.size}</span>
              <span class="bg-[#181716] border border-white/10 px-1.5 py-0.5 rounded font-medium text-stone-300">Color: ${item.color}</span>
            </div>
          </div>

          <div class="flex items-center justify-between mt-2">
            <!-- Stepper -->
            <div class="flex items-center border border-white/20 rounded h-7 bg-[#181716]">
              <button onclick="Store.updateCartQuantity('${item.cartItemId}', ${item.quantity - 1})" class="w-6 h-full flex items-center justify-center text-xs text-stone-300 hover:text-white">
                &minus;
              </button>
              <span class="w-7 text-center text-xs font-bold text-white">${item.quantity}</span>
              <button onclick="Store.updateCartQuantity('${item.cartItemId}', ${item.quantity + 1})" class="w-6 h-full flex items-center justify-center text-xs text-stone-300 hover:text-white">
                &#43;
              </button>
            </div>

            <!-- Item Price -->
            <span class="text-xs font-bold text-[#D4AF37]">${Store.formatPKR(item.price * item.quantity)}</span>
          </div>
        </div>
      </div>
    `).join("");
  },

  applyCartCoupon: function () {
    const input = document.getElementById("cartCouponInput");
    if (!input) return;
    const res = Store.applyCoupon(input.value);
    if (res.success) {
      this.showToast(res.message);
      input.value = "";
    } else {
      alert(res.message);
    }
  },

  // Interactive Bra Size Calculator
  openBraCalculatorModal: function () {
    this.closeAllModals();
    const modal = document.getElementById("braCalculatorModalBackdrop");
    if (modal) modal.classList.add("open");
  },

  calculateBraSize: function () {
    const bandInput = document.getElementById("calcBandInches");
    const bustInput = document.getElementById("calcBustInches");
    const resultBox = document.getElementById("calculatorResultBox");

    if (!bandInput || !bustInput || !resultBox) return;

    const underbust = parseFloat(bandInput.value);
    const bust = parseFloat(bustInput.value);

    if (isNaN(underbust) || isNaN(bust) || underbust <= 0 || bust <= 0) {
      alert("Please enter valid positive numbers for your measurements.");
      return;
    }

    if (bust <= underbust) {
      alert("Fullest bust measurement should be larger than underbust measurement.");
      return;
    }

    // Standard UK/US/Pakistani Bra Calculation
    let calculatedBand = Math.round(underbust);
    if (calculatedBand % 2 === 0) {
      calculatedBand += 4;
    } else {
      calculatedBand += 5;
    }

    const diff = Math.round(bust - underbust);
    let calculatedCup = "B";
    if (diff <= 1) calculatedCup = "A";
    else if (diff === 2) calculatedCup = "B";
    else if (diff === 3) calculatedCup = "C";
    else if (diff === 4) calculatedCup = "D";
    else if (diff >= 5) calculatedCup = "DD";

    const recommendedSize = `${calculatedBand}${calculatedCup}`;
    const sisterSmaller = `${calculatedBand - 2}${calculatedCup === "A" ? "B" : calculatedCup === "B" ? "C" : "D"}`;
    const sisterLarger = `${calculatedBand + 2}${calculatedCup === "D" ? "C" : calculatedCup === "C" ? "B" : "A"}`;

    resultBox.innerHTML = `
      <div class="p-4 bg-rose-50/80 border border-rose-200 rounded-xl text-center space-y-2">
        <span class="text-[10px] font-bold text-rose-600 uppercase tracking-widest block">Your Certified Size</span>
        <div class="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif-luxury">${recommendedSize}</div>
        <p class="text-xs text-stone-600">Underbust: ${underbust}" &bull; Bust: ${bust}"</p>

        <div class="mt-3 pt-3 border-t border-rose-200/80 grid grid-cols-2 gap-2 text-xs text-stone-700">
          <div class="p-2 bg-white rounded border border-rose-100">
            <span class="text-[10px] text-stone-400 block uppercase">Tighter Sister Size</span>
            <strong class="text-stone-900">${sisterSmaller}</strong>
          </div>
          <div class="p-2 bg-white rounded border border-rose-100">
            <span class="text-[10px] text-stone-400 block uppercase">Looser Sister Size</span>
            <strong class="text-stone-900">${sisterLarger}</strong>
          </div>
        </div>

        <button 
          type="button" 
          onclick="App.filterByCalculatedSize('${calculatedBand}', '${calculatedCup}')"
          class="mt-4 w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition shadow-md"
        >
          Browse Bras in My Size (${recommendedSize}) &rarr;
        </button>
      </div>
    `;
    resultBox.classList.remove("hidden");
  },

  filterByCalculatedSize: function (band, cup) {
    this.closeAllModals();
    this.currentCategory = "bras";
    this.activeFilters.band = band.toString();
    this.activeFilters.cup = cup;
    this.renderCategoryCircles();
    this.renderProducts();
    const catalogEl = document.getElementById("catalogSection");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    }
    this.showToast(`Showing bras available in size ${band}${cup}! ✨`);
  },

  // Customer Reviews & Interactive Histogram
  renderReviewsSection: function () {
    const reviews = Store.getReviews();
    const container = document.getElementById("customerReviewsGrid");
    const countDisplay = document.getElementById("reviewsCountDisplay");
    if (!container) return;

    if (countDisplay) countDisplay.textContent = `${reviews.length} Verified Reviews`;

    container.innerHTML = reviews.map(r => `
      <div class="p-5 bg-[#181716] rounded-xl border border-white/10 hover:border-[#D4AF37]/30 transition space-y-3 flex flex-col justify-between shadow-lg">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex text-[#D4AF37] text-xs">
              ${Array.from({ length: 5 }, (_, i) => `<i class="fa-solid fa-star ${i < r.rating ? "text-[#D4AF37]" : "text-white/20"}"></i>`).join("")}
            </div>
            ${r.verified ? `
              <span class="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full">
                <i class="fa-solid fa-check"></i> Verified Buyer
              </span>
            ` : ""}
          </div>
          <h4 class="text-xs sm:text-sm font-bold text-white">"${r.title}"</h4>
          <p class="text-xs text-stone-300 leading-relaxed">${r.comment}</p>
        </div>

        <div class="pt-2 border-t border-white/10 text-xs font-semibold text-stone-200 flex justify-between items-center">
          <div>
            <span class="text-white">${r.name}</span>
            <span class="text-stone-400 font-normal block text-[11px]">${r.city}, PK &bull; ${r.date}</span>
          </div>
          <span class="text-[10px] text-[#D4AF37] font-semibold truncate max-w-[120px]">${r.productTitle}</span>
        </div>
      </div>
    `).join("");
  },

  openWriteReviewModal: function () {
    const modal = document.getElementById("writeReviewModalBackdrop");
    if (modal) modal.classList.add("open");
  },

  handleReviewSubmission: function (form) {
    const formData = new FormData(form);
    const newRev = {
      name: formData.get("reviewerName") || "Anonymous Customer",
      city: formData.get("reviewerCity") || "Lahore",
      rating: parseInt(formData.get("rating")) || 5,
      title: formData.get("reviewTitle") || "Amazing Fit & Quality",
      comment: formData.get("reviewComment") || "",
      productTitle: formData.get("productTitle") || "Seamless Wireless Bra"
    };

    Store.addReview(newRev);
    this.closeAllModals();
    this.showToast("Thank you for your feedback! Review published. ⭐");
  },

  // Checkout Flow
  openCheckoutModal: function () {
    const cart = Store.getCart();
    if (cart.length === 0) {
      alert("Your shopping bag is empty! Please add some intimates first.");
      return;
    }
    this.closeAllDrawers();
    const modal = document.getElementById("checkoutModalBackdrop");
    const summaryBox = document.getElementById("checkoutSummaryBox");
    const totals = Store.getCartTotals();

    if (summaryBox) {
      summaryBox.innerHTML = `
        <div class="bg-[#181716] p-4 rounded-xl border border-white/10 mb-4 text-xs space-y-2 text-white">
          <div class="font-bold text-white text-sm mb-2 border-b border-white/10 pb-1.5 flex justify-between">
            <span>Order Summary (${Store.getCartCount()} Items)</span>
            <span class="text-[#D4AF37] flex items-center gap-1 font-semibold"><i class="fa-solid fa-lock"></i> Discreet Packing</span>
          </div>
          ${cart.map(i => `
            <div class="flex justify-between text-stone-300">
              <span class="truncate max-w-[220px]">${i.quantity}x ${i.title} (${i.size})</span>
              <span class="font-semibold text-white">${Store.formatPKR(i.price * i.quantity)}</span>
            </div>
          `).join("")}
          <div class="border-t border-white/10 pt-2 space-y-1">
            <div class="flex justify-between text-stone-300">
              <span>Subtotal:</span>
              <span class="font-semibold text-white">${Store.formatPKR(totals.subtotal)}</span>
            </div>
            ${totals.discount > 0 ? `
              <div class="flex justify-between text-emerald-400 font-semibold">
                <span>Discount (${totals.coupon.code}):</span>
                <span>-${Store.formatPKR(totals.discount)}</span>
              </div>
            ` : ""}
            <div class="flex justify-between text-stone-300">
              <span>Shipping (TCS Express Discreet):</span>
              <span class="font-semibold text-white">${totals.shipping === 0 ? "FREE" : Store.formatPKR(totals.shipping)}</span>
            </div>
            <div class="flex justify-between text-sm font-bold text-white pt-1.5 border-t border-white/10">
              <span>Total Payable:</span>
              <span class="text-[#D4AF37] text-base font-extrabold">${Store.formatPKR(totals.total)}</span>
            </div>
          </div>
        </div>
      `;
    }

    if (modal) modal.classList.add("open");
  },

  // 1-Click WhatsApp Checkout & Booking
  checkoutViaWhatsApp: function (customerDetails = null) {
    const cart = Store.getCart();
    if (!cart || cart.length === 0) {
      alert("Aap ka shopping bag khali hai! Pehle koi product add karein.");
      return;
    }

    const totals = Store.getCartTotals();
    const orderData = {
      customer: customerDetails || {
        fullName: "WhatsApp Customer",
        phone: Store.WHATSAPP_DISPLAY,
        city: "Pakistan",
        address: "Booked via WhatsApp"
      },
      paymentMethod: "Cash on Delivery (WhatsApp Booking)",
      items: [...cart],
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      total: totals.total,
      discreetPackaging: true
    };

    let newOrder = null;
    try {
      newOrder = Store.addOrder(orderData);
    } catch (e) {
      console.warn("Could not save order locally", e);
    }

    const orderRef = newOrder ? newOrder.orderId : null;
    const waUrl = Store.getWhatsAppOrderUrl(customerDetails, orderRef);

    this.showToast("WhatsApp open ho raha hai... Apna booking message send karein! 💬");
    this.closeAllDrawers();
    this.closeAllModals();

    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = waUrl;
    } else {
      window.open(waUrl, "_blank");
    }
  },

  handleCheckoutSubmission: function (form) {
    const formData = new FormData(form);
    const totals = Store.getCartTotals();
    const cart = Store.getCart();

    const customerDetails = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      address: formData.get("address"),
      city: formData.get("city"),
      notes: formData.get("notes") || ""
    };

    const orderData = {
      customer: customerDetails,
      paymentMethod: formData.get("paymentMethod") || "Cash on Delivery (COD)",
      items: cart,
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      total: totals.total,
      discreetPackaging: true
    };

    const newOrder = Store.addOrder(orderData);
    this.closeAllModals();
    this.showOrderConfirmationModal(newOrder);

    // Auto-open WhatsApp with complete booking info
    const waUrl = Store.getWhatsAppOrderUrl(customerDetails, newOrder.orderId);
    setTimeout(() => {
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = waUrl;
      } else {
        window.open(waUrl, "_blank");
      }
    }, 400);
  },

  showOrderConfirmationModal: function (order) {
    const modal = document.getElementById("orderConfirmationModalBackdrop");
    const container = document.getElementById("orderConfirmationContent");
    if (!modal || !container) return;

    container.innerHTML = `
      <div class="p-6 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl animate-bounce">
          <i class="fa-solid fa-check"></i>
        </div>
        <span class="text-xs font-bold uppercase tracking-widest text-emerald-600">Order Placed Successfully!</span>
        <h2 class="text-xl sm:text-2xl font-bold text-stone-900 font-serif-luxury mt-1">Thank You, ${order.customer.fullName}!</h2>
        <p class="text-xs text-stone-500 mt-1">Your confidential order has been received and queued for dispatch.</p>

        <!-- Order Details Card -->
        <div class="my-5 p-4 bg-stone-50 border border-stone-200 rounded-xl text-left text-xs space-y-2">
          <div class="flex justify-between items-center border-b border-stone-200 pb-2">
            <div>
              <span class="text-stone-400 block text-[10px] uppercase">Order Reference</span>
              <strong class="text-sm font-bold text-rose-600">${order.orderId}</strong>
            </div>
            <div>
              <span class="text-stone-400 block text-[10px] uppercase">TCS Tracking Code</span>
              <strong class="text-sm font-bold text-stone-800">${order.trackingCode}</strong>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2 pt-1 text-stone-700">
            <div><strong>Recipient:</strong> ${order.customer.fullName}</div>
            <div><strong>City:</strong> ${order.customer.city}</div>
            <div><strong>Phone:</strong> ${order.customer.phone}</div>
            <div><strong>Payment:</strong> ${order.paymentMethod}</div>
          </div>
          <div class="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-[11px] font-medium border border-emerald-200 flex items-center gap-2">
            <i class="fa-solid fa-shield-halved text-emerald-600"></i>
            100% Confidential Delivery Guarantee: The parcel exterior has NO intimate wear labels.
          </div>
        </div>

        <!-- WhatsApp Direct Link -->
        <div class="mb-4">
          <a 
            href="${Store.getWhatsAppOrderUrl(order.customer, order.orderId)}" 
            target="_blank" 
            class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition shadow-md flex items-center justify-center gap-2"
          >
            <i class="fa-brands fa-whatsapp text-lg"></i> Send Order Details to WhatsApp (+92 326 6131394)
          </a>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row gap-2.5">
          <button 
            type="button" 
            onclick="App.closeAllModals(); App.openTrackingModalWithCode('${order.orderId}')" 
            class="flex-1 py-3 bg-stone-900 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-2 shadow-md"
          >
            <i class="fa-solid fa-truck-fast"></i> Track Live Courier
          </button>
          <button 
            type="button" 
            onclick="window.print()" 
            class="px-4 py-3 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs uppercase rounded-lg transition"
          >
            <i class="fa-solid fa-print mr-1"></i> Print Receipt
          </button>
          <button 
            type="button" 
            onclick="App.closeAllModals()" 
            class="px-4 py-3 border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs uppercase rounded-lg transition"
          >
            Continue
          </button>
        </div>
      </div>
    `;

    modal.classList.add("open");
  },

  // Live Courier Tracking
  openOrderTrackingModal: function () {
    this.closeAllModals();
    const modal = document.getElementById("orderTrackingModalBackdrop");
    if (modal) modal.classList.add("open");
  },

  openTrackingModalWithCode: function (code) {
    this.openOrderTrackingModal();
    const input = document.getElementById("trackingLookupInput");
    if (input) input.value = code;
    this.lookupOrderTracking();
  },

  lookupOrderTracking: function () {
    const input = document.getElementById("trackingLookupInput");
    const container = document.getElementById("trackingTimelineContainer");
    if (!input || !container) return;

    const query = input.value.trim().toUpperCase();
    if (!query) {
      alert("Please enter your Order ID or TCS Tracking Number.");
      return;
    }

    const orders = Store.getOrders();
    const order = orders.find(o => o.orderId.toUpperCase() === query || o.trackingCode.toUpperCase() === query);

    if (!order) {
      container.innerHTML = `
        <div class="p-4 bg-rose-50 border border-rose-200 rounded-lg text-center text-xs text-rose-700">
          <i class="fa-solid fa-circle-exclamation text-lg mb-1 block"></i>
          Order reference "${query}" not found. Please verify the code on your order invoice or SMS.
        </div>
      `;
      container.classList.remove("hidden");
      return;
    }

    const steps = [
      { title: "Order Confirmed", desc: "Customer order booked and verified", icon: "fa-receipt", done: true },
      { title: "Confidential Packaging", desc: "Packed in sealed unbranded brown box", icon: "fa-box-archive", done: true },
      { title: "Dispatched via TCS Express", desc: "Handed over to courier facility", icon: "fa-truck-fast", done: order.status !== "Order Confirmed" },
      { title: "Out for Delivery", desc: "Courier rider is en route to address", icon: "fa-motorcycle", done: order.status === "Out for Delivery" || order.status === "Delivered" },
      { title: "Delivered", desc: "Delivered discreetly to recipient", icon: "fa-circle-check", done: order.status === "Delivered" }
    ];

    container.innerHTML = `
      <div class="p-4 bg-white border border-stone-200 rounded-xl space-y-4 text-xs">
        <div class="flex items-center justify-between border-b border-stone-100 pb-2">
          <div>
            <span class="text-stone-400 block text-[10px]">ORDER ID</span>
            <strong class="text-sm font-bold text-stone-900">${order.orderId}</strong>
          </div>
          <div class="text-right">
            <span class="text-stone-400 block text-[10px]">STATUS</span>
            <span class="px-2 py-0.5 rounded text-xs font-bold ${order.status === "Delivered" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}">
              ${order.status}
            </span>
          </div>
        </div>

        <div class="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
          ${steps.map(s => `
            <div class="relative flex items-start gap-3">
              <span class="absolute -left-6 w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${s.done ? "bg-rose-600 text-white" : "bg-stone-200 text-stone-400"}">
                <i class="fa-solid fa-check"></i>
              </span>
              <div>
                <h5 class="font-bold ${s.done ? "text-stone-900" : "text-stone-400"}">${s.title}</h5>
                <p class="text-[11px] text-stone-500">${s.desc}</p>
              </div>
            </div>
          `).join("")}
        </div>

        <div class="bg-stone-50 p-2.5 rounded text-[11px] text-stone-600 border border-stone-100">
          <strong>Destination:</strong> ${order.customer.address}, ${order.customer.city}
        </div>
      </div>
    `;
    container.classList.remove("hidden");
  },

  // WhatsApp 1-Click Order Assistant
  orderViaWhatsApp: function (product) {
    if (!product) return;
    const phone = (typeof Store !== "undefined" && Store.WHATSAPP_NUMBER) ? Store.WHATSAPP_NUMBER : "923266131394";
    const msg = encodeURIComponent(
      `Assalam-o-Alaikum Miss Collection!\n\nMujhe yeh product book/purchase karna hai:\n• Product: ${product.title}\n• Price: ${Store.formatPKR(product.price)}\n• Code: ${product.id}\n\nKindly availability confirm karein aur discreet private packaging ke sath dispatch karein. Shukriya!`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  },

  // VIP WhatsApp Haute Concierge
  openWhatsAppConcierge: function (topic) {
    const phone = (typeof Store !== "undefined" && Store.WHATSAPP_NUMBER) ? Store.WHATSAPP_NUMBER : "923266131394";
    const subject = topic || "VIP Order & Fitting Consultation";
    const msg = encodeURIComponent(
      `Assalam-o-Alaikum Miss Collection Haute Concierge!\n\nSubject: ${subject}\nMujhe customized size guidance, private fitting advice, aur direct order booking mein assistance chahiye. Please guide karein.`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  },

  // Modal & Drawer Toggles
  openCartDrawer: function () {
    this.closeAllDrawers();
    this.updateCartUI();
    document.getElementById("cartDrawerBackdrop").classList.add("open");
  },

  openWishlistDrawer: function () {
    this.closeAllDrawers();
    this.updateWishlistUI();
    document.getElementById("wishlistDrawerBackdrop").classList.add("open");
  },

  openMobileNav: function () {
    this.closeAllDrawers();
    document.getElementById("mobileNavDrawerBackdrop").classList.add("open");
  },

  closeAllDrawers: function () {
    document.querySelectorAll(".drawer-backdrop").forEach(d => d.classList.remove("open"));
  },

  closeAllModals: function () {
    document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("open"));
  },

  closeSearchModal: function () {
    const results = document.getElementById("predictiveSearchResults");
    if (results) results.classList.add("hidden");
  },

  // Toast Notification
  showToast: function (message) {
    let toast = document.getElementById("appToastNotification");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "appToastNotification";
      toast.className = "fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 bg-stone-900/95 text-white text-xs font-semibold px-5 py-3 rounded-full shadow-xl z-50 transition-all duration-300 opacity-0 pointer-events-none flex items-center gap-2 border border-white/10";
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-sparkles text-rose-400"></i> ${message}`;
    toast.classList.remove("opacity-0", "pointer-events-none");
    toast.classList.add("opacity-100");

    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      toast.classList.add("opacity-0", "pointer-events-none");
      toast.classList.remove("opacity-100");
    }, 2800);
  }
};

// Export to global scope
if (typeof window !== "undefined") {
  window.App = App;
}
