export interface HealthScore {
  total: number;
  seo: number;
  accessibility: number;
  mobile: number;
  cro: number;
  validation: number;
}

export function calculateHealthScore(
  templateIndex: any,
  validationErrors: number
): HealthScore {
  // Base scores
  let seo = 80;
  let accessibility = 80;
  let mobile = 80;
  let cro = 50;
  let validation = Math.max(0, 100 - (validationErrors * 20));

  if (templateIndex && templateIndex.sections) {
    const sections = Object.values(templateIndex.sections) as Array<any>;
    const types = sections.map(s => s.type || "");

    // CRO Boosts
    if (types.some(t => t.includes("hero"))) cro += 15;
    if (types.some(t => t.includes("trust"))) cro += 15;
    if (types.some(t => t.includes("reviews"))) cro += 10;
    if (types.some(t => t.includes("faq"))) cro += 10;

    // SEO Boosts
    if (types.some(t => t.includes("seo") || t.includes("content"))) seo += 20;

    // Accessibility Boosts (assumed from having proper components)
    if (types.length > 3) accessibility += 20;

    // Mobile Boosts (assumed from standard registry components)
    if (types.length > 2) mobile += 20;
  }

  // Cap at 100
  seo = Math.min(100, seo);
  accessibility = Math.min(100, accessibility);
  mobile = Math.min(100, mobile);
  cro = Math.min(100, cro);

  // Health = SEO * 0.20 + Accessibility * 0.20 + Mobile * 0.20 + CRO * 0.30 + Validation * 0.10
  const total = Math.round(
    (seo * 0.20) + 
    (accessibility * 0.20) + 
    (mobile * 0.20) + 
    (cro * 0.30) + 
    (validation * 0.10)
  );

  return { total, seo, accessibility, mobile, cro, validation };
}
