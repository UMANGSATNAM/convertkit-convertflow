import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

const TEMPLATES = {
  about_us: {
    title: "About Us",
    bodyHtml: `<h2>Our Story</h2><p>Welcome to our store. We are passionate about bringing you the best products.</p><h2>Our Mission</h2><p>Our mission is to provide exceptional value and customer service.</p>`
  },
  contact: {
    title: "Contact Us",
    bodyHtml: `<p>We would love to hear from you!</p><p>Email: support@example.com</p><p>Phone: 1-800-123-4567</p>`
  },
  faq: {
    title: "Frequently Asked Questions",
    bodyHtml: `<h3>How long does shipping take?</h3><p>Shipping typically takes 3-5 business days.</p><h3>Do you offer returns?</h3><p>Yes, we offer a 30-day money-back guarantee.</p>`
  },
  shipping: {
    title: "Shipping Policy",
    bodyHtml: `<h2>Shipping Options</h2><p>We offer standard and expedited shipping via major carriers.</p><h2>Processing Time</h2><p>Orders are processed within 24-48 hours.</p>`
  },
  track_order: {
    title: "Track Your Order",
    bodyHtml: `<p>Please enter your tracking number below to view the status of your shipment.</p><!-- You can embed a tracking widget here -->`
  },
  returns: {
    title: "Returns & Refunds",
    bodyHtml: `<h2>Return Policy</h2><p>You have 30 days to return an item from the date you received it.</p><h2>Refunds</h2><p>Once we receive your item, we will initiate a refund to your original method of payment.</p>`
  },
  size_guide: {
    title: "Size Guide",
    bodyHtml: `<p>Use this guide to find your perfect fit.</p><table><tr><th>Size</th><th>Bust</th><th>Waist</th></tr><tr><td>S</td><td>34"</td><td>26"</td></tr><tr><td>M</td><td>36"</td><td>28"</td></tr><tr><td>L</td><td>38"</td><td>30"</td></tr></table>`
  },
  tos: {
    title: "Terms of Service",
    bodyHtml: `<p>By accessing or using our website, you agree to be bound by these Terms of Service.</p><h2>Products or Services</h2><p>We reserve the right to limit the sales of our products or Services to any person, geographic region or jurisdiction.</p>`
  }
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const formData = await request.formData();
  const templateId = formData.get("templateId");

  if (!templateId || !TEMPLATES[templateId]) {
    return json({ error: "Invalid template ID" }, { status: 400 });
  }

  const template = TEMPLATES[templateId];

  try {
    const response = await admin.graphql(
      `mutation pageCreate($page: PageCreateInput!) {
        pageCreate(page: $page) {
          page {
            id
            title
            handle
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          page: {
            title: template.title,
            bodyHtml: template.bodyHtml,
            isPublished: true,
          },
        },
      }
    );

    const parsed = await response.json();
    
    if (parsed.data?.pageCreate?.userErrors?.length > 0) {
      return json({ 
        error: parsed.data.pageCreate.userErrors[0].message 
      }, { status: 400 });
    }

    return json({ 
      success: true, 
      page: parsed.data.pageCreate.page 
    });

  } catch (error) {
    console.error("Failed to publish page:", error);
    return json({ error: "Failed to communicate with Shopify API" }, { status: 500 });
  }
};
