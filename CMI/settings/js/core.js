/* =============================================================
 * CMI · Core runtime, preferences, file IO, and i18n helpers
 * ============================================================= */
"use strict";

(() => {
  const MOD_ID = "context-menu-icons";
  const SVG_PREF = "svg.context-properties.content.enabled";
  const LANG_PREF = "language.config";
  const LANG_AUTO = "auto";

  const topWin = (() => {
    try {
      return window.browsingContext?.topChromeWindow ?? null;
    } catch {
      return null;
    }
  })();

  // A chrome:// page in a tab does not always get a global `Services`.
  const Svcs = (() => {
    try {
      if (typeof Services !== "undefined" && Services?.prefs) return Services;
    } catch {}
    try {
      if (topWin?.Services?.prefs) return topWin.Services;
    } catch {}
    try {
      const mod = ChromeUtils.importESModule("resource://gre/modules/Services.sys.mjs");
      if (mod?.Services?.prefs) return mod.Services;
      if (mod?.prefs) return mod;
    } catch {}
    return null;
  })();

  const hasServices = !!Svcs;
  const inChrome = hasServices;

  const sineApi = (() => {
    try {
      return topWin?.SineAPI ?? null;
    } catch {
      return null;
    }
  })();

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function debounce(fn, ms) {
    let timer = 0;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  }

  // ---------------------------------------------------------
  // State
  // ---------------------------------------------------------
  const state = {
    fields: [],
    byKey: new Map(),
    source: "README.md",
    version: "",
    activeTab: "appearance",
    lang: "en",
    langPref: LANG_AUTO,
    config: { status: "idle", detail: "" },
  };

  function fieldOf(key) {
    return state.byKey.get(key) || null;
  }

  // ---------------------------------------------------------
  // Preferences
  // ---------------------------------------------------------
  const store = new Map();

  function prefType(key) {
    if (!hasServices) return store.has(key) ? 1 : 0;
    try {
      return Svcs.prefs.getPrefType(key);
    } catch {
      return 0;
    }
  }

  function prefExists(key) {
    return prefType(key) !== 0;
  }

  function readPref(key, kind, fallback) {
    if (!hasServices) return store.has(key) ? store.get(key) : fallback;
    try {
      if (!prefExists(key)) return fallback;
      if (kind === "bool") return Svcs.prefs.getBoolPref(key);
      if (kind === "int") return Svcs.prefs.getIntPref(key);
      return Svcs.prefs.getStringPref(key);
    } catch {
      return fallback;
    }
  }

  function writePref(key, kind, value) {
    if (!hasServices) {
      store.set(key, value);
      return;
    }
    try {
      if (kind === "bool") Svcs.prefs.setBoolPref(key, !!value);
      else if (kind === "int") Svcs.prefs.setIntPref(key, Math.round(Number(value)) || 0);
      else Svcs.prefs.setStringPref(key, String(value));
    } catch (err) {
      console.error("[CMI] failed to write pref", key, err);
    }
  }

  function clearPref(key) {
    if (!hasServices) {
      store.delete(key);
      return;
    }
    try {
      if (prefExists(key)) Svcs.prefs.clearUserPref(key);
    } catch (err) {
      console.error("[CMI] failed to clear pref", key, err);
    }
  }

  function defaultValueOf(field) {
    if (field.hasDefault) return field.default;
    return field.type === "bool" ? false : field.type === "int" ? 0 : "";
  }

  function currentValue(field) {
    if (!field) return null;
    return readPref(field.key, field.type, defaultValueOf(field));
  }

  function valueOf(key, fallback) {
    const field = fieldOf(key);
    if (!field) return fallback;
    const value = currentValue(field);
    return value === "" || value == null ? fallback : value;
  }

  function isModified(field) {
    const value = currentValue(field);
    if (!field.hasDefault) return prefExists(field.key);
    if (field.type === "bool") return !!value !== !!field.default;
    if (field.type === "int") return Number(value) !== Number(field.default);
    return String(value ?? "") !== String(field.default ?? "");
  }

  // ---------------------------------------------------------
  // Mod file access
  // ---------------------------------------------------------
  function ioTools() {
    const out = {};
    try {
      if (typeof IOUtils !== "undefined") out.IOUtils = IOUtils;
      if (typeof PathUtils !== "undefined") out.PathUtils = PathUtils;
    } catch {}
    if (!out.IOUtils && topWin?.IOUtils) out.IOUtils = topWin.IOUtils;
    if (!out.PathUtils && topWin?.PathUtils) out.PathUtils = topWin.PathUtils;
    if ((!out.IOUtils || !out.PathUtils) && typeof ChromeUtils !== "undefined") {
      try {
        if (!out.IOUtils) {
          const mod = ChromeUtils.importESModule("resource://gre/modules/IOUtils.sys.mjs");
          out.IOUtils = mod.IOUtils ?? mod;
        }
        if (!out.PathUtils) {
          const mod = ChromeUtils.importESModule("resource://gre/modules/PathUtils.sys.mjs");
          out.PathUtils = mod.PathUtils ?? mod;
        }
      } catch {}
    }
    return out;
  }

  function modRootCandidates() {
    const { PathUtils } = ioTools();
    const out = [];
    try {
      const folder = sineApi?.utils?.getModFolder?.(MOD_ID);
      if (folder) out.push(folder);
    } catch {}
    if (PathUtils) {
      try {
        out.push(PathUtils.join(PathUtils.profileDir, "chrome", "sine-mods", MOD_ID));
      } catch {}
      try {
        out.push(PathUtils.join(PathUtils.profileDir, "chrome", MOD_ID));
      } catch {}
    }
    return out;
  }

  async function readModFile(relPath) {
    const { IOUtils } = ioTools();
    if (IOUtils) {
      for (const root of modRootCandidates()) {
        try {
          return await IOUtils.readUTF8(`${root}/${relPath}`);
        } catch {}
      }
    }
    // Panel lives in CMI/settings/, so mod root is two levels up (../../).
    for (const rel of [`../../${relPath}`, `../${relPath}`, `./${relPath}`]) {
      try {
        const res = await fetch(rel, { cache: "no-store" });
        if (res.ok) {
          const text = await res.text();
          if (text && !/^<!doctype html/i.test(text.trim())) return text;
        }
      } catch {}
      try {
        const text = await new Promise((resolve) => {
          const xhr = new XMLHttpRequest();
          xhr.open("GET", rel, true);
          xhr.overrideMimeType("text/plain; charset=utf-8");
          xhr.onload = () => resolve(xhr.status === 200 || xhr.status === 0 ? xhr.responseText : null);
          xhr.onerror = () => resolve(null);
          xhr.send();
        });
        if (text && !/^<!doctype html/i.test(text.trim())) return text;
      } catch {}
    }
    return null;
  }

  // ---------------------------------------------------------
  // i18n
  // ---------------------------------------------------------
  const LOCALES = (() => {
    try {
      const bundle = window.CMI_LOCALES;
      if (bundle?.locales && Array.isArray(bundle.order) && bundle.order.length) {
        return { map: bundle.locales, order: bundle.order };
      }
    } catch {}
    return { map: { en: { name: "English" } }, order: ["en"] };
  })();

  function localeOf(id) {
    return LOCALES.map[id] || LOCALES.map.en || null;
  }

  function normalizeTag(tag) {
    return String(tag || "").replace(/_/g, "-").trim();
  }

  function matchLocale(tag) {
    const raw = normalizeTag(tag).toLowerCase();
    if (!raw) return null;
    for (const id of LOCALES.order) {
      if (id.toLowerCase() === raw) return id;
    }
    const base = raw.split("-")[0];
    if (base === "zh") {
      if (/-(tw|hk|mo|hant)/.test(raw) && LOCALES.order.includes("zh-TW")) return "zh-TW";
      if (LOCALES.order.includes("zh-CN")) return "zh-CN";
    }
    for (const id of LOCALES.order) {
      if (id.toLowerCase().split("-")[0] === base) return id;
    }
    return null;
  }

  function browserLocales() {
    const tags = [];
    try {
      if (Svcs) tags.push(...Svcs.locale.getAppLocalesAsBCP47());
    } catch {}
    try {
      if (Svcs) tags.push(Svcs.locale.getAppLocaleAsBCP47());
    } catch {}
    try {
      if (navigator.languages) tags.push(...navigator.languages);
    } catch {}
    try {
      if (navigator.language) tags.push(navigator.language);
    } catch {}
    return tags.filter(Boolean);
  }

  function browserLocale() {
    for (const tag of browserLocales()) {
      const hit = matchLocale(tag);
      if (hit) return hit;
    }
    return "en";
  }

  function resolveLang(prefValue) {
    const value = String(prefValue ?? "");
    if (value && value !== LANG_AUTO) {
      const hit = matchLocale(value);
      if (hit) return hit;
    }
    return browserLocale();
  }

  function readLangPref() {
    const raw = readPref(LANG_PREF, "string", "");
    return String(raw || "").trim() || LANG_AUTO;
  }

  function writeLangPref(value) {
    const text = String(value || LANG_AUTO);
    if (text === LANG_AUTO) clearPref(LANG_PREF);
    else writePref(LANG_PREF, "string", text);
    state.langPref = text;
    state.lang = resolveLang(text);
  }

  function pick(group, key) {
    const active = localeOf(state.lang);
    const english = localeOf("en");
    const value = active?.[group]?.[key];
    return value != null ? value : english?.[group]?.[key];
  }

  function fmt(text, vars) {
    return String(text).replace(/\{(\w+)\}/g, (match, key) =>
      vars && Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : match
    );
  }

  function t(key, vars) {
    const value = pick("ui", key);
    return fmt(value != null ? value : key, vars);
  }

  function langName(id) {
    return localeOf(id)?.name || id;
  }

  function fieldText(field) {
    if (!field) return null;
    const keys = [field.key];
    if (/_[12]$/.test(field.key)) keys.push(field.key.replace(/_[12]$/, "_x"));
    const order = [state.lang, "en"].filter((id, index, list) => id && list.indexOf(id) === index);
    for (const id of order) {
      const table = localeOf(id)?.fields;
      if (!table) continue;
      for (const key of keys) {
        if (Array.isArray(table[key])) return table[key];
      }
    }
    return null;
  }

  function fieldLabel(field) {
    const entry = fieldText(field);
    const base = entry?.[0] || field.key.replace(/_[12]$/, "");
    return field.pack ? `${base} · ${field.pack}` : base;
  }

  function fieldHelp(field) {
    const entry = fieldText(field);
    return entry?.[1] || field.readme || "";
  }

  function tabText(id, part) {
    return pick("tabs", id)?.[part] || "";
  }

  function groupText(id) {
    const value = pick("groups", id);
    return value != null ? value : id;
  }

  function enumText(field, value) {
    const table = pick("enum", field.key);
    const label = table?.[String(value)];
    if (label) return label;
    const option = (field.options || []).find((item) => Number(item.value) === Number(value));
    return option ? option.label : String(value);
  }

  window.CMI = {
    MOD_ID,
    SVG_PREF,
    LANG_PREF,
    LANG_AUTO,
    topWin,
    Svcs,
    inChrome,
    sineApi,
    $,
    $$,
    el,
    debounce,
    state,
    fieldOf,
    prefExists,
    readPref,
    writePref,
    clearPref,
    defaultValueOf,
    currentValue,
    valueOf,
    isModified,
    readModFile,
    LOCALES,
    browserLocale,
    resolveLang,
    readLangPref,
    writeLangPref,
    pick,
    fmt,
    t,
    langName,
    fieldLabel,
    fieldHelp,
    tabText,
    groupText,
    enumText,
  };
})();
