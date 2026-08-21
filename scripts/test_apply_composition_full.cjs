const { applyComposition } = require('../app/services/page-compositions.server');
const { STORE_PAGE_TEMPLATES } = require('../app/data/page-templates');

async function test() {
  const template = STORE_PAGE_TEMPLATES.find(t => t.id === 'hp-v51-home');
  console.log('Testing template:', template.id);

  const shop = { shopDomain: 'test-shop.myshopify.com', accessToken: 'dummy' };
  const composition = {
    id: template.id,
    name: template.name,
    pageType: template.pageType,
    niche: template.niche,
    family: template.family,
    archetype: template.styleTag,
    accentColor: template.accentColor,
    announcement: template.announcement,
    header: template.header,
    footer: template.footer,
    sections: template.sections,
  };

  process.env.MOCK_SHOPIFY = 'true';
  const result = await applyComposition(shop, '123456', composition, { collections: ['all'] });
  console.log('Result:', result);
}

test().catch(console.error);
