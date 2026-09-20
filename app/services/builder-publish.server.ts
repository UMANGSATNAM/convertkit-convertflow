// app/services/builder-publish.server.ts
import { getActiveTheme, uploadAsset } from "./theme.server";
import type { PageSchema, Section, Column, Block, BlockStyles } from "../builder/types";

function cssStyleString(styles: BlockStyles = {}): string {
  const rules: string[] = [];
  if (styles.fontSize) rules.push(`font-size: ${styles.fontSize}`);
  if (styles.fontWeight) rules.push(`font-weight: ${styles.fontWeight}`);
  if (styles.lineHeight) rules.push(`line-height: ${styles.lineHeight}`);
  if (styles.textAlign) rules.push(`text-align: ${styles.textAlign}`);
  if (styles.textColor) rules.push(`color: ${styles.textColor}`);
  if (styles.backgroundColor) rules.push(`background-color: ${styles.backgroundColor}`);
  if (styles.backgroundImage) rules.push(`background-image: url('${styles.backgroundImage}')`);
  if (styles.paddingTop !== undefined) rules.push(`padding-top: ${styles.paddingTop}px`);
  if (styles.paddingBottom !== undefined) rules.push(`padding-bottom: ${styles.paddingBottom}px`);
  if (styles.paddingLeft !== undefined) rules.push(`padding-left: ${styles.paddingLeft}px`);
  if (styles.paddingRight !== undefined) rules.push(`padding-right: ${styles.paddingRight}px`);
  if (styles.marginTop !== undefined) rules.push(`margin-top: ${styles.marginTop}px`);
  if (styles.marginBottom !== undefined) rules.push(`margin-bottom: ${styles.marginBottom}px`);
  if (styles.marginLeft !== undefined) rules.push(`margin-left: ${styles.marginLeft}px`);
  if (styles.marginRight !== undefined) rules.push(`margin-right: ${styles.marginRight}px`);
  if (styles.borderRadius !== undefined) rules.push(`border-radius: ${styles.borderRadius}px`);
  if (styles.borderWidth !== undefined && styles.borderStyle && styles.borderStyle !== "none") {
    rules.push(`border: ${styles.borderWidth}px ${styles.borderStyle} ${styles.borderColor || "#e2e8f0"}`);
  }
  if (styles.boxShadow && styles.boxShadow !== "none") {
    const shadowMap: Record<string, string> = {
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    };
    if (shadowMap[styles.boxShadow]) rules.push(`box-shadow: ${shadowMap[styles.boxShadow]}`);
  }
  if (styles.width) rules.push(`width: ${styles.width}`);
  if (styles.maxWidth) rules.push(`max-width: ${styles.maxWidth}`);
  return rules.join("; ");
}

function renderBlock(block: Block): string {
  const styleAttr = `style="${cssStyleString(block.styles)}"`;
  const hideClass = [
    block.visibility?.hideOnDesktop ? "cf-hide-desktop" : "",
    block.visibility?.hideOnTablet ? "cf-hide-tablet" : "",
    block.visibility?.hideOnMobile ? "cf-hide-mobile" : "",
  ].filter(Boolean).join(" ");

  const wrap = (inner: string) => `<div class="cf-block cf-block-${block.type} ${hideClass}" data-cf-id="${block.id}">${inner}</div>`;

  switch (block.type) {
    case "heading": {
      const tag = block.settings?.tag || "h2";
      return wrap(`<${tag} ${styleAttr}>${block.settings?.text || ""}</${tag}>`);
    }

    case "paragraph": {
      return wrap(`<p ${styleAttr}>${block.settings?.text || ""}</p>`);
    }

    case "button": {
      return wrap(`
        <a href="${block.settings?.url || "#"}" ${styleAttr} class="cf-btn">
          ${block.settings?.text || "Click Here"}
        </a>
      `);
    }

    case "image": {
      return wrap(`
        <img src="${block.settings?.src || ""}" alt="${block.settings?.alt || ""}" ${styleAttr} loading="lazy" style="max-width:100%; height:auto; display:block;" />
      `);
    }

    case "video": {
      return wrap(`
        <div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:12px;">
          <iframe src="${block.settings?.embedUrl || ""}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;" allowfullscreen></iframe>
        </div>
      `);
    }

    case "divider": {
      return wrap(`<hr ${styleAttr} style="border:none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />`);
    }

    case "product_title": {
      const tag = block.settings?.tag || "h1";
      return wrap(`<${tag} ${styleAttr}>{{ product.title | default: "${block.settings?.text || "Product Title"}" }}</${tag}>`);
    }

    case "product_price": {
      return wrap(`
        <div ${styleAttr} style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:26px; font-weight:800; color:#0f172a;">{{ product.price | money | default: "${block.settings?.price || "₹1,499"}" }}</span>
          {% if product.compare_at_price > product.price %}
            <span style="text-decoration:line-through; color:#94a3b8; font-size:18px;">{{ product.compare_at_price | money }}</span>
            <span style="background:#fef2f2; color:#b91c1c; font-size:12px; font-weight:700; padding:2px 8px; border-radius:4px;">SAVE</span>
          {% else %}
            <span style="text-decoration:line-through; color:#94a3b8; font-size:18px;">${block.settings?.comparePrice || "₹2,499"}</span>
            <span style="background:#fef2f2; color:#b91c1c; font-size:12px; font-weight:700; padding:2px 8px; border-radius:4px;">${block.settings?.badgeText || "SAVE 40%"}</span>
          {% endif %}
        </div>
      `);
    }

    case "product_gallery": {
      const images: string[] = block.settings?.images || [
        "https://images.unsplash.com/photo-1608248597359-251f5e8b39aa?w=800&auto=format&fit=crop&q=80"
      ];
      return wrap(`
        <div class="cf-gallery" style="display:flex; flex-direction:column; gap:12px;">
          <div style="border-radius:12px; overflow:hidden; box-shadow:0 4px 6px -1px rgb(0 0 0 / 0.1);">
            <img id="cf-main-img" src="${images[0]}" alt="Product" style="width:100%; height:auto; display:block;" />
          </div>
          ${images.length > 1 ? `
            <div style="display:flex; gap:10px; overflow-x:auto; padding-bottom:6px;">
              ${images.map((img, i) => `
                <img src="${img}" alt="Thumb" style="width:68px; height:68px; object-fit:cover; border-radius:8px; cursor:pointer; border:2px solid ${i === 0 ? '#0284c7' : '#e2e8f0'};" onclick="document.getElementById('cf-main-img').src=this.src" />
              `).join("")}
            </div>
          ` : ""}
        </div>
      `);
    }

    case "product_variants": {
      const options = block.settings?.options || [{ name: "Size", values: ["Small", "Medium", "Large"] }];
      return wrap(`
        <div class="cf-variants" ${styleAttr}>
          ${options.map((opt: any) => `
            <div style="margin-bottom:14px;">
              <label style="display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:6px;">Select ${opt.name}:</label>
              <div style="display:flex; gap:8px; flex-wrap:wrap;">
                ${opt.values.map((v: string, idx: number) => `
                  <button type="button" class="cf-var-pill ${idx === 0 ? 'active' : ''}" style="padding:8px 16px; border:1.5px solid ${idx === 0 ? '#0284c7' : '#cbd5e1'}; background:${idx === 0 ? '#f0f9ff' : '#ffffff'}; color:${idx === 0 ? '#0284c7' : '#334155'}; font-size:14px; font-weight:600; border-radius:6px; cursor:pointer;">
                    ${v}
                  </button>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      `);
    }

    case "product_stock_urgency": {
      const pct = block.settings?.percentage || 85;
      return wrap(`
        <div style="background:#fff1f2; border:1px solid #fecdd3; border-radius:8px; padding:12px; margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:700; color:#9f1239; margin-bottom:6px;">
            <span>${block.settings?.text || "⚡ Limited Stock Remaining"}</span>
            <span>Only Few Left!</span>
          </div>
          <div style="background:#ffe4e6; height:8px; border-radius:999px; overflow:hidden;">
            <div style="background:#e11d48; width:${pct}%; height:100%; border-radius:999px;"></div>
          </div>
        </div>
      `);
    }

    case "product_rating": {
      const rating = block.settings?.rating || 4.9;
      const count = block.settings?.reviewsCount || 1420;
      return wrap(`
        <div style="display:flex; align-items:center; gap:6px; font-size:14px; font-weight:600; color:#d97706; margin-bottom:10px;">
          <span>⭐⭐⭐⭐⭐</span>
          <span style="color:#0f172a;">${rating}</span>
          <span style="color:#64748b; font-weight:400;">(${count.toLocaleString()} Reviews)</span>
          <span style="background:#ecfdf5; color:#047857; font-size:11px; font-weight:700; padding:2px 6px; border-radius:4px; margin-left:4px;">✓ VERIFIED</span>
        </div>
      `);
    }

    case "product_atc": {
      return wrap(`
        <form method="post" action="/cart/add" class="cf-atc-form" style="margin-bottom:12px;">
          <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}" />
          <div style="display:flex; gap:10px;">
            ${block.settings?.showQuantity ? `
              <div style="display:flex; align-items:center; border:1px solid #cbd5e1; border-radius:8px; background:#f8fafc;">
                <button type="button" onclick="const q=this.nextElementSibling; if(q.value>1) q.value--;" style="padding:10px 14px; border:none; background:transparent; font-size:18px; cursor:pointer;">-</button>
                <input type="number" name="quantity" value="1" min="1" style="width:40px; text-align:center; border:none; background:transparent; font-weight:700;" />
                <button type="button" onclick="const q=this.previousElementSibling; q.value++;" style="padding:10px 14px; border:none; background:transparent; font-size:18px; cursor:pointer;">+</button>
              </div>
            ` : ""}
            <button type="submit" ${styleAttr} class="cf-btn-atc" style="flex:1; cursor:pointer; display:flex; justify-content:center; align-items:center; gap:8px;">
              <span>🛒</span>
              <span>${block.settings?.text || "ADD TO CART"}</span>
            </button>
          </div>
        </form>
      `);
    }

    case "product_buynow": {
      return wrap(`
        <form method="post" action="/cart/add" class="cf-buynow-form" style="margin-bottom:16px;">
          <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}" />
          <input type="hidden" name="return_to" value="/checkout" />
          <button type="submit" ${styleAttr} class="cf-btn-buynow" style="cursor:pointer; display:flex; justify-content:center; align-items:center; gap:8px;">
            ${block.settings?.text || "⚡ BUY NOW WITH CASH ON DELIVERY"}
          </button>
        </form>
      `);
    }

    case "countdown_timer": {
      const h = block.settings?.hours || 3;
      const m = block.settings?.minutes || 45;
      const s = block.settings?.seconds || 20;
      return wrap(`
        <div class="cf-timer-card" ${styleAttr} style="text-align:center;">
          <div style="font-size:12px; font-weight:800; letter-spacing:0.5px; color:#b91c1c; margin-bottom:6px;">
            ${block.settings?.title || "FLASH SALE ENDS IN:"}
          </div>
          <div style="display:flex; justify-content:center; gap:8px;" id="cf-timer-${block.id}">
            <div style="background:#0f172a; color:#fff; padding:6px 10px; border-radius:6px; font-weight:800; font-size:18px; min-width:38px;">${String(h).padStart(2, "0")}h</div>
            <div style="background:#0f172a; color:#fff; padding:6px 10px; border-radius:6px; font-weight:800; font-size:18px; min-width:38px;">${String(m).padStart(2, "0")}m</div>
            <div style="background:#0f172a; color:#fff; padding:6px 10px; border-radius:6px; font-weight:800; font-size:18px; min-width:38px;">${String(s).padStart(2, "0")}s</div>
          </div>
        </div>
      `);
    }

    case "trust_badges": {
      const badges = block.settings?.badges || [
        { icon: "🚚", title: "Free Express Shipping", desc: "Across India" },
        { icon: "💵", title: "Cash on Delivery", desc: "Available at checkout" },
        { icon: "🛡️", title: "100% Genuine Formula", desc: "Lab tested" },
      ];
      return wrap(`
        <div class="cf-trust-grid" ${styleAttr} style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:12px;">
          ${badges.map((b: any) => `
            <div style="display:flex; align-items:center; gap:10px; padding:8px 10px; background:#ffffff; border:1px solid #f1f5f9; border-radius:6px;">
              <span style="font-size:24px;">${b.icon}</span>
              <div>
                <div style="font-size:12px; font-weight:700; color:#0f172a;">${b.title}</div>
                <div style="font-size:11px; color:#64748b;">${b.desc}</div>
              </div>
            </div>
          `).join("")}
        </div>
      `);
    }

    case "testimonial": {
      return wrap(`
        <div class="cf-testimonial-card" ${styleAttr}>
          <div style="color:#d97706; margin-bottom:8px;">⭐⭐⭐⭐⭐</div>
          <p style="font-size:15px; font-style:italic; color:#334155; line-height:1.5; margin-bottom:12px;">
            ${block.settings?.quote || "“Amazing experience! 10/10 recommended.”"}
          </p>
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; border-radius:50%; background:#e2e8f0; display:flex; align-items:center; justify-content:center; font-weight:700; color:#475569;">
              ${(block.settings?.name || "A")[0]}
            </div>
            <div>
              <div style="font-size:13px; font-weight:700; color:#0f172a;">${block.settings?.name || "Verified Customer"}</div>
              <div style="font-size:11px; color:#059669; font-weight:600;">✓ Verified Purchase</div>
            </div>
          </div>
        </div>
      `);
    }

    case "faq_accordion": {
      const faqs = block.settings?.faqs || [];
      return wrap(`
        <div class="cf-faq-list" ${styleAttr}>
          ${faqs.map((item: any) => `
            <details style="border:1px solid #e2e8f0; border-radius:8px; margin-bottom:8px; background:#fff; padding:12px 16px;">
              <summary style="font-size:15px; font-weight:700; color:#0f172a; cursor:pointer; list-style:none; display:flex; justify-content:space-between; align-items:center;">
                <span>${item.q}</span>
                <span style="font-size:18px; color:#94a3b8;">+</span>
              </summary>
              <div style="margin-top:10px; font-size:14px; color:#475569; line-height:1.6; border-top:1px solid #f1f5f9; padding-top:8px;">
                ${item.a}
              </div>
            </details>
          `).join("")}
        </div>
      `);
    }

    case "pincode_checker": {
      return wrap(`
        <div class="cf-pincode-card" ${styleAttr}>
          <div style="font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">📍 Check Delivery & COD Availability</div>
          <div style="display:flex; gap:8px;">
            <input type="text" placeholder="${block.settings?.placeholder || 'Enter 6-digit Pincode'}" maxlength="6" style="flex:1; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:14px;" />
            <button type="button" onclick="this.parentElement.nextElementSibling.style.display='block'" style="padding:8px 16px; background:#0284c7; color:#fff; border:none; border-radius:6px; font-weight:600; font-size:13px; cursor:pointer;">Check</button>
          </div>
          <div style="display:none; margin-top:8px; font-size:12px; font-weight:700; color:#059669;">
            ${block.settings?.sampleResult || "⚡ Fast Delivery in 2-3 Days | Cash on Delivery Available"}
          </div>
        </div>
      `);
    }

    case "whatsapp_chat": {
      const num = block.settings?.number || "919876543210";
      const text = encodeURIComponent(block.settings?.message || "Hi!");
      return wrap(`
        <a href="https://wa.me/${num}?text=${text}" target="_blank" rel="noopener noreferrer" ${styleAttr} style="display:flex; align-items:center; justify-content:center; gap:8px; text-decoration:none;">
          <span>💬</span>
          <span>${block.settings?.text || "Chat on WhatsApp"}</span>
        </a>
      `);
    }

    default:
      return wrap(`<!-- Block type: ${block.type} -->`);
  }
}

function renderColumn(col: Column): string {
  const widthPct = col.width ? (col.width / 12) * 100 : 100;
  const blocksHtml = col.blocks.map(renderBlock).join("\n");
  return `
    <div class="cf-column" style="flex: 0 0 ${widthPct}%; max-width: ${widthPct}%; box-sizing: border-box; padding: 0 12px;">
      ${blocksHtml}
    </div>
  `;
}

function renderSection(sec: Section): string {
  const styleAttr = `style="${cssStyleString(sec.styles)}"`;
  const colsHtml = sec.columns.map(renderColumn).join("\n");
  return `
    <section class="cf-section" id="${sec.id}" ${styleAttr}>
      <div class="cf-container" style="max-width: ${sec.settings?.containerMaxWidth || "1200px"}; margin: 0 auto; padding: 0 16px; box-sizing: border-box;">
        <div class="cf-row" style="display: flex; flex-wrap: wrap; margin: 0 -12px; box-sizing: border-box;">
          ${colsHtml}
        </div>
      </div>
    </section>
  `;
}

export function compilePageToLiquid(page: PageSchema): { liquid: string; css: string } {
  const sectionsHtml = page.sections.map(renderSection).join("\n");

  const fullPageNoChromeCss = page.layoutMode === "FULL_PAGE_NO_CHROME" ? `
    /* Full Page No Chrome: hides standard theme header/footer for distraction-free funnel */
    header.header, .header-wrapper, #shopify-section-header, .site-header,
    footer.footer, .footer-section, #shopify-section-footer, .site-footer {
      display: none !important;
    }
  ` : "";

  const baseCss = `
    .cf-page-wrapper {
      font-family: ${page.globalStyles?.fontFamily || "inherit"};
      color: ${page.globalStyles?.textColor || "#1e293b"};
      background-color: ${page.globalStyles?.backgroundColor || "#ffffff"};
      width: 100%;
      overflow-x: hidden;
    }
    .cf-column {
      box-sizing: border-box;
    }
    .cf-btn {
      display: inline-block;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .cf-btn:hover {
      opacity: 0.92;
      transform: translateY(-1px);
    }
    .cf-var-pill:hover {
      border-color: #0284c7 !important;
    }
    @media (max-width: 768px) {
      .cf-column {
        flex: 0 0 100% !important;
        max-width: 100% !important;
        margin-bottom: 16px;
      }
      .cf-hide-mobile {
        display: none !important;
      }
    }
    @media (min-width: 769px) {
      .cf-hide-desktop {
        display: none !important;
      }
    }
    ${fullPageNoChromeCss}
    ${page.customCss || ""}
  `;

  const liquid = `
{% comment %}
  Generated by ConvertFlow PageFly-Style Page Builder
  Page: ${page.title} (${page.handle})
  Auto-generated on: {{ "now" | date: "%Y-%m-%d %H:%M:%S" }}
{% endcomment %}

<div class="cf-page-wrapper cf-page-${page.handle}">
  ${sectionsHtml}
</div>

<style>
${baseCss}
</style>
  `.trim();

  return { liquid, css: baseCss };
}

export async function publishPageToShopify(
  admin: any,
  shopDomain: string,
  page: PageSchema,
  targetThemeId?: string
) {
  const safeHandle = page.handle.toLowerCase().replace(/[^a-z0-9-_]/g, "-");
  const templateSuffix = `cf-${safeHandle}`;

  // 1. Resolve target theme
  let themeId = targetThemeId;
  if (!themeId) {
    const activeTheme = await getActiveTheme(admin);
    if (!activeTheme) throw new Error("Could not find active Shopify theme.");
    themeId = activeTheme.id.replace("gid://shopify/Theme/", "");
  }

  // 2. Compile Liquid & CSS
  const { liquid } = compilePageToLiquid(page);

  // 3. Write Theme Section: sections/cf-page-[handle].liquid
  const sectionKey = `sections/cf-page-${safeHandle}.liquid`;
  await uploadAsset(admin, themeId, {
    key: sectionKey,
    value: liquid,
  });

  // 4. Write Theme Template: templates/page.cf-[handle].json
  const templateKey = `templates/page.${templateSuffix}.json`;
  const templateJson = JSON.stringify({
    wrapper: "div.cf-page-container",
    sections: {
      main: {
        type: `cf-page-${safeHandle}`,
      },
    },
    order: ["main"],
  }, null, 2);

  await uploadAsset(admin, themeId, {
    key: templateKey,
    value: templateJson,
  });

  // 5. Create or Update Online Store Page in Shopify Admin
  // First query if a page with this handle exists
  const checkQuery = await admin.graphql(`
    query($query: String!) {
      pages(first: 5, query: $query) {
        nodes {
          id
          title
          handle
          templateSuffix
        }
      }
    }
  `, {
    variables: { query: `handle:${safeHandle}` }
  });
  const checkRes = await checkQuery.json();
  const existingPage = checkRes?.data?.pages?.nodes?.find((p: any) => p.handle === safeHandle);

  let shopifyPageId = existingPage?.id;

  if (existingPage) {
    // Update existing page
    const updateRes = await admin.graphql(`
      mutation pageUpdate($id: ID!, $page: PageUpdateInput!) {
        pageUpdate(id: $id, page: $page) {
          page {
            id
            handle
            templateSuffix
          }
          userErrors {
            field
            message
          }
        }
      }
    `, {
      variables: {
        id: existingPage.id,
        page: {
          title: page.title,
          templateSuffix: templateSuffix,
        }
      }
    });
    const updateData = await updateRes.json();
    if (updateData?.data?.pageUpdate?.userErrors?.length > 0) {
      throw new Error(updateData.data.pageUpdate.userErrors.map((e: any) => e.message).join(", "));
    }
  } else {
    // Create new page
    const createRes = await admin.graphql(`
      mutation pageCreate($page: PageCreateInput!) {
        pageCreate(page: $page) {
          page {
            id
            handle
            templateSuffix
          }
          userErrors {
            field
            message
          }
        }
      }
    `, {
      variables: {
        page: {
          title: page.title,
          handle: safeHandle,
          templateSuffix: templateSuffix,
          isPublished: true,
        }
      }
    });
    const createData = await createRes.json();
    if (createData?.data?.pageCreate?.userErrors?.length > 0) {
      throw new Error(createData.data.pageCreate.userErrors.map((e: any) => e.message).join(", "));
    }
    shopifyPageId = createData?.data?.pageCreate?.page?.id;
  }

  const liveUrl = `https://${shopDomain}/pages/${safeHandle}`;
  const editorUrl = `https://${shopDomain}/admin/themes/${themeId}/editor?previewPath=%2Fpages%2F${safeHandle}`;

  return {
    ok: true,
    shopifyPageId,
    templateSuffix,
    sectionKey,
    templateKey,
    liveUrl,
    editorUrl,
    themeId,
  };
}
