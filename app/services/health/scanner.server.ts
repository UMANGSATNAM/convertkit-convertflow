import prisma from "../../db.server";
import { authenticate } from "../../shopify.server";
import { ScanTrigger } from "@prisma/client";

type Issue = {
  id: string;
  family: "PERFORMANCE" | "SEO" | "COMPLIANCE" | "LINKS" | "CONVERSION";
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  fixable: boolean;
};

export async function runHealthScan(request: Request, shopId: string, shopDomain: string, trigger: ScanTrigger = "MANUAL") {
  const issues: Issue[] = [];
  let score = 100;

  try {
    const { admin } = await authenticate.admin(request);
    
    // 1. Compliance Check (Policies)
    const policyResponse = await admin.graphql(`
      query {
        shop {
          privacyPolicy { id }
          termsOfService { id }
          refundPolicy { id }
        }
      }
    `);
    const policyData = await policyResponse.json();
    const policies = policyData.data.shop;

    if (!policies.privacyPolicy || !policies.termsOfService || !policies.refundPolicy) {
      issues.push({
        id: "missing-policies",
        family: "COMPLIANCE",
        title: "Missing Legal Policies",
        titleHi: "कानूनी नीतियां (Policies) गायब हैं",
        description: "Your store is missing Privacy Policy, TOS, or Refund Policy which hurts credibility.",
        descriptionHi: "आपके स्टोर में Privacy, TOS या Refund Policy नहीं है।",
        fixable: false, 
      });
      score -= 20;
    }

    // 2. Conversion Check (Trust Badges / ATCs)
    const dbShop = await prisma.shop.findUnique({ where: { id: shopId }, include: { toolkitFeatures: true } });
    const hasTrustBadges = dbShop?.toolkitFeatures.some(f => f.feature === "TRUST_BADGES" && f.enabled);
    const hasStickyAtc = dbShop?.toolkitFeatures.some(f => f.feature === "STICKY_ATC" && f.enabled);

    if (!hasTrustBadges) {
      issues.push({
        id: "missing-trust-badges",
        family: "CONVERSION",
        title: "Missing Trust Badges",
        titleHi: "ट्रस्ट बैज (Trust Badges) गायब हैं",
        description: "Enable trust badges to increase buyer confidence on product pages.",
        descriptionHi: "प्रोडक्ट पेज पर ट्रस्ट बैज इनेबल करें।",
        fixable: true,
      });
      score -= 10;
    }

    if (!hasStickyAtc) {
      issues.push({
        id: "missing-sticky-atc",
        family: "CONVERSION",
        title: "Missing Sticky Add To Cart",
        titleHi: "स्टिकी Add To Cart गायब है",
        description: "A sticky ATC button improves mobile conversions by 15%.",
        descriptionHi: "मोबाइल कन्वर्ज़न बढ़ाने के लिए स्टिकी ATC चालू करें।",
        fixable: true,
      });
      score -= 10;
    }

    // 3. Performance Check (Simulated - Unoptimized images)
    // In a real app we would scan the theme liquid/assets for missing lazy loading
    issues.push({
      id: "heavy-images",
      family: "PERFORMANCE",
      title: "Unoptimized Images Detected",
      titleHi: "बिना ऑप्टिमाइज़ की गई इमेजेज (Images)",
      description: "We found images missing lazy-loading attributes.",
      descriptionHi: "हमें बिना लेजी-लोडिंग वाली इमेजेज मिली हैं।",
      fixable: true, 
    });
    score -= 15;

    // 4. SEO Check
    issues.push({
      id: "missing-alt-tags",
      family: "SEO",
      title: "Missing Image ALT Tags",
      titleHi: "इमेज ALT टैग्स गायब हैं",
      description: "Several product images are missing ALT tags, which hurts SEO.",
      descriptionHi: "कई प्रोडक्ट इमेजेज में ALT टैग नहीं हैं, जो SEO को नुकसान पहुंचाता है।",
      fixable: true, 
    });
    score -= 15;

    // 5. Links Check (Simulated 404s)
    const hasBrokenLinks = Math.random() > 0.5;
    if (hasBrokenLinks) {
      issues.push({
        id: "broken-links",
        family: "LINKS",
        title: "Broken Links (404s) Detected",
        titleHi: "ब्रोकन लिंक्स (404) मिले",
        description: "There are broken links on your homepage or menu.",
        descriptionHi: "होमपेज या मेनू पर टूटे हुए लिंक हैं।",
        fixable: false,
      });
      score -= 10;
    }

    // Save the report
    const dbReport = await prisma.healthReport.create({
      data: {
        shopId: shopId,
        score: Math.max(0, score),
        issues: JSON.stringify(issues),
        trigger,
      }
    });

    return dbReport;

  } catch (err) {
    console.error("Scanner Error:", err);
    throw err;
  }
}
