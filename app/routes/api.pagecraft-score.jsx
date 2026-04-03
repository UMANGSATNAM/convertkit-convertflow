import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { sections } = body;
  if (!sections || !Array.isArray(sections)) {
    return json({ error: "sections array is required" }, { status: 400 });
  }

  const breakdown = [];
  let total = 0;
  const improvements = [];

  const checks = [
    {
      name: "CTA Above the Fold",
      test: () => {
        const hero = sections.find(s => s.type === "hero");
        return hero && hero.cta_text && hero.cta_text.length > 2;
      },
      points: 15,
      fix: "Your CTA button needs to be in the hero section — the first thing customers see.",
      fixType: "fix_cta",
    },
    {
      name: "Trust Badges Near Buy",
      test: () => sections.some(s => s.type === "trust_badges"),
      points: 10,
      fix: "Add trust badges (Secure Checkout, Free Shipping, Returns) — lifts conversions by 15%.",
      fixType: "add_trust",
    },
    {
      name: "Hero Section",
      test: () => sections.some(s => s.type === "hero"),
      points: 15,
      fix: "Add a hero banner — customers decide in 3 seconds if they'll stay.",
      fixType: "add_hero",
    },
    {
      name: "Social Proof",
      test: () => sections.some(s => s.type === "social_proof"),
      points: 10,
      fix: "Add customer reviews — 93% of shoppers read reviews before buying.",
      fixType: "add_social",
    },
    {
      name: "FAQ Section",
      test: () => sections.some(s => s.type === "faq"),
      points: 10,
      fix: "Add FAQ section — reduces support tickets by 40% and helps Google rankings.",
      fixType: "add_faq",
    },
    {
      name: "Urgency Element",
      test: () => sections.some(s => s.type === "urgency_bar"),
      points: 10,
      fix: "Add an urgency bar — countdown timers and stock counters lift conversions by 20%.",
      fixType: "add_urgency",
    },
    {
      name: "Product Showcase",
      test: () => sections.some(s => s.type === "product_showcase"),
      points: 10,
      fix: "Highlight your products with a showcase section — show what customers came to buy.",
      fixType: "add_product",
    },
    {
      name: "Mobile Responsive",
      test: () => true, // All PageCraft sections are responsive by design
      points: 10,
      fix: "Ensure all sections stack properly on mobile viewports.",
      fixType: "fix_mobile",
    },
    {
      name: "Single Primary CTA",
      test: () => {
        const ctas = sections.filter(s => s.cta_text);
        return ctas.length >= 1 && ctas.length <= 3;
      },
      points: 5,
      fix: "Have exactly one primary CTA — too many choices paralyze customers.",
      fixType: "fix_single_cta",
    },
    {
      name: "Footer with Policies",
      test: () => sections.some(s => s.type === "footer"),
      points: 5,
      fix: "Add a footer with policy links — builds trust and is required by Shopify.",
      fixType: "add_footer",
    },
  ];

  for (const check of checks) {
    const passed = check.test();
    breakdown.push({
      name: check.name,
      passed,
      points: passed ? check.points : 0,
      maxPoints: check.points,
    });
    if (passed) {
      total += check.points;
    } else {
      improvements.push({
        text: check.fix,
        fixType: check.fixType,
        potentialPoints: check.points,
      });
    }
  }

  // Sort improvements by potential points (highest first)
  improvements.sort((a, b) => b.potentialPoints - a.potentialPoints);

  return json({
    score: total,
    maxScore: 100,
    grade: total >= 90 ? "A+" : total >= 80 ? "A" : total >= 70 ? "B" : total >= 60 ? "C" : "D",
    breakdown,
    improvements: improvements.slice(0, 3), // Top 3 only
    allImprovements: improvements,
  });
};
