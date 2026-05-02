import os
import json

NICHES_DIR = 'i:/converflow app/convertkit-convertflow/theme-niches'

customs = {
    'pilgrim': {
        'tabs': [
            {'label': 'Description', 'content': '<p>Experience Korean beauty secrets with our dermatologist-tested formulas.</p>'},
            {'label': 'Ingredients', 'content': '<p>100% Vegan, Cruelty-free, No Sulfates, No Parabens.</p>'},
            {'label': 'How to Use', 'content': '<p>Apply 2-3 drops to clean face. Gently pat into skin.</p>'}
        ],
        'trust': [('🌿', '100% Vegan'), ('🚫', 'Toxin Free'), ('🐇', 'Cruelty Free')]
    },
    'tanishq': {
        'tabs': [
            {'label': 'Details', 'content': '<p>Hallmarked 22K gold jewelry crafted with precision.</p>'},
            {'label': 'Lifetime Buyback', 'content': '<p>We offer 100% exchange value on all our jewelry.</p>'}
        ],
        'trust': [('💎', 'Certified Diamonds'), ('🏅', 'BIS Hallmarked'), ('🔄', 'Lifetime Buyback')]
    },
    'caratlane': {
        'tabs': [
            {'label': 'Design & Materials', 'content': '<p>Modern, lightweight jewelry for everyday wear.</p>'},
            {'label': 'Try at Home', 'content': '<p>Book a free try at home appointment today.</p>'}
        ],
        'trust': [('🏠', 'Free Try at Home'), ('🚚', 'Insured Shipping'), ('🛡️', '15-Day Returns')]
    },
    'fitness-supplements': {
        'tabs': [
            {'label': 'Overview', 'content': '<p>Premium whey protein for maximum muscle recovery.</p>'},
            {'label': 'Nutritional Info', 'content': '<p>24g Protein | 5.5g BCAA | Zero Added Sugar.</p>'}
        ],
        'trust': [('💪', 'Clinically Tested'), ('🧪', 'Lab Verified'), ('🚫', 'Banned Substance Free')]
    },
    'food-delivery': {
        'atc_text': 'Order Now',
        'tabs': [
            {'label': 'Ingredients', 'content': '<p>Fresh, locally sourced ingredients prepared daily.</p>'},
            {'label': 'Delivery Info', 'content': '<p>Delivered fresh within 45 minutes.</p>'}
        ],
        'trust': [('⚡', 'Fast Delivery'), ('🍲', 'Fresh Daily'), ('⭐', 'Top Rated')]
    },
    'activewear': {
        'tabs': [
            {'label': 'Fabric', 'content': '<p>Sweat-wicking, 4-way stretch material.</p>'},
            {'label': 'Fit Guide', 'content': '<p>True to size. Model is 5\\\'9\\" wearing size M.</p>'}
        ],
        'trust': [('🏃', 'Squat Proof'), ('💧', 'Sweat Wicking'), ('↩️', 'Easy Returns')]
    }
}

base_tabs = [
    {'label': 'Description', 'content': '<p>Premium quality materials and expert craftsmanship.</p>'},
    {'label': 'Shipping', 'content': '<p>Free delivery on orders over ₹999.</p>'},
    {'label': 'Returns', 'content': '<p>Easy 30-day returns policy.</p>'}
]
base_trust = [('🔒', 'Secure Checkout'), ('🚚', 'Fast Shipping'), ('↩️', 'Easy Returns')]

for niche in os.listdir(NICHES_DIR):
    d = os.path.join(NICHES_DIR, niche, 'templates')
    if not os.path.isdir(d): continue
    
    cust = customs.get(niche, {})
    tabs = cust.get('tabs', base_tabs)
    trust = cust.get('trust', base_trust)
    atc = cust.get('atc_text', 'Add to Cart')
    
    prod_data = {
        'sections': {
            'main': {
                'type': 'product-main',
                'settings': {
                    'atc_text': atc,
                    'show_buy_now': True,
                    'buy_now_text': 'Buy Now',
                    'show_trust': True,
                    'show_description': True
                },
                'blocks': {
                    f'tb_{i}': {'type': 'trust_badge', 'settings': {'icon': t[0], 'text': t[1]}}
                    for i, t in enumerate(trust)
                },
                'block_order': [f'tb_{i}' for i in range(len(trust))]
            },
            'tabs': {
                'type': 'product-tabs',
                'settings': {'tabs_heading': 'Product Information'},
                'blocks': {
                    f'tab_{i}': {'type': 'tab', 'settings': {'tab_label': tb['label'], 'tab_content': tb['content']}}
                    for i, tb in enumerate(tabs)
                },
                'block_order': [f'tab_{i}' for i in range(len(tabs))]
            },
            'recommendations': {
                'type': 'product-recommendations',
                'settings': {'title': 'You May Also Like', 'products_count': 4}
            },
            'recently': {
                'type': 'recently-viewed',
                'settings': {'title': 'Recently Viewed', 'products_count': 4}
            }
        },
        'order': ['main', 'tabs', 'recommendations', 'recently']
    }
    
    with open(os.path.join(d, 'product.json'), 'w', encoding='utf-8') as f:
        json.dump(prod_data, f, indent=2, ensure_ascii=False)
        
    cart_data = {
        'sections': {
            'main': {
                'type': 'cart-main',
                'settings': {
                    'show_note': True,
                    'show_gift': niche in ['tanishq', 'caratlane', 'jewellery-heritage', 'luxury-watches']
                }
            }
        },
        'order': ['main']
    }
    
    with open(os.path.join(d, 'cart.json'), 'w', encoding='utf-8') as f:
        json.dump(cart_data, f, indent=2, ensure_ascii=False)
        
    coll_data = {
        'sections': {
            'banner': {'type': 'collection-banner', 'settings': {}},
            'main': {
                'type': 'collection-main',
                'settings': {
                    'products_per_page': 24 if niche != 'food-delivery' else 48,
                    'columns': '4' if niche not in ['luxury-watches', 'jewellery-heritage'] else '3'
                }
            }
        },
        'order': ['banner', 'main']
    }
    
    with open(os.path.join(d, 'collection.json'), 'w', encoding='utf-8') as f:
        json.dump(coll_data, f, indent=2, ensure_ascii=False)

print('Generated Product, Cart, and Collection JSONs for all 25 niches!')
