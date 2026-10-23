/**
 * Miss Collection - Store & State Management
 * Persistent localStorage state for Cart, Wishlist, Orders, Coupons, and Products
 */

const Store = {
  // Storage keys
  KEYS: {
    PRODUCTS: "miss_collection_products_v1",
    CART: "miss_collection_cart_v1",
    WISHLIST: "miss_collection_wishlist_v1",
    ORDERS: "miss_collection_orders_v1",
    COUPON: "miss_collection_active_coupon_v1"
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

  // Initialize or fetch products
  getProducts: function() {
    try {
      const stored = localStorage.getItem(this.KEYS.PRODUCTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Error loading stored products", e);
    }
    // Default fallback
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

  // Price Formatter Helper
  formatPKR: function(amount) {
    return "Rs. " + Number(amount || 0).toLocaleString("en-PK");
  }
};

// Auto-initialize store
if (typeof window !== "undefined") {
  window.Store = Store;
}
