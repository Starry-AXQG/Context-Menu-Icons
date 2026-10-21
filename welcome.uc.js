// ==UserScript==
// @name           Context Menu Icons Welcome
// @description    Shows a one-time setup guide and interactive menu preview.
// @author         Starry-AXQG
// @version        1.0
// @include        main
// @grant          none
// ==/UserScript==

(function () {
  "use strict";

  // Bump this key so users who ran an earlier build with an invisible overlay
  // are not incorrectly treated as having completed the guide.
  const PREF_NAME = "cmi-welcome.v2.has-shown";
  const ROOT_ID = "cmi-welcome";
  const STRINGS = [
    {
      eyebrow: "WELCOME TO CMI",
      title: "Make every right-click feel at home.",
      body: "Choose an icon style, tidy up long menus, and shape your browser to fit the way you work.",
      label: "Your menu, your style",
      detail: "Switch between two icon families at any time in Sine preferences.",
    },
    {
      eyebrow: "01 · PICK YOUR ICONS",
      title: "Start with a look you love.",
      body: "FluentUI is crisp and familiar. ZenUI uses a softer, browser-native feel. You can change your choice whenever you like.",
      label: "Icon package",
      detail: "In Sine → Context Menu Icons preferences, choose FluentUI or ZenUI.",
    },
    {
      eyebrow: "02 · KEEP MENUS TIDY",
      title: "Keep the useful things close.",
      body: "Hide unavailable actions automatically, or fold the items you rarely use into one neat submenu.",
      label: "A calmer context menu",
      detail: "Enable “Hide inactive items” or “CMI fold menu JS” in Sine preferences.",
    },
    {
      eyebrow: "03 · MAKE IT YOURS",
      title: "Tune the little details.",
      body: "Center your bookmarks, hide folder icons, or let the bookmark bar appear only when you need it.",
      label: "Fine-tune your browser",
      detail: "All options are available from the Context Menu Icons settings in Sine.",
    },
  ];

  function getPrefs() {
    try {
      if (typeof Services !== "undefined" && Services.prefs) return Services.prefs;
    } catch (_) {
    }
    try {
      if (typeof ChromeUtils !== "undefined" && ChromeUtils.importESModule) {
        return ChromeUtils.importESModule("resource://gre/modules/Services.sys.mjs").Services.prefs;
      }
    } catch (_) {
    }
    try {
      if (typeof Components !== "undefined" && Components.utils) {
        return Components.utils.import("resource://gre/modules/Services.jsm", {}).Services.prefs;
      }
    } catch (_) {
    }
    return null;
  }

  function createWelcome() {
    if (document.getElementById(ROOT_ID)) return;
    const prefs = getPrefs();
    if (prefs) {
      try {
        if (prefs.getBoolPref(PREF_NAME, false)) return;
      } catch (_) {
      }
    }

    const root = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
    root.id = ROOT_ID;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-labelledby", "cmi-welcome-title");
    root.innerHTML = `
      <div class="cmi-welcome-backdrop"></div>
      <section class="cmi-welcome-card">
        <button class="cmi-welcome-close" type="button" aria-label="Close welcome guide">×</button>
        <div class="cmi-welcome-copy">
          <div class="cmi-welcome-brand"><span class="cmi-brand-mark">CM</span><span>CONTEXT MENU ICONS</span></div>
          <p class="cmi-welcome-eyebrow"></p>
          <h1 id="cmi-welcome-title"></h1>
          <p class="cmi-welcome-body"></p>
          <div class="cmi-welcome-tip"><span class="cmi-tip-icon">✦</span><div><strong class="cmi-tip-title"></strong><p class="cmi-tip-detail"></p></div></div>
          <div class="cmi-welcome-footer">
            <div class="cmi-welcome-dots" aria-label="Guide progress"></div>
            <div class="cmi-welcome-actions"><button class="cmi-welcome-back" type="button">Back</button><button class="cmi-welcome-next" type="button">Get started <span aria-hidden="true">→</span></button></div>
          </div>
        </div>
        <div class="cmi-welcome-preview-wrap">
          <div class="cmi-preview-heading"><span>LIVE PREVIEW</span><span class="cmi-preview-status"><i></i> MENU STYLE</span></div>
          <div class="cmi-preview-stage">
            <div class="cmi-preview-context">
              <div class="cmi-preview-site"><span class="cmi-site-dot"></span><span>example.com</span><span class="cmi-site-more">···</span></div>
              <div class="cmi-preview-separator"></div>
              <div class="cmi-preview-item"><span class="cmi-preview-icon cmi-icon-link"></span><span>Open Link in New Tab</span><kbd>Ctrl</kbd></div>
              <div class="cmi-preview-item"><span class="cmi-preview-icon cmi-icon-window"></span><span>Open Link in New Window</span></div>
              <div class="cmi-preview-item"><span class="cmi-preview-icon cmi-icon-private"></span><span>Open Link in Private Window</span></div>
              <div class="cmi-preview-separator"></div>
              <div class="cmi-preview-item"><span class="cmi-preview-icon cmi-icon-copy"></span><span>Copy Link</span><kbd>⌘C</kbd></div>
              <div class="cmi-preview-item cmi-preview-toggle"><span class="cmi-preview-check">✓</span><span>Show more options</span><span class="cmi-preview-chevron">›</span></div>
              <div class="cmi-preview-folded"><span>⇧</span> Bookmark Link<br><span>⇧</span> Save Link As…</div>
            </div>
            <div class="cmi-preview-caption">A cleaner menu, with the actions you need.</div>
          </div>
          <div class="cmi-preview-switcher"><span>PREVIEW STYLE</span><div><button type="button" data-package="fluent" class="is-active">FluentUI</button><button type="button" data-package="zen">ZenUI</button></div></div>
        </div>
      </section>`;

    document.documentElement.appendChild(root);
    // Persist only after the overlay has been created, so a failed first run
    // can be retried after the script is fixed or updated.
    try { if (prefs) prefs.setBoolPref(PREF_NAME, true); } catch (_) {}
    let step = 0;
    const title = root.querySelector("#cmi-welcome-title");
    const eyebrow = root.querySelector(".cmi-welcome-eyebrow");
    const body = root.querySelector(".cmi-welcome-body");
    const tipTitle = root.querySelector(".cmi-tip-title");
    const tipDetail = root.querySelector(".cmi-tip-detail");
    const dots = root.querySelector(".cmi-welcome-dots");
    const back = root.querySelector(".cmi-welcome-back");
    const next = root.querySelector(".cmi-welcome-next");

    function close() {
      root.classList.add("is-closing");
      window.setTimeout(() => root.remove(), 220);
    }

    function render() {
      const content = STRINGS[step];
      eyebrow.textContent = content.eyebrow;
      title.textContent = content.title;
      body.textContent = content.body;
      tipTitle.textContent = content.label;
      tipDetail.textContent = content.detail;
      back.disabled = step === 0;
      next.innerHTML = step === STRINGS.length - 1 ? 'Open Sine settings <span aria-hidden="true">→</span>' : 'Next <span aria-hidden="true">→</span>';
      dots.replaceChildren(...STRINGS.map((_, index) => {
        const dot = document.createElementNS("http://www.w3.org/1999/xhtml", "span");
        dot.className = index === step ? "is-active" : "";
        dot.setAttribute("aria-hidden", "true");
        return dot;
      }));
      root.classList.toggle("is-first", step === 0);
    }

    root.querySelector(".cmi-welcome-close").addEventListener("click", close);
    root.querySelector(".cmi-welcome-backdrop").addEventListener("click", close);
    back.addEventListener("click", () => { if (step > 0) { step -= 1; render(); } });
    next.addEventListener("click", () => {
      if (step < STRINGS.length - 1) { step += 1; render(); return; }
      close();
      try { gBrowser.selectedTab = gBrowser.addTab("about:preferences#sine"); } catch (_) {}
    });
    root.querySelectorAll("[data-package]").forEach((button) => button.addEventListener("click", () => {
      root.querySelectorAll("[data-package]").forEach((item) => item.classList.toggle("is-active", item === button));
      root.querySelector(".cmi-preview-context").dataset.package = button.dataset.package;
    }));
    window.addEventListener("keydown", function onKey(event) {
      if (event.key === "Escape" && document.getElementById(ROOT_ID)) {
        close();
        window.removeEventListener("keydown", onKey);
      }
    });
    render();
  }

  if (document.readyState === "complete") window.setTimeout(createWelcome, 1200);
  else window.addEventListener("load", () => window.setTimeout(createWelcome, 1200), { once: true });
})();
