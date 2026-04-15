(function () {
  var errorMessages = [];

  function ensureBanner() {
    var banner = document.getElementById("startup-error-banner");
    if (banner) return banner;

    banner = document.createElement("div");
    banner.id = "startup-error-banner";
    banner.style.cssText = [
      "position:sticky",
      "top:0",
      "z-index:10000",
      "padding:10px 14px",
      "background:#7a1f1f",
      "color:#ffd9d9",
      "border-bottom:1px solid #b04b4b",
      "font:600 13px/1.35 Arial, sans-serif"
    ].join(";");
    document.body.insertBefore(banner, document.body.firstChild);
    return banner;
  }

  function showError(message) {
    var banner = ensureBanner();
    banner.textContent = message;
  }

  function pushError(message) {
    if (!message) return;
    errorMessages.push(String(message));
  }

  window.addEventListener("error", function (event) {
    var target = event && event.target;
    if (target && target.tagName === "SCRIPT") {
      var src = target.getAttribute("src") || "unknown script";
      pushError("Script failed to load: " + src);
    } else if (event && event.message) {
      pushError("Runtime error: " + event.message);
    }
  }, true);

  window.addEventListener("unhandledrejection", function (event) {
    var reason = event && event.reason;
    if (reason && reason.message) {
      pushError("Unhandled promise rejection: " + reason.message);
      return;
    }
    pushError("Unhandled promise rejection occurred during startup.");
  });

  function browserLooksLegacy() {
    try {
      // If this throws in parse/eval, browser lacks modern JS support required by app.js.
      eval("var __chk = ({a:1})?.a ?? 0;");
      return false;
    } catch (e) {
      return true;
    }
  }

  window.addEventListener("load", function () {
    setTimeout(function () {
      if (window.__LUMINOR_BOOT_OK) return;

      var message = "Dashboard failed to initialize.";

      if (browserLooksLegacy()) {
        message += " This browser is too old for the current build. Use latest Chrome, Edge, or Firefox.";
      }

      if (errorMessages.length) {
        message += " " + errorMessages[0];
      }

      showError(message);
      if (window.console && console.error) {
        console.error("Startup guard detected init failure", {
          errors: errorMessages,
          userAgent: navigator.userAgent
        });
      }
    }, 800);
  });
})();
