// ==UserScript==
// @name           CMI-settings.uc.js
// @description    An affiliated module of CMI, opens the HTML settings panel
// @author         Starry-AXQG
// @version        v1.0
// @include        main
// @grant          none
// ==/UserScript==

// 🧩 Opens CMI/settings/preferences.html
// The HTML panel reads README.md and writes prefs; it can export/import them.
(function () {
  "use strict";

  const MOD_ID = "context-menu-icons";

  // This file is loaded through chrome://sine/content/context-menu-icons/JS/...
  // so the panel lives in CMI/settings/preferences.html.
  let SCRIPT_URL = "";
  try {
    SCRIPT_URL = Components.stack.filename.split(" -> ").pop().replace(/[?#].*$/, "");
  } catch (e) {
    SCRIPT_URL = `chrome://sine/content/${MOD_ID}/JS/CMI-settings.uc.js`;
  }
  const SETTINGS_URL = new URL("../CMI/settings/preferences.html", SCRIPT_URL).href;

  const hookedWindows = new WeakSet();
  const watchedBrowsers = new WeakSet();
  const cleanups = [];

  function log(...args) {
    try { console.debug("[cmi-settings]", ...args); } catch (e) {}
  }

  /* ------------------------------------------------------------------ *
   * Opening the panel
   * ------------------------------------------------------------------ */

  function openSettings() {
    try {
      const tabs = Array.from(window.gBrowser.tabs || []);
      const base = SETTINGS_URL.split("#")[0];
      const existing = tabs.find(
        (tab) => tab.linkedBrowser?.currentURI?.spec?.split("#")[0] === base
      );
      if (existing) {
        window.gBrowser.selectedTab = existing;
        return;
      }
      window.gBrowser.selectedTab = window.gBrowser.addTrustedTab(SETTINGS_URL);
    } catch (err) {
      console.error("[cmi-settings] failed to open panel", err);
    }
  }

  /* ------------------------------------------------------------------ *
   * Hijack the Sine config button so it opens the HTML panel instead of
   * the plain preferences.json dialog.
   * ------------------------------------------------------------------ */

  function onClickCapture(event) {
    try {
      const button = event.target?.closest?.(".sineItemConfigureButton");
      if (!button) return;
      const card = button.closest(".sineItem");
      if (!card || card.getAttribute("mod-id") !== MOD_ID) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openSettings();
    } catch (err) {
      log("configure hook failed", err);
    }
  }

  function hookAboutPreferences(win) {
    if (!win || hookedWindows.has(win)) return;
    hookedWindows.add(win);
    win.addEventListener("click", onClickCapture, true);
    cleanups.push(() => {
      try { win.removeEventListener("click", onClickCapture, true); } catch (e) {}
    });
  }

  function watchBrowser(browser) {
    if (!browser || watchedBrowsers.has(browser)) return;
    watchedBrowsers.add(browser);

    const maybeHook = () => {
      try {
        const spec = browser.currentURI?.spec || "";
        if (!/^about:(preferences|settings)/.test(spec)) return;
        hookAboutPreferences(browser.contentWindow);
      } catch (e) {}
    };

    const onLoad = () => maybeHook();
    browser.addEventListener("load", onLoad, true);
    cleanups.push(() => {
      try { browser.removeEventListener("load", onLoad, true); } catch (e) {}
    });
    maybeHook();
  }

  function installTabWatcher() {
    try {
      const listener = {
        onLocationChange(browser, webProgress, request, location) {
          try {
            if (location && /^about:(preferences|settings)/.test(location.spec)) {
              watchBrowser(browser);
            }
          } catch (e) {}
        },
        onStateChange(browser, webProgress, request, stateFlags) {
          try {
            const done = Ci.nsIWebProgressListener.STATE_STOP;
            if ((stateFlags & done) === 0) return;
            const spec = browser.currentURI?.spec || "";
            if (/^about:(preferences|settings)/.test(spec)) watchBrowser(browser);
          } catch (e) {}
        },
      };
      window.gBrowser.addTabsProgressListener(listener);
      cleanups.push(() => {
        try { window.gBrowser.removeTabsProgressListener(listener); } catch (e) {}
      });
      for (const browser of window.gBrowser.browsers || []) {
        const spec = browser.currentURI?.spec || "";
        if (/^about:(preferences|settings)/.test(spec)) watchBrowser(browser);
      }
    } catch (err) {
      log("tab watcher failed", err);
    }
  }

  /* ------------------------------------------------------------------ *
   * Lifecycle
   * ------------------------------------------------------------------ */

  function unload() {
    while (cleanups.length) {
      try { cleanups.pop()(); } catch (e) {}
    }
    try { delete window.CMI; } catch (e) {}
    try { delete window.CMISettings; } catch (e) {}
  }

  function init() {
    installTabWatcher();
    window.CMISettings = {
      settingsURL: SETTINGS_URL,
      openSettings,
      unload,
    };
    log("ready:", SETTINGS_URL);
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(init, 400);
  } else {
    window.addEventListener("load", () => setTimeout(init, 400), { once: true });
  }

  try { window.addUnloadListener?.(unload); } catch (e) {}
  window.addEventListener("unload", unload, { once: true });
})();
