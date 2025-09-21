// ==UserScript==
// @name           CMI-fold_menu.uc.js
// @description    An affiliated module of CMI, used for folding the context menu
// @author         Starry-AXQG
// @version        v2.1
// @include        main
// @grant          none
// ==/UserScript==


(function () {
  "use strict";

  const TARGET_MENU_ID = "contentAreaContextMenu";
  let MOVE_IDS = [];
  const MORE_MENU_ID = "cmi-show-more-menu";
  const MORE_POPUP_ID = "cmi-show-more-menupopup";

  const PREF_NAME = "cmi-fold-item-IDs";
  const PREF_ENABLE_NAME = "cmi-fold_menu_item-enable";
  const PREF_LABEL_NAME = "cmi-fold-menu-label";
  const CSS_VAR_IDS = "--cmi-fold-item-ids";
  const CSS_VAR_LABEL = "--cmi-fold-menu-label";

  const originalPositions = new Map();
  const cloneSuffix = "-sine-clone";
  let targetMenupopup = null;
  let skipMoveThisOpen = false;
  let restoredForThisOpen = false;
  let CURRENT_MENU_LABEL = null;

  function createXUL(tag) { return (document.createXULElement ? document.createXULElement(tag) : document.createElement(tag)); }
  function log(...args) { try { console.debug("[more-menu]", ...args); } catch (e) {} }

  function isFeatureEnabled() {
    try { if (typeof Components !== 'undefined' && Components.utils) { try { Components.utils.import && Components.utils.import('resource://gre/modules/Services.jsm'); } catch (e) {} } } catch (e) {}
    try { if (typeof Services !== 'undefined' && Services.prefs) { try { return !!Services.prefs.getBoolPref(PREF_ENABLE_NAME, false); } catch (e) { return false; } } } catch (e) {}
    return false;
  }

  function normalizeIdString(s) {
    if (!s) return "";
    s = String(s);
    s = s.replace(/^\s*['\"]|['\"]\s*$/g, "");
    s = s.replace(/[\u200B-\u200D\uFEFF\u00A0\t\n\r\f]/g, "");
    return s.trim();
  }
  const ID_VALID_RE = /^[A-Za-z0-9_.:\-]+$/;
  function isValidIdCandidate(s) { if (!s) return false; s = normalizeIdString(s); if (s.length < 2) return false; return ID_VALID_RE.test(s); }

  function extractIdFromElement(el) {
    if (!el) return null;
    try {
      if (el.id) { const id0 = normalizeIdString(el.id); if (isValidIdCandidate(id0)) return id0; }
      const attrsToTry = ['anonid', 'command', 'data-id', 'data-item-id', 'data-command'];
      for (const a of attrsToTry) {
        const v = el.getAttribute && el.getAttribute(a);
        if (v) { const vv = normalizeIdString(v); if (isValidIdCandidate(vv)) return vv; }
      }
      let p = el.parentNode;
      while (p) {
        if (p.id) { const pid = normalizeIdString(p.id); if (isValidIdCandidate(pid)) return pid; }
        p = p.parentNode;
      }
      const labelish = el.getAttribute && (el.getAttribute('anonid') || el.getAttribute('label') || el.getAttribute('value'));
      if (labelish) { const lab = normalizeIdString(labelish); if (isValidIdCandidate(lab)) return lab; }
    } catch (e) { console.warn('[more-menu] extractIdFromElement error', e); }
    return null;
  }

  function parsePrefStringToArray(raw) {
    if (!raw) return [];
    raw = normalizeIdString(raw);
    if (!raw) return [];
    const parts = raw.split(/[,\s]+/).map(s => normalizeIdString(s)).filter(Boolean);
    const cleaned = parts.map(s => s.replace(/^#/, '')).filter(Boolean);
    const seen = new Set();
    const out = [];
    for (const p of cleaned) { if (!seen.has(p)) { seen.add(p); out.push(p); } }
    return out;
  }
  function arrayToPrefString(arr) { if (!Array.isArray(arr)) return ''; return arr.map(s => normalizeIdString(s).replace(/^#/, '')).filter(Boolean).join(', '); }

  function readPrefArray() {
    try { if (typeof Services !== 'undefined' && Services.prefs) { try { const raw = Services.prefs.getCharPref(PREF_NAME); return parsePrefStringToArray(raw); } catch (e) { return []; } } } catch (e) {}
    return [];
  }
  function writePrefArray(arr) {
    try { if (typeof Services !== 'undefined' && Services.prefs) { const v = arrayToPrefString(arr); Services.prefs.setCharPref(PREF_NAME, v); log('wrote pref', PREF_NAME, v); return true; } } catch (e) { console.error('[more-menu] writePrefArray failed', e); }
    return false;
  }

  // Toggle-aware append: if id exists, remove it; otherwise add it.
  function appendIdToPrefAndMemory(id) {
    try {
      const clean = normalizeIdString(id).replace(/^#/, '');
      if (!isValidIdCandidate(clean)) { console.warn('[more-menu] rejected invalid id candidate:', id, '->', clean); return false; }

      let arr = readPrefArray();
      if (!arr.length && Array.isArray(MOVE_IDS) && MOVE_IDS.length) arr = MOVE_IDS.slice();

      const existingIndex = arr.indexOf(clean);
      if (existingIndex !== -1) {
        // remove (toggle off)
        arr.splice(existingIndex, 1);
        const ok = writePrefArray(arr);
        if (ok) {
          const memIdx = MOVE_IDS.indexOf(clean);
          if (memIdx !== -1) MOVE_IDS.splice(memIdx, 1);
          try {
            restoreItemById(clean);
            const more = document.getElementById(MORE_MENU_ID);
            if (more && more.parentNode) {
              const popup = more.querySelector('menupopup');
              if (popup) {
                const children = Array.from(popup.children).filter(n => n && n.id && !n.id.endsWith(cloneSuffix));
                if (children.length === 0) { try { more.style.display = 'none'; } catch (e) {} }
              }
            }
          } catch (e) { console.warn('[more-menu] restore after removal failed', e); }
          console.info('[more-menu] removed id from pref:', clean, 'new value:', arrayToPrefString(arr));
          return true;
        } else { console.error('[more-menu] failed to write pref while removing', clean); return false; }
      }

      // add (toggle on)
      if (arr.includes(clean)) { log('[more-menu] id already present (after re-check):', clean); return true; }
      arr.push(clean);
      const ok = writePrefArray(arr);
      if (ok) {
        if (!MOVE_IDS.includes(clean)) MOVE_IDS.push(clean);
        console.info('[more-menu] added id to pref:', clean, 'new value:', arrayToPrefString(arr));
        return true;
      }
    } catch (e) { console.error('[more-menu] appendIdToPrefAndMemory error', e); }
    return false;
  }

  const DEFAULT_LABELS = {
    'zh-CN': '显示更多选项',
    'zh-TW': '顯示更多選項',
    'ja': 'その他のオプションを表示',
    'es': 'Mostrar más opciones',
    'de': 'Weitere Optionen',
    'fr': 'Afficher plus d’options',
    'en': 'Show more options'
  };

  function loadMenuLabelFromCSS() {
    try { const cs = getComputedStyle(document.documentElement); if (!cs) return null; let raw = cs.getPropertyValue(CSS_VAR_LABEL); if (!raw) return null; raw = raw.trim(); if (!raw) return null; if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) raw = raw.slice(1, -1).trim(); return raw || null; } catch (e) { console.warn('[more-menu] loadMenuLabelFromCSS failed', e); return null; }
  }

  function loadMenuLabelFromPref() {
    try { if (typeof Components !== 'undefined' && Components.utils) { try { Components.utils.import && Components.utils.import('resource://gre/modules/Services.jsm'); } catch (e) {} } } catch (e) {}
    try { if (typeof Services !== 'undefined' && Services.prefs) { try { const raw = Services.prefs.getCharPref(PREF_LABEL_NAME, '').trim(); if (raw) return raw; } catch (e) {} } } catch (e) {}
    return null;
  }

  function defaultLabelByLocale() { try { const lang = (navigator.language || 'en').toLowerCase(); for (const k of Object.keys(DEFAULT_LABELS)) { if (lang.startsWith(k.toLowerCase())) return DEFAULT_LABELS[k]; } } catch (e) {} return DEFAULT_LABELS['en']; }
  function loadMenuLabel() { let label = loadMenuLabelFromCSS(); if (label) return label; label = loadMenuLabelFromPref(); if (label) return label; return defaultLabelByLocale(); }

  function observeLabelPrefChanges() {
    try { if (typeof Services === 'undefined') { Components.utils.import && Components.utils.import('resource://gre/modules/Services.jsm'); } } catch (e) {}
    try {
      if (typeof Services !== 'undefined' && Services.prefs && Services.prefs.addObserver) {
        const observer = { observe(subject, topic, data) { try { const newLabel = loadMenuLabelFromPref() || loadMenuLabelFromCSS() || defaultLabelByLocale(); if (newLabel && newLabel !== CURRENT_MENU_LABEL) { CURRENT_MENU_LABEL = newLabel; const more = document.getElementById(MORE_MENU_ID); if (more) { try { more.setAttribute('label', CURRENT_MENU_LABEL); } catch (e) {} } } } catch (e) { console.warn('[more-menu] pref observer error', e); } } };
        Services.prefs.addObserver(PREF_LABEL_NAME, observer, false);
        window.addEventListener('unload', () => { try { Services.prefs.removeObserver(PREF_LABEL_NAME, observer); } catch (e) {} }, { once: true });
      }
    } catch (e) { console.warn('[more-menu] could not attach pref observer for label', e); }
  }

  function parseIdList(raw) { if (!raw) return []; raw = normalizeIdString(raw); if (!raw) return []; const parts = raw.split(/[,\s]+/).map(s => s.trim()).filter(Boolean); return parts.map(s => s.replace(/^#/, '')); }
  function loadMoveIdsFromCSSVar() { try { const cs = getComputedStyle(document.documentElement); if (!cs) return; let raw = cs.getPropertyValue(CSS_VAR_IDS); if (!raw) return; const ids = parseIdList(raw); if (ids.length) { MOVE_IDS = ids; log('loaded MOVE_IDS from CSS var:', MOVE_IDS); } } catch (e) { console.warn('[more-menu] failed to read CSS var', CSS_VAR_IDS, e); } }
  function loadMoveIdsFromPref() { try { if (typeof Components !== 'undefined' && Components.utils) { try { Components.utils.import && Components.utils.import('resource://gre/modules/Services.jsm'); } catch (e) {} } } catch (e) {} try { if (typeof Services !== 'undefined' && Services.prefs) { const arr = readPrefArray(); if (arr.length) { MOVE_IDS = arr; log('loaded MOVE_IDS from pref:', MOVE_IDS); } } } catch (e) { console.warn('[more-menu] failed to read pref', PREF_NAME, e); } }

  function recordOriginal(el) { if (!el || !el.id) return; if (originalPositions.has(el.id)) return; try { originalPositions.set(el.id, { parent: el.parentNode, nextSibling: el.nextSibling }); log('recorded original for', el.id); } catch (e) {} }

  function ensureMoreMenu(menupopup) {
    let existing = document.getElementById(MORE_MENU_ID);
    if (existing && menupopup.contains(existing)) return existing;
    if (existing && existing.parentNode && existing.parentNode !== menupopup) { try { existing.parentNode.removeChild(existing); } catch (e) {} existing = null; }
    if (existing) return existing;
    try { const menu = createXUL('menu'); menu.id = MORE_MENU_ID; menu.setAttribute('label', CURRENT_MENU_LABEL || loadMenuLabel()); menu.setAttribute('anonid', 'cmi-show-more-menu'); const popup = createXUL('menupopup'); popup.id = MORE_POPUP_ID; menu.appendChild(popup); menupopup.appendChild(menu); log('created more menu'); return menu; } catch (e) { console.error('[more-menu] create failed:', e); return null; }
  }

  function moveItemById(id, menupopup, allowClone = true) { const moreMenu = ensureMoreMenu(menupopup); if (!moreMenu) return false; const morePopup = moreMenu.querySelector('menupopup'); if (!morePopup) return false; const el = document.getElementById(id); if (!el) return false; if (morePopup.contains(el)) return true; recordOriginal(el); try { morePopup.appendChild(el); el.classList && el.classList.add('sine-moved'); log('moved', id); return true; } catch (e) { if (!allowClone) return false; try { const clone = el.cloneNode(true); if (clone.id) clone.id = clone.id + cloneSuffix; morePopup.appendChild(clone); try { el.style.display = ''; el.classList && el.classList.add('sine-hidden-original'); } catch (ex) {} log('cloned and hid original', id); return true; } catch (ex) { console.error('[more-menu] clone failed for', id, ex); return false; } } }

  function moveItems(menupopup) { const moreMenu = document.getElementById(MORE_MENU_ID) || ensureMoreMenu(menupopup); if (moreMenu) { try { moreMenu.style.display = ''; } catch (e) {} } MOVE_IDS.forEach(id => moveItemById(id, menupopup, true)); }

  function restoreItemById(id) { const info = originalPositions.get(id); if (!info) return false; let el = document.getElementById(id); try { const clone = document.getElementById(id + cloneSuffix); if (clone && clone.parentNode) { clone.parentNode.removeChild(clone); } if (!el) { return false; } if (el.parentNode === info.parent) return true; try { info.parent.insertBefore(el, info.nextSibling); try { el.style.display = ''; el.classList && el.classList.remove('sine-hidden-original'); } catch (e) {} el.classList && el.classList.remove('sine-moved'); log('restored', id); return true; } catch (e) { console.error('[more-menu] restore failed for', id, e); return false; } } catch (e) { console.error(e); return false; } }

  function restoreItems() { MOVE_IDS.forEach(id => restoreItemById(id)); if (skipMoveThisOpen) { try { const more = document.getElementById(MORE_MENU_ID); if (more && more.parentNode) { more.style.display = 'none'; } } catch (e) { console.warn(e); } } }

  function initOnce() { const target = document.getElementById(TARGET_MENU_ID); if (!target) { log('target menu not found yet (will retry on later events)'); return; } const menupopup = (target.nodeName && target.nodeName.toLowerCase() === 'menupopup') ? target : (target.querySelector && (target.querySelector('menupopup') || target)); if (!menupopup) { log('no menupopup available'); return; } targetMenupopup = menupopup; try { CURRENT_MENU_LABEL = loadMenuLabel(); } catch (e) {} try { loadMoveIdsFromCSSVar(); } catch (e) {} try { loadMoveIdsFromPref(); } catch (e) {} setTimeout(() => { try { loadMoveIdsFromCSSVar(); } catch (e) {} }, 300); observeLabelPrefChanges(); try { moveItems(menupopup); } catch (e) { console.error(e); } const observer = new MutationObserver(muts => { for (const m of muts) { if (m.type === 'childList' && (m.addedNodes && m.addedNodes.length)) { if (restoredForThisOpen) continue; moveItems(menupopup); } } }); try { observer.observe(menupopup, { childList: true, subtree: true }); log('mutation observer attached'); } catch (e) { console.warn('[more-menu] failed to attach observer, will rely on one-shot move', e); } try { menupopup.addEventListener('popupshowing', () => { if (skipMoveThisOpen) { restoreItems(); restoredForThisOpen = true; } }); menupopup.addEventListener('popuphidden', () => { if (restoredForThisOpen) { setTimeout(() => { try { moveItems(menupopup); } catch (e) { console.error(e); } try { const more = document.getElementById(MORE_MENU_ID); if (more && more.parentNode) { more.style.display = ''; } } catch (e) {} restoredForThisOpen = false; skipMoveThisOpen = false; }, 50); } }); } catch (e) { console.warn('[more-menu] popup event hookup failed', e); } attachQuickAddHandlers(menupopup); log('more-menu initialized'); }

  let lastHoveredMenuItem = null; let contextOpen = false; function onMenuPointerOver(e) { const t = e.target; if (!t) return; const nodeName = (t.nodeName || '').toLowerCase(); if (nodeName === 'menuitem' || nodeName === 'menu' || (t.getAttribute && t.getAttribute('role') === 'menuitem')) { lastHoveredMenuItem = t; } }
  function isMagicCombo(e) { try { return e.ctrlKey && e.shiftKey && e.key && e.key.toLowerCase() === 'a' && e.getModifierState && e.getModifierState('CapsLock'); } catch (e) { return false; } }
  function onKeyDown(e) { try { if (!contextOpen) return; if (!isMagicCombo(e)) return; e.preventDefault(); e.stopPropagation(); const el = lastHoveredMenuItem; const id = extractIdFromElement(el); if (!id) { console.warn('[more-menu] hovered item has no valid id; cannot add'); return; } const ok = appendIdToPrefAndMemory(id); if (ok) console.log('[more-menu] success: toggled', id); else console.log('[more-menu] failed to toggle', id); } catch (ex) { console.error('[more-menu] onKeyDown error', ex); } }
  function attachQuickAddHandlers(menupopup) { if (!menupopup) return; menupopup.addEventListener('pointerover', onMenuPointerOver, true); menupopup.addEventListener('pointerenter', onMenuPointerOver, true); menupopup.addEventListener('popupshowing', () => { contextOpen = true; lastHoveredMenuItem = null; }); menupopup.addEventListener('popuphidden', () => { contextOpen = false; lastHoveredMenuItem = null; }); document.addEventListener('keydown', onKeyDown, true); window.addEventListener('unload', () => { try { menupopup.removeEventListener('pointerover', onMenuPointerOver, true); } catch(e){} try { menupopup.removeEventListener('pointerenter', onMenuPointerOver, true); } catch(e){} try { document.removeEventListener('keydown', onKeyDown, true); } catch(e){} }, { once: true }); }

  if (!isFeatureEnabled()) { log('[more-menu] disabled by pref', PREF_ENABLE_NAME); return; }
  if (document.readyState === 'complete' || document.readyState === 'interactive') { setTimeout(initOnce, 200); } else { window.addEventListener('load', () => setTimeout(initOnce, 200), { once: true }); }
  try { document.addEventListener('contextmenu', function (e) { try { skipMoveThisOpen = !!e.shiftKey; if (skipMoveThisOpen && targetMenupopup) { restoreItems(); restoredForThisOpen = true; log('Shift held: restoring original menu for this open'); } } catch (err) { console.error(err); } }, true); } catch (e) { console.warn('[more-menu] failed to attach contextmenu listener', e); }
  window.addEventListener('unload', () => {}, { once: true });

})();
