import fs from 'fs';
const S = 'i:/converflow app/convertkit-convertflow/theme-base/sections';
const w = (name, content) => { fs.writeFileSync(`${S}/${name}`, content, 'utf8'); console.log('wrote', name); };

const card = (content) => `<div class="page-width" style="padding:60px 20px 80px;max-width:600px;margin:0 auto">${content}</div>`;
const input = (name,type,label,req='') => `<div style="margin-bottom:20px"><label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px">${label}${req?'<span style="color:red"> *</span>':''}</label><input type="${type}" name="${name}" ${req?'required':''} style="width:100%;padding:12px 16px;border:1px solid var(--c-border);border-radius:var(--radius);font-family:var(--f-body);font-size:15px;background:var(--c-bg);color:var(--c-text)"></div>`;
const schema = (name) => `\n{%- schema -%}\n{"name":"${name}","settings":[],"presets":[{"name":"${name}"}]}\n{%- endschema -%}`;

// LOGIN
w('customer-login.liquid', card(`
<h1 style="font-family:var(--f-heading);font-size:32px;margin-bottom:8px">Sign In</h1>
<p style="color:var(--c-subtle);margin-bottom:32px">Welcome back! Please sign in to your account.</p>
{%- form 'customer_login' -%}
  {%- if form.errors -%}<div style="padding:12px 16px;background:#fef2f2;border:1px solid #fca5a5;border-radius:var(--radius);color:#dc2626;font-size:14px;margin-bottom:20px">{{ form.errors | default_errors }}</div>{%- endif -%}
  ${input('customer[email]','email','Email Address','req')}
  ${input('customer[password]','password','Password','req')}
  <div style="display:flex;justify-content:flex-end;margin-bottom:20px"><a href="{{ routes.root_url }}account/login#recover" style="font-size:14px;color:var(--c-accent)">Forgot password?</a></div>
  <button type="submit" class="btn-primary" style="width:100%;padding:15px">Sign In</button>
{%- endform -%}
<p style="text-align:center;margin-top:24px;font-size:14px;color:var(--c-subtle)">Don't have an account? <a href="{{ routes.account_register_url }}" style="color:var(--c-accent);font-weight:600">Create one</a></p>
`) + schema('Customer Login'));

// REGISTER
w('customer-register.liquid', card(`
<h1 style="font-family:var(--f-heading);font-size:32px;margin-bottom:8px">Create Account</h1>
<p style="color:var(--c-subtle);margin-bottom:32px">Join us for exclusive offers and easy order tracking.</p>
{%- form 'create_customer' -%}
  {%- if form.errors -%}<div style="padding:12px 16px;background:#fef2f2;border:1px solid #fca5a5;border-radius:var(--radius);color:#dc2626;font-size:14px;margin-bottom:20px">{{ form.errors | default_errors }}</div>{%- endif -%}
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
    ${input('customer[first_name]','text','First Name','req')}
    ${input('customer[last_name]','text','Last Name','req')}
  </div>
  ${input('customer[email]','email','Email Address','req')}
  ${input('customer[password]','password','Password','req')}
  <button type="submit" class="btn-primary" style="width:100%;padding:15px">Create Account</button>
{%- endform -%}
<p style="text-align:center;margin-top:24px;font-size:14px;color:var(--c-subtle)">Already have an account? <a href="{{ routes.account_login_url }}" style="color:var(--c-accent);font-weight:600">Sign in</a></p>
`) + schema('Customer Register'));

// ACCOUNT
w('customer-account.liquid', `<div class="page-width" style="padding:60px 20px 80px">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:40px;flex-wrap:wrap;gap:16px">
  <h1 style="font-family:var(--f-heading);font-size:clamp(24px,4vw,36px)">My Account</h1>
  <a href="{{ routes.account_logout_url }}" class="btn-outline" style="font-size:14px;padding:10px 20px">Sign Out</a>
</div>
<div style="display:grid;grid-template-columns:1fr 2fr;gap:40px;align-items:flex-start">
  <div style="background:var(--c-border,#f3f4f6);border-radius:calc(var(--radius)*2);padding:28px">
    <p style="font-family:var(--f-heading);font-size:18px;font-weight:700;margin-bottom:4px">{{ customer.first_name }} {{ customer.last_name }}</p>
    <p style="font-size:14px;color:var(--c-subtle);margin-bottom:20px">{{ customer.email }}</p>
    <a href="{{ routes.account_addresses_url }}" style="display:block;padding:10px 0;font-size:14px;border-bottom:1px solid var(--c-border);color:var(--c-text)">Manage Addresses</a>
    <a href="{{ routes.account_logout_url }}" style="display:block;padding:10px 0;font-size:14px;color:#dc2626">Sign Out</a>
  </div>
  <div>
    <h2 style="font-family:var(--f-heading);font-size:20px;margin-bottom:24px">Order History</h2>
    {%- if customer.orders.size == 0 -%}
    <p style="color:var(--c-subtle)">You haven't placed any orders yet. <a href="/collections/all" style="color:var(--c-accent);font-weight:600">Start shopping</a></p>
    {%- else -%}
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <thead><tr style="border-bottom:2px solid var(--c-border)">
        {%- for h in 'Order,Date,Items,Total,Status' | split: ',' -%}<th style="text-align:left;padding:10px 12px;font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--c-subtle)">{{h}}</th>{%- endfor -%}
      </tr></thead>
      <tbody>
        {%- for order in customer.orders -%}
        <tr style="border-bottom:1px solid var(--c-border)">
          <td style="padding:14px 12px"><a href="{{ order.customer_url }}" style="color:var(--c-accent);font-weight:600">{{ order.name }}</a></td>
          <td style="padding:14px 12px;color:var(--c-subtle)">{{ order.created_at | date: "%b %d, %Y" }}</td>
          <td style="padding:14px 12px">{{ order.line_items.size }}</td>
          <td style="padding:14px 12px;font-weight:700">{{ order.total_price | money }}</td>
          <td style="padding:14px 12px"><span style="padding:4px 10px;border-radius:99px;font-size:12px;font-weight:700;background:rgba(34,197,94,.1);color:#16a34a">{{ order.financial_status | capitalize }}</span></td>
        </tr>
        {%- endfor -%}
      </tbody>
    </table>
    {%- endif -%}
  </div>
</div>
</div>` + schema('Customer Account'));

// ORDER
w('customer-order.liquid', `<div class="page-width" style="padding:60px 20px 80px;max-width:900px;margin:0 auto">
<div style="display:flex;align-items:center;gap:16px;margin-bottom:40px;flex-wrap:wrap">
  <a href="{{ routes.account_url }}" style="color:var(--c-subtle);font-size:14px">← Back to Account</a>
  <h1 style="font-family:var(--f-heading);font-size:clamp(20px,3vw,32px)">Order {{ order.name }}</h1>
  <span style="padding:6px 14px;border-radius:99px;font-size:13px;font-weight:700;background:rgba(34,197,94,.1);color:#16a34a;margin-left:auto">{{ order.financial_status | capitalize }}</span>
</div>
{%- for item in order.line_items -%}
<div style="display:grid;grid-template-columns:80px 1fr;gap:16px;padding:20px 0;border-bottom:1px solid var(--c-border)">
  {%- if item.image -%}<img src="{{ item.image | image_url: width: 160 }}" alt="{{ item.title | escape }}" width="80" height="80" style="border-radius:var(--radius);object-fit:cover;width:80px;height:80px">{%- else -%}<div style="width:80px;height:80px;background:var(--c-border);border-radius:var(--radius)"></div>{%- endif -%}
  <div>
    <p style="font-weight:600;margin-bottom:4px">{{ item.title }}</p>
    {%- unless item.variant.title == 'Default Title' -%}<p style="font-size:13px;color:var(--c-subtle);margin-bottom:4px">{{ item.variant.title }}</p>{%- endunless -%}
    <p style="font-size:14px;color:var(--c-subtle)">Qty: {{ item.quantity }} × {{ item.price | money }}</p>
  </div>
</div>
{%- endfor -%}
<div style="margin-top:32px;max-width:320px;margin-left:auto">
  <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:15px"><span>Subtotal</span><span>{{ order.subtotal_price | money }}</span></div>
  {%- for shipping in order.shipping_methods -%}<div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:15px;color:var(--c-subtle)"><span>{{ shipping.title }}</span><span>{{ shipping.price | money }}</span></div>{%- endfor -%}
  <div style="display:flex;justify-content:space-between;padding-top:16px;border-top:2px solid var(--c-border);font-weight:700;font-size:18px"><span>Total</span><span>{{ order.total_price | money }}</span></div>
</div>
</div>` + schema('Customer Order'));

// ADDRESSES
w('customer-addresses.liquid', `<div class="page-width" style="padding:60px 20px 80px;max-width:800px;margin:0 auto">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:40px;flex-wrap:wrap;gap:16px">
  <h1 style="font-family:var(--f-heading);font-size:clamp(22px,4vw,36px)">Addresses</h1>
  <a href="{{ routes.account_url }}" style="color:var(--c-subtle);font-size:14px">← Back</a>
</div>
{%- paginate customer.addresses by 10 -%}
{%- if customer.addresses.size == 0 -%}
<p style="color:var(--c-subtle)">No addresses saved yet.</p>
{%- else -%}
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px">
  {%- for address in customer.addresses -%}
  <div style="padding:24px;border:1px solid var(--c-border);border-radius:calc(var(--radius)*2){%- if address == customer.default_address -%};border-color:var(--c-accent);box-shadow:0 0 0 2px var(--c-accent){%- endif -%}">
    {%- if address == customer.default_address -%}<span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--c-accent);display:block;margin-bottom:10px">Default Address</span>{%- endif -%}
    <p style="font-weight:600;margin-bottom:6px">{{ address.first_name }} {{ address.last_name }}</p>
    <p style="font-size:14px;color:var(--c-subtle);line-height:1.6">{{ address.address1 }}{%- if address.address2 -%}, {{ address.address2 }}{%- endif -%}<br>{{ address.city }}, {{ address.province }} {{ address.zip }}<br>{{ address.country }}</p>
  </div>
  {%- endfor -%}
</div>
{%- endif -%}
{%- endpaginate -%}
</div>` + schema('Customer Addresses'));

// RESET PASSWORD
w('customer-reset-password.liquid', card(`
<h1 style="font-family:var(--f-heading);font-size:32px;margin-bottom:8px">Reset Password</h1>
<p style="color:var(--c-subtle);margin-bottom:32px">Enter your new password below.</p>
{%- form 'reset_customer_password' -%}
  {%- if form.errors -%}<div style="padding:12px;background:#fef2f2;border:1px solid #fca5a5;border-radius:var(--radius);color:#dc2626;font-size:14px;margin-bottom:20px">{{ form.errors | default_errors }}</div>{%- endif -%}
  ${input('customer[password]','password','New Password','req')}
  ${input('customer[password_confirmation]','password','Confirm Password','req')}
  <button type="submit" class="btn-primary" style="width:100%;padding:15px">Reset Password</button>
{%- endform -%}
`) + schema('Reset Password'));

// ACTIVATE ACCOUNT
w('customer-activate-account.liquid', card(`
<h1 style="font-family:var(--f-heading);font-size:32px;margin-bottom:8px">Activate Account</h1>
<p style="color:var(--c-subtle);margin-bottom:32px">Create a password to activate your account.</p>
{%- form 'activate_customer_password' -%}
  {%- if form.errors -%}<div style="padding:12px;background:#fef2f2;border:1px solid #fca5a5;border-radius:var(--radius);color:#dc2626;font-size:14px;margin-bottom:20px">{{ form.errors | default_errors }}</div>{%- endif -%}
  ${input('customer[password]','password','Password','req')}
  ${input('customer[password_confirmation]','password','Confirm Password','req')}
  <button type="submit" class="btn-primary" style="width:100%;padding:15px">Activate Account</button>
{%- endform -%}
`) + schema('Activate Account'));

console.log('✅ All 7 customer sections written');
