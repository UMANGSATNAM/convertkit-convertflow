import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { shopifyFetchWithRetry } from "../lib/shopify-fetch.server.js";

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopDomain = session.shop;
  const accessToken = session.accessToken;

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { page, storeName, whatsapp } = body;
  if (!page || !page.sections) {
    return json({ error: "page with sections is required" }, { status: 400 });
  }

  const title = page.meta?.page_title || `${storeName || "My Store"} - Home`;
  const metaDescription = page.meta?.page_description || "";
  const slug = `pagecraft-${Date.now()}`;

  // Build HTML body from sections
  let bodyHtml = buildPageHtml(page.sections);

  // Add WhatsApp floating widget if phone number provided
  if (whatsapp && whatsapp.trim()) {
    bodyHtml += buildWhatsAppWidgetHtml(whatsapp.trim(), storeName);
  }

  try {
    const res = await shopifyFetchWithRetry(
      `https://${shopDomain}/admin/api/2025-01/pages.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: {
            title,
            handle: slug,
            body_html: bodyHtml,
            published: true,
            metafields_global_title_tag: title,
            metafields_global_description_tag: metaDescription,
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Shopify page create error:", errText);
      return json({ error: "Failed to publish page to Shopify" }, { status: 500 });
    }

    const data = await res.json();
    const pageUrl = `https://${shopDomain}/pages/${data.page.handle}`;

    return json({
      success: true,
      pageId: data.page.id,
      pageUrl,
      handle: data.page.handle,
      title: data.page.title,
    });
  } catch (err) {
    console.error("Publish error:", err);
    return json({ error: "Failed to publish. Please try again." }, { status: 500 });
  }
};

function buildPageHtml(sections) {
  const parts = [];

  for (const section of sections) {
    switch (section.type) {
      case "hero":
        parts.push(buildHeroHtml(section));
        break;
      case "product_showcase":
        parts.push(buildProductShowcaseHtml(section));
        break;
      case "trust_badges":
        parts.push(buildTrustBadgesHtml(section));
        break;
      case "social_proof":
        parts.push(buildSocialProofHtml(section));
        break;
      case "faq":
        parts.push(buildFaqHtml(section));
        break;
      case "urgency_bar":
        parts.push(buildUrgencyBarHtml(section));
        break;
      case "footer":
        parts.push(buildFooterHtml(section));
        break;
      case "whatsapp_widget":
        // Handled separately via floating widget
        break;
      default:
        break;
    }
  }

  return parts.join("\n");
}

function buildHeroHtml(s) {
  const bg = s.background_gradient || s.background_color || "#0F172A";
  const ctaColor = s.cta_color || "#10B981";
  return `
<div style="background:${bg};padding:80px 24px;text-align:center;color:#fff;border-radius:12px;margin-bottom:24px;">
  <h1 style="font-size:42px;font-weight:800;margin:0 0 16px;line-height:1.1;">${escHtml(s.headline || "Welcome to our store")}</h1>
  <p style="font-size:18px;opacity:0.8;margin:0 auto 32px;max-width:560px;line-height:1.6;">${escHtml(s.subtext || "")}</p>
  ${s.cta_text ? `<a href="/collections/all" style="display:inline-block;padding:16px 40px;background:${ctaColor};color:#fff;text-decoration:none;border-radius:10px;font-weight:700;font-size:16px;transition:transform 0.2s;">${escHtml(s.cta_text)}</a>` : ""}
</div>`;
}

function buildProductShowcaseHtml(s) {
  return `
<div style="padding:48px 24px;text-align:center;margin-bottom:24px;">
  <h2 style="font-size:28px;font-weight:700;margin:0 0 8px;color:#1E293B;">${escHtml(s.headline || "Our Products")}</h2>
  <p style="color:#64748B;margin:0 0 32px;font-size:15px;">${escHtml(s.subtext || "")}</p>
  <div style="display:grid;grid-template-columns:repeat(${s.columns || 3},1fr);gap:20px;max-width:900px;margin:0 auto;">
    ${[1, 2, 3].map(i => `
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:24px;text-align:center;">
        <div style="width:100%;height:180px;background:#E2E8F0;border-radius:8px;margin-bottom:16px;display:flex;align-items:center;justify-content:center;color:#94A3B8;font-size:14px;">Product ${i}</div>
        <p style="font-weight:600;color:#1E293B;margin:0 0 4px;">Featured Product ${i}</p>
        ${s.show_prices ? `<p style="color:#059669;font-weight:700;margin:0;">$XX.XX</p>` : ""}
      </div>
    `).join("")}
  </div>
</div>`;
}

function buildTrustBadgesHtml(s) {
  const bg = s.background_color || "#F8FAFC";
  const badges = s.badges || [
    { icon: "shield", label: "Secure Checkout" },
    { icon: "truck", label: "Free Shipping" },
    { icon: "refresh", label: "30-Day Returns" },
  ];
  const iconMap = {
    shield: "&#x1F6E1;",
    truck: "&#x1F69A;",
    refresh: "&#x1F504;",
    star: "&#x2B50;",
    check: "&#x2705;",
    lock: "&#x1F512;",
    heart: "&#x2764;",
  };
  return `
<div style="background:${bg};padding:32px 24px;text-align:center;border-radius:12px;margin-bottom:24px;">
  <div style="display:flex;justify-content:center;gap:40px;flex-wrap:wrap;">
    ${badges.map(b => `
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:20px;">${iconMap[b.icon] || "&#x2705;"}</span>
        <span style="font-weight:600;font-size:14px;color:#1E293B;">${escHtml(b.label)}</span>
      </div>
    `).join("")}
  </div>
</div>`;
}

function buildSocialProofHtml(s) {
  const reviews = s.reviews || [];
  return `
<div style="padding:48px 24px;text-align:center;margin-bottom:24px;">
  <h2 style="font-size:28px;font-weight:700;margin:0 0 32px;color:#1E293B;">${escHtml(s.headline || "What Our Customers Say")}</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;max-width:960px;margin:0 auto;">
    ${reviews.map(r => `
      <div style="background:#fff;border:1px solid #E2E8F0;border-radius:12px;padding:24px;text-align:left;">
        <div style="color:#F59E0B;font-size:16px;margin-bottom:12px;">${"★".repeat(r.rating || 5)}${"☆".repeat(5 - (r.rating || 5))}</div>
        <p style="color:#374151;font-size:14px;line-height:1.6;margin:0 0 16px;">"${escHtml(r.text || "")}"</p>
        <p style="margin:0;font-weight:600;font-size:13px;color:#1E293B;">${escHtml(r.name || "Customer")}</p>
        ${r.location ? `<p style="margin:0;font-size:12px;color:#94A3B8;">${escHtml(r.location)}</p>` : ""}
      </div>
    `).join("")}
  </div>
</div>`;
}

function buildFaqHtml(s) {
  const items = s.items || [];
  return `
<div style="padding:48px 24px;max-width:720px;margin:0 auto 24px;">
  <h2 style="font-size:28px;font-weight:700;text-align:center;margin:0 0 32px;color:#1E293B;">${escHtml(s.headline || "FAQ")}</h2>
  ${items.map(item => `
    <details style="border:1px solid #E2E8F0;border-radius:10px;padding:16px 20px;margin-bottom:12px;background:#fff;">
      <summary style="font-weight:600;font-size:15px;color:#1E293B;cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;">
        ${escHtml(item.question || "")}
        <span style="font-size:20px;color:#94A3B8;transition:transform 0.2s;">+</span>
      </summary>
      <p style="margin:12px 0 0;color:#64748B;font-size:14px;line-height:1.7;">${escHtml(item.answer || "")}</p>
    </details>
  `).join("")}
</div>`;
}

function buildUrgencyBarHtml(s) {
  const bg = s.background_color || "#DC2626";
  const color = s.text_color || "#fff";
  return `
<div style="background:${bg};color:${color};padding:14px 24px;text-align:center;border-radius:10px;margin-bottom:24px;font-weight:600;font-size:15px;">
  ${escHtml(s.message || "Limited time offer — order now!")}
</div>`;
}

function buildFooterHtml(s) {
  return `
<div style="background:#1E293B;color:#94A3B8;padding:48px 24px;border-radius:12px;margin-top:24px;">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:32px;max-width:960px;margin:0 auto;">
    ${(s.columns || []).map(col => `
      <div>
        <h4 style="color:#fff;font-size:14px;font-weight:700;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em;">${escHtml(col.title || "")}</h4>
        <ul style="list-style:none;padding:0;margin:0;">
          ${(col.links || []).map(link => `<li style="margin-bottom:8px;"><a href="#" style="color:#94A3B8;text-decoration:none;font-size:13px;">${escHtml(link)}</a></li>`).join("")}
        </ul>
      </div>
    `).join("")}
  </div>
  ${s.copyright ? `<p style="text-align:center;margin:32px 0 0;font-size:12px;color:#64748B;">${escHtml(s.copyright)}</p>` : ""}
</div>`;
}

function escHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildWhatsAppWidgetHtml(phone, storeName) {
  const cleanPhone = phone.replace(/[^\d+]/g, "");
  const msg = encodeURIComponent(`Hi! I'm interested in products from ${storeName || "your store"}.`);
  return `
<!-- PageCraft AI WhatsApp Chat Widget -->
<style>
  .pc-wa-float {
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    width: 60px; height: 60px; border-radius: 50%;
    background: #25D366; color: #fff;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 20px rgba(37,211,102,0.5);
    cursor: pointer; text-decoration: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    animation: pc-wa-pulse 2s ease-in-out infinite;
  }
  .pc-wa-float:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 28px rgba(37,211,102,0.6);
  }
  .pc-wa-float svg {
    width: 32px; height: 32px;
  }
  .pc-wa-tooltip {
    position: fixed; bottom: 92px; right: 24px; z-index: 9998;
    background: #fff; color: #1E293B; padding: 10px 16px;
    border-radius: 10px; font-size: 13px; font-weight: 600;
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    opacity: 0; transform: translateY(8px);
    animation: pc-wa-tooltip-show 0.4s 2s ease forwards;
    font-family: -apple-system, sans-serif;
  }
  .pc-wa-tooltip::after {
    content: ''; position: absolute; bottom: -6px; right: 24px;
    border-left: 6px solid transparent; border-right: 6px solid transparent;
    border-top: 6px solid #fff;
  }
  @keyframes pc-wa-pulse {
    0%, 100% { box-shadow: 0 4px 20px rgba(37,211,102,0.5); }
    50% { box-shadow: 0 4px 32px rgba(37,211,102,0.7), 0 0 0 12px rgba(37,211,102,0.1); }
  }
  @keyframes pc-wa-tooltip-show {
    to { opacity: 1; transform: translateY(0); }
  }
</style>
<div class="pc-wa-tooltip">Need help? Chat with us! 💬</div>
<a class="pc-wa-float" href="https://wa.me/${cleanPhone}?text=${msg}" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
  <svg viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.487l4.624-1.467A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.168 0-4.178-.594-5.918-1.627l-.424-.253-2.742.87.878-2.688-.278-.442A9.77 9.77 0 012.182 12c0-5.419 4.4-9.818 9.818-9.818S21.818 6.581 21.818 12 17.419 21.818 12 21.818z"/></svg>
</a>
<!-- End WhatsApp Widget -->`;
}
