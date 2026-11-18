/* =============================================================
 * CMI · Configuration export, import, reset, and live restyle
 * ============================================================= */
"use strict";

(() => {
  const CMI = window.CMI;
  const {
    SVG_PREF,
    state,
    sineApi,
    fieldOf,
    prefExists,
    currentValue,
    defaultValueOf,
    writePref,
    clearPref,
    readLangPref,
    writeLangPref,
    debounce,
    t,
  } = CMI;

  const CONFIG_FILE = "CMI-config.json";
  const CONFIG_KIND = "cmi-config";
  const CONFIG_SCHEMA = 1;

  const scheduleRestyle = debounce(() => {
    try {
      sineApi?.manager?.rebuildMods?.(false);
    } catch (err) {
      console.warn("[CMI] rebuildMods failed", err);
    }
  }, 260);

  function exportValue(field) {
    if (!prefExists(field.key)) return null;
    const value = currentValue(field);
    if (value === "" || value == null) return null;
    return field.type === "bool" ? !!value : field.type === "int" ? Number(value) : String(value);
  }

  function buildConfig() {
    const prefs = {};
    const defaults = {};
    for (const field of state.fields) {
      const value = exportValue(field);
      if (value !== null) prefs[field.key] = value;
      const def = defaultValueOf(field);
      if (def !== "" && def != null) {
        defaults[field.key] = field.type === "bool" ? !!def : field.type === "int" ? Number(def) : String(def);
      }
    }
    return {
      _kind: CONFIG_KIND,
      _schema: CONFIG_SCHEMA,
      _generator: `Context Menu Icons${state.version ? ` v${state.version}` : ""}`,
      _exportedAt: new Date().toISOString(),
      language: readLangPref(),
      preferences: prefs,
      defaults,
    };
  }

  function downloadConfig() {
    const payload = buildConfig();
    const text = `${JSON.stringify(payload, null, 2)}\n`;
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = CONFIG_FILE;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return Object.keys(payload.preferences).length;
  }

  function parseConfig(text) {
    let data = null;
    try {
      data = JSON.parse(text);
    } catch {
      return null;
    }
    if (!data || typeof data !== "object") return null;
    const prefs = data.preferences || data;
    if (!prefs || typeof prefs !== "object" || Array.isArray(prefs)) return null;
    const known = new Set(state.fields.map((field) => field.key));
    const applied = [];
    for (const [key, value] of Object.entries(prefs)) {
      if (!known.has(key)) continue;
      const field = fieldOf(key);
      if (!field || value === null || value === undefined) continue;
      applied.push([field, value]);
    }
    if (!applied.length) return null;
    return { data, applied };
  }

  function setConfigState(status, detail) {
    state.config.status = status;
    state.config.detail = detail || "";
    CMI.ui?.renderConfigState();
  }

  async function resetEverything({ silent = false } = {}) {
    for (const field of state.fields) {
      const def = defaultValueOf(field);
      if (field.type === "bool") writePref(field.key, "bool", !!def);
      else if (field.type === "int") writePref(field.key, "int", Number(def) || 0);
      else if (def === "" || def == null) clearPref(field.key);
      else writePref(field.key, "string", String(def));
    }
    if (fieldOf(SVG_PREF)) writePref(SVG_PREF, "bool", true);

    for (const field of state.fields) field.ui?.widget.sync();
    CMI.ui?.refreshAllStates();
    CMI.ui?.renderAdvancedValues();
    CMI.preview?.updatePreview();
    scheduleRestyle();

    if (silent) return;
    setConfigState("saved");
    CMI.ui?.toast(t("toastResetDone"));
  }

  async function applyConfig(data, applied) {
    await resetEverything({ silent: true });
    for (const [field, value] of applied) {
      if (field.type === "bool") writePref(field.key, "bool", !!value);
      else if (field.type === "int") {
        const num = Number(value);
        if (!Number.isNaN(num)) writePref(field.key, "int", num);
      } else {
        const text = String(value ?? "");
        if (text === "") clearPref(field.key);
        else writePref(field.key, "string", text);
      }
    }
    if (fieldOf(SVG_PREF)) writePref(SVG_PREF, "bool", true);
    if (typeof data.language === "string" && data.language) writeLangPref(data.language);

    state.langPref = readLangPref();
    state.lang = CMI.resolveLang(state.langPref);
    CMI.relabel?.();
    scheduleRestyle();
  }

  async function readJsonFile(file) {
    if (!file) return null;
    try {
      return await file.text();
    } catch {}
    try {
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
      });
    } catch {
      return null;
    }
  }

  async function importConfig(file) {
    const text = await readJsonFile(file);
    if (!text) {
      CMI.ui?.toast(t("toastImportInvalid"), "danger");
      return;
    }
    const parsed = parseConfig(text);
    if (!parsed) {
      CMI.ui?.toast(t("toastImportInvalid"), "danger");
      return;
    }
    const ok = await CMI.ui.confirmDialog(
      t("confirmImportTitle"),
      t("confirmImportText"),
      t("confirmImportOk")
    );
    if (!ok) return;
    try {
      await applyConfig(parsed.data, parsed.applied);
      setConfigState("imported");
      CMI.ui?.toast(t("toastImportDone", { count: parsed.applied.length }));
    } catch (err) {
      setConfigState("error");
      CMI.ui?.toast(t("toastImportFail", { error: err?.message ?? err }), "danger");
    }
  }

  CMI.config = {
    scheduleRestyle,
    buildConfig,
    downloadConfig,
    importConfig,
    resetEverything,
    setConfigState,
  };
})();
