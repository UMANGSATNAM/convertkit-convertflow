/**
 * ConvertKit ConvertFlow — Visual Section Inspector
 * Injected inline into the proxied store page.
 * Self-contained vanilla JS — no imports, no dependencies, no build step.
 */
(function () {
  "use strict";

  var inspectorEnabled = true;
  var activeSection = null;
  var overlay = null;
  var tooltip = null;

  // ── Create overlay ──
  function createOverlay() {
    overlay = document.createElement("div");
    overlay.id = "__ck_overlay";
    overlay.style.cssText =
      "position:fixed;pointer-events:none;border:2px solid #4F46E5;border-radius:4px;" +
      "background:rgba(79,70,229,0.06);z-index:2147483646;display:none;" +
      "transition:top 0.12s ease,left 0.12s ease,width 0.12s ease,height 0.12s ease;" +
      "box-shadow:0 0 0 1px rgba(79,70,229,0.3);";
    document.body.appendChild(overlay);
  }

  // ── Create tooltip ──
  function createTooltip() {
    tooltip = document.createElement("div");
    tooltip.id = "__ck_tooltip";
    tooltip.style.cssText =
      "position:fixed;background:#4F46E5;color:#fff;padding:4px 10px;border-radius:4px;" +
      "font-size:11px;font-family:system-ui,-apple-system,sans-serif;font-weight:600;" +
      "pointer-events:none;z-index:2147483647;display:none;white-space:nowrap;" +
      "box-shadow:0 2px 8px rgba(0,0,0,0.15);";
    document.body.appendChild(tooltip);
  }

  // ── Section detection ──
  function getSectionForElement(el) {
    var node = el;
    var maxDepth = 30;
    while (node && node !== document.body && maxDepth-- > 0) {
      if (node.dataset && node.dataset.sectionId) {
        return {
          sectionId: node.dataset.sectionId,
          sectionType: node.dataset.sectionType || "",
          element: node,
        };
      }
      if (node.id && node.id.indexOf("shopify-section-") === 0) {
        var id = node.id.replace("shopify-section-", "");
        return {
          sectionId: id,
          sectionType: node.dataset ? node.dataset.sectionType || "" : "",
          element: node,
        };
      }
      node = node.parentElement;
    }
    return null;
  }

  // ── Position overlay over element ──
  function positionOverlay(rect) {
    if (!overlay) return;
    overlay.style.top = rect.top + "px";
    overlay.style.left = rect.left + "px";
    overlay.style.width = rect.width + "px";
    overlay.style.height = rect.height + "px";
    overlay.style.display = "block";
  }

  // ── Position tooltip above element ──
  function positionTooltip(rect, label) {
    if (!tooltip) return;
    tooltip.textContent = label;
    tooltip.style.display = "block";
    var tooltipTop = rect.top - 28;
    if (tooltipTop < 4) tooltipTop = rect.bottom + 6;
    tooltip.style.top = tooltipTop + "px";
    tooltip.style.left = Math.max(4, rect.left) + "px";
  }

  function hideOverlay() {
    if (overlay) overlay.style.display = "none";
    if (tooltip) tooltip.style.display = "none";
    activeSection = null;
  }

  // ── Mousemove: highlight sections ──
  document.addEventListener(
    "mousemove",
    function (e) {
      if (!inspectorEnabled) return;

      // Temporarily hide overlay so elementFromPoint works
      if (overlay) overlay.style.display = "none";
      if (tooltip) tooltip.style.display = "none";

      var target = document.elementFromPoint(e.clientX, e.clientY);
      if (!target) {
        hideOverlay();
        return;
      }

      var section = getSectionForElement(target);
      if (section) {
        activeSection = section;
        var rect = section.element.getBoundingClientRect();
        positionOverlay(rect);
        var label = section.sectionType
          ? section.sectionId + " (" + section.sectionType + ")"
          : section.sectionId;
        positionTooltip(rect, label);
      } else {
        hideOverlay();
      }
    },
    { passive: true }
  );

  // ── Mouseleave: hide everything ──
  document.addEventListener("mouseleave", function () {
    hideOverlay();
  });

  // ── Click: select section (capture phase) ──
  document.addEventListener(
    "click",
    function (e) {
      if (!inspectorEnabled) return;
      if (!activeSection) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Flash overlay green for feedback
      if (overlay) {
        overlay.style.borderColor = "#059669";
        overlay.style.background = "rgba(5,150,105,0.08)";
        setTimeout(function () {
          overlay.style.borderColor = "#4F46E5";
          overlay.style.background = "rgba(79,70,229,0.06)";
        }, 300);
      }

      window.parent.postMessage(
        {
          type: "CK_SECTION_CLICKED",
          sectionId: activeSection.sectionId,
          sectionType: activeSection.sectionType,
        },
        "*"
      );
    },
    true // capture phase
  );

  // ── Message handler ──
  window.addEventListener("message", function (e) {
    if (!e.data || typeof e.data.type !== "string") return;
    if (e.data.type.indexOf("CK_") !== 0) return;

    switch (e.data.type) {
      case "CK_INJECT_CSS":
        var styleEl = document.getElementById("__ck_injected_css");
        if (!styleEl) {
          styleEl = document.createElement("style");
          styleEl.id = "__ck_injected_css";
          document.head.appendChild(styleEl);
        }
        styleEl.textContent = e.data.css || "";
        break;

      case "CK_INJECT_HTML":
        if (e.data.sectionId && e.data.html) {
          var sectionEl = document.getElementById(
            "shopify-section-" + e.data.sectionId
          );
          if (sectionEl) {
            sectionEl.innerHTML = e.data.html;
          }
        }
        break;

      case "CK_GET_SECTIONS":
        var nodes = document.querySelectorAll("[data-section-id]");
        var sections = [];
        for (var i = 0; i < nodes.length; i++) {
          var n = nodes[i];
          sections.push({
            sectionId: n.dataset.sectionId,
            sectionType: n.dataset.sectionType || "",
            rect: n.getBoundingClientRect(),
          });
        }
        // Also check by shopify-section- prefix
        var byId = document.querySelectorAll('[id^="shopify-section-"]');
        for (var j = 0; j < byId.length; j++) {
          var node = byId[j];
          var sid = node.id.replace("shopify-section-", "");
          var exists = false;
          for (var k = 0; k < sections.length; k++) {
            if (sections[k].sectionId === sid) { exists = true; break; }
          }
          if (!exists) {
            sections.push({
              sectionId: sid,
              sectionType: node.dataset.sectionType || "",
              rect: node.getBoundingClientRect(),
            });
          }
        }
        window.parent.postMessage(
          { type: "CK_SECTIONS_LIST", sections: sections },
          "*"
        );
        break;

      case "CK_TOGGLE_INSPECTOR":
        inspectorEnabled = !!e.data.enabled;
        if (!inspectorEnabled) hideOverlay();
        break;
    }
  });

  // ── Init ──
  function init() {
    createOverlay();
    createTooltip();
    window.parent.postMessage({ type: "CK_INSPECTOR_READY" }, "*");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
