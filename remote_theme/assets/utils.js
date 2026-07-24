// Custom PubSub for Cross-Component Communication
class EventBus {
  constructor() {
    this.events = {};
  }
  subscribe(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
    return () => {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    };
  }
  publish(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }
}

window.PubSub = new EventBus();

// DOM Ready Helper
window.domReady = function(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
};

// Debounce helper
window.debounce = function(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

// Money Formatter (looks at shop format or standard USD fallback)
window.formatMoney = function(cents, format = "${{amount}}") {
  if (typeof cents === 'string') cents = cents.replace('.', '');
  let value = '';
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  const formatString = format || "${{amount}}";

  function floatToString(numeric, decimals) {
    let string = numeric.toFixed(decimals).toString();
    if (string.match(/^\.\d+/)) {
      return "0" + string;
    } else {
      return string;
    }
  }

  let centsInt = parseInt(cents, 10);
  if (isNaN(centsInt)) centsInt = 0;

  switch (formatString.match(placeholderRegex)?.[1]) {
    case 'amount':
      value = floatToString(centsInt / 100.0, 2);
      break;
    case 'amount_no_decimals':
      value = floatToString(centsInt / 100.0, 0);
      break;
    case 'amount_with_comma_separator':
      value = floatToString(centsInt / 100.0, 2).replace(/\./, ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = floatToString(centsInt / 100.0, 0).replace(/\./, ',');
      break;
    default:
      value = floatToString(centsInt / 100.0, 2);
  }

  return formatString.replace(placeholderRegex, value);
};

// Fetch Wrapper with error handling
window.fetchWrapper = async function(url, options = {}) {
  const defaultHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
  options.headers = { ...defaultHeaders, ...options.headers };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.description || data.message || `HTTP error ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error(`[Fetch API Error] URL: ${url}`, error);
    throw error;
  }
};
