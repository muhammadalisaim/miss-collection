/**
 * Miss Collection - Master Product Catalog
 * Authentic Pakistani Ladies' Undergarments, Bridal Sets, Loungewear & Shapewear
 * With Dual-Angle Photography for Image Hover Swap & In-Cart Cross-Sells
 */

const DEFAULT_PRODUCTS = [
  // --- BRAS ---
  {
    id: "mc-bra-01",
    title: "Feather-Light Seamless Wireless Comfort Bra",
    category: "bras",
    subCategory: "Wireless Bras",
    price: 1850,
    originalPrice: 2450,
    rating: 4.9,
    reviewsCount: 142,
    badge: "Bestseller",
    badgeColor: "rose",
    inStock: true,
    stockCount: 18,
    isFeatured: true,
    description: "Designed for all-day cloud-like comfort. Made with buttery-soft micro-modal fabric, molded wireless cups, and ultra-smooth zero-dig underband. 100% invisible under tight t-shirts and kurtis.",
    fabric: "85% Micro-Modal, 15% Elastane",
    colors: [
      { name: "Blush Pink", hex: "#f3c5c9", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80" },
      { name: "Nude Skin", hex: "#deb89d", image: "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80" },
      { name: "Midnight Black", hex: "#1f1f21", image: "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&w=800&q=80" }
    ],
    sizes: ["32B", "34B", "34C", "36B", "36C", "38B", "38C", "40C"],
    cupSizes: ["B", "C"],
    bandSizes: ["32", "34", "36", "38", "40"],
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80"
    ],
    crossSells: ["mc-acc-01", "mc-acc-02"]
  },
  {
    id: "mc-bra-02",
    title: "Chantilly Floral Lace Plunge Push-Up Bra",
    category: "bras",
    subCategory: "Push-Up Bras",
    price: 2450,
    originalPrice: 3200,
    rating: 4.8,
    reviewsCount: 89,
    badge: "Sale",
    badgeColor: "red",
    inStock: true,
    stockCount: 12,
    isFeatured: true,
    description: "Exquisite French-inspired scalloped floral lace with gentle contoured push-up padding. Provides natural lift, stunning cleavage, and plush underwire support wrapped in velvet comfort channel.",
    fabric: "78% Polyamide Lace, 22% Spandex",
    colors: [
      { name: "Crimson Maroon", hex: "#8b1538", image: "https://images.unsplash.com/photo-1616150840617-a0684f0f089d?auto=format&fit=crop&w=800&q=80" },
      { name: "Onyx Black", hex: "#111111", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80" },
      { name: "Bridal Ivory", hex: "#fcf8f2", image: "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&w=800&q=80" }
    ],
    sizes: ["32B", "34B", "34C", "36B", "36C", "38C"],
    cupSizes: ["B", "C"],
    bandSizes: ["32", "34", "36", "38"],
    images: [
      "https://images.unsplash.com/photo-1616150840617-a0684f0f089d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80"
    ],
    crossSells: ["mc-panty-03", "mc-acc-02"]
  },
  {
    id: "mc-bra-03",
    title: "Everyday Invisible T-Shirt Contour Bra",
    category: "bras",
    subCategory: "T-Shirt Bras",
    price: 1650,
    originalPrice: 2100,
    rating: 4.9,
    reviewsCount: 215,
    badge: "Popular",
    badgeColor: "amber",
    inStock: true,
    stockCount: 25,
    isFeatured: true,
    description: "The quintessential daily wardrobe essential. Smooth micro-knit cups provide full coverage with non-bulky modesty lining and non-slip adjustable convertible straps.",
    fabric: "90% Nylon Microfiber, 10% Spandex",
    colors: [
      { name: "Warm Beige", hex: "#e5cbb5", image: "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&w=800&q=80" },
      { name: "Mocha", hex: "#9e7762", image: "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80" },
      { name: "Pearl White", hex: "#ffffff", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80" }
    ],
    sizes: ["32B", "34B", "34C", "36B", "36C", "38B", "38C", "38D", "40C", "40D"],
    cupSizes: ["B", "C", "D"],
    bandSizes: ["32", "34", "36", "38", "40"],
    images: [
      "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80"
    ],
    crossSells: ["mc-acc-02", "mc-acc-03"]
  },
  {
    id: "mc-bra-04",
    title: "Full-Support Back-Smoothing Minimizer Bra",
    category: "bras",
    subCategory: "Minimizer Bras",
    price: 2850,
    originalPrice: 3500,
    rating: 4.9,
    reviewsCount: 96,
    badge: "Full Support",
    badgeColor: "rose",
    inStock: true,
    stockCount: 14,
    isFeatured: false,
    description: "Specially engineered for heavier bust sizes (C to DD). Reduces bust projection by up to 1.5 inches while providing high lift, wide side wings to eliminate back bulge, and cushioned shoulder straps.",
    fabric: "82% Polyamide, 18% Spandex Power-Mesh",
    colors: [
      { name: "Almond Nude", hex: "#d8b295", image: "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80" },
      { name: "Slate Black", hex: "#222222", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80" }
    ],
    sizes: ["34C", "34D", "36C", "36D", "38C", "38D", "40C", "40D", "42D"],
    cupSizes: ["C", "D"],
    bandSizes: ["34", "36", "38", "40", "42"],
    images: [
      "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80"
    ],
    crossSells: ["mc-acc-02", "mc-acc-03"]
  },
  {
    id: "mc-bra-05",
    title: "100% Organic Breathable Cotton Daily Bra",
    category: "bras",
    subCategory: "Cotton Bras",
    price: 1250,
    originalPrice: 1550,
    rating: 4.7,
    reviewsCount: 184,
    badge: "100% Cotton",
    badgeColor: "emerald",
    inStock: true,
    stockCount: 30,
    isFeatured: false,
    description: "Pure combed organic cotton bra designed for hot Pakistani summers. Double layered non-padded cups without wires for total skin breathability and all-day sweat-wicking comfort.",
    fabric: "95% Combed Organic Cotton, 5% Lycra",
    colors: [
      { name: "Pure White", hex: "#ffffff", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80" },
      { name: "Skin Beige", hex: "#deb89d", image: "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&w=800&q=80" },
      { name: "Soft Lilac", hex: "#d8c4d8", image: "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80" }
    ],
    sizes: ["32B", "34B", "34C", "36B", "36C", "38B", "38C", "40B", "40C"],
    cupSizes: ["B", "C"],
    bandSizes: ["32", "34", "36", "38", "40"],
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&w=800&q=80"
    ],
    crossSells: ["mc-panty-02", "mc-acc-03"]
  },
  {
    id: "mc-bra-06",
    title: "High-Impact Active Racerback Sports Bra",
    category: "bras",
    subCategory: "Sports Bras",
    price: 2250,
    originalPrice: 2800,
    rating: 4.8,
    reviewsCount: 77,
    badge: "Athletic",
    badgeColor: "rose",
    inStock: true,
    stockCount: 16,
    isFeatured: false,
    description: "Maximum bounce control with compression cups, breathable mesh back panel, and wide ergonomic shoulder straps. Perfect for workouts, jogging, and yoga.",
    fabric: "75% Polyester, 25% Spandex Quick-Dry Tech",
    colors: [
      { name: "Onyx Black", hex: "#1a1a1a", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80" },
      { name: "Rose Plum", hex: "#834053", image: "https://images.unsplash.com/photo-1616150840617-a0684f0f089d?auto=format&fit=crop&w=800&q=80" }
    ],
    sizes: ["32B", "34B", "34C", "36B", "36C", "38C"],
    cupSizes: ["B", "C"],
    bandSizes: ["32", "34", "36", "38"],
    images: [
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
    ],
    crossSells: ["mc-acc-01", "mc-acc-03"]
  },

  // --- PANTIES ---
  {
    id: "mc-panty-01",
    title: "Laser-Cut Ultra-Seamless No-Show Panties (Pack of 3)",
    category: "panties",
    subCategory: "Seamless Panties",
    price: 1450,
    originalPrice: 1950,
    rating: 4.9,
    reviewsCount: 168,
    badge: "Pack of 3",
    badgeColor: "rose",
    inStock: true,
    stockCount: 35,
    isFeatured: true,
    description: "Zero panty lines guaranteed. Ultra-thin laser-cut edges with bonded seams, moisture-wicking stretch fabric, and a 100% natural cotton gusset for optimal hygiene.",
    fabric: "80% Nylon, 20% Elastane with 100% Cotton Gusset",
    colors: [
      { name: "Nude, Black & Rose Set", hex: "#deb89d", image: "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
    ],
    crossSells: ["mc-bra-01", "mc-acc-03"]
  },
  {
    id: "mc-panty-02",
    title: "Breathable Combed Cotton High-Waist Briefs (Pack of 3)",
    category: "panties",
    subCategory: "Cotton Panties",
    price: 1250,
    originalPrice: 1600,
    rating: 4.8,
    reviewsCount: 134,
    badge: "Everyday Essential",
    badgeColor: "amber",
    inStock: true,
    stockCount: 40,
    isFeatured: false,
    description: "Full coverage high-rise fit that sits softly on the natural waistline. Non-binding waistband and gentle leg elastic that won't pinch or roll down.",
    fabric: "95% Combed Cotton, 5% Spandex",
    colors: [
      { name: "Peach, White & Powder Blue Set", hex: "#fed7aa", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80"
    ],
    crossSells: ["mc-bra-05", "mc-acc-03"]
  },
  {
    id: "mc-panty-03",
    title: "French Scalloped Lace Bikini Panty",
    category: "panties",
    subCategory: "Lace Panties",
    price: 850,
    originalPrice: 1100,
    rating: 4.7,
    reviewsCount: 92,
    badge: "Luxury Lace",
    badgeColor: "rose",
    inStock: true,
    stockCount: 22,
    isFeatured: true,
    description: "Delicate floral lace bikini panty with cheeky back cut and scalloped edge trims. Soft interior lining ensures irritation-free comfort against delicate skin.",
    fabric: "88% Polyamide Lace, 12% Spandex",
    colors: [
      { name: "Wine Maroon", hex: "#8b1538", image: "https://images.unsplash.com/photo-1616150840617-a0684f0f089d?auto=format&fit=crop&w=800&q=80" },
      { name: "Jet Black", hex: "#111111", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1616150840617-a0684f0f089d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80"
    ],
    crossSells: ["mc-bra-02", "mc-acc-01"]
  },
  {
    id: "mc-panty-04",
    title: "Anti-Chafing Soft Modal Boyshort Underwear",
    category: "panties",
    subCategory: "Boyshorts",
    price: 950,
    originalPrice: 1300,
    rating: 4.9,
    reviewsCount: 65,
    badge: "Anti-Chafe",
    badgeColor: "emerald",
    inStock: true,
    stockCount: 19,
    isFeatured: false,
    description: "Extended leg length prevents inner-thigh friction under dresses, eastern lawn suits, and trousers. Made of cooling bamboo modal with natural antibacterial properties.",
    fabric: "92% Bamboo Modal, 8% Spandex",
    colors: [
      { name: "Skin Nude", hex: "#deb89d", image: "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&w=800&q=80" },
      { name: "Deep Charcoal", hex: "#27272a", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80"
    ],
    crossSells: ["mc-shape-03", "mc-acc-03"]
  },

  // --- BRIDAL & LUXURY SETS ---
  {
    id: "mc-bridal-01",
    title: "Royal Crimson Velvet & Lace 4-Piece Bridal Lingerie Set",
    category: "bridal",
    subCategory: "Bridal Sets",
    price: 5450,
    originalPrice: 7200,
    rating: 5.0,
    reviewsCount: 84,
    badge: "Bridal Exclusive",
    badgeColor: "rose",
    inStock: true,
    stockCount: 8,
    isFeatured: true,
    description: "The crown jewel of our bridal trousseau. Handcrafted rich crimson embroidery with shimmering accents. Includes underwire plunge bra, matching scalloped panty, adjustable garter belt, and sheer stockings in a luxury satin gift box.",
    fabric: "Silk-Touch Satin, Metallic Embroidered Chantilly Lace",
    colors: [
      { name: "Royal Crimson", hex: "#7a0c2e", image: "https://images.unsplash.com/photo-1616150840617-a0684f0f089d?auto=format&fit=crop&w=800&q=80" },
      { name: "Midnight Black", hex: "#111111", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80" }
    ],
    sizes: ["32B", "34B", "34C", "36B", "36C", "38C"],
    cupSizes: ["B", "C"],
    bandSizes: ["32", "34", "36", "38"],
    images: [
      "https://images.unsplash.com/photo-1616150840617-a0684f0f089d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80"
    ],
    crossSells: ["mc-bridal-02", "mc-acc-01"]
  },
  {
    id: "mc-bridal-02",
    title: "Ethereal Pearl White Silk & Lace Bridal Chemise Set",
    category: "bridal",
    subCategory: "Bridal Gowns",
    price: 4250,
    originalPrice: 5600,
    rating: 4.9,
    reviewsCount: 51,
    badge: "Honeymoon Special",
    badgeColor: "rose",
    inStock: true,
    stockCount: 11,
    isFeatured: true,
    description: "Sensuous pearlescent white night chemise with delicate eyelash lace cups, criss-cross back straps, and matching high-slit sheer kimono robe. Comes with discreet privacy storage sleeve.",
    fabric: "95% Silk Satin, 5% Lace",
    colors: [
      { name: "Pearl White", hex: "#ffffff", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80" },
      { name: "Blush Rose", hex: "#f3c5c9", image: "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80"
    ],
    crossSells: ["mc-bridal-01", "mc-acc-01"]
  },
  {
    id: "mc-bridal-03",
    title: "Rose Gold Embroidered Sheer Babydoll & G-String Set",
    category: "bridal",
    subCategory: "Babydolls",
    price: 3650,
    originalPrice: 4800,
    rating: 4.8,
    reviewsCount: 39,
    badge: "Luxury",
    badgeColor: "amber",
    inStock: true,
    stockCount: 9,
    isFeatured: false,
    description: "Semi-sheer mesh babydoll with rose gold floral threadwork, flowing empire waist silhouette, and matching delicate G-string. Flattering and romantic.",
    fabric: "100% Sheer Polyamide Mesh & Embroidered Lace",
    colors: [
      { name: "Dusty Rose Gold", hex: "#c98f98", image: "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80" },
      { name: "Raven Black", hex: "#1c1917", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80"
    ],
    crossSells: ["mc-acc-01", "mc-night-03"]
  },

  // --- SLEEPWEAR & NIGHTWEAR ---
  {
    id: "mc-night-01",
    title: "Mulberry Silk Touch 3-Piece Pajama Set with Lace Robe",
    category: "nightwear",
    subCategory: "Pajama Sets",
    price: 4650,
    originalPrice: 5900,
    rating: 4.9,
    reviewsCount: 112,
    badge: "Top Rated",
    badgeColor: "rose",
    inStock: true,
    stockCount: 15,
    isFeatured: true,
    description: "Indulgent 3-piece luxury sleep ensemble featuring a lace-trimmed camisole top, relaxed fluid trousers, and a tie-waist satin kimono robe. Non-static, breathable, and silky smooth.",
    fabric: "High-Grade Mulberry Satin Finish (Anti-Static)",
    colors: [
      { name: "Champagne Gold", hex: "#e8d8b8", image: "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&w=800&q=80" },
      { name: "Dusty Rose", hex: "#c27d88", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80" },
      { name: "Midnight Navy", hex: "#1e293b", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
    ],
    crossSells: ["mc-night-03", "mc-acc-01"]
  },
  {
    id: "mc-night-02",
    title: "Premium Modal Cotton Button-Down Long Sleepshirt",
    category: "nightwear",
    subCategory: "Sleepshirts",
    price: 2950,
    originalPrice: 3800,
    rating: 4.8,
    reviewsCount: 78,
    badge: "Ultra Soft",
    badgeColor: "emerald",
    inStock: true,
    stockCount: 20,
    isFeatured: false,
    description: "Classic boyfriend cut sleepshirt crafted in whisper-soft Austrian modal cotton. Contrast piped lapel collar, chest pocket, and curved hem for effortless lounging.",
    fabric: "95% Lenzing Modal, 5% Spandex",
    colors: [
      { name: "Powder Blue Striped", hex: "#bfdbfe", image: "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80" },
      { name: "Soft Blush", hex: "#fbcfe8", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
    ],
    crossSells: ["mc-acc-03", "mc-panty-01"]
  },
  {
    id: "mc-night-03",
    title: "Silky Satin Cami & Shorts Loungewear Set",
    category: "nightwear",
    subCategory: "Cami Sets",
    price: 2450,
    originalPrice: 3100,
    rating: 4.7,
    reviewsCount: 63,
    badge: "Sale",
    badgeColor: "red",
    inStock: true,
    stockCount: 17,
    isFeatured: false,
    description: "Flirty and comfortable 2-piece cami shorts set. V-neckline with delicate eyelash lace inset, adjustable skinny straps, and elastic waist dolphin-hem tap shorts.",
    fabric: "100% Poly-Satin Sheen",
    colors: [
      { name: "Emerald Green", hex: "#065f46", image: "https://images.unsplash.com/photo-1616150840617-a0684f0f089d?auto=format&fit=crop&w=800&q=80" },
      { name: "Ruby Maroon", hex: "#881337", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1616150840617-a0684f0f089d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80"
    ],
    crossSells: ["mc-night-01", "mc-acc-01"]
  },

  // --- SHAPEWEAR ---
  {
    id: "mc-shape-01",
    title: "360° Firm Control High-Waist Tummy Tucker Shaper",
    category: "shapewear",
    subCategory: "Tummy Shapers",
    price: 2150,
    originalPrice: 2850,
    rating: 4.9,
    reviewsCount: 220,
    badge: "Bestseller",
    badgeColor: "rose",
    inStock: true,
    stockCount: 28,
    isFeatured: true,
    description: "Instantly flattens the tummy and sculpts the waistline by up to 2 dress sizes. Equipped with four flexible steel spiral bones to prevent roll-down, and seamless laser leg openings.",
    fabric: "80% Nylon Power-Compress, 20% Spandex with Cotton Lining",
    colors: [
      { name: "Natural Nude", hex: "#deb89d", image: "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&w=800&q=80" },
      { name: "Jet Black", hex: "#111111", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80" }
    ],
    sizes: ["M", "L", "XL", "XXL", "3XL"],
    images: [
      "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80"
    ],
    crossSells: ["mc-shape-02", "mc-acc-01"]
  },
  {
    id: "mc-shape-02",
    title: "All-Day Sculpting Seamless Bodysuit Open-Bust Shaper",
    category: "shapewear",
    subCategory: "Full Bodysuits",
    price: 3450,
    originalPrice: 4400,
    rating: 4.8,
    reviewsCount: 88,
    badge: "Full Body",
    badgeColor: "amber",
    inStock: true,
    stockCount: 14,
    isFeatured: true,
    description: "Wear with your favorite bra! Open-bust U-shape lifts the bustline while firm compression zones contour the midriff, back, hips, and tummy. Features a convenient hook-and-eye bathroom gusset.",
    fabric: "82% Polyamide, 18% Elastane High-Recovery Stretch",
    colors: [
      { name: "Beige Skin", hex: "#d8b295", image: "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80" },
      { name: "Classic Black", hex: "#18181b", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80"
    ],
    crossSells: ["mc-bra-03", "mc-acc-01"]
  },
  {
    id: "mc-shape-03",
    title: "High-Waist Thigh Slimmer & Anti-Chafe Shaper Shorts",
    category: "shapewear",
    subCategory: "Thigh Shapers",
    price: 1950,
    originalPrice: 2500,
    rating: 4.8,
    reviewsCount: 74,
    badge: "Anti-Chafe",
    badgeColor: "emerald",
    inStock: true,
    stockCount: 20,
    isFeatured: false,
    description: "Smooths hips and thighs without squeezing too tight. Prevents inner-thigh chafing during summer while offering gentle moderate tummy support under lawn kurtas.",
    fabric: "85% Microfiber, 15% Spandex",
    colors: [
      { name: "Skin Nude", hex: "#deb89d", image: "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&w=800&q=80" },
      { name: "Onyx Black", hex: "#111111", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80"
    ],
    crossSells: ["mc-panty-04", "mc-acc-03"]
  },

  // --- ACCESSORIES ---
  {
    id: "mc-acc-01",
    title: "Invisible Reusable Silicone Push-Up Nipple Covers (2 Pairs)",
    category: "accessories",
    subCategory: "Nipple Covers",
    price: 950,
    originalPrice: 1350,
    rating: 4.9,
    reviewsCount: 156,
    badge: "Must Have",
    badgeColor: "rose",
    inStock: true,
    stockCount: 45,
    isFeatured: true,
    description: "Medical-grade hypoallergenic silicone pasties with ultra-thin tapered edges that blend seamlessly with any skin tone. Washable and reusable up to 30 times.",
    fabric: "100% Medical Bio-Silicone Adhesive",
    colors: [
      { name: "Skin Tone", hex: "#deb89d", image: "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80" }
    ],
    sizes: ["One Size"],
    images: [
      "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
    ],
    crossSells: ["mc-acc-02", "mc-acc-03"]
  },
  {
    id: "mc-acc-02",
    title: "Soft Elastic Bra Strap Extenders (Set of 3: Black, Skin & White)",
    category: "accessories",
    subCategory: "Extenders",
    price: 650,
    originalPrice: 900,
    rating: 4.9,
    reviewsCount: 88,
    badge: "Comfort Kit",
    badgeColor: "amber",
    inStock: true,
    stockCount: 50,
    isFeatured: false,
    description: "Adds up to 2 inches of extra band breathing room to any tight bra. Standard 2-hook and 3-hook compatible plush micro-fiber with stainless steel hooks.",
    fabric: "Soft Microfiber with Stainless Steel Hooks",
    colors: [
      { name: "Trio Pack (Skin, White, Black)", hex: "#d1d5db", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80" }
    ],
    sizes: ["3-Hook Standard"],
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&w=800&q=80"
    ],
    crossSells: ["mc-acc-01", "mc-acc-03"]
  },
  {
    id: "mc-acc-03",
    title: "Protective Delicates & Bra Washing Mesh Bag (Pack of 2)",
    category: "accessories",
    subCategory: "Care & Wash",
    price: 750,
    originalPrice: 1000,
    rating: 4.8,
    reviewsCount: 62,
    badge: "Care Essential",
    badgeColor: "emerald",
    inStock: true,
    stockCount: 35,
    isFeatured: false,
    description: "Prevents underwires from bending, straps from tangling, and delicate lace from tearing in washing machines. Features rust-proof hidden zipper lock and durable honeycomb mesh.",
    fabric: "Reinforced Honeycomb Breathable Polyester Mesh",
    colors: [
      { name: "Clean White", hex: "#ffffff", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80" }
    ],
    sizes: ["Pack of 2"],
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80"
    ],
    crossSells: ["mc-acc-01", "mc-acc-02"]
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { DEFAULT_PRODUCTS };
}
