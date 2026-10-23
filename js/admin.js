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
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (email === "admin@misscollection.pk" && password === "MissAdmin2026") {
      sessionStorage.setItem("mc_admin_session", "authenticated");
      this.isLoggedIn = true;
      this.checkAuth();
      this.refreshDashboard();
    } else {
      alert("Invalid credentials! Please use:\nEmail: admin@misscollection.pk\nPassword: MissAdmin2026");
    }
  },

  logout: function () {
    sessionStorage.removeItem("mc_admin_session");
    this.isLoggedIn = false;
    this.checkAuth();
  },

  switchTab: function (tabName) {
    document.querySelectorAll("[data-admin-tab]").forEach(btn => {
      if (btn.getAttribute("data-admin-tab") === tabName) {
        btn.classList.add("bg-rose-600", "text-white");
        btn.classList.remove("text-stone-600", "hover:bg-stone-100");
      } else {
        btn.classList.remove("bg-rose-600", "text-white");
        btn.classList.add("text-stone-600", "hover:bg-stone-100");
      }
    });

    document.querySelectorAll(".admin-tab-content").forEach(c => c.classList.add("hidden"));
    const activeContent = document.getElementById(`tabContent-${tabName}`);
    if (activeContent) activeContent.classList.remove("hidden");
  },

  refreshDashboard: function () {
    this.renderKPIs();
    this.renderProductsTable();
    this.renderOrdersTable();
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

  deleteProduct: function (productId) {
    if (confirm("Are you sure you want to remove this product from Miss Collection catalog?")) {
      let products = Store.getProducts();
      products = products.filter(i => i.id !== productId);
      Store.saveProducts(products);
      this.refreshDashboard();
    }
  },

  openAddProductModal: function () {
    const form = document.getElementById("adminAddProductForm");
    if (form) form.reset();
    document.getElementById("adminProductModalId").value = "";
    document.getElementById("adminProductModalTitle").textContent = "Add New Intimate Product";
    document.getElementById("adminProductModal").classList.remove("hidden");
  },

  openEditProductModal: function (productId) {
    const p = Store.getProductById(productId);
    if (!p) return;

    const form = document.getElementById("adminAddProductForm");
    document.getElementById("adminProductModalId").value = p.id;
    document.getElementById("adminProductModalTitle").textContent = "Edit Product Details";

    form.title.value = p.title;
    form.category.value = p.category;
    form.subCategory.value = p.subCategory;
    form.price.value = p.price;
    form.originalPrice.value = p.originalPrice || "";
    form.stockCount.value = p.stockCount || 10;
    form.description.value = p.description || "";
    form.fabric.value = p.fabric || "";
    form.imageUrl.value = p.images[0] || "";

    document.getElementById("adminProductModal").classList.remove("hidden");
  },

  closeProductModal: function () {
    document.getElementById("adminProductModal").classList.add("hidden");
  },

  handleSaveProduct: function (form) {
    const editId = document.getElementById("adminProductModalId").value;
    const products = Store.getProducts();

    const title = form.title.value.trim();
    const category = form.category.value;
    const subCategory = form.subCategory.value.trim();
    const price = parseInt(form.price.value);
    const originalPrice = form.originalPrice.value ? parseInt(form.originalPrice.value) : null;
    const stockCount = parseInt(form.stockCount.value) || 15;
    const description = form.description.value.trim();
    const fabric = form.fabric.value.trim();
    const imageUrl = form.imageUrl.value.trim() || "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80";

    if (editId) {
      // Edit existing
      const p = products.find(i => i.id === editId);
      if (p) {
        p.title = title;
        p.category = category;
        p.subCategory = subCategory;
        p.price = price;
        p.originalPrice = originalPrice;
        p.stockCount = stockCount;
        p.description = description;
        p.fabric = fabric;
        if (imageUrl) p.images[0] = imageUrl;
      }
    } else {
      // Add new
      const newId = "mc-" + category.substring(0, 3) + "-" + Date.now().toString().slice(-4);
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
        inStock: true,
        stockCount: stockCount,
        description: description,
        fabric: fabric,
        colors: [{ name: "Standard", hex: "#deb89d", image: imageUrl }],
        sizes: category === "bras" ? ["32B", "34B", "36B", "38B"] : ["S", "M", "L", "XL"],
        images: [imageUrl]
      });
    }

    Store.saveProducts(products);
    this.closeProductModal();
    this.refreshDashboard();
    alert("Catalog saved successfully!");
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

  restoreFactoryDefaults: function () {
    if (confirm("Reset Miss Collection catalog to original factory defaults? All manual edits will be re-initialized.")) {
      if (typeof DEFAULT_PRODUCTS !== "undefined") {
        Store.saveProducts(DEFAULT_PRODUCTS);
        this.refreshDashboard();
        alert("Restored factory catalog successfully.");
      }
    }
  }
};
