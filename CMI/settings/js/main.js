/* =============================================================
 * CMI · Panel bootstrap, wiring, and field updates
 * ============================================================= */
"use strict";

(() => {
  const CMI = window.CMI;
  const {
    $,
    $$,
    state,
    topWin,
    Svcs,
    inChrome,
    sineApi,
    prefExists,
    readPref,
    writePref,
    clearPref,
    readModFile,
    readLangPref,
    writeLangPref,
    resolveLang,
    langName,
    fmt,
    t,
  } = CMI;

  function applyField(field, value) {
    if (!field) return;
    if (field.type === "bool") {
      writePref(field.key, "bool", !!value);
    } else if (field.type === "int") {
      const num = Number(value);
      if (Number.isNaN(num)) return;
      writePref(field.key, "int", num);
    } else {
      const text = String(value ?? "");
      if (text === "") clearPref(field.key);
      else writePref(field.key, "string", text);
    }
    field.ui?.widget.sync();
    CMI.ui.refreshAllStates();
    CMI.ui.renderAdvancedValues();
    CMI.preview.updatePreview();
    CMI.config.scheduleRestyle();
  }

  function relabel() {
    CMI.ui.renderLangSelect();
    CMI.ui.applyI18n();
    CMI.ui.renderTabs();
    CMI.ui.renderPanels();
    CMI.ui.selectTab(state.activeTab);
    CMI.preview.updatePreview();
    CMI.ui.refreshAllStates();
    CMI.ui.renderConfigState();
    CMI.ui.renderMeta();
  }

  function setLanguage(value) {
    writeLangPref(value);
    relabel();
    const name = state.langPref === CMI.LANG_AUTO ? langName(state.lang) : langName(state.langPref);
    CMI.ui.toast(fmt(t("toastLanguage"), { name }));
  }

  function wire() {
    $("#btn-reset-all").addEventListener("click", async () => {
      const ok = await CMI.ui.confirmDialog(
        t("confirmResetTitle"),
        fmt(t("confirmResetText"), { count: state.fields.length }),
        t("confirmResetOk")
      );
      if (ok) await CMI.config.resetEverything();
    });

    $("#lang-select").addEventListener("change", (event) => setLanguage(event.target.value));

    $("#btn-native-menu").addEventListener("click", (event) => {
      CMI.preview.openNativeMenu(event.currentTarget);
    });

    $("#btn-export").addEventListener("click", () => {
      try {
        const count = CMI.config.downloadConfig();
        CMI.config.setConfigState("exported");
        CMI.ui.toast(t("toastExportDone", { count }));
      } catch (err) {
        CMI.config.setConfigState("error", err?.message ?? String(err));
        CMI.ui.toast(t("toastExportFail", { error: err?.message ?? err }), "danger");
      }
    });

    $("#btn-import").addEventListener("click", () => {
      const input = $("#config-file");
      if (!input) return;
      input.value = "";
      input.click();
    });

    $("#config-file").addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (file) CMI.config.importConfig(file);
    });

    $("#btn-restart").addEventListener("click", async () => {
      if (!inChrome) {
        CMI.ui.toast(t("toastPreviewOnlyRestart"), "danger");
        return;
      }
      const ok = await CMI.ui.confirmDialog(
        t("confirmRestartTitle"),
        t("confirmRestartText"),
        t("confirmRestartOk")
      );
      if (!ok) return;
      try {
        if (sineApi?.utils?.restart) {
          sineApi.utils.restart();
          return;
        }
        const CiNS = typeof Ci !== "undefined" ? Ci : topWin?.Ci;
        Svcs.startup.quit(CiNS.nsIAppStartup.eRestart | CiNS.nsIAppStartup.eAttemptQuit);
      } catch (err) {
        CMI.ui.toast(fmt(t("toastRestartFail"), { error: err?.message ?? err }), "danger");
      }
    });

    for (const link of $$(".link")) {
      link.addEventListener("click", (event) => {
        if (!inChrome) return;
        event.preventDefault();
        try {
          topWin.openTrustedLinkIn(link.href, "tab", { relatedToCurrent: true });
        } catch {
          window.open(link.href, "_blank");
        }
      });
    }

    window.addEventListener("keydown", (event) => {
      if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
      const index = Number(event.key);
      const tabs = CMI.ui.tabsWithFields();
      if (index >= 1 && index <= tabs.length) {
        event.preventDefault();
        CMI.ui.selectTab(tabs[index - 1]);
      }
    });
  }

  async function loadThemeVersion() {
    const raw = await readModFile("theme.json");
    if (!raw) return "";
    try {
      return JSON.parse(raw).version || "";
    } catch {
      return "";
    }
  }

  function normalizeEmptyStrings() {
    if (!inChrome) return;
    for (const field of state.fields) {
      if (field.type !== "string" || !prefExists(field.key)) continue;
      if (readPref(field.key, "string", "") === "") clearPref(field.key);
    }
  }

  async function init() {
    const { buildSchemaFromReadme, buildFallbackSchema, HIDDEN_KEYS } = CMI.schema;
    const readme = await readModFile("README.md");
    const parsed = readme ? buildSchemaFromReadme(readme) : [];
    if (parsed.length >= 10) {
      state.fields = parsed;
      state.source = "README.md";
    } else {
      state.fields = buildFallbackSchema();
      state.source = "built-in";
    }
    state.fields = state.fields.filter((field) => !HIDDEN_KEYS.has(field.key));
    state.byKey.clear();
    for (const field of state.fields) state.byKey.set(field.key, field);

    state.version = await loadThemeVersion();
    state.langPref = readLangPref();
    state.lang = resolveLang(state.langPref);
    state.activeTab = CMI.ui.tabsWithFields()[0] || "appearance";

    normalizeEmptyStrings();

    relabel();
    wire();

    document.documentElement.dataset.ready = "true";
  }

  CMI.applyField = applyField;
  CMI.relabel = relabel;

  init().catch((err) => {
    console.error("[CMI] preferences init failed", err);
    const banner = $("#banner");
    if (banner) {
      banner.hidden = false;
      banner.dataset.tone = "warn";
      banner.textContent = fmt(t("initFailed"), { error: err?.message ?? err });
    }
  });
})();
