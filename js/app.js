/**
 * Miss Collection - Main Frontend Application Logic
 * Ella Theme Interactive Features & Lingerie E-Commerce UX
 */

document.addEventListener("DOMContentLoaded", function () {
  App.init();
});

const App = {
  currentCategory: "all",
  activeFilters: {
    cup: null,
    band: null,
    sort: "featured",
    search: ""
  },
  activeProductForModal: null,

  init: function () {
    this.bindEvents();
    this.renderCategoryCircles();
    this.renderProducts();
    this.updateCartUI();
    this.updateWishlistUI();
    this.initStickyHeader();
    this.initHeroSlider();
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

    // Category Tabs / Pills
    document.querySelectorAll("[data-category-filter]").forEach(btn => {
      btn.addEventListener("click", function () {
        document.querySelectorAll("[data-category-filter]").forEach(b => {
          b.classList.remove("active", "bg-rose-600", "text-white");
          b.classList.add("bg-white", "text-stone-700");
        });
        this.classList.add("active", "bg-rose-600", "text-white");
        this.classList.remove("bg-white", "text-stone-700");

        self.currentCategory = this.getAttribute("data-category-filter");
        self.renderProducts();
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
  },

  initStickyHeader: function () {
    const header = document.querySelector(".header-sticky");
    if (!header) return;
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        header.classList.add("header-shadow", "py-2");
        header.classList.remove("py-3.5");
      } else {
        header.classList.remove("header-shadow", "py-2");
        header.classList.add("py-3.5");
      }
    });
  },

  initHeroSlider: function () {
    let currentSlide = 0;
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

    setInterval(() => {
      let next = (currentSlide + 1) % slides.length;
      showSlide(next);
    }, 5500);
  },

  renderCategoryCircles: function () {
    const container = document.getElementById("categoryCirclesContainer");
    if (!container) return;

    const categories = [
      { id: "all", name: "All Essentials", img: "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=300&q=80", count: "25+ Styles" },
      { id: "bras", name: "Luxury Bras", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80", count: "Seamless & Lace" },
      { id: "panties", name: "Cotton & Panties", img: "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=300&q=80", count: "No-Show & Briefs" },
      { id: "bridal", name: "Bridal Trousseau", img: "https://images.unsplash.com/photo-1616150840617-a0684f0f089d?auto=format&fit=crop&w=300&q=80", count: "Velvet & Lace" },
      { id: "nightwear", name: "Silky Nightwear", img: "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&w=300&q=80", count: "Satin PJ Sets" },
      { id: "shapewear", name: "Tummy Shapewear", img: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=300&q=80", count: "Hourglass Fit" },
      { id: "accessories", name: "Care & Pasties", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80", count: "Nipple Covers" }
    ];

    container.innerHTML = categories.map(cat => `
      <div class="category-circle-item shrink-0 text-center select-none" onclick="App.filterByCategory('${cat.id}')">
        <div class="category-circle-img-wrapper p-1 rounded-full border-2 ${this.currentCategory === cat.id ? 'border-rose-600 ring-2 ring-rose-200' : 'border-stone-200 hover:border-rose-400'} transition-all">
          <img src="${cat.img}" alt="${cat.name}" class="category-circle-img" loading="lazy" />
        </div>
        <span class="text-xs font-semibold text-stone-800 tracking-tight block mt-1">${cat.name}</span>
        <span class="text-[10px] text-stone-600 block -mt-1 font-medium">${cat.count}</span>
      </div>
    `).join("");
  },

  filterByCategory: function (categoryId) {
    this.currentCategory = categoryId;
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

    // 4. Search Filter
    if (this.activeFilters.search) {
      const q = this.activeFilters.search.toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // 5. Sorting
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

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-16 text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 text-2xl">
            <i class="fa-solid fa-sparkles"></i>
          </div>
          <h3 class="text-lg font-bold text-stone-800">No intimates found matching your criteria</h3>
          <p class="text-xs text-stone-500 mt-1 max-w-sm mx-auto">Try clearing selected filters or searching for terms like "seamless", "lace", or "cotton".</p>
          <button onclick="App.resetFilters()" class="mt-4 px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded uppercase tracking-wider hover:bg-rose-600 transition">
            Reset Filters
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = products.map(p => this.generateProductCardHTML(p)).join("");
  },

  generateProductCardHTML: function (p) {
    const isWishlisted = Store.isInWishlist(p.id);
    const discountPercent = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
    const badgeColorClass = p.badgeColor === "red" 
      ? "bg-rose-700 text-white" 
      : p.badgeColor === "amber" 
      ? "bg-amber-600 text-white" 
      : p.badgeColor === "emerald"
      ? "bg-emerald-700 text-white"
      : "bg-stone-900 text-white";

    return `
      <div class="product-card group flex flex-col justify-between" data-product-id="${p.id}">
        <!-- Image & Badges -->
        <div class="product-card-img-wrapper cursor-pointer" onclick="App.openQuickView('${p.id}')">
          <img src="${p.images[0]}" alt="${p.title}" class="product-card-img" loading="lazy" />
          
          <!-- Top Badges -->
          <div class="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            ${p.badge ? `<span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${badgeColorClass}">${p.badge}</span>` : ""}
            ${discountPercent > 0 ? `<span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-rose-700 text-white">-${discountPercent}%</span>` : ""}
          </div>

          <!-- Wishlist Heart Button -->
          <button 
            type="button" 
            onclick="event.stopPropagation(); App.toggleWishlist('${p.id}')"
            class="wishlist-btn absolute top-2.5 right-2.5 z-10 ${isWishlisted ? "active text-white bg-rose-600" : "text-stone-600 hover:text-rose-600"}"
            title="${isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}"
          >
            <i class="${isWishlisted ? "fa-solid" : "fa-regular"} fa-heart text-sm"></i>
          </button>

          <!-- Quick Actions Bar on Hover -->
          <div class="product-action-bar">
            <button 
              type="button" 
              onclick="event.stopPropagation(); App.openQuickView('${p.id}')" 
              class="flex-1 py-2 bg-stone-900/90 backdrop-blur-sm text-white text-xs font-semibold rounded hover:bg-rose-600 transition flex items-center justify-center gap-1.5 shadow-md"
            >
              <i class="fa-regular fa-eye text-xs"></i> Quick View
            </button>
            <button 
              type="button" 
              onclick="event.stopPropagation(); App.quickAddToCart('${p.id}')" 
              class="w-10 h-8 bg-rose-600 text-white rounded hover:bg-rose-700 transition flex items-center justify-center shadow-md"
              title="Quick Add"
            >
              <i class="fa-solid fa-bag-shopping text-xs"></i>
            </button>
          </div>
        </div>

        <!-- Product Details -->
        <div class="p-3.5 flex flex-col flex-1 justify-between">
          <div>
            <!-- Subcategory & Rating -->
            <div class="flex items-center justify-between text-[11px] text-stone-500 mb-1">
              <span class="uppercase tracking-wider font-medium text-rose-700">${p.subCategory}</span>
              <div class="flex items-center gap-1 text-amber-500 font-semibold">
                <i class="fa-solid fa-star text-[10px]"></i>
                <span class="text-stone-700 text-xs">${p.rating}</span>
                <span class="text-stone-400">(${p.reviewsCount})</span>
              </div>
            </div>

            <!-- Title -->
            <h4 class="text-xs sm:text-sm font-semibold text-stone-900 hover:text-rose-600 transition line-clamp-2 cursor-pointer mb-2" onclick="App.openQuickView('${p.id}')">
              ${p.title}
            </h4>

            <!-- Color Swatches preview -->
            ${p.colors && p.colors.length > 0 ? `
              <div class="flex items-center gap-1.5 mb-2.5">
                ${p.colors.slice(0, 4).map(c => `
                  <span class="swatch-circle" style="background-color: ${c.hex};" title="${c.name}"></span>
                `).join("")}
                ${p.colors.length > 4 ? `<span class="text-[10px] text-stone-500">+${p.colors.length - 4}</span>` : ""}
              </div>
            ` : ""}
          </div>

          <!-- Price & Discreet packaging guarantee badge -->
          <div class="pt-2 border-t border-stone-100 flex items-center justify-between mt-auto">
            <div>
              <span class="text-sm sm:text-base font-bold text-stone-900">${Store.formatPKR(p.price)}</span>
              ${p.originalPrice ? `<span class="text-xs text-stone-400 line-through ml-1.5">${Store.formatPKR(p.originalPrice)}</span>` : ""}
            </div>
            <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-800 bg-rose-100/90 px-1.5 py-0.5 rounded border border-rose-300">
              <i class="fa-solid fa-shield-halved text-[9px] text-rose-700"></i> Discreet
            </span>
          </div>
        </div>
      </div>
    `;
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
      sort: "featured",
      search: ""
    };
    const sortSelect = document.getElementById("catalogSortSelect");
    if (sortSelect) sortSelect.value = "featured";
    document.querySelectorAll(".site-search-input").forEach(i => i.value = "");
    this.renderCategoryCircles();
    this.renderProducts();
  },

  // Quick View Modal
  openQuickView: function (productId) {
    const p = Store.getProductById(productId);
    if (!p) return;

    this.activeProductForModal = p;
    let selectedSize = p.sizes ? p.sizes[0] : "Standard";
    let selectedColor = p.colors ? p.colors[0].name : "Standard";
    let selectedImage = (p.colors && p.colors[0].image) || p.images[0];
    let qty = 1;

    const modalContent = document.getElementById("quickViewModalContent");
    if (!modalContent) return;

    modalContent.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 relative">
        <!-- Close Button -->
        <button onclick="App.closeAllModals()" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition z-20">
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>

        <!-- Product Gallery -->
        <div class="space-y-3">
          <div class="aspect-[3/4] rounded-lg overflow-hidden bg-stone-50 border border-stone-200 relative">
            <img id="modalMainImage" src="${selectedImage}" alt="${p.title}" class="w-full h-full object-cover" />
            <span class="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-[11px] font-semibold text-stone-800 px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1.5">
              <i class="fa-solid fa-lock text-rose-600"></i> 100% Discreet Packaging
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
                  class="w-14 h-18 object-cover rounded border border-stone-200 cursor-pointer hover:border-rose-600 transition" 
                />
              `).join("")}
            </div>
          ` : ""}
        </div>

        <!-- Product Information & Options -->
        <div class="flex flex-col justify-between">
          <div>
            <!-- Category and Rating -->
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="text-rose-700 font-bold tracking-wider uppercase">${p.subCategory}</span>
              <div class="flex items-center gap-1 text-amber-500 font-bold">
                <i class="fa-solid fa-star text-xs"></i>
                <span class="text-stone-800">${p.rating}</span>
                <span class="text-stone-400">(${p.reviewsCount} reviews)</span>
              </div>
            </div>

            <!-- Title -->
            <h2 class="text-lg sm:text-xl font-bold text-stone-900 leading-snug mb-2 font-serif-luxury">
              ${p.title}
            </h2>

            <!-- Pricing -->
            <div class="flex items-baseline gap-3 mb-4">
              <span class="text-xl sm:text-2xl font-bold text-stone-900">${Store.formatPKR(p.price)}</span>
              ${p.originalPrice ? `
                <span class="text-sm text-stone-400 line-through">${Store.formatPKR(p.originalPrice)}</span>
                <span class="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs font-bold rounded">
                  Save ${Store.formatPKR(p.originalPrice - p.price)}
                </span>
              ` : ""}
            </div>

            <!-- Stock Status Pill -->
            <div class="mb-4 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              In Stock & Ready for Confidential Dispatch (${p.stockCount} left)
            </div>

            <!-- Color Options -->
            ${p.colors && p.colors.length > 0 ? `
              <div class="mb-4">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-xs font-bold text-stone-800 uppercase tracking-wider">Color:</span>
                  <span id="modalSelectedColorLabel" class="text-xs text-rose-600 font-semibold">${selectedColor}</span>
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
                  <span class="text-xs font-bold text-stone-800 uppercase tracking-wider">Select Size:</span>
                  <button onclick="App.openBraCalculatorModal()" class="text-xs text-rose-600 hover:underline font-semibold flex items-center gap-1">
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

            <!-- Description -->
            <p class="text-xs text-stone-600 leading-relaxed mb-3">
              ${p.description}
            </p>

            <!-- Fabric Info -->
            <div class="text-[11px] text-stone-500 mb-4 bg-stone-50 p-2.5 rounded border border-stone-100">
              <strong>Fabric & Care:</strong> ${p.fabric}. Hand wash cold, line dry in shade.
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-2.5 pt-3 border-t border-stone-100">
            <!-- Quantity & Add to Cart -->
            <div class="flex items-center gap-3">
              <div class="flex items-center border border-stone-300 rounded h-11 bg-white">
                <button type="button" onclick="App.stepModalQty(-1)" class="w-10 h-full text-stone-600 hover:text-stone-900 transition flex items-center justify-center font-bold">
                  &minus;
                </button>
                <input id="modalQtyInput" type="number" value="1" min="1" max="10" readonly class="w-10 text-center text-xs font-bold text-stone-900 focus:outline-none" />
                <button type="button" onclick="App.stepModalQty(1)" class="w-10 h-full text-stone-600 hover:text-stone-900 transition flex items-center justify-center font-bold">
                  &#43;
                </button>
              </div>

              <button 
                type="button" 
                onclick="App.addActiveModalToCart()"
                class="flex-1 h-11 bg-stone-900 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider rounded transition flex items-center justify-center gap-2 shadow-md"
              >
                <i class="fa-solid fa-bag-shopping"></i> Add to Shopping Bag
              </button>
            </div>

            <!-- 1-Click WhatsApp Order Button -->
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
    this.openCartDrawer();
  },

  quickAddToCart: function (productId) {
    const p = Store.getProductById(productId);
    if (!p) return;
    const size = p.sizes ? p.sizes[0] : "Standard";
    const color = p.colors ? p.colors[0].name : "Standard";
    Store.addToCart(p, size, color, 1);
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
        <img src="${p.images[0]}" alt="${p.title}" class="w-16 h-20 object-cover rounded bg-stone-50" />
        <div class="flex-1 min-w-0">
          <h4 class="text-xs font-bold text-stone-900 truncate">${p.title}</h4>
          <span class="text-[11px] text-rose-600 font-semibold">${p.subCategory}</span>
          <div class="text-xs font-bold text-stone-800 mt-1">${Store.formatPKR(p.price)}</div>
        </div>
        <div class="flex flex-col gap-1.5 shrink-0">
          <button 
            onclick="App.quickAddToCart('${p.id}'); Store.toggleWishlist('${p.id}');" 
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

  // Cart Drawer UI & Calculations
  updateCartUI: function () {
    const cart = Store.getCart();
    const totals = Store.getCartTotals();
    const cartCount = Store.getCartCount();

    // Update floating badges
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

    // Free shipping thermometer
    if (shippingProgressFill && shippingThresholdText) {
      shippingProgressFill.style.width = `${totals.freeShippingProgress}%`;
      if (totals.isFreeShipping) {
        shippingThresholdText.innerHTML = `
          <span class="text-emerald-700 font-bold">
            <i class="fa-solid fa-circle-check"></i> Congratulations! You qualified for Free Discreet Shipping!
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

    if (!itemsContainer) return;

    if (cart.length === 0) {
      itemsContainer.innerHTML = `
        <div class="py-16 text-center text-stone-400">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 text-2xl">
            <i class="fa-solid fa-bag-shopping"></i>
          </div>
          <h4 class="text-sm font-bold text-stone-800">Your shopping bag is empty</h4>
          <p class="text-xs text-stone-500 mt-1 max-w-xs mx-auto">Discover ultra-comfortable bras, seamless knickers, and bridal trousseau.</p>
          <button onclick="App.closeAllDrawers(); App.filterByCategory('bras');" class="mt-4 px-5 py-2.5 bg-stone-900 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-wider rounded transition">
            Shop Bras Collection
          </button>
        </div>
      `;
      return;
    }

    itemsContainer.innerHTML = cart.map(item => `
      <div class="flex gap-3 py-3 border-b border-stone-100">
        <img src="${item.image}" alt="${item.title}" class="w-16 h-20 object-cover rounded bg-stone-50 shrink-0" />
        <div class="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between gap-2">
              <h4 class="text-xs font-semibold text-stone-900 line-clamp-1">${item.title}</h4>
              <button onclick="Store.removeFromCart('${item.cartItemId}')" class="text-stone-400 hover:text-rose-600 text-xs shrink-0 p-1" title="Remove">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
            <div class="flex items-center gap-2 mt-0.5 text-[11px] text-stone-500">
              <span class="bg-stone-100 px-1.5 py-0.5 rounded font-medium text-stone-700">Size: ${item.size}</span>
              <span class="bg-stone-100 px-1.5 py-0.5 rounded font-medium text-stone-700">Color: ${item.color}</span>
            </div>
          </div>

          <div class="flex items-center justify-between mt-2">
            <!-- Stepper -->
            <div class="flex items-center border border-stone-200 rounded h-7 bg-white">
              <button onclick="Store.updateCartQuantity('${item.cartItemId}', ${item.quantity - 1})" class="w-6 h-full flex items-center justify-center text-xs text-stone-600 hover:bg-stone-100">
                &minus;
              </button>
              <span class="w-7 text-center text-xs font-bold text-stone-800">${item.quantity}</span>
              <button onclick="Store.updateCartQuantity('${item.cartItemId}', ${item.quantity + 1})" class="w-6 h-full flex items-center justify-center text-xs text-stone-600 hover:bg-stone-100">
                &#43;
              </button>
            </div>

            <!-- Item Price -->
            <span class="text-xs font-bold text-stone-900">${Store.formatPKR(item.price * item.quantity)}</span>
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

  // Bra Size Calculator
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
    // 1. Calculate Band Size
    let calculatedBand = Math.round(underbust);
    if (calculatedBand % 2 === 0) {
      calculatedBand += 4;
    } else {
      calculatedBand += 5;
    }

    // 2. Calculate Cup Size (Bust - Band Difference)
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
      <div class="p-4 bg-rose-50 border border-rose-200 rounded-lg text-center">
        <span class="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-1">Your Perfect Recommended Fit</span>
        <div class="text-3xl font-extrabold text-stone-900 font-serif-luxury">${recommendedSize}</div>
        <p class="text-xs text-stone-600 mt-1">Based on underbust ${underbust}" and bust ${bust}".</p>

        <div class="mt-3 pt-3 border-t border-rose-200/60 flex items-center justify-around text-xs text-stone-600">
          <div>Sister Size (Tighter): <strong class="text-stone-900">${sisterSmaller}</strong></div>
          <div>Sister Size (Looser): <strong class="text-stone-900">${sisterLarger}</strong></div>
        </div>

        <button 
          type="button" 
          onclick="App.filterByCalculatedSize('${calculatedBand}', '${calculatedCup}')"
          class="mt-4 w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded transition shadow-sm"
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
    this.showToast(`Showing bras available in size ${band}${cup}!`);
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
        <div class="bg-stone-50 p-4 rounded-lg border border-stone-200 mb-4 text-xs space-y-2">
          <div class="font-bold text-stone-900 text-sm mb-2 border-b border-stone-200 pb-1.5 flex justify-between">
            <span>Order Summary (${Store.getCartCount()} Items)</span>
            <span class="text-rose-600">Discreet Packing</span>
          </div>
          ${cart.map(i => `
            <div class="flex justify-between text-stone-600">
              <span class="truncate max-w-[200px]">${i.quantity}x ${i.title} (${i.size})</span>
              <span class="font-semibold text-stone-900">${Store.formatPKR(i.price * i.quantity)}</span>
            </div>
          `).join("")}
          <div class="border-t border-stone-200 pt-2 space-y-1">
            <div class="flex justify-between text-stone-600">
              <span>Subtotal:</span>
              <span class="font-semibold text-stone-900">${Store.formatPKR(totals.subtotal)}</span>
            </div>
            ${totals.discount > 0 ? `
              <div class="flex justify-between text-rose-600 font-semibold">
                <span>Discount (${totals.coupon.code}):</span>
                <span>-${Store.formatPKR(totals.discount)}</span>
              </div>
            ` : ""}
            <div class="flex justify-between text-stone-600">
              <span>Shipping (TCS Express):</span>
              <span class="font-semibold text-stone-900">${totals.shipping === 0 ? "FREE" : Store.formatPKR(totals.shipping)}</span>
            </div>
            <div class="flex justify-between text-sm font-bold text-stone-900 pt-1 border-t border-stone-200">
              <span>Total Payable:</span>
              <span class="text-rose-600">${Store.formatPKR(totals.total)}</span>
            </div>
          </div>
        </div>
      `;
    }

    if (modal) modal.classList.add("open");
  },

  handleCheckoutSubmission: function (form) {
    const formData = new FormData(form);
    const totals = Store.getCartTotals();
    const cart = Store.getCart();

    const orderData = {
      customer: {
        fullName: formData.get("fullName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        address: formData.get("address"),
        city: formData.get("city"),
        notes: formData.get("notes") || ""
      },
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
        <p class="text-xs text-stone-500 mt-1">We have received your order and our logistics team has queued it for confidential packaging.</p>

        <!-- Order Details Card -->
        <div class="my-5 p-4 bg-stone-50 border border-stone-200 rounded-lg text-left text-xs space-y-2">
          <div class="flex justify-between items-center border-b border-stone-200 pb-2">
            <div>
              <span class="text-stone-400 block text-[10px] uppercase">Order Reference</span>
              <strong class="text-sm font-bold text-rose-600">${order.orderId}</strong>
            </div>
            <div>
              <span class="text-stone-400 block text-[10px] uppercase">Tracking Number</span>
              <strong class="text-sm font-bold text-stone-800">${order.trackingCode}</strong>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2 pt-1 text-stone-700">
            <div><strong>Recipient:</strong> ${order.customer.fullName}</div>
            <div><strong>City:</strong> ${order.customer.city}</div>
            <div><strong>Contact:</strong> ${order.customer.phone}</div>
            <div><strong>Payment:</strong> ${order.paymentMethod}</div>
          </div>
          <div class="p-2 bg-emerald-50 text-emerald-800 rounded text-[11px] font-medium border border-emerald-200 flex items-center gap-2">
            <i class="fa-solid fa-shield-halved text-emerald-600"></i>
            100% Confidential Delivery Guarantee: The parcel exterior has NO intimate wear labels.
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row gap-2.5">
          <button 
            type="button" 
            onclick="App.closeAllModals(); App.openTrackingModalWithCode('${order.orderId}')" 
            class="flex-1 py-3 bg-stone-900 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider rounded transition flex items-center justify-center gap-2"
          >
            <i class="fa-solid fa-truck-fast"></i> Track Live Courier
          </button>
          <button 
            type="button" 
            onclick="App.closeAllModals()" 
            class="px-5 py-3 border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs uppercase rounded transition"
          >
            Continue Shopping
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
      <div class="p-4 bg-white border border-stone-200 rounded-lg space-y-4 text-xs">
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

        <!-- Timeline steps -->
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

  // WhatsApp Order Assistant
  orderViaWhatsApp: function (product) {
    if (!product) return;
    const phone = "923001234567"; // Brand helpline WhatsApp
    const msg = encodeURIComponent(
      `Assalam-o-Alaikum Miss Collection!

I want to order:
• Product: ${product.title}
• Price: ${Store.formatPKR(product.price)}
• Code: ${product.id}

Please confirm delivery and discreet packaging details.`
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
      toast.className = "fixed bottom-5 left-1/2 -translate-x-1/2 bg-stone-900/90 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg z-50 transition-all duration-300 opacity-0 pointer-events-none";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.remove("opacity-0", "pointer-events-none");
    toast.classList.add("opacity-100");

    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      toast.classList.add("opacity-0", "pointer-events-none");
      toast.classList.remove("opacity-100");
    }, 2500);
  }
};

// Export to global scope
if (typeof window !== "undefined") {
  window.App = App;
}
