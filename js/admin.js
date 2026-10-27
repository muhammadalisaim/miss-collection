/**
 * Miss Collection - Admin Portal Management Logic
 * Catalog CRUD, Stock Control, Orders Pipeline & Sales Analytics
 */

document.addEventListener("DOMContentLoaded", function () {
  AdminApp.init();
});

const AdminApp = {
  isLoggedIn: false,

  init: function () {
    this.checkAuth();
    this.bindEvents();
    if (this.isLoggedIn) {
      this.refreshDashboard();
    }
  },

  checkAuth: function () {
    const session = sessionStorage.getItem("mc_admin_session");
    if (session === "authenticated") {
      this.isLoggedIn = true;
      document.getElementById("adminLoginView").classList.add("hidden");
      document.getElementById("adminDashboardView").classList.remove("hidden");
    } else {
      this.isLoggedIn = false;
      document.getElementById("adminLoginView").classList.remove("hidden");
      document.getElementById("adminDashboardView").classList.add("hidden");
    }
  },

  bindEvents: function () {
    const self = this;

    // Login Form
    const loginForm = document.getElementById("adminLoginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        self.handleLogin(this);
      });
    }

    // Add Product Form
    const addProductForm = document.getElementById("adminAddProductForm");
    if (addProductForm) {
      addProductForm.addEventListener("submit", function (e) {
        e.preventDefault();
        self.handleSaveProduct(this);
      });
    }

    // Tab Switching
    document.querySelectorAll("[data-admin-tab]").forEach(btn => {
      btn.addEventListener("click", function () {
        const tab = this.getAttribute("data-admin-tab");
        self.switchTab(tab);
      });
    });
  },

  handleLogin: function (form) {
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;

    const validEmail = "nazasra784@gmail.com";
    const validPassword = "Naz@2375";

    if (email === validEmail && (password === validPassword || password.trim() === validPassword)) {
      sessionStorage.setItem("mc_admin_session", "authenticated");
      this.isLoggedIn = true;
      this.checkAuth();
      this.refreshDashboard();
    } else {
      alert("Invalid email or password! Please check your credentials and try again.");
    }
  },

  logout: function () {
    sessionStorage.removeItem("mc_admin_session");
    this.isLoggedIn = false;
    this.checkAuth();
  },

  currentTab: "catalog",

  switchTab: function (tabName) {
    this.currentTab = tabName;
    document.querySelectorAll("[data-admin-tab]").forEach(btn => {
      if (btn.getAttribute("data-admin-tab") === tabName) {
        btn.classList.add("bg-stone-900", "text-white");
        btn.classList.remove("text-stone-600", "hover:bg-stone-100");
      } else {
        btn.classList.remove("bg-stone-900", "text-white");
        btn.classList.add("text-stone-600", "hover:bg-stone-100");
      }
    });

    document.querySelectorAll(".admin-tab-content").forEach(c => c.classList.add("hidden"));
    const activeContent = document.getElementById(`tabContent-${tabName}`);
    if (activeContent) activeContent.classList.remove("hidden");

    // Contextual button label
    const addBtnText = document.getElementById("adminMainAddBtnText");
    if (addBtnText) {
      if (tabName === "catalog") addBtnText.textContent = "Add Product";
      else if (tabName === "navigation") addBtnText.textContent = "Add Menu Item";
      else if (tabName === "banners") addBtnText.textContent = "Add Slide";
      else if (tabName === "lookbook") addBtnText.textContent = "Edit Lookbook";
      else addBtnText.textContent = "New Item";
    }
  },

  handleContextualAdd: function () {
    if (this.currentTab === "navigation") {
      this.openAddNavModal();
    } else if (this.currentTab === "banners") {
      this.openAddBannerModal();
    } else if (this.currentTab === "lookbook") {
      this.openEditLookbookModal("lookbook-1");
    } else {
      this.openAddProductModal();
    }
  },

  refreshDashboard: function () {
    this.renderKPIs();
    this.renderProductsTable();
    this.renderOrdersTable();
    this.renderNavigationTable();
    this.renderBannersTable();
    this.renderLookbookGrid();
  },

  renderKPIs: function () {
    const products = Store.getProducts();
    const orders = Store.getOrders();

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const lowStockCount = products.filter(p => (p.stockCount || 0) < 15).length;

    document.getElementById("kpiTotalRevenue").textContent = Store.formatPKR(totalRevenue);
    document.getElementById("kpiTotalOrders").textContent = orders.length;
    document.getElementById("kpiTotalProducts").textContent = products.length;
    document.getElementById("kpiLowStock").textContent = lowStockCount;
  },

  renderProductsTable: function () {
    const tbody = document.getElementById("adminProductsTableBody");
    if (!tbody) return;

    const products = Store.getProducts();
    tbody.innerHTML = products.map((p, idx) => `
      <tr class="border-b border-stone-100 hover:bg-stone-50/50 transition">
        <td class="p-3 text-stone-400 font-mono text-xs">#${idx + 1}</td>
        <td class="p-3">
          <div class="flex items-center gap-3">
            <img src="${p.images[0]}" alt="${p.title}" class="w-10 h-12 object-cover rounded bg-stone-100 shrink-0" />
            <div>
              <div class="font-bold text-stone-900 text-xs">${p.title}</div>
              <span class="text-[10px] text-rose-600 uppercase font-semibold">${p.category} &bull; ${p.subCategory}</span>
            </div>
          </div>
        </td>
        <td class="p-3 text-xs font-bold text-stone-900">
          <div class="flex items-center gap-1.5">
            <span>${Store.formatPKR(p.price)}</span>
            <button onclick="AdminApp.promptEditPrice('${p.id}', ${p.price})" class="text-[10px] text-rose-600 hover:underline" title="Change Price">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
        </td>
        <td class="p-3 text-xs">
          <span class="font-semibold ${p.stockCount < 10 ? "text-amber-600" : "text-stone-700"}">${p.stockCount || 0} units</span>
        </td>
        <td class="p-3">
          <button 
            onclick="AdminApp.toggleProductStock('${p.id}')" 
            class="px-2 py-1 rounded text-[10px] font-bold uppercase transition ${p.inStock ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}"
          >
            ${p.inStock ? "In Stock" : "Sold Out"}
          </button>
        </td>
        <td class="p-3 text-right">
          <div class="flex items-center justify-end gap-2">
            <button onclick="AdminApp.openEditProductModal('${p.id}')" class="p-1.5 text-stone-600 hover:text-rose-600 text-xs" title="Edit">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button onclick="AdminApp.deleteProduct('${p.id}')" class="p-1.5 text-stone-400 hover:text-rose-600 text-xs" title="Delete">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join("");
  },

  renderOrdersTable: function () {
    const tbody = document.getElementById("adminOrdersTableBody");
    if (!tbody) return;

    const orders = Store.getOrders();
    tbody.innerHTML = orders.map(o => `
      <tr class="border-b border-stone-100 hover:bg-stone-50/50 transition">
        <td class="p-3">
          <strong class="text-xs font-mono text-rose-600">${o.orderId}</strong>
          <span class="block text-[10px] text-stone-400">${o.date}</span>
        </td>
        <td class="p-3 text-xs">
          <strong class="text-stone-900 block">${o.customer.fullName}</strong>
          <span class="text-stone-500 block text-[11px]">${o.customer.phone} &bull; ${o.customer.city}</span>
        </td>
        <td class="p-3 text-xs text-stone-600">
          ${o.items.length} item(s)
          <span class="block text-[10px] text-stone-400 truncate max-w-[150px]">${o.items.map(i => i.title).join(", ")}</span>
        </td>
        <td class="p-3 text-xs font-bold text-stone-900">
          ${Store.formatPKR(o.total)}
          <span class="block text-[10px] text-stone-400 font-normal">${o.paymentMethod}</span>
        </td>
        <td class="p-3">
          <select 
            onchange="AdminApp.changeOrderStatus('${o.orderId}', this.value)" 
            class="text-xs font-semibold p-1.5 rounded border border-stone-200 bg-white text-stone-800 focus:outline-none focus:border-rose-500"
          >
            <option value="Order Confirmed" ${o.status === "Order Confirmed" ? "selected" : ""}>Order Confirmed</option>
            <option value="Confidential Packaging" ${o.status === "Confidential Packaging" ? "selected" : ""}>Confidential Packaging</option>
            <option value="Dispatched via TCS" ${o.status === "Dispatched via TCS" ? "selected" : ""}>Dispatched via TCS</option>
            <option value="Out for Delivery" ${o.status === "Out for Delivery" ? "selected" : ""}>Out for Delivery</option>
            <option value="Delivered" ${o.status === "Delivered" ? "selected" : ""}>Delivered</option>
          </select>
        </td>
        <td class="p-3 text-right">
          <button onclick="AdminApp.viewOrderDetails('${o.orderId}')" class="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded">
            View
          </button>
        </td>
      </tr>
    `).join("");
  },

  promptEditPrice: function (productId, currentPrice) {
    const newPrice = prompt(`Enter new price in PKR for this item:`, currentPrice);
    if (newPrice !== null) {
      const val = parseInt(newPrice);
      if (!isNaN(val) && val > 0) {
        const products = Store.getProducts();
        const p = products.find(i => i.id === productId);
        if (p) {
          p.price = val;
          Store.saveProducts(products);
          this.refreshDashboard();
        }
      } else {
        alert("Please enter a valid price number.");
      }
    }
  },

  toggleProductStock: function (productId) {
    const products = Store.getProducts();
    const p = products.find(i => i.id === productId);
    if (p) {
      p.inStock = !p.inStock;
      Store.saveProducts(products);
      this.refreshDashboard();
    }
  },

  currentUploadedImage: null,

  clearAllProducts: function () {
    if (confirm("⚠️ Kya aap waqai tamaam products ko catalog se delete karna chahte hain?\n\n(Yeh action tamam products remove kar dega aur woh dobara wapis nahi aayenge).")) {
      Store.clearAllProducts();
      this.refreshDashboard();
      alert("Tamaam products kamyabi se delete ho chuki hain!");
    }
  },

  deleteProduct: function (productId) {
    if (confirm("Are you sure you want to remove this product from Miss Collection catalog?")) {
      let products = Store.getProducts();
      products = products.filter(i => i.id !== productId);
      Store.saveProducts(products);
      this.refreshDashboard();
    }
  },

  handleCategoryChange: function (val) {
    const customContainer = document.getElementById("adminCustomCategoryContainer");
    if (!customContainer) return;
    if (val === "__custom__") {
      customContainer.classList.remove("hidden");
      const customInput = document.getElementById("adminCustomCategoryInput");
      if (customInput) customInput.focus();
    } else {
      customContainer.classList.add("hidden");
    }
  },

  toggleSizeChip: function (btn) {
    if (btn.classList.contains("active")) {
      btn.classList.remove("active", "bg-stone-900", "text-white", "border-stone-900");
      btn.classList.add("border-stone-200", "text-stone-700");
    } else {
      btn.classList.add("active", "bg-stone-900", "text-white", "border-stone-900");
      btn.classList.remove("border-stone-200", "text-stone-700");
    }
  },

  handleImageFileUpload: function (e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Barah-e-karam valid image file (JPG, PNG, WEBP) select karein.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target.result;
      this.currentUploadedImage = dataUrl;

      const preview = document.getElementById("adminProductImagePreview");
      const placeholderIcon = document.getElementById("adminProductImagePlaceholderIcon");
      if (preview && placeholderIcon) {
        preview.src = dataUrl;
        preview.classList.remove("hidden");
        placeholderIcon.classList.add("hidden");
      }
    };
    reader.readAsDataURL(file);
  },

  handleImageUrlInput: function (url) {
    if (!url || !url.trim()) return;
    const cleanUrl = url.trim();
    this.currentUploadedImage = cleanUrl;

    const preview = document.getElementById("adminProductImagePreview");
    const placeholderIcon = document.getElementById("adminProductImagePlaceholderIcon");
    if (preview && placeholderIcon) {
      preview.src = cleanUrl;
      preview.classList.remove("hidden");
      placeholderIcon.classList.add("hidden");
    }
  },

  openAddProductModal: function () {
    const form = document.getElementById("adminAddProductForm");
    if (form) form.reset();
    document.getElementById("adminProductModalId").value = "";
    document.getElementById("adminProductModalTitle").textContent = "Add New Intimate Product (نیا پروڈکٹ شامل کریں)";
    
    // Reset category selector
    const catSelect = document.getElementById("adminProductCategory");
    if (catSelect) catSelect.value = "bras";
    this.handleCategoryChange("bras");

    // Reset size chips
    document.querySelectorAll(".admin-size-chip").forEach(btn => {
      btn.classList.remove("active", "bg-stone-900", "text-white", "border-stone-900");
      btn.classList.add("border-stone-200", "text-stone-700");
    });
    // Default select standard bra sizes
    document.querySelectorAll('.admin-size-chip[data-size="32B"], .admin-size-chip[data-size="34B"], .admin-size-chip[data-size="36B"]').forEach(btn => {
      this.toggleSizeChip(btn);
    });

    // Reset image preview
    this.currentUploadedImage = null;
    const preview = document.getElementById("adminProductImagePreview");
    const placeholderIcon = document.getElementById("adminProductImagePlaceholderIcon");
    if (preview && placeholderIcon) {
      preview.src = "";
      preview.classList.add("hidden");
      placeholderIcon.classList.remove("hidden");
    }

    document.getElementById("adminProductModal").classList.remove("hidden");
  },

  openEditProductModal: function (productId) {
    const p = Store.getProductById(productId);
    if (!p) return;

    const form = document.getElementById("adminAddProductForm");
    document.getElementById("adminProductModalId").value = p.id;
    document.getElementById("adminProductModalTitle").textContent = "Edit Product Details (پروڈکٹ تبدیل کریں)";

    form.title.value = p.title || "";
    form.price.value = p.price || "";
    form.originalPrice.value = p.originalPrice || "";
    form.stockCount.value = p.stockCount || 20;
    form.inStock.checked = p.inStock !== false;

    // Category
    const catSelect = document.getElementById("adminProductCategory");
    const knownCats = ["bras", "panties", "bridal", "nightwear", "shapewear"];
    if (knownCats.includes(p.category)) {
      catSelect.value = p.category;
      this.handleCategoryChange(p.category);
    } else {
      catSelect.value = "__custom__";
      this.handleCategoryChange("__custom__");
      document.getElementById("adminCustomCategoryInput").value = p.category || "";
    }

    // Sizes
    document.querySelectorAll(".admin-size-chip").forEach(btn => {
      const sz = btn.getAttribute("data-size");
      if (p.sizes && p.sizes.includes(sz)) {
        btn.classList.add("active", "bg-stone-900", "text-white", "border-stone-900");
        btn.classList.remove("border-stone-200", "text-stone-700");
      } else {
        btn.classList.remove("active", "bg-stone-900", "text-white", "border-stone-900");
        btn.classList.add("border-stone-200", "text-stone-700");
      }
    });

    // Image preview
    const img = (p.images && p.images[0]) ? p.images[0] : "";
    this.currentUploadedImage = img;
    const preview = document.getElementById("adminProductImagePreview");
    const placeholderIcon = document.getElementById("adminProductImagePlaceholderIcon");
    if (img && preview && placeholderIcon) {
      preview.src = img;
      preview.classList.remove("hidden");
      placeholderIcon.classList.add("hidden");
      if (form.imageUrl) form.imageUrl.value = img.startsWith("data:") ? "" : img;
    }

    document.getElementById("adminProductModal").classList.remove("hidden");
  },

  closeProductModal: function () {
    document.getElementById("adminProductModal").classList.add("hidden");
  },

  handleSaveProduct: function (form) {
    const editId = document.getElementById("adminProductModalId").value;
    const products = Store.getProducts();

    const title = form.title.value.trim();
    let category = form.category.value;
    if (category === "__custom__") {
      const customVal = document.getElementById("adminCustomCategoryInput").value.trim();
      category = customVal || "General Intimates";
    }

    const price = parseInt(form.price.value);
    const originalPrice = form.originalPrice.value ? parseInt(form.originalPrice.value) : null;
    const stockCount = parseInt(form.stockCount.value) || 20;
    const inStock = form.inStock.checked;

    // Gather selected sizes
    const selectedSizes = [];
    document.querySelectorAll(".admin-size-chip.active").forEach(btn => {
      selectedSizes.push(btn.getAttribute("data-size"));
    });
    const customSizesStr = document.getElementById("adminCustomSizesInput").value.trim();
    if (customSizesStr) {
      customSizesStr.split(",").map(s => s.trim()).filter(Boolean).forEach(s => {
        if (!selectedSizes.includes(s)) selectedSizes.push(s);
      });
    }
    const finalSizes = selectedSizes.length > 0 ? selectedSizes : ["Standard"];

    // Image resolution
    const fallbackImage = "https://images.unsplash.com/photo-1594616091971-bf856a77b57d?auto=format&fit=crop&w=800&q=80";
    const imageUrl = this.currentUploadedImage || (form.imageUrl && form.imageUrl.value.trim()) || fallbackImage;

    const subCategory = category.charAt(0).toUpperCase() + category.slice(1);

    if (editId) {
      // Edit existing product
      const p = products.find(i => i.id === editId);
      if (p) {
        p.title = title;
        p.category = category;
        p.subCategory = subCategory;
        p.price = price;
        p.originalPrice = originalPrice;
        p.stockCount = stockCount;
        p.inStock = inStock;
        p.sizes = finalSizes;
        p.images[0] = imageUrl;
        if (p.colors && p.colors[0]) p.colors[0].image = imageUrl;
      }
    } else {
      // Add new product
      const newId = "mc-" + category.substring(0, 3).toLowerCase() + "-" + Date.now().toString().slice(-4);
      products.unshift({
        id: newId,
        title: title,
        category: category,
        subCategory: subCategory,
        price: price,
        originalPrice: originalPrice,
        rating: 5.0,
        reviewsCount: 1,
        badge: "New Arrival",
        badgeColor: "rose",
        inStock: inStock,
        stockCount: stockCount,
        description: `${title} - crafted with premium soft fabrics for supreme comfort, flawless silhouette, and confidential delivery.`,
        fabric: "92% Ultra-Soft Micro-Modal, 8% Elastane",
        colors: [{ name: "Standard", hex: "#d4af37", image: imageUrl }],
        sizes: finalSizes,
        images: [imageUrl]
      });
    }

    Store.saveProducts(products);
    this.closeProductModal();
    this.refreshDashboard();
    alert("Product catalog updated successfully!");
  },

  changeOrderStatus: function (orderId, newStatus) {
    Store.updateOrderStatus(orderId, newStatus);
    this.refreshDashboard();
  },

  viewOrderDetails: function (orderId) {
    const orders = Store.getOrders();
    const o = orders.find(i => i.orderId === orderId);
    if (!o) return;

    alert(
      `Order: ${o.orderId}\n` +
      `Date: ${o.date}\n` +
      `Customer: ${o.customer.fullName} (${o.customer.phone})\n` +
      `Address: ${o.customer.address}, ${o.customer.city}\n` +
      `Payment: ${o.paymentMethod}\n` +
      `Status: ${o.status}\n` +
      `Total: ${Store.formatPKR(o.total)}\n\n` +
      `Items:\n` + o.items.map(i => ` - ${i.quantity}x ${i.title} [Size: ${i.size}, Color: ${i.color}]`).join("\n")
    );
  },

  // ==========================================
  // NAVIGATION MENU CMS MANAGEMENT
  // ==========================================
  renderNavigationTable: function () {
    const tbody = document.getElementById("adminNavTableBody");
    if (!tbody) return;

    const items = Store.getNavItems();
    tbody.innerHTML = items.map((item, idx) => `
      <tr class="border-b border-stone-100 hover:bg-stone-50/50 transition">
        <td class="p-3 text-stone-400 font-mono text-xs">#${item.order || idx + 1}</td>
        <td class="p-3">
          <div class="flex items-center gap-2">
            ${item.icon ? `<i class="fa-solid ${item.icon} text-stone-500 text-xs"></i>` : ""}
            <span class="font-bold text-xs text-stone-900">${item.title}</span>
          </div>
        </td>
        <td class="p-3 text-xs text-stone-600 font-mono">
          ${item.targetType === "modal" ? `<span class="text-amber-700 font-bold"><i class="fa-solid fa-window-maximize mr-1"></i>${item.action || "modal"}</span>` : `<span class="text-rose-600 font-bold"><i class="fa-solid fa-filter mr-1"></i>${item.category}</span>`}
        </td>
        <td class="p-3 text-xs">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.isMega ? "bg-purple-100 text-purple-800" : "bg-stone-100 text-stone-600"}">
            ${item.isMega ? "Mega Menu" : "Direct Link"}
          </span>
        </td>
        <td class="p-3">
          <button 
            onclick="AdminApp.toggleNav('${item.id}')" 
            class="px-2.5 py-1 rounded text-[10px] font-bold uppercase transition ${item.visible !== false ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" : "bg-stone-200 text-stone-600 hover:bg-stone-300"}"
            title="Click to toggle display on storefront"
          >
            ${item.visible !== false ? '<i class="fa-solid fa-eye mr-1"></i>Visible' : '<i class="fa-solid fa-eye-slash mr-1"></i>Hidden'}
          </button>
        </td>
        <td class="p-3 text-right">
          <div class="flex items-center justify-end gap-2">
            <button onclick="AdminApp.openEditNavModal('${item.id}')" class="p-1.5 text-stone-600 hover:text-rose-600 text-xs" title="Edit Menu Item">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button onclick="AdminApp.deleteNav('${item.id}')" class="p-1.5 text-stone-400 hover:text-rose-600 text-xs" title="Delete Menu Item">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join("");
  },

  openAddNavModal: function () {
    const modal = document.getElementById("adminNavModal");
    const form = document.getElementById("adminNavForm");
    if (!modal || !form) return;
    form.reset();
    form.id.value = "";
    document.getElementById("adminNavModalTitle").textContent = "Add Top Menu Option";
    this.handleNavTypeChange("category");
    modal.classList.remove("hidden");
  },

  openEditNavModal: function (id) {
    const modal = document.getElementById("adminNavModal");
    const form = document.getElementById("adminNavForm");
    if (!modal || !form) return;

    const items = Store.getNavItems();
    const item = items.find(i => i.id === id);
    if (!item) return;

    form.id.value = item.id;
    form.title.value = item.title;
    form.targetType.value = item.targetType || "category";
    if (form.category) form.category.value = item.category || "all";
    if (form.action) form.action.value = item.action || "openBraCalculatorModal";
    form.order.value = item.order || 1;
    form.icon.value = item.icon || "";
    form.visible.checked = item.visible !== false;
    form.isMega.checked = item.isMega === true;

    this.handleNavTypeChange(form.targetType.value);
    document.getElementById("adminNavModalTitle").textContent = "Edit Menu Option: " + item.title;
    modal.classList.remove("hidden");
  },

  closeNavModal: function () {
    const modal = document.getElementById("adminNavModal");
    if (modal) modal.classList.add("hidden");
  },

  handleNavTypeChange: function (type) {
    const catWrapper = document.getElementById("navCategoryFieldWrapper");
    const modalWrapper = document.getElementById("navModalActionWrapper");
    if (type === "modal") {
      if (catWrapper) catWrapper.classList.add("hidden");
      if (modalWrapper) modalWrapper.classList.remove("hidden");
    } else {
      if (catWrapper) catWrapper.classList.remove("hidden");
      if (modalWrapper) modalWrapper.classList.add("hidden");
    }
  },

  handleNavFormSubmit: function (e) {
    e.preventDefault();
    const form = document.getElementById("adminNavForm");
    if (!form) return;

    const id = form.id.value;
    const title = form.title.value.trim();
    const targetType = form.targetType.value;
    const category = form.category ? form.category.value : "all";
    const action = form.action ? form.action.value : "";
    const order = parseInt(form.order.value, 10) || 1;
    const icon = form.icon.value.trim();
    const visible = form.visible.checked;
    const isMega = form.isMega.checked;

    if (!title) {
      alert("Please provide a menu title!");
      return;
    }

    if (id) {
      Store.updateNavItem(id, {
        title, targetType, category, action, order, icon, visible, isMega
      });
    } else {
      Store.addNavItem({
        title, targetType, category, action, order, icon, visible, isMega
      });
    }

    this.closeNavModal();
    this.renderNavigationTable();
    alert("Header menu updated successfully!");
  },

  deleteNav: function (id) {
    if (confirm("Are you sure you want to remove this navigation option from the header?")) {
      Store.deleteNavItem(id);
      this.renderNavigationTable();
    }
  },

  toggleNav: function (id) {
    Store.toggleNavVisibility(id);
    this.renderNavigationTable();
  },

  // ==========================================
  // HERO BANNERS CMS MANAGEMENT
  // ==========================================
  renderBannersTable: function () {
    const grid = document.getElementById("adminBannersGrid");
    if (!grid) return;

    const banners = Store.getBanners();
    grid.innerHTML = banners.map((b, idx) => `
      <div class="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs flex flex-col group">
        <div class="relative h-44 bg-stone-900 overflow-hidden">
          <img src="${b.imageUrl}" alt="${b.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          <div class="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent"></div>
          <div class="absolute top-3 left-3">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-900/80 text-white border border-white/20">
              Slide #${idx + 1}
            </span>
          </div>
          <div class="absolute bottom-3 left-3 right-3 text-white">
            <span class="text-[9px] uppercase font-bold text-rose-300 block">${b.badge || "Featured"}</span>
            <h4 class="text-sm font-bold leading-tight truncate">${b.title}</h4>
          </div>
        </div>

        <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <p class="text-xs text-stone-600 line-clamp-2">${b.subtitle || "No descriptive text"}</p>
            <div class="mt-2 text-[11px] font-semibold text-stone-500 flex items-center gap-1.5">
              <i class="fa-solid fa-arrow-pointer text-rose-500 text-xs"></i>
              <span>Button: <strong>${b.btnText || "Shop Now"}</strong> (Target: ${b.btnCategory})</span>
            </div>
          </div>

          <div class="pt-3 border-t border-stone-100 flex items-center justify-between">
            <button 
              onclick="AdminApp.toggleBanner('${b.id}')" 
              class="px-2.5 py-1 rounded text-[10px] font-bold uppercase transition ${b.active !== false ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" : "bg-stone-200 text-stone-600 hover:bg-stone-300"}"
            >
              ${b.active !== false ? '<i class="fa-solid fa-play mr-1"></i>Active' : '<i class="fa-solid fa-pause mr-1"></i>Paused'}
            </button>

            <div class="flex items-center gap-2">
              <button onclick="AdminApp.openEditBannerModal('${b.id}')" class="p-1.5 text-stone-600 hover:text-rose-600 text-xs font-semibold flex items-center gap-1" title="Edit Slide">
                <i class="fa-solid fa-pen"></i> Edit
              </button>
              <button onclick="AdminApp.deleteBanner('${b.id}')" class="p-1.5 text-stone-400 hover:text-rose-600 text-xs" title="Delete Slide">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join("");
  },

  currentUploadedBannerImage: null,

  openAddBannerModal: function () {
    const modal = document.getElementById("adminBannerModal");
    const form = document.getElementById("adminBannerForm");
    if (!modal || !form) return;
    form.reset();
    form.id.value = "";
    this.currentUploadedBannerImage = null;
    const preview = document.getElementById("adminBannerImagePreview");
    const placeholder = document.getElementById("adminBannerPlaceholderIcon");
    if (preview) preview.classList.add("hidden");
    if (placeholder) placeholder.classList.remove("hidden");
    document.getElementById("adminBannerModalTitle").textContent = "Add New Hero Banner Slide";
    modal.classList.remove("hidden");
  },

  openEditBannerModal: function (id) {
    const modal = document.getElementById("adminBannerModal");
    const form = document.getElementById("adminBannerForm");
    if (!modal || !form) return;

    const banners = Store.getBanners();
    const banner = banners.find(b => b.id === id);
    if (!banner) return;

    form.id.value = banner.id;
    form.title.value = banner.title || "";
    form.badge.value = banner.badge || "";
    form.badgeColor.value = banner.badgeColor || "rose";
    form.subtitle.value = banner.subtitle || "";
    form.btnText.value = banner.btnText || "";
    form.btnCategory.value = banner.btnCategory || "bras";
    form.active.checked = banner.active !== false;

    const img = banner.imageUrl || "";
    this.currentUploadedBannerImage = img;
    const preview = document.getElementById("adminBannerImagePreview");
    const placeholder = document.getElementById("adminBannerPlaceholderIcon");
    const urlInput = document.getElementById("adminBannerUrlInput");

    if (img && preview && placeholder) {
      preview.src = img;
      preview.classList.remove("hidden");
      placeholder.classList.add("hidden");
      if (urlInput) urlInput.value = img.startsWith("data:") ? "" : img;
    } else {
      if (preview) preview.classList.add("hidden");
      if (placeholder) placeholder.classList.remove("hidden");
      if (urlInput) urlInput.value = "";
    }

    document.getElementById("adminBannerModalTitle").textContent = "Edit Banner Slide: " + banner.title;
    modal.classList.remove("hidden");
  },

  closeBannerModal: function () {
    const modal = document.getElementById("adminBannerModal");
    if (modal) modal.classList.add("hidden");
    this.currentUploadedBannerImage = null;
  },

  handleBannerImageFileUpload: function (event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose a valid image file (JPG, PNG, WEBP, etc.)");
      return;
    }

    const reader = new FileReader();
    const self = this;
    reader.onload = function (e) {
      const dataUrl = e.target.result;
      self.currentUploadedBannerImage = dataUrl;
      const preview = document.getElementById("adminBannerImagePreview");
      const placeholder = document.getElementById("adminBannerPlaceholderIcon");
      if (preview && placeholder) {
        preview.src = dataUrl;
        preview.classList.remove("hidden");
        placeholder.classList.add("hidden");
      }
      const urlInput = document.getElementById("adminBannerUrlInput");
      if (urlInput) urlInput.value = "";
    };
    reader.readAsDataURL(file);
  },

  handleBannerImageUrlInput: function (url) {
    const trimmed = (url || "").trim();
    if (!trimmed) return;
    this.currentUploadedBannerImage = trimmed;
    const preview = document.getElementById("adminBannerImagePreview");
    const placeholder = document.getElementById("adminBannerPlaceholderIcon");
    if (preview && placeholder) {
      preview.src = trimmed;
      preview.classList.remove("hidden");
      placeholder.classList.add("hidden");
    }
  },

  handleBannerFormSubmit: function (e) {
    e.preventDefault();
    const form = document.getElementById("adminBannerForm");
    if (!form) return;

    const id = form.id.value;
    const title = form.title.value.trim();
    const badge = form.badge.value.trim();
    const badgeColor = form.badgeColor.value;
    const subtitle = form.subtitle.value.trim();
    const btnText = form.btnText.value.trim();
    const btnCategory = form.btnCategory.value;
    const active = form.active.checked;

    const fallbackImg = "https://images.unsplash.com/photo-1594616091971-bf856a77b57d?auto=format&fit=crop&w=1800&q=85";
    const imageUrl = this.currentUploadedBannerImage || (form.imageUrl && form.imageUrl.value.trim()) || fallbackImg;

    if (!title) {
      alert("Please provide a Slide Headline!");
      return;
    }

    if (id) {
      Store.updateBanner(id, {
        title, badge, badgeColor, imageUrl, subtitle, btnText, btnCategory, active
      });
    } else {
      Store.addBanner({
        title, badge, badgeColor, imageUrl, subtitle, btnText, btnCategory, active
      });
    }

    this.closeBannerModal();
    this.renderBannersTable();
    alert("Hero banner saved successfully!");
  },

  deleteBanner: function (id) {
    if (confirm("Delete this hero carousel slide?")) {
      Store.deleteBanner(id);
      this.renderBannersTable();
    }
  },

  toggleBanner: function (id) {
    Store.toggleBannerStatus(id);
    this.renderBannersTable();
  },

  restoreFactoryDefaults: function () {
    if (confirm("Reset Miss Collection catalog, header navigation menu, and hero banners to original factory defaults? All manual edits will be re-initialized.")) {
      if (typeof DEFAULT_PRODUCTS !== "undefined") {
        Store.saveProducts(DEFAULT_PRODUCTS);
      }
      if (Store.DEFAULT_NAV_ITEMS) {
        Store.saveNavItems(Store.DEFAULT_NAV_ITEMS);
      }
      if (Store.DEFAULT_BANNERS) {
        Store.saveBanners(Store.DEFAULT_BANNERS);
      }
      if (Store.DEFAULT_LOOKBOOK) {
        Store.resetLookbookDefaults();
      }
      this.refreshDashboard();
      alert("Restored factory catalog, navigation, and hero banners successfully.");
    }
  },

  // ==========================================
  // CURATED SEASONAL LOOKBOOK (The Lookbook Edit)
  // ==========================================
  currentUploadedLookbookImage: null,

  renderLookbookGrid: function () {
    const grid = document.getElementById("adminLookbookGrid");
    if (!grid) return;

    const list = Store.getLookbook();
    const tileLabels = [
      "Tile #1 • Large 7-Column Editorial Look (بائیں طرف بڑا کارڈ)",
      "Tile #2 • Top-Right Look (دائیں اوپر والا کارڈ)",
      "Tile #3 • Bottom-Right Look (دائیں نیچے والا کارڈ)"
    ];

    grid.innerHTML = list.map((item, idx) => {
      return `
        <div class="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs flex flex-col group">
          <div class="relative h-56 bg-stone-900 overflow-hidden">
            <img src="${item.imageUrl}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent"></div>
            <div class="absolute top-3 left-3">
              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-900/90 text-[#D4AF37] border border-[#D4AF37]/30">
                ${tileLabels[idx] || `Tile #${idx + 1}`}
              </span>
            </div>
            <div class="absolute bottom-3 left-3 right-3 text-white">
              <span class="text-[9px] uppercase font-bold text-[#D4AF37] block tracking-widest">${item.tagline || "Curated Edit"}</span>
              <h4 class="text-sm font-bold leading-tight truncate">${item.title}</h4>
            </div>
          </div>

          <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
            <div>
              ${item.description ? `<p class="text-xs text-stone-600 line-clamp-2 mb-2">${item.description}</p>` : ""}
              <div class="space-y-1 text-[11px] text-stone-500">
                <div><strong class="text-stone-700">Category Filter:</strong> <span class="capitalize font-semibold text-rose-600">${item.category}</span></div>
                <div><strong class="text-stone-700">Button CTA:</strong> ${item.buttonText || "Shop Collection →"}</div>
              </div>
            </div>

            <div class="pt-3 border-t border-stone-100 flex items-center justify-between">
              <button 
                type="button"
                onclick="AdminApp.openEditLookbookModal('${item.id}')" 
                class="w-full py-2 bg-stone-900 hover:bg-[#B4640A] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <i class="fa-solid fa-pen-to-square text-[11px]"></i> Edit This Look (تبدیل کریں)
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  },

  openEditLookbookModal: function (id) {
    const modal = document.getElementById("adminLookbookModal");
    const form = document.getElementById("adminLookbookForm");
    if (!modal || !form) return;

    const list = Store.getLookbook();
    const item = list.find(t => t.id === id) || list[0];
    if (!item) return;

    document.getElementById("adminLookbookTileId").value = item.id;
    document.getElementById("adminLookbookTitle").value = item.title || "";
    document.getElementById("adminLookbookTagline").value = item.tagline || "";
    document.getElementById("adminLookbookDesc").value = item.description || "";
    document.getElementById("adminLookbookBtnText").value = item.buttonText || "";
    document.getElementById("adminLookbookCategory").value = item.category || "bras";

    // Image preview
    const img = item.imageUrl || "";
    this.currentUploadedLookbookImage = img;
    const preview = document.getElementById("adminLookbookImagePreview");
    const placeholderIcon = document.getElementById("adminLookbookPlaceholderIcon");
    const urlInput = document.getElementById("adminLookbookUrlInput");

    if (img && preview && placeholderIcon) {
      preview.src = img;
      preview.classList.remove("hidden");
      placeholderIcon.classList.add("hidden");
      if (urlInput) urlInput.value = img.startsWith("data:") ? "" : img;
    } else {
      if (preview) preview.classList.add("hidden");
      if (placeholderIcon) placeholderIcon.classList.remove("hidden");
      if (urlInput) urlInput.value = "";
    }

    modal.classList.remove("hidden");
  },

  closeLookbookModal: function () {
    const modal = document.getElementById("adminLookbookModal");
    if (modal) modal.classList.add("hidden");
    this.currentUploadedLookbookImage = null;
  },

  handleLookbookImageFileUpload: function (event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose a valid image file (JPG, PNG, WEBP, etc.)");
      return;
    }

    const reader = new FileReader();
    const self = this;
    reader.onload = function (e) {
      const dataUrl = e.target.result;
      self.currentUploadedLookbookImage = dataUrl;
      const preview = document.getElementById("adminLookbookImagePreview");
      const placeholder = document.getElementById("adminLookbookPlaceholderIcon");
      if (preview && placeholder) {
        preview.src = dataUrl;
        preview.classList.remove("hidden");
        placeholder.classList.add("hidden");
      }
      const urlInput = document.getElementById("adminLookbookUrlInput");
      if (urlInput) urlInput.value = "";
    };
    reader.readAsDataURL(file);
  },

  handleLookbookImageUrlInput: function (url) {
    const trimmed = (url || "").trim();
    if (!trimmed) return;
    this.currentUploadedLookbookImage = trimmed;
    const preview = document.getElementById("adminLookbookImagePreview");
    const placeholder = document.getElementById("adminLookbookPlaceholderIcon");
    if (preview && placeholder) {
      preview.src = trimmed;
      preview.classList.remove("hidden");
      placeholder.classList.add("hidden");
    }
  },

  handleSaveLookbook: function (event) {
    event.preventDefault();
    const form = event.target;
    const id = document.getElementById("adminLookbookTileId").value;
    if (!id) return;

    const title = form.title.value.trim();
    const tagline = form.tagline.value.trim();
    const description = form.description ? form.description.value.trim() : "";
    const buttonText = form.buttonText.value.trim();
    const category = form.category.value;

    const fallbackImg = "https://images.unsplash.com/photo-1594616091971-bf856a77b57d?auto=format&fit=crop&w=1200&q=85";
    const imageUrl = this.currentUploadedLookbookImage || (form.imageUrl && form.imageUrl.value.trim()) || fallbackImg;

    Store.updateLookbookTile(id, {
      title,
      tagline,
      description,
      buttonText,
      category,
      imageUrl
    });

    this.closeLookbookModal();
    this.renderLookbookGrid();
    alert("The Lookbook Edit tile updated successfully! Changes are live on the homepage.");
  },

  resetLookbookDefaults: function () {
    if (confirm("Reset 'The Lookbook Edit' to original seasonal defaults?")) {
      Store.resetLookbookDefaults();
      this.renderLookbookGrid();
      alert("Lookbook restored to default seasonal styling.");
    }
  }
};
