const fs = require('fs');
const path = require('path');

const THEME_PATH = 'app/data/templates/theme-engine/base-theme';

// 1. Read check.json
let content = fs.readFileSync('check.json', 'utf16le');
if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
const offensesData = JSON.parse(content);

const missingKeys = new Set();
offensesData.forEach(fileData => {
  if (fileData.offenses) {
    fileData.offenses.forEach(offense => {
      if (offense.check === 'TranslationKeyExists') {
        const match = offense.message.match(/'([^']+)'/);
        if (match) missingKeys.add(match[1]);
      }
    });
  }
});

const keysArray = Array.from(missingKeys);
console.log(`Found ${keysArray.length} missing keys.`);

// 2. Scan Liquid files to find interpolation variables used with these keys
const liquidFiles = [];
function findLiquidFiles(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      findLiquidFiles(fullPath);
    } else if (fullPath.endsWith('.liquid')) {
      liquidFiles.push(fullPath);
    }
  }
}
findLiquidFiles(THEME_PATH);

const keyVariables = {};

liquidFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  keysArray.forEach(key => {
    const regex = new RegExp(`['"]${key.replace(/\./g, '\\.')}['"]\\s*\\|\\s*t([^}]*)`, 'g');
    let match;
    while ((match = regex.exec(content)) !== null) {
      const argsPart = match[1];
      if (argsPart && argsPart.trim() !== '') {
        const argRegex = /([a-zA-Z0-9_]+)\s*:/g;
        let argMatch;
        while ((argMatch = argRegex.exec(argsPart)) !== null) {
          const varName = argMatch[1];
          if (!keyVariables[key]) keyVariables[key] = new Set();
          keyVariables[key].add(varName);
        }
      }
    }
  });
});

const defaultEn = {
  "collections": {
    "general": {
      "items_count": {
        "one": "1 product",
        "other": "{{ count }} products"
      }
    }
  },
  "sections": {
    "collection_list": {
      "empty": "No collections found"
    }
  },
  "general": {
    "search": {
      "submit": "Search"
    },
    "email": "Email",
    "rights_reserved": "All rights reserved"
  },
  "customer": {
    "account": {
      "title": "Account",
      "details": "Account details",
      "view_addresses": "View addresses",
      "return": "Return to Account details"
    },
    "log_out": "Log out",
    "orders": {
      "title": "Order history",
      "order_number": "Order",
      "date": "Date",
      "payment_status": "Payment status",
      "fulfillment_status": "Fulfillment status",
      "total": "Total",
      "none": "You haven't placed any orders yet."
    },
    "order": {
      "title": "Order {{ name }}",
      "date": "Placed on {{ date }}",
      "product": "Product",
      "sku": "SKU",
      "price": "Price",
      "quantity": "Quantity",
      "total": "Total",
      "fulfilled_at": "Fulfilled {{ date }}",
      "subtotal": "Subtotal",
      "shipping": "Shipping",
      "tax": "Tax",
      "billing_address": "Billing Address",
      "shipping_address": "Shipping Address",
      "fulfillment_status": "Fulfillment Status",
      "payment_status": "Payment Status",
      "track_shipment": "Track shipment",
      "discount": "Discount",
      "shipping_method": "Shipping method"
    },
    "addresses": {
      "title": "Addresses",
      "add_new": "Add a new address",
      "no_default": "You have no default address.",
      "first_name": "First name",
      "last_name": "Last name",
      "address1": "Address 1",
      "city": "City",
      "country": "Country/Region",
      "add": "Add address",
      "cancel": "Cancel",
      "default": "Set as default address",
      "edit": "Edit",
      "delete": "Delete",
      "delete_confirm": "Are you sure you wish to delete this address?",
      "edit_address": "Edit address",
      "update": "Update address",
      "zip": "Postal/Zip code",
      "phone": "Phone",
      "company": "Company",
      "address2": "Address 2",
      "province": "Province/State"
    },
    "activate_account": {
      "title": "Activate account",
      "subtext": "Create your password to activate your account.",
      "password": "Password",
      "submit": "Activate account",
      "cancel": "Decline invitation",
      "password_confirm": "Confirm password"
    },
    "login_page": {
      "title": "Login",
      "subtitle": "Please enter your email and password",
      "email": "Email",
      "password": "Password",
      "sign_in": "Sign in",
      "forgot_password": "Forgot your password?",
      "create_account": "Create account",
      "guest_title": "Continue as a guest",
      "guest_continue": "Continue"
    },
    "recover_password": {
      "title": "Reset your password",
      "subtext": "We will send you an email to reset your password",
      "email": "Email",
      "submit": "Submit",
      "cancel": "Cancel",
      "success": "We've sent you an email with a link to update your password."
    },
    "register": {
      "title": "Create account",
      "subtitle": "Please fill in the information below:",
      "first_name": "First name",
      "last_name": "Last name",
      "email": "Email",
      "password": "Password",
      "submit": "Create",
      "have_account": "Already have an account?",
      "login_here": "Login here"
    },
    "reset_password": {
      "title": "Reset account password",
      "subtext": "Enter a new password for {{ email }}",
      "password": "Password",
      "password_confirm": "Confirm Password",
      "submit": "Reset Password"
    }
  },
  "blogs": {
    "article": {
      "back_to_blog": "Back to blog",
      "share": "Share this article",
      "read_more": "Read more"
    },
    "list": {
      "no_articles": "There are currently no articles."
    }
  },
  "pages": {
    "blank": {
      "content": "Blank page"
    }
  },
  "password_page": {
    "login_form": {
      "title": "Enter store using password",
      "message": "Enter your password to access the store.",
      "submit": "Enter",
      "error": "Incorrect password. Please try again."
    }
  }
};

const defaultHi = {
  "collections": {
    "general": {
      "items_count": {
        "one": "1 प्रोडक्ट",
        "other": "{{ count }} प्रोडक्ट"
      }
    }
  },
  "sections": {
    "collection_list": {
      "empty": "कोई कलेक्शन नहीं मिला"
    }
  },
  "general": {
    "search": {
      "submit": "सर्च करें"
    },
    "email": "ईमेल",
    "rights_reserved": "सभी अधिकार सुरक्षित हैं"
  },
  "customer": {
    "account": {
      "title": "अकाउंट",
      "details": "अकाउंट डिटेल्स",
      "view_addresses": "एड्रेस देखें",
      "return": "अकाउंट डिटेल्स पर वापस जाएं"
    },
    "log_out": "लॉग आउट करें",
    "orders": {
      "title": "ऑर्डर",
      "order_number": "ऑर्डर",
      "date": "तारीख",
      "payment_status": "पेमेंट स्टेटस",
      "fulfillment_status": "फुलफिलमेंट स्टेटस",
      "total": "टोटल",
      "none": "आपने अभी तक कोई ऑर्डर नहीं किया है।"
    },
    "order": {
      "title": "ऑर्डर {{ name }}",
      "date": "तारीख {{ date }}",
      "product": "प्रोडक्ट",
      "sku": "SKU",
      "price": "प्राइस",
      "quantity": "क्वांटिटी",
      "total": "टोटल",
      "fulfilled_at": "डिलीवर हुआ {{ date }}",
      "subtotal": "सबटोटल",
      "shipping": "शिपिंग",
      "tax": "टैक्स",
      "billing_address": "बिलिंग एड्रेस",
      "shipping_address": "शिपिंग एड्रेस",
      "fulfillment_status": "फुलफिलमेंट स्टेटस",
      "payment_status": "पेमेंट स्टेटस",
      "track_shipment": "ऑर्डर ट्रैक करें",
      "discount": "डिस्काउंट",
      "shipping_method": "शिपिंग मेथड"
    },
    "addresses": {
      "title": "एड्रेस",
      "add_new": "नया एड्रेस जोड़ें",
      "no_default": "आपका कोई डिफ़ॉल्ट एड्रेस नहीं है।",
      "first_name": "फर्स्ट नेम",
      "last_name": "लास्ट नेम",
      "address1": "एड्रेस 1",
      "city": "शहर",
      "country": "देश/क्षेत्र",
      "add": "एड्रेस जोड़ें",
      "cancel": "कैंसिल करें",
      "default": "डिफ़ॉल्ट एड्रेस के रूप में सेट करें",
      "edit": "एडिट करें",
      "delete": "डिलीट करें",
      "delete_confirm": "क्या आप वाकई इस एड्रेस को डिलीट करना चाहते हैं?",
      "edit_address": "एड्रेस एडिट करें",
      "update": "एड्रेस अपडेट करें",
      "zip": "पिन कोड",
      "phone": "फ़ोन",
      "company": "कंपनी",
      "address2": "एड्रेस 2",
      "province": "राज्य"
    },
    "activate_account": {
      "title": "अकाउंट एक्टिवेट करें",
      "subtext": "अपना अकाउंट एक्टिवेट करने के लिए पासवर्ड बनाएं।",
      "password": "पासवर्ड",
      "submit": "अकाउंट एक्टिवेट करें",
      "cancel": "इनविटेशन रिजेक्ट करें",
      "password_confirm": "पासवर्ड कंफर्म करें"
    },
    "login_page": {
      "title": "लॉगिन",
      "subtitle": "कृपया अपना ईमेल और पासवर्ड दर्ज करें",
      "email": "ईमेल",
      "password": "पासवर्ड",
      "sign_in": "लॉगिन करें",
      "forgot_password": "पासवर्ड भूल गए?",
      "create_account": "अकाउंट बनाएं",
      "guest_title": "गेस्ट के रूप में जारी रखें",
      "guest_continue": "जारी रखें"
    },
    "recover_password": {
      "title": "पासवर्ड रीसेट करें",
      "subtext": "हम आपको अपना पासवर्ड रीसेट करने के लिए एक ईमेल भेजेंगे।",
      "email": "ईमेल",
      "submit": "सबमिट करें",
      "cancel": "कैंसिल करें",
      "success": "हमने आपको अपना पासवर्ड अपडेट करने के लिए एक लिंक के साथ एक ईमेल भेजा है।"
    },
    "register": {
      "title": "अकाउंट बनाएं",
      "subtitle": "कृपया नीचे दी गई जानकारी भरें:",
      "first_name": "फर्स्ट नेम",
      "last_name": "लास्ट नेम",
      "email": "ईमेल",
      "password": "पासवर्ड",
      "submit": "अकाउंट बनाएं",
      "have_account": "पहले से अकाउंट है?",
      "login_here": "यहां लॉगिन करें"
    },
    "reset_password": {
      "title": "अकाउंट पासवर्ड रीसेट करें",
      "subtext": "{{ email }} के लिए नया पासवर्ड दर्ज करें",
      "password": "पासवर्ड",
      "password_confirm": "पासवर्ड कंफर्म करें",
      "submit": "पासवर्ड रीसेट करें"
    }
  },
  "blogs": {
    "article": {
      "back_to_blog": "ब्लॉग पर वापस जाएं",
      "share": "इस आर्टिकल को शेयर करें",
      "read_more": "और पढ़ें"
    },
    "list": {
      "no_articles": "अभी कोई आर्टिकल नहीं है।"
    }
  },
  "pages": {
    "blank": {
      "content": "खाली पेज"
    }
  },
  "password_page": {
    "login_form": {
      "title": "पासवर्ड का उपयोग करके स्टोर में प्रवेश करें",
      "message": "स्टोर तक पहुंचने के लिए अपना पासवर्ड दर्ज करें।",
      "submit": "एंटर करें",
      "error": "पासवर्ड सही नहीं है, कृपया दोबारा ट्राई करें।"
    }
  }
};

function assignDeep(target, pathParts, value) {
  let current = target;
  for (let i = 0; i < pathParts.length - 1; i++) {
    if (!current[pathParts[i]]) {
      current[pathParts[i]] = {};
    }
    current = current[pathParts[i]];
  }
  
  const lastPart = pathParts[pathParts.length - 1];
  if (current[lastPart] === undefined || typeof current[lastPart] === 'string') {
    current[lastPart] = value;
  } else if (typeof current[lastPart] === 'object' && typeof value === 'object') {
     Object.assign(current[lastPart], value);
  }
}

function deepMerge(target, source) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && !Array.isArray(source[key]) && source[key] !== null) {
        if (!target[key]) target[key] = {};
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

const enPath = path.join(THEME_PATH, 'locales/en.default.json');
const hiPath = path.join(THEME_PATH, 'locales/hi.json');

const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
let hiJson = {};
if (fs.existsSync(hiPath)) {
  hiJson = JSON.parse(fs.readFileSync(hiPath, 'utf8'));
}

deepMerge(enJson, defaultEn);
deepMerge(hiJson, defaultHi);

// Map variable placeholders if missing
keysArray.forEach(key => {
  const parts = key.split('.');
  
  let valEn = defaultEn;
  parts.forEach(p => valEn = (valEn && valEn[p]) ? valEn[p] : null);
  
  if (!valEn) {
    const vars = Array.from(keyVariables[key] || []);
    let defaultText = parts[parts.length - 1].replace(/_/g, ' '); 
    // capitalize
    defaultText = defaultText.charAt(0).toUpperCase() + defaultText.slice(1);

    if (vars.length > 0) {
      defaultText += " " + vars.map(v => `{{ ${v} }}`).join(" ");
    }
    assignDeep(enJson, parts, defaultText);
    assignDeep(hiJson, parts, defaultText); // generic fallback
  }
});

fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
fs.writeFileSync(hiPath, JSON.stringify(hiJson, null, 2));

console.log(`Successfully populated en.default.json and hi.json with ${keysArray.length} keys`);
