/**
 * Miss Collection - Store & State Management
 * Persistent localStorage state for Cart, Wishlist, Orders, Coupons, Reviews, and Products
 */

const Store = {
  // Storage keys
  KEYS: {
    PRODUCTS: "miss_collection_products_v2",
    CART: "miss_collection_cart_v2",
    WISHLIST: "miss_collection_wishlist_v2",
    ORDERS: "miss_collection_orders_v2",
    COUPON: "miss_collection_active_coupon_v2",
    REVIEWS: "miss_collection_reviews_v2",
    NAV_ITEMS: "miss_collection_nav_items_v2",
    BANNERS: "miss_collection_banners_v2",
    LOOKBOOK: "miss_collection_lookbook_v2"
  },

  // Available Promo Codes
  COUPONS: {
    "MISS10": { code: "MISS10", type: "percent", value: 10, description: "10% Off Sitewide" },
    "WELCOME500": { code: "WELCOME500", type: "fixed", value: 500, minSpend: 3000, description: "Rs. 500 Off (Min Spend Rs. 3,000)" },
    "FREESHIP": { code: "FREESHIP", type: "shipping", value: 100, description: "Free Discreet Shipping" }
  },

  // Delivery settings
  SHIPPING_FEE: 250,
  FREE_SHIPPING_THRESHOLD: 2500,

  // WhatsApp Order Booking Contact
  WHATSAPP_NUMBER: "923266131394",
  WHATSAPP_DISPLAY: "+92 326 6131394",

  // Initialize or fetch products
  getProducts: function() {
    try {
      const stored = localStorage.getItem(this.KEYS.PRODUCTS);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("Error loading stored products", e);
    }
    // Default fallback - only runs if never initialized in localStorage
    if (typeof DEFAULT_PRODUCTS !== "undefined") {
      this.saveProducts(DEFAULT_PRODUCTS);
      return DEFAULT_PRODUCTS;
    }
    return [];
  },

  clearAllProducts: function() {
    this.saveProducts([]);
  },

  resetDefaultProducts: function() {
    if (typeof DEFAULT_PRODUCTS !== "undefined") {
      this.saveProducts(DEFAULT_PRODUCTS);
      return DEFAULT_PRODUCTS;
    }
    return [];
  },

  saveProducts: function(products) {
    localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent("products_updated", { detail: products }));
  },

  getProductById: function(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id) || null;
  },

  getAllCategories: function() {
    const products = this.getProducts();
    const catMap = new Map();

    const KNOWN_INFO = {
      "bras": { name: "Luxury Bras", subtitle: "Seamless & Lace Lift", defaultImg: "https://images.unsplash.com/photo-1594616091971-bf856a77b57d?auto=format&fit=crop&w=400&q=80" },
      "panties": { name: "Comfort Panties", subtitle: "No-Show & Cotton", defaultImg: "https://images.unsplash.com/photo-1610241519159-8a62634bac9a?auto=format&fit=crop&w=400&q=80" },
      "bridal": { name: "Bridal Trousseau", subtitle: "Royal Velvet & Chantilly", defaultImg: "https://images.unsplash.com/photo-1568663521381-33b7c467fda0?auto=format&fit=crop&w=400&q=80" },
      "nightwear": { name: "Silky Sleepwear", subtitle: "Satin & Silk PJ Sets", defaultImg: "https://images.unsplash.com/photo-1574539602047-548bf9557352?auto=format&fit=crop&w=400&q=80" },
      "shapewear": { name: "Hourglass Shapewear", subtitle: "Firm Tummy Sculpt", defaultImg: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=400&q=80" }
    };

    products.forEach(p => {
      const rawCat = (p.category || "general").toLowerCase().trim();
      const info = KNOWN_INFO[rawCat] || {
        name: rawCat.split(/[-_ ]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        subtitle: "Couture Silhouette",
        defaultImg: (p.images && p.images[0]) ? p.images[0] : "https://images.unsplash.com/photo-1594616091971-bf856a77b57d?auto=format&fit=crop&w=400&q=80"
      };

      if (!catMap.has(rawCat)) {
        catMap.set(rawCat, {
          id: rawCat,
          name: info.name,
          subtitle: info.subtitle,
          img: (p.images && p.images[0]) ? p.images[0] : info.defaultImg,
          count: 1
        });
      } else {
        const entry = catMap.get(rawCat);
        entry.count += 1;
        if ((!entry.img || entry.img.includes("unsplash.com")) && p.images && p.images[0]) {
          entry.img = p.images[0];
        }
      }
    });

    return Array.from(catMap.values());
  },

  // Cart Management
  getCart: function() {
    try {
      const stored = localStorage.getItem(this.KEYS.CART);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  saveCart: function(cart) {
    localStorage.setItem(this.KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cart_updated", { detail: cart }));
  },

  addToCart: function(product, selectedSize, selectedColor, quantity = 1) {
    const cart = this.getCart();
    const size = selectedSize || (product.sizes ? product.sizes[0] : "Standard");
    const color = selectedColor || (product.colors ? product.colors[0].name : "Standard");
    const cartItemId = `${product.id}-${size}-${color}`;

    const existingIndex = cart.findIndex(item => item.cartItemId === cartItemId);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        cartItemId: cartItemId,
        productId: product.id,
        title: product.title,
        category: product.category,
        subCategory: product.subCategory,
        price: product.price,
        originalPrice: product.originalPrice,
        size: size,
        color: color,
        image: (product.colors && product.colors.find(c => c.name === color))?.image || product.images[0],
        quantity: quantity
      });
    }

    this.saveCart(cart);
    return cart;
  },

  updateCartQuantity: function(cartItemId, newQty) {
    let cart = this.getCart();
    if (newQty <= 0) {
      cart = cart.filter(item => item.cartItemId !== cartItemId);
    } else {
      const item = cart.find(i => i.cartItemId === cartItemId);
      if (item) item.quantity = newQty;
    }
    this.saveCart(cart);
    return cart;
  },

  removeFromCart: function(cartItemId) {
    const cart = this.getCart().filter(item => item.cartItemId !== cartItemId);
    this.saveCart(cart);
    return cart;
  },

  clearCart: function() {
    this.saveCart([]);
    this.removeCoupon();
  },

  getCartCount: function() {
    return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
  },

  getCartSubtotal: function() {
    return this.getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  // Cross-Sells for Cart Drawer
  getCartCrossSells: function() {
    const cart = this.getCart();
    const cartProductIds = cart.map(i => i.productId);
    const allProducts = this.getProducts();

    // Suggested accessory add-ons
    const defaultAccessories = ["mc-acc-01", "mc-acc-02", "mc-acc-03"];
    let recommendations = [];

    cart.forEach(item => {
      const prod = allProducts.find(p => p.id === item.productId);
      if (prod && prod.crossSells) {
        recommendations.push(...prod.crossSells);
      }
    });

    recommendations.push(...defaultAccessories);
    // Remove duplicates and items already in cart
    const uniqueIds = [...new Set(recommendations)].filter(id => !cartProductIds.includes(id));
    return uniqueIds.slice(0, 3).map(id => allProducts.find(p => p.id === id)).filter(Boolean);
  },

  // Coupon Engine
  getActiveCoupon: function() {
    try {
      const stored = localStorage.getItem(this.KEYS.COUPON);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  applyCoupon: function(couponCode) {
    const cleanCode = (couponCode || "").trim().toUpperCase();
    const coupon = this.COUPONS[cleanCode];
    if (!coupon) {
      return { success: false, message: "Invalid promo code" };
    }
    const subtotal = this.getCartSubtotal();
    if (coupon.minSpend && subtotal < coupon.minSpend) {
      return { 
        success: false, 
        message: `Min spend of Rs. ${coupon.minSpend.toLocaleString()} required for this code` 
      };
    }
    localStorage.setItem(this.KEYS.COUPON, JSON.stringify(coupon));
    window.dispatchEvent(new CustomEvent("coupon_applied", { detail: coupon }));
    return { success: true, message: `Promo code ${coupon.code} applied!`, coupon };
  },

  removeCoupon: function() {
    localStorage.removeItem(this.KEYS.COUPON);
    window.dispatchEvent(new CustomEvent("coupon_removed"));
  },

  getCartTotals: function() {
    const subtotal = this.getCartSubtotal();
    let shipping = subtotal >= this.FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : this.SHIPPING_FEE;
    const coupon = this.getActiveCoupon();
    let discount = 0;

    if (coupon && subtotal > 0) {
      if (coupon.type === "percent") {
        discount = Math.round((subtotal * coupon.value) / 100);
      } else if (coupon.type === "fixed") {
        discount = Math.min(coupon.value, subtotal);
      } else if (coupon.type === "shipping") {
        shipping = 0;
      }
    }

    const total = Math.max(0, subtotal - discount + shipping);
    const amountForFreeShipping = Math.max(0, this.FREE_SHIPPING_THRESHOLD - subtotal);
    const freeShippingProgress = Math.min(100, Math.round((subtotal / this.FREE_SHIPPING_THRESHOLD) * 100));

    return {
      subtotal,
      discount,
      shipping,
      total,
      coupon,
      amountForFreeShipping,
      freeShippingProgress,
      isFreeShipping: shipping === 0 && subtotal > 0
    };
  },

  // Wishlist Management
  getWishlist: function() {
    try {
      const stored = localStorage.getItem(this.KEYS.WISHLIST);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  isInWishlist: function(productId) {
    return this.getWishlist().includes(productId);
  },

  toggleWishlist: function(productId) {
    let wishlist = this.getWishlist();
    let added = false;
    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter(id => id !== productId);
      added = false;
    } else {
      wishlist.push(productId);
      added = true;
    }
    localStorage.setItem(this.KEYS.WISHLIST, JSON.stringify(wishlist));
    window.dispatchEvent(new CustomEvent("wishlist_updated", { detail: wishlist }));
    return { wishlist, added };
  },

  // Orders Management
  getOrders: function() {
    try {
      const stored = localStorage.getItem(this.KEYS.ORDERS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Error reading orders", e);
    }
    // Pre-populate realistic seed orders if none exist
    const initialOrders = [
      {
        orderId: "MC-78921",
        date: "2026-10-21 14:32",
        customer: {
          fullName: "Ayesha Malik",
          phone: "0300-4821945",
          email: "ayesha.m@gmail.com",
          address: "House 42, Street 8, Phase 5, DHA",
          city: "Lahore",
          notes: "Please pack in discreet brown box, call before delivery."
        },
        items: [
          { title: "Feather-Light Seamless Wireless Comfort Bra", size: "34B", color: "Blush Pink", price: 1850, quantity: 2 },
          { title: "Laser-Cut Ultra-Seamless No-Show Panties (Pack of 3)", size: "M", color: "Nude Set", price: 1450, quantity: 1 }
        ],
        subtotal: 5150,
        discount: 515,
        shipping: 0,
        total: 4635,
        paymentMethod: "Cash on Delivery (COD)",
        status: "Out for Delivery",
        courier: "TCS Express",
        trackingCode: "TCS-92847192",
        discreetPackaging: true
      },
      {
        orderId: "MC-78918",
        date: "2026-10-20 18:15",
        customer: {
          fullName: "Fatima Noor",
          phone: "0321-7719204",
          email: "fatima.n92@outlook.com",
          address: "Apartment 4B, Clifton Block 2",
          city: "Karachi",
          notes: "Confidential packaging essential."
        },
        items: [
          { title: "Royal Crimson Velvet & Lace 4-Piece Bridal Lingerie Set", size: "34C", color: "Royal Crimson", price: 5450, quantity: 1 }
        ],
        subtotal: 5450,
        discount: 0,
        shipping: 0,
        total: 5450,
        paymentMethod: "JazzCash / EasyPaisa",
        status: "Delivered",
        courier: "Leopards Courier",
        trackingCode: "LCS-44182903",
        discreetPackaging: true
      }
    ];
    this.saveOrders(initialOrders);
    return initialOrders;
  },

  saveOrders: function(orders) {
    localStorage.setItem(this.KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent("orders_updated", { detail: orders }));
  },

  addOrder: function(orderData) {
    const orders = this.getOrders();
    const orderId = "MC-" + Math.floor(10000 + Math.random() * 90000);
    const trackingCode = "TCS-" + Math.floor(10000000 + Math.random() * 90000000);

    const newOrder = {
      orderId: orderId,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      ...orderData,
      status: "Order Confirmed",
      courier: "TCS Express",
      trackingCode: trackingCode,
      discreetPackaging: true
    };

    orders.unshift(newOrder);
    this.saveOrders(orders);
    this.clearCart();
    return newOrder;
  },

  updateOrderStatus: function(orderId, newStatus) {
    const orders = this.getOrders();
    const order = orders.find(o => o.orderId === orderId);
    if (order) {
      order.status = newStatus;
      this.saveOrders(orders);
      return true;
    }
    return false;
  },

  // Customer Reviews System
  getReviews: function() {
    try {
      const stored = localStorage.getItem(this.KEYS.REVIEWS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Error reading reviews", e);
    }
    const seedReviews = [
      {
        id: "rev-1",
        name: "Dr. Sadia Tariq",
        city: "Lahore",
        rating: 5,
        date: "2 days ago",
        title: "Finally a seamless bra that actually stays invisible!",
        comment: "I ordered the Seamless Wireless Comfort Bra in Blush Pink. The fabric is so soft that you forget you are wearing a bra. Delivery was super fast in Lahore and the discreet brown packaging gave me 100% peace of mind.",
        productTitle: "Feather-Light Seamless Wireless Comfort Bra",
        verified: true
      },
      {
        id: "rev-2",
        name: "Mahnoor Rizwan",
        city: "Karachi",
        rating: 5,
        date: "5 days ago",
        title: "Bridal set quality exceeded international brands",
        comment: "The Royal Crimson Velvet Bridal set is breathtaking! The embroidery is soft and does not scratch. Also used their bra size calculator and got the exact sister size 34C which fits like a glove. Highly recommended!",
        productTitle: "Royal Crimson Velvet & Lace 4-Piece Bridal Lingerie Set",
        verified: true
      },
      {
        id: "rev-3",
        name: "Zainab Kashif",
        city: "Islamabad",
        rating: 5,
        date: "1 week ago",
        title: "Tummy Tucker shaper is magical under lawn kurtis",
        comment: "The 360° firm control shaper smoothed out all love handles without rolling down thanks to the steel bones. Paid via Cash on Delivery and courier arrived in 2 days in Islamabad.",
        productTitle: "360° Firm Control High-Waist Tummy Tucker Shaper",
        verified: true
      },
      {
        id: "rev-4",
        name: "Hira Usman",
        city: "Faisalabad",
        rating: 5,
        date: "2 weeks ago",
        title: "Pack of 3 seamless panties is a lifesaver",
        comment: "No visible panty line under tight pants or white shalwars! Fabric is stretchable and breathable. Very impressed by the unbranded box delivery.",
        productTitle: "Laser-Cut Ultra-Seamless No-Show Panties",
        verified: true
      }
    ];
    this.saveReviews(seedReviews);
    return seedReviews;
  },

  saveReviews: function(reviews) {
    localStorage.setItem(this.KEYS.REVIEWS, JSON.stringify(reviews));
    window.dispatchEvent(new CustomEvent("reviews_updated", { detail: reviews }));
  },

  addReview: function(reviewData) {
    const reviews = this.getReviews();
    const newRev = {
      id: "rev-" + Date.now(),
      date: "Just now",
      verified: true,
      ...reviewData
    };
    reviews.unshift(newRev);
    this.saveReviews(reviews);
    return newRev;
  },

  // Default Navigation Items (Fallback Seed)
  DEFAULT_NAV_ITEMS: [
    { id: "nav-all", title: "All Silhouettes", category: "all", targetType: "category", visible: true, order: 1, isMega: false },
    { id: "nav-bras", title: "Bras & Bralettes", category: "bras", targetType: "category", visible: true, order: 2, isMega: true },
    { id: "nav-panties", title: "Panties & Briefs", category: "panties", targetType: "category", visible: true, order: 3, isMega: true },
    { id: "nav-bridal", title: "Bridal Sets", category: "bridal", targetType: "category", visible: true, order: 4, isMega: true, highlightClass: "text-[#D4AF37]" },
    { id: "nav-nightwear", title: "Silky Sleepwear", category: "nightwear", targetType: "category", visible: true, order: 5, isMega: true },
    { id: "nav-shapewear", title: "Shapewear", category: "shapewear", targetType: "category", visible: true, order: 6, isMega: true },
    { id: "nav-calculator", title: "Fit Calculator", category: "calculator", targetType: "modal", action: "openBraCalculatorModal", icon: "fa-ruler-combined", visible: true, order: 7, highlightClass: "text-[#F3E5AB] font-semibold" },
    { id: "nav-tracking", title: "Track Order", category: "tracking", targetType: "modal", action: "openOrderTrackingModal", icon: "fa-truck-fast", visible: true, order: 8, highlightClass: "text-stone-400 font-normal" }
  ],

  getNavItems: function() {
    try {
      const stored = localStorage.getItem(this.KEYS.NAV_ITEMS);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("Error reading stored nav items", e);
    }
    this.saveNavItems(this.DEFAULT_NAV_ITEMS);
    return this.DEFAULT_NAV_ITEMS;
  },

  saveNavItems: function(items) {
    localStorage.setItem(this.KEYS.NAV_ITEMS, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("nav_items_updated", { detail: items }));
  },

  addNavItem: function(itemData) {
    const items = this.getNavItems();
    const newItem = {
      id: "nav-" + Date.now(),
      title: itemData.title || "New Menu Item",
      category: itemData.category || "all",
      targetType: itemData.targetType || "category",
      action: itemData.action || "",
      icon: itemData.icon || "",
      visible: itemData.visible !== false,
      order: items.length + 1,
      isMega: itemData.isMega === true,
      highlightClass: itemData.highlightClass || ""
    };
    items.push(newItem);
    this.saveNavItems(items);
    return newItem;
  },

  updateNavItem: function(id, data) {
    const items = this.getNavItems();
    const index = items.findIndex(item => item.id === id);
    if (index > -1) {
      items[index] = { ...items[index], ...data };
      this.saveNavItems(items);
      return items[index];
    }
    return null;
  },

  deleteNavItem: function(id) {
    let items = this.getNavItems();
    items = items.filter(item => item.id !== id);
    this.saveNavItems(items);
    return items;
  },

  toggleNavVisibility: function(id) {
    const items = this.getNavItems();
    const item = items.find(i => i.id === id);
    if (item) {
      item.visible = !item.visible;
      this.saveNavItems(items);
      return item.visible;
    }
    return null;
  },

  // Default Hero Banners (Fallback Seed)
  // Default Hero Banners (High-Fashion Haute Couture Seed)
  DEFAULT_BANNERS: [
    {
      id: "banner-1",
      title: "The Art of Invisible Support",
      subtitle: "Cloud-soft wireless micro-modal intimates engineered for flawless invisible contours under luxury lawn suits and kurtis.",
      badge: "HAUTE EDIT • ZERO-WIRE COMFORT",
      badgeColor: "amber",
      imageUrl: "https://images.unsplash.com/photo-1594616091971-bf856a77b57d?auto=format&fit=crop&w=1800&q=85",
      btnText: "Explore Seamless Bras",
      btnCategory: "bras",
      secondaryBtnText: "Fit Calculator",
      secondaryBtnAction: "openBraCalculatorModal",
      active: true,
      order: 1
    },
    {
      id: "banner-2",
      title: "Imperial Velvet & Chantilly Lace",
      subtitle: "Handcrafted luxury bridal trousseau ensembles, embroidered corsets, and silk nightwear shipped in confidential keepsake boxes.",
      badge: "BRIDAL TROUSSEAU 2026",
      badgeColor: "rose",
      imageUrl: "https://images.unsplash.com/photo-1568663521381-33b7c467fda0?auto=format&fit=crop&w=1800&q=85",
      btnText: "Discover Bridal Edit",
      btnCategory: "bridal",
      secondaryBtnText: "WhatsApp VIP Concierge",
      secondaryBtnAction: "openWhatsAppConcierge",
      active: true,
      order: 2
    },
    {
      id: "banner-3",
      title: "Mulberry Silk & Satin Nightwear",
      subtitle: "Sensual silk slip dresses, loungewear sets, and robes crafted for quiet nighttime indulgence and breathable grace.",
      badge: "PURE SILK LOUNGEWEAR",
      badgeColor: "amber",
      imageUrl: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1800&q=85",
      btnText: "Shop Sleepwear Sets",
      btnCategory: "nightwear",
      secondaryBtnText: "Fit Consultation",
      secondaryBtnAction: "openBraCalculatorModal",
      active: true,
      order: 3
    }
  ],

  getBanners: function() {
    try {
      const stored = localStorage.getItem(this.KEYS.BANNERS);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("Error reading stored banners", e);
    }
    this.saveBanners(this.DEFAULT_BANNERS);
    return this.DEFAULT_BANNERS;
  },

  saveBanners: function(banners) {
    localStorage.setItem(this.KEYS.BANNERS, JSON.stringify(banners));
    window.dispatchEvent(new CustomEvent("banners_updated", { detail: banners }));
  },

  addBanner: function(bannerData) {
    const banners = this.getBanners();
    const newBanner = {
      id: "banner-" + Date.now(),
      title: bannerData.title || "Seasonal Collection",
      subtitle: bannerData.subtitle || "",
      badge: bannerData.badge || "Featured",
      badgeColor: bannerData.badgeColor || "rose",
      imageUrl: bannerData.imageUrl || "https://images.unsplash.com/photo-1594616091971-bf856a77b57d?auto=format&fit=crop&w=1800&q=85",
      btnText: bannerData.btnText || "Shop Now →",
      btnCategory: bannerData.btnCategory || "all",
      secondaryBtnText: bannerData.secondaryBtnText || "",
      secondaryBtnAction: bannerData.secondaryBtnAction || "",
      active: bannerData.active !== false,
      order: banners.length + 1
    };
    banners.push(newBanner);
    this.saveBanners(banners);
    return newBanner;
  },

  updateBanner: function(id, data) {
    const banners = this.getBanners();
    const index = banners.findIndex(b => b.id === id);
    if (index > -1) {
      banners[index] = { ...banners[index], ...data };
      this.saveBanners(banners);
      return banners[index];
    }
    return null;
  },

  deleteBanner: function(id) {
    let banners = this.getBanners();
    banners = banners.filter(b => b.id !== id);
    this.saveBanners(banners);
    return banners;
  },

  toggleBannerStatus: function(id) {
    const banners = this.getBanners();
    const banner = banners.find(b => b.id === id);
    if (banner) {
      banner.active = !banner.active;
      this.saveBanners(banners);
      return banner.active;
    }
    return null;
  },

  // ==========================================
  // CURATED SEASONAL LOOKBOOK (The Lookbook Edit)
  // ==========================================
  DEFAULT_LOOKBOOK: [
    {
      id: "lookbook-1",
      tagline: "Signature Silhouette",
      title: "The Basics: Zero-Wire Comfort",
      description: "Buttery micro-modal fabric engineered for cloud-like invisible support under Pakistani lawn suits & kurtis.",
      buttonText: "Shop Seamless Bras →",
      category: "bras",
      imageUrl: "https://images.unsplash.com/photo-1594616091971-bf856a77b57d?auto=format&fit=crop&w=1200&q=85",
      type: "large"
    },
    {
      id: "lookbook-2",
      tagline: "Haute Trousseau",
      title: "Luxury Bridal Edit",
      description: "Exquisite Chantilly lace & silk corsetry for wedding trousseau.",
      buttonText: "Explore Trousseau →",
      category: "bridal",
      imageUrl: "https://images.unsplash.com/photo-1568663521381-33b7c467fda0?auto=format&fit=crop&w=800&q=85",
      type: "small-top"
    },
    {
      id: "lookbook-3",
      tagline: "Special Price",
      title: "Satin Nightwear & Sets",
      description: "Luxe satin slips and delicate lace chemises.",
      buttonText: "Shop Loungewear →",
      category: "nightwear",
      imageUrl: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=800&q=85",
      type: "small-bottom"
    }
  ],

  getLookbook: function() {
    try {
      const stored = localStorage.getItem(this.KEYS.LOOKBOOK);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Error reading stored lookbook", e);
    }
    this.saveLookbook(this.DEFAULT_LOOKBOOK);
    return this.DEFAULT_LOOKBOOK;
  },

  saveLookbook: function(items) {
    try {
      localStorage.setItem(this.KEYS.LOOKBOOK, JSON.stringify(items));
      if (typeof window !== "undefined" && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent("lookbook_updated", { detail: items }));
      }
      return true;
    } catch (e) {
      console.error("Error saving lookbook", e);
      return false;
    }
  },

  updateLookbookTile: function(id, data) {
    const list = this.getLookbook();
    const index = list.findIndex(item => item.id === id);
    if (index > -1) {
      list[index] = { ...list[index], ...data };
      this.saveLookbook(list);
      return list[index];
    }
    return null;
  },

  resetLookbookDefaults: function() {
    this.saveLookbook(this.DEFAULT_LOOKBOOK);
    return this.DEFAULT_LOOKBOOK;
  },

  // Price Formatter Helper
  formatPKR: function(amount) {
    return "Rs. " + Number(amount || 0).toLocaleString("en-PK");
  },

  // WhatsApp Order Message Generator
  buildWhatsAppOrderMessage: function(customerDetails = null, orderRef = null) {
    const cart = this.getCart();
    if (cart.length === 0) return "";
    const totals = this.getCartTotals();
    const ref = orderRef || ("MC-" + Math.floor(10000 + Math.random() * 90000));

    let text = "🌸 *MISS COLLECTION - NEW ORDER BOOKING* 🌸\n";
    text += "──────────────────────────\n";
    text += `*Order Reference:* #${ref}\n`;
    text += "Assalam-o-Alaikum! Mujhe Miss Collection se yeh order book/purchase karna hai:\n\n";
    text += "📦 *Ordered Product(s):*\n";

    cart.forEach((item, index) => {
      text += `${index + 1}. *${item.title}*\n`;
      text += `   • Size: ${item.size} | Color: ${item.color}\n`;
      text += `   • Qty: ${item.quantity} × ${this.formatPKR(item.price)} = ${this.formatPKR(item.price * item.quantity)}\n\n`;
    });

    text += "──────────────────────────\n";
    text += "💰 *Bill Summary:*\n";
    text += `• Subtotal: ${this.formatPKR(totals.subtotal)}\n`;
    if (totals.discount > 0 && totals.coupon) {
      text += `• Promo Discount (${totals.coupon.code}): -${this.formatPKR(totals.discount)}\n`;
    }
    text += `• Confidential Delivery: ${totals.shipping === 0 ? "FREE" : this.formatPKR(totals.shipping)}\n`;
    text += `• *Grand Total: ${this.formatPKR(totals.total)}*\n`;
    text += "• Payment: Cash on Delivery (COD)\n";
    text += "──────────────────────────\n";

    if (customerDetails && (customerDetails.fullName || customerDetails.phone || customerDetails.city || customerDetails.address)) {
      text += "📍 *Customer Delivery Details:*\n";
      text += `• Name: ${customerDetails.fullName || "N/A"}\n`;
      text += `• Phone: ${customerDetails.phone || "N/A"}\n`;
      text += `• City: ${customerDetails.city || "N/A"}\n`;
      text += `• Address: ${customerDetails.address || "N/A"}\n`;
      if (customerDetails.notes) {
        text += `• Instructions: ${customerDetails.notes}\n`;
      }
    } else {
      text += "📍 *Customer Delivery Details (COD Courier):*\n";
      text += "• Full Name: \n";
      text += "• Phone Number: \n";
      text += "• Delivery City: \n";
      text += "• Complete Address: \n";
    }

    text += "──────────────────────────\n";
    text += "🔒 *Discreet Packing:* 100% confidential unbranded box parcel.\n";
    text += "Kindly mera order confirm karein aur TCS tracking share karein. Shukriya! ✨";

    return text;
  },

  getWhatsAppOrderUrl: function(customerDetails = null, orderRef = null) {
    const message = this.buildWhatsAppOrderMessage(customerDetails, orderRef);
    return `https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }
};

// Auto-initialize store
if (typeof window !== "undefined") {
  window.Store = Store;
}
