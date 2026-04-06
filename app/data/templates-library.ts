// Templates Library — Pre-built page templates for the builder
import { createNode, generateNodeId } from "./page-tree";
import type { PageTree } from "./page-tree";

export interface PageTemplate {
  id: string;
  name: string;
  category: "landing" | "home" | "product" | "collection" | "blog" | "custom";
  industry: string;
  thumbnail: string;
  isPremium: boolean;
  description: string;
  buildTree: () => PageTree;
}

function makeTree(title: string, slug: string, nodes: ReturnType<typeof createNode>[]): PageTree {
  const now = new Date().toISOString();
  return {
    id: generateNodeId("page"), title, slug,
    seoTitle: title, seoDescription: `${title} - Premium page built with PageCraft`,
    globalStyles: { fontFamily: "'Inter', sans-serif", primaryColor: "#10B981", secondaryColor: "#0F172A", bodyColor: "#64748B", headingColor: "#1E293B", backgroundColor: "#FFFFFF", maxWidth: 1200 },
    nodes, createdAt: now, updatedAt: now,
  };
}

function heroSection(headline: string, subtext: string, ctaText: string, bgColor: string, ctaColor: string) {
  const sec = createNode("section", { fullWidth: true, backgroundColor: bgColor, paddingTop: 80, paddingBottom: 80 });
  const row = createNode("row", { columns: "2", gap: 48, alignItems: "center" }, sec.id);
  const leftCol = createNode("column", { verticalAlign: "center" }, row.id);
  const rightCol = createNode("column", { verticalAlign: "center" }, row.id);
  leftCol.children = [
    createNode("heading", { text: headline, tag: "h1", fontSize: 48, fontWeight: "800", color: "#FFFFFF", lineHeight: 1.1 }, leftCol.id),
    createNode("paragraph", { text: subtext, fontSize: 18, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }, leftCol.id),
    createNode("button", { text: ctaText, url: "/collections/all", backgroundColor: ctaColor, textColor: "#FFFFFF", fontSize: 16, fontWeight: "700", paddingX: 32, paddingY: 14, borderRadius: 8 }, leftCol.id),
  ];
  rightCol.children = [
    createNode("image", { src: "", alt: "Hero", width: "100%", height: "400px", objectFit: "cover", borderRadius: 12 }, rightCol.id),
  ];
  row.children = [leftCol, rightCol];
  sec.children = [row];
  return sec;
}

function trustSection() {
  const sec = createNode("section", { backgroundColor: "#F8FAFC", paddingTop: 32, paddingBottom: 32 });
  sec.children = [
    createNode("trust_badges", {
      badges: [{ icon: "shield", label: "Secure Checkout" }, { icon: "truck", label: "Free Shipping" }, { icon: "refresh", label: "30-Day Returns" }, { icon: "star", label: "5-Star Rated" }],
      layout: "horizontal", iconSize: 28, backgroundColor: "#F8FAFC",
    }, sec.id),
  ];
  return sec;
}

function testimonialsSection(bgColor = "#FFFFFF") {
  const sec = createNode("section", { backgroundColor: bgColor, paddingTop: 60, paddingBottom: 60 });
  sec.children = [
    createNode("heading", { text: "What Our Customers Say", tag: "h2", fontSize: 32, fontWeight: "700", color: "#1E293B", textAlign: "center" }, sec.id),
    createNode("spacer", { height: 32 }, sec.id),
    createNode("testimonial", {
      reviews: [
        { name: "Sarah M.", rating: 5, text: "Absolutely love this! Changed my routine completely.", location: "New York" },
        { name: "James K.", rating: 5, text: "Best purchase I've made. Highly recommend!", location: "LA" },
        { name: "Emily R.", rating: 4, text: "Great quality. Customer service is top notch.", location: "Chicago" },
      ], layout: "cards", columns: "3",
    }, sec.id),
  ];
  return sec;
}

function faqSection() {
  const sec = createNode("section", { backgroundColor: "#FFFFFF", paddingTop: 60, paddingBottom: 60 });
  sec.children = [
    createNode("heading", { text: "Frequently Asked Questions", tag: "h2", fontSize: 32, fontWeight: "700", color: "#1E293B", textAlign: "center" }, sec.id),
    createNode("spacer", { height: 24 }, sec.id),
    createNode("faq_accordion", {
      items: [
        { question: "How long does shipping take?", answer: "Standard shipping takes 3-5 business days. Express available at checkout." },
        { question: "What is your return policy?", answer: "30-day money-back guarantee on all products. No questions asked." },
        { question: "Do you ship internationally?", answer: "Yes! We ship to over 50 countries worldwide with tracked delivery." },
      ], accentColor: "#10B981",
    }, sec.id),
  ];
  return sec;
}

function ctaSection(headline: string, subtext: string, ctaText: string, bgColor: string) {
  const sec = createNode("section", { backgroundColor: bgColor, paddingTop: 60, paddingBottom: 60 });
  sec.children = [
    createNode("heading", { text: headline, tag: "h2", fontSize: 36, fontWeight: "800", color: "#FFFFFF", textAlign: "center" }, sec.id),
    createNode("paragraph", { text: subtext, fontSize: 16, color: "rgba(255,255,255,0.7)", textAlign: "center" }, sec.id),
    createNode("spacer", { height: 16 }, sec.id),
    createNode("button", { text: ctaText, url: "/collections/all", backgroundColor: "#FFFFFF", textColor: bgColor, fontSize: 16, fontWeight: "700", paddingX: 36, paddingY: 16, borderRadius: 8, align: "center" }, sec.id),
  ];
  return sec;
}

function newsletterSection() {
  const sec = createNode("section", { backgroundColor: "#0F172A", paddingTop: 60, paddingBottom: 60 });
  sec.children = [
    createNode("newsletter", {
      headline: "Stay in the Loop", subtext: "Get 10% off your first order when you subscribe.",
      placeholder: "Enter your email", buttonText: "Subscribe", buttonColor: "#10B981",
      backgroundColor: "#0F172A", textColor: "#FFFFFF",
    }, sec.id),
  ];
  return sec;
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: "landing_modern", name: "Modern Landing Page", category: "landing", industry: "General",
    thumbnail: "", isPremium: false,
    description: "Clean, conversion-focused landing page with hero, trust, testimonials, FAQ, and CTA.",
    buildTree: () => makeTree("Modern Landing Page", "landing", [
      heroSection("Welcome to Our Store", "Discover premium products crafted just for you. Quality that speaks for itself.", "Shop Now", "#0F172A", "#10B981"),
      trustSection(),
      testimonialsSection(),
      faqSection(),
      ctaSection("Ready to Get Started?", "Join thousands of happy customers today.", "Shop Collection", "#10B981"),
      newsletterSection(),
    ]),
  },
  {
    id: "landing_bold", name: "Bold Launch Page", category: "landing", industry: "General",
    thumbnail: "", isPremium: false,
    description: "High-impact launch page with urgency elements and strong CTA.",
    buildTree: () => makeTree("Bold Launch Page", "launch", [
      heroSection("The Future is Here", "Revolutionary products that change everything. Limited first-batch available.", "Reserve Yours Now", "#1E293B", "#EF4444"),
      trustSection(),
      (() => {
        const sec = createNode("section", { backgroundColor: "#FFFFFF", paddingTop: 60, paddingBottom: 60 });
        sec.children = [
          createNode("heading", { text: "Why Choose Us", tag: "h2", fontSize: 36, fontWeight: "700", color: "#1E293B", textAlign: "center" }, sec.id),
          createNode("spacer", { height: 32 }, sec.id),
          createNode("countdown_timer", { headline: "Launch Sale Ends In", endDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16), accentColor: "#EF4444", textColor: "#FFFFFF", backgroundColor: "#1E293B" }, sec.id),
        ];
        return sec;
      })(),
      testimonialsSection("#F8FAFC"),
      faqSection(),
      ctaSection("Don't Miss Out", "Limited stock available. Order now before it's gone.", "Buy Now", "#EF4444"),
    ]),
  },
  {
    id: "landing_skincare", name: "Skincare Landing", category: "landing", industry: "Beauty",
    thumbnail: "", isPremium: false,
    description: "Elegant skincare landing page with soft tones and premium feel.",
    buildTree: () => makeTree("Skincare Landing", "skincare", [
      heroSection("Glow From Within", "Science-backed skincare that delivers visible results in 14 days.", "Discover Your Routine", "#1C1917", "#D4A574"),
      trustSection(),
      (() => {
        const sec = createNode("section", { backgroundColor: "#FFFBF5", paddingTop: 60, paddingBottom: 60 });
        const row = createNode("row", { columns: "2", gap: 48, alignItems: "center" }, sec.id);
        const left = createNode("column", { verticalAlign: "center" }, row.id);
        const right = createNode("column", { verticalAlign: "center" }, row.id);
        left.children = [createNode("image", { src: "", alt: "Product", width: "100%", height: "500px", objectFit: "cover", borderRadius: 16 }, left.id)];
        right.children = [
          createNode("heading", { text: "The Science of Beautiful Skin", tag: "h2", fontSize: 32, fontWeight: "700", color: "#1C1917" }, right.id),
          createNode("paragraph", { text: "Our formula combines retinol, hyaluronic acid, and vitamin C in perfect balance. Clinically tested and dermatologist-approved.", fontSize: 16, color: "#78716C", lineHeight: 1.8 }, right.id),
          createNode("button", { text: "Learn More", url: "/pages/about", backgroundColor: "#D4A574", textColor: "#FFFFFF", borderRadius: 4, paddingX: 28, paddingY: 12 }, right.id),
        ];
        row.children = [left, right];
        sec.children = [row];
        return sec;
      })(),
      testimonialsSection(),
      faqSection(),
      ctaSection("Start Your Skincare Journey", "Free shipping on your first order. 30-day satisfaction guarantee.", "Shop Now", "#1C1917"),
    ]),
  },
  {
    id: "landing_fitness", name: "Fitness Landing", category: "landing", industry: "Fitness",
    thumbnail: "", isPremium: false,
    description: "High-energy fitness landing page with bold typography and strong CTAs.",
    buildTree: () => makeTree("Fitness Landing", "fitness", [
      heroSection("Train Harder. Live Better.", "Premium fitness gear engineered for peak performance.", "Shop Gear", "#0F172A", "#F97316"),
      trustSection(),
      testimonialsSection("#F8FAFC"),
      faqSection(),
      ctaSection("Push Your Limits", "Join 50,000+ athletes who trust our gear.", "Start Training", "#F97316"),
      newsletterSection(),
    ]),
  },
  {
    id: "landing_fashion", name: "Fashion Collection", category: "landing", industry: "Fashion",
    thumbnail: "", isPremium: false,
    description: "Minimal fashion landing with editorial layout and clean lines.",
    buildTree: () => makeTree("Fashion Collection", "fashion", [
      heroSection("New Season. New Rules.", "Discover the collection that redefines modern style.", "Shop the Collection", "#0C0A09", "#E11D48"),
      trustSection(),
      testimonialsSection(),
      ctaSection("Join the Movement", "Free returns. Free shipping over $100.", "Browse All", "#0C0A09"),
    ]),
  },
  {
    id: "landing_tech", name: "Tech Product Launch", category: "landing", industry: "Electronics",
    thumbnail: "", isPremium: true,
    description: "Sleek tech product launch page with dark theme and spec highlights.",
    buildTree: () => makeTree("Tech Launch", "tech-launch", [
      heroSection("Next-Gen Innovation", "The most advanced gadget we've ever built. Pre-order now.", "Pre-Order — $299", "#0C1021", "#3B82F6"),
      trustSection(),
      (() => {
        const sec = createNode("section", { backgroundColor: "#0C1021", paddingTop: 60, paddingBottom: 60 });
        sec.children = [
          createNode("heading", { text: "Specs That Matter", tag: "h2", fontSize: 36, fontWeight: "700", color: "#FFFFFF", textAlign: "center" }, sec.id),
          createNode("spacer", { height: 24 }, sec.id),
          createNode("table", {
            headers: ["Feature", "Ours", "Competitor"],
            rows: [["Battery", "48 hours", "24 hours"], ["Weight", "145g", "210g"], ["Display", "OLED 120Hz", "LCD 60Hz"]],
            striped: true, headerBg: "#3B82F6", headerColor: "#FFFFFF",
          }, sec.id),
        ];
        return sec;
      })(),
      testimonialsSection("#0F172A"),
      ctaSection("The Wait Is Over", "Ships worldwide. 2-year warranty included.", "Order Now", "#3B82F6"),
    ]),
  },
  {
    id: "home_general", name: "General Homepage", category: "home", industry: "General",
    thumbnail: "", isPremium: false,
    description: "Complete homepage with hero, collections, features, and newsletter.",
    buildTree: () => makeTree("Homepage", "home", [
      heroSection("Welcome to Our Store", "Premium products. Exceptional quality. Delivered to your door.", "Explore", "#0F172A", "#10B981"),
      trustSection(),
      (() => {
        const sec = createNode("section", { backgroundColor: "#FFFFFF", paddingTop: 60, paddingBottom: 60 });
        sec.children = [
          createNode("heading", { text: "Shop by Category", tag: "h2", fontSize: 32, fontWeight: "700", color: "#1E293B", textAlign: "center" }, sec.id),
          createNode("spacer", { height: 24 }, sec.id),
          createNode("collection_list", { columns: "4", showPrice: true, showTitle: true, limit: 8, collectionHandle: "" }, sec.id),
        ];
        return sec;
      })(),
      testimonialsSection("#F8FAFC"),
      faqSection(),
      newsletterSection(),
    ]),
  },
  {
    id: "product_standard", name: "Product Page", category: "product", industry: "General",
    thumbnail: "", isPremium: false,
    description: "Standard product page layout with images, details, and reviews.",
    buildTree: () => makeTree("Product Page", "product", [
      (() => {
        const sec = createNode("section", { backgroundColor: "#FFFFFF", paddingTop: 40, paddingBottom: 40 });
        sec.children = [createNode("breadcrumb", { fontSize: 13, color: "#64748B", separator: "/" }, sec.id)];
        return sec;
      })(),
      (() => {
        const sec = createNode("section", { backgroundColor: "#FFFFFF", paddingTop: 0, paddingBottom: 60 });
        const row = createNode("row", { columns: "2", gap: 48, alignItems: "flex-start" }, sec.id);
        const left = createNode("column", {}, row.id);
        const right = createNode("column", {}, row.id);
        left.children = [createNode("product_images", { layout: "thumbnails", thumbnailPosition: "bottom", zoom: true, borderRadius: 8 }, left.id)];
        right.children = [
          createNode("product_title", { tag: "h1", fontSize: 32, fontWeight: "700", color: "#1E293B" }, right.id),
          createNode("product_price", { fontSize: 24, color: "#059669", showCompare: true }, right.id),
          createNode("spacer", { height: 16 }, right.id),
          createNode("paragraph", { text: "Product description goes here...", fontSize: 15, color: "#64748B" }, right.id),
          createNode("spacer", { height: 24 }, right.id),
          createNode("add_to_cart", { buttonText: "Add to Cart", buttonColor: "#1E293B", textColor: "#FFFFFF", showQuantity: true, buttonRadius: 8 }, right.id),
          createNode("spacer", { height: 24 }, right.id),
          createNode("trust_badges", { badges: [{ icon: "shield", label: "Secure" }, { icon: "truck", label: "Free Shipping" }, { icon: "refresh", label: "Returns" }], layout: "horizontal", iconSize: 20 }, right.id),
        ];
        row.children = [left, right];
        sec.children = [row];
        return sec;
      })(),
      (() => {
        const sec = createNode("section", { backgroundColor: "#F8FAFC", paddingTop: 48, paddingBottom: 48 });
        sec.children = [createNode("tabs", {
          tabs: [
            { title: "Description", content: "Full product details here." },
            { title: "Shipping", content: "Free shipping on orders over $50." },
            { title: "Reviews", content: "Customer reviews." },
          ], accentColor: "#10B981", style: "underline",
        }, sec.id)];
        return sec;
      })(),
      testimonialsSection(),
    ]),
  },
  {
    id: "blank", name: "Blank Page", category: "custom", industry: "General",
    thumbnail: "", isPremium: false,
    description: "Start from scratch. A completely blank canvas.",
    buildTree: () => makeTree("Untitled Page", "untitled", []),
  },
  {
    id: "about_us", name: "About Us", category: "custom", industry: "General",
    thumbnail: "", isPremium: false,
    description: "Tell your brand story with an engaging about page.",
    buildTree: () => makeTree("About Us", "about-us", [
      heroSection("Our Story", "We started with a simple idea: make premium products accessible to everyone.", "Meet the Team", "#0F172A", "#10B981"),
      (() => {
        const sec = createNode("section", { backgroundColor: "#FFFFFF", paddingTop: 60, paddingBottom: 60 });
        const row = createNode("row", { columns: "2", gap: 48, alignItems: "center" }, sec.id);
        const left = createNode("column", {}, row.id);
        const right = createNode("column", {}, row.id);
        left.children = [
          createNode("heading", { text: "Our Mission", tag: "h2", fontSize: 32, fontWeight: "700", color: "#1E293B" }, left.id),
          createNode("paragraph", { text: "We believe quality should never be compromised. Every product we create goes through rigorous testing to ensure it meets our exacting standards.", fontSize: 16, color: "#64748B", lineHeight: 1.8 }, left.id),
        ];
        right.children = [createNode("image", { src: "", alt: "Our team", width: "100%", height: "350px", objectFit: "cover", borderRadius: 12 }, right.id)];
        row.children = [left, right];
        sec.children = [row];
        return sec;
      })(),
      ctaSection("Join Our Journey", "Follow us on social media for behind-the-scenes content.", "Follow Us", "#10B981"),
    ]),
  },
];

export function getTemplatesByCategory(category: string): PageTemplate[] {
  if (category === "all") return PAGE_TEMPLATES;
  return PAGE_TEMPLATES.filter((t) => t.category === category);
}

export function getTemplatesByIndustry(industry: string): PageTemplate[] {
  return PAGE_TEMPLATES.filter((t) => t.industry.toLowerCase() === industry.toLowerCase());
}

export function getTemplate(id: string): PageTemplate | undefined {
  return PAGE_TEMPLATES.find((t) => t.id === id);
}
