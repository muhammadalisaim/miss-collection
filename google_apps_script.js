/**
 * ==========================================================================
 * MISS COLLECTION — GOOGLE SHEETS CLOUD DATABASE BACKEND (Google Apps Script)
 * ==========================================================================
 * 
 * Instructions for Setup:
 * 1. Open Google Sheets (sheets.google.com) and create a New Spreadsheet.
 *    Name it: "Miss Collection Database"
 * 2. In Google Sheets, click: Extensions > Apps Script (ایکسٹینشنز > ایپس سکرپٹ).
 * 3. Delete any code in the editor, paste this entire file, and click Save (💾).
 * 4. Click: Deploy > New deployment (بلیو بٹن "Deploy" پر کلک کریں).
 * 5. Select type: "Web app" (Gear icon > Web app).
 * 6. Set Description: "Miss Collection API v1".
 * 7. Set "Execute as": "Me" (آپ کی ای میل).
 * 8. Set "Who has access": "Anyone" (کوئی بھی / اینی ون) — IMPORTANT!
 * 9. Click "Deploy". Authorize permissions when prompted.
 * 10. Copy the "Web app URL" (starts with https://script.google.com/macros/s/...)
 * 11. Paste this Web app URL into Miss Collection Admin Panel > Cloud Settings!
 */

const SHEET_PRODUCTS = "Products";
const SHEET_ORDERS = "Orders";

// Product Table Column Headers
const PRODUCT_HEADERS = [
  "id", "title", "category", "subCategory", "price", "originalPrice",
  "stockCount", "inStock", "sizes", "fabric", "images", "badge",
  "badgeColor", "description", "colors", "rating", "reviewsCount", "updatedAt"
];

// Order Table Column Headers
const ORDER_HEADERS = [
  "orderId", "timestamp", "customerName", "customerPhone", "customerEmail",
  "city", "deliveryAddress", "itemsSummary", "subtotal", "discount",
  "shipping", "totalAmount", "status", "notes"
];

/**
 * Handle HTTP GET Requests
 * e.g. ?action=getProducts
 * e.g. ?action=getOrders
 */
function doGet(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "getProducts";
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === "getProducts") {
      const sheet = getOrCreateSheet(ss, SHEET_PRODUCTS, PRODUCT_HEADERS);
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) {
        return createJsonResponse({ success: true, count: 0, products: [] });
      }

      const headers = data[0];
      const products = [];

      for (var i = 1; i < data.length; i++) {
        var row = data[i];
        if (!row[0]) continue; // Skip empty rows

        var p = {};
        for (var j = 0; j < headers.length; j++) {
          var key = headers[j];
          var val = row[j];

          // Parse JSON/Arrays where applicable
          if (key === "sizes" && typeof val === "string") {
            try { p[key] = val.startsWith("[") ? JSON.parse(val) : val.split(",").map(function(s) { return s.trim(); }); }
            catch (err) { p[key] = val.split(",").map(function(s) { return s.trim(); }); }
          } else if ((key === "images" || key === "colors") && typeof val === "string") {
            try { p[key] = JSON.parse(val); }
            catch (err) { p[key] = val ? [val] : []; }
          } else if (key === "price" || key === "originalPrice" || key === "stockCount" || key === "rating" || key === "reviewsCount") {
            p[key] = val === "" ? null : Number(val);
          } else if (key === "inStock") {
            p[key] = (val === true || val === "TRUE" || val === "true" || val === 1);
          } else {
            p[key] = val;
          }
        }
        products.push(p);
      }

      return createJsonResponse({ success: true, count: products.length, products: products });
    }

    if (action === "getOrders") {
      const sheet = getOrCreateSheet(ss, SHEET_ORDERS, ORDER_HEADERS);
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) {
        return createJsonResponse({ success: true, count: 0, orders: [] });
      }

      const headers = data[0];
      const orders = [];

      for (var r = 1; r < data.length; r++) {
        var orderRow = data[r];
        if (!orderRow[0]) continue;

        var ord = {};
        for (var c = 0; c < headers.length; c++) {
          ord[headers[c]] = orderRow[c];
        }
        orders.push(ord);
      }

      // Return recent orders first
      orders.reverse();
      return createJsonResponse({ success: true, count: orders.length, orders: orders });
    }

    return createJsonResponse({ success: false, message: "Unknown GET action: " + action });
  } catch (error) {
    return createJsonResponse({ success: false, error: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Handle HTTP POST Requests
 * Actions: saveProduct, deleteProduct, saveAllProducts, logOrder
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(15000);

  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      body = e.parameter;
    }

    const action = body.action || "saveProduct";
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. SAVE / UPDATE SINGLE PRODUCT
    if (action === "saveProduct") {
      const p = body.product;
      if (!p || !p.id) {
        return createJsonResponse({ success: false, message: "Missing product data or product ID" });
      }

      const sheet = getOrCreateSheet(ss, SHEET_PRODUCTS, PRODUCT_HEADERS);
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      var rowIndex = -1;

      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == p.id) {
          rowIndex = i + 1; // 1-indexed for sheet
          break;
        }
      }

      var rowValues = prepareProductRow(headers, p);

      if (rowIndex > -1) {
        sheet.getRange(rowIndex, 1, 1, rowValues.length).setValues([rowValues]);
        return createJsonResponse({ success: true, message: "Product updated", id: p.id, action: "update" });
      } else {
        sheet.appendRow(rowValues);
        return createJsonResponse({ success: true, message: "Product added", id: p.id, action: "insert" });
      }
    }

    // 2. DELETE SINGLE PRODUCT
    if (action === "deleteProduct") {
      const productId = body.productId || body.id;
      if (!productId) {
        return createJsonResponse({ success: false, message: "Missing productId" });
      }

      const sheet = getOrCreateSheet(ss, SHEET_PRODUCTS, PRODUCT_HEADERS);
      const data = sheet.getDataRange().getValues();
      for (var d = 1; d < data.length; d++) {
        if (data[d][0] == productId) {
          sheet.deleteRow(d + 1);
          return createJsonResponse({ success: true, message: "Product deleted", id: productId });
        }
      }
      return createJsonResponse({ success: false, message: "Product not found: " + productId });
    }

    // 3. BULK SAVE ALL PRODUCTS (e.g. Initial migration or clear all)
    if (action === "saveAllProducts") {
      const productsList = body.products || [];
      const sheet = getOrCreateSheet(ss, SHEET_PRODUCTS, PRODUCT_HEADERS);
      
      // Clear all rows except headers
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.deleteRows(2, lastRow - 1);
      }

      if (productsList.length > 0) {
        const headers = PRODUCT_HEADERS;
        const allRows = productsList.map(function(item) {
          return prepareProductRow(headers, item);
        });
        sheet.getRange(2, 1, allRows.length, headers.length).setValues(allRows);
      }

      return createJsonResponse({ success: true, message: "Bulk saved " + productsList.length + " products" });
    }

    // 4. LOG NEW CUSTOMER ORDER (From WhatsApp booking or Checkout form)
    if (action === "logOrder") {
      const ord = body.order;
      if (!ord) {
        return createJsonResponse({ success: false, message: "Missing order data" });
      }

      const sheet = getOrCreateSheet(ss, SHEET_ORDERS, ORDER_HEADERS);
      const cust = ord.customer || {};

      var itemsSummary = "";
      if (Array.isArray(ord.items)) {
        itemsSummary = ord.items.map(function(it) {
          return it.title + " (" + (it.size || "Standard") + ") x" + (it.quantity || 1);
        }).join(" | ");
      } else if (typeof ord.items === "string") {
        itemsSummary = ord.items;
      }

      const orderRow = [
        ord.orderId || ("MC-" + Math.floor(10000 + Math.random() * 90000)),
        ord.date || new Date().toISOString().replace("T", " ").substr(0, 19),
        cust.fullName || "WhatsApp Customer",
        cust.phone || "",
        cust.email || "",
        cust.city || "Pakistan",
        cust.address || "WhatsApp Booking",
        itemsSummary,
        ord.subtotal || 0,
        ord.discount || 0,
        ord.shipping || 0,
        ord.total || 0,
        ord.status || "WhatsApp Inquired",
        cust.notes || ""
      ];

      sheet.appendRow(orderRow);
      return createJsonResponse({ success: true, message: "Order logged successfully", orderId: orderRow[0] });
    }

    return createJsonResponse({ success: false, message: "Unknown POST action: " + action });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Helper: Prepare product data array matching sheet headers
 */
function prepareProductRow(headers, p) {
  var row = [];
  var now = new Date().toISOString().replace("T", " ").substr(0, 19);

  for (var i = 0; i < headers.length; i++) {
    var h = headers[i];
    if (h === "id") row.push(p.id || "");
    else if (h === "title") row.push(p.title || "");
    else if (h === "category") row.push(p.category || "general");
    else if (h === "subCategory") row.push(p.subCategory || "");
    else if (h === "price") row.push(p.price || 0);
    else if (h === "originalPrice") row.push(p.originalPrice || "");
    else if (h === "stockCount") row.push(p.stockCount || 20);
    else if (h === "inStock") row.push(p.inStock !== false);
    else if (h === "sizes") row.push(Array.isArray(p.sizes) ? p.sizes.join(", ") : (p.sizes || ""));
    else if (h === "fabric") row.push(p.fabric || "");
    else if (h === "images") row.push(Array.isArray(p.images) ? JSON.stringify(p.images) : (p.images ? JSON.stringify([p.images]) : "[]"));
    else if (h === "badge") row.push(p.badge || "");
    else if (h === "badgeColor") row.push(p.badgeColor || "dark");
    else if (h === "description") row.push(p.description || "");
    else if (h === "colors") row.push(Array.isArray(p.colors) ? JSON.stringify(p.colors) : "[]");
    else if (h === "rating") row.push(p.rating || 4.9);
    else if (h === "reviewsCount") row.push(p.reviewsCount || 12);
    else if (h === "updatedAt") row.push(now);
    else row.push(p[h] || "");
  }
  return row;
}

/**
 * Helper: Find existing sheet or create with initial headers
 */
function getOrCreateSheet(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    // Format header row (Bold + Dark Slate)
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#181716");
    headerRange.setFontColor("#D4AF37");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Helper: Output JSON response with proper MIME type
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
