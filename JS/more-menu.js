/*
 more-menu.js (enhanced)
 Sine mod script for Zen (move specific items from contentAreaContextMenu
 into a new submenu labelled "显示更多选项")

 Enhancement: when the user holds Shift while opening the context menu,
 the script will temporarily restore the original, full menu (disable the
 "move into more" behavior for that menu open). After the menu closes the
 moved items are re-applied.

 Features / behavior summary:
 - Moves these menuitems (if present):
   #context-openlink
   #context-openlinkprivate
   #context-sendlinktodevice
 - Records original parent/nextSibling for each moved item so it can restore
   them temporarily when Shift is held during contextmenu opening.
 - Uses a MutationObserver for late-added nodes.
 - Uses a Document-level 'contextmenu' listener to detect event.shiftKey and
   trigger temporary restore before the menu shows. After the menu is hidden
   the script re-applies the move.
 - Clone fallback: if direct appendChild fails, script clones the node and
   sets the clone id to "<id>-sine-clone" to avoid duplicate id collisions.
*/
(function () {
  "use strict";

  const TARGET_MENU_ID = "contentAreaContextMenu"; // 页面右键菜单
  const MOVE_IDS = [
    "context-openlink",
    "context-openlinkprivate",
    "context-sendlinktodevice",
    "context-openlinkintab",
    "context-openlinkinusercontext-menu",
    "context-bookmarklink",
    "context-savelink",
    "context-searchselect-private",
    "context-inspect-a11y",
  ];
  const MORE_MENU_ID = "cmi-show-more-menu";
  const MORE_POPUP_ID = "cmi-show-more-menupopup";

  // State
  const originalPositions = new Map(); // id -> { parent, nextSibling }
  const cloneSuffix = "-sine-clone";
  let targetMenupopup = null;
  let skipMoveThisOpen = false; // set true when Shift held during contextmenu
  let restoredForThisOpen = false;

  function createXUL(tag) {
    return (document.createXULElement ? document.createXULElement(tag) : document.createElement(tag));
  }

  function log(...args) {
    try { console.debug("[more-menu]", ...args); } catch (e) {}
  }

  function recordOriginal(el) {
    if (!el || !el.id) return;
    if (originalPositions.has(el.id)) return;
    try {
      originalPositions.set(el.id, { parent: el.parentNode, nextSibling: el.nextSibling });
      log("recorded original for", el.id);
    } catch (e) {}
  }

  function ensureMoreMenu(menupopup) {
    let existing = document.getElementById(MORE_MENU_ID);
    if (existing && menupopup.contains(existing)) return existing;

    if (existing && existing.parentNode && existing.parentNode !== menupopup) {
      try { existing.parentNode.removeChild(existing); } catch (e) {}
      existing = null;
    }

    if (existing) return existing;

    try {
      const menu = createXUL("menu");
      menu.id = MORE_MENU_ID;
      menu.setAttribute("label", "显示更多选项");
      menu.setAttribute("anonid", "cmi-show-more-menu");
      const popup = createXUL("menupopup");
      popup.id = MORE_POPUP_ID;
      menu.appendChild(popup);
      menupopup.appendChild(menu);
      log("created more menu");
      return menu;
    } catch (e) {
      console.error("[more-menu] create failed:", e);
      return null;
    }
  }

  function moveItemById(id, menupopup, allowClone = true) {
    const moreMenu = ensureMoreMenu(menupopup);
    if (!moreMenu) return false;
    const morePopup = moreMenu.querySelector("menupopup");
    if (!morePopup) return false;

    const el = document.getElementById(id);
    if (!el) return false;

    // If already in morePopup, skip
    if (morePopup.contains(el)) return true;

    // Record original position (once)
    recordOriginal(el);

    try {
      morePopup.appendChild(el); // try move
      el.classList && el.classList.add("sine-moved");
      log("moved", id);
      return true;
    } catch (e) {
      if (!allowClone) return false;
      // Fallback: clone and hide original
      try {
        const clone = el.cloneNode(true);
        // avoid duplicate id
        if (clone.id) clone.id = clone.id + cloneSuffix;
        morePopup.appendChild(clone);
        try { el.style.display = "none"; el.classList && el.classList.add("sine-hidden-original"); } catch (ex) {}
        log("cloned and hid original", id);
        return true;
      } catch (ex) {
        console.error("[more-menu] clone failed for", id, ex);
        return false;
      }
    }
  }

  function moveItems(menupopup) {
    MOVE_IDS.forEach(id => moveItemById(id, menupopup, true));
  }

  // Restore a single item back to its recorded original position
  function restoreItemById(id) {
    const info = originalPositions.get(id);
    if (!info) return false;
    // find either original element (by id) or the hidden original
    let el = document.getElementById(id);
    // If the original was hidden (we hid it during clone fallback), el still references original.
    // If we have a clone (id + suffix) in morePopup, remove it.
    try {
      // remove clone if present
      const clone = document.getElementById(id + cloneSuffix);
      if (clone && clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }

      if (!el) {
        // element not present (odd), nothing to restore
        return false;
      }

      // If element already at original parent, skip
      if (el.parentNode === info.parent) return true;

      // insert before nextSibling (if null, append)
      try {
        info.parent.insertBefore(el, info.nextSibling);
        // if it was hidden previously, unhide
        try { el.style.display = ""; el.classList && el.classList.remove("sine-hidden-original"); } catch (e) {}
        el.classList && el.classList.remove("sine-moved");
        log("restored", id);
        return true;
      } catch (e) {
        console.error("[more-menu] restore failed for", id, e);
        return false;
      }
    } catch (e) { console.error(e); return false; }
  }

  function restoreItems() {
    MOVE_IDS.forEach(id => restoreItemById(id));
  }

  function initOnce() {
    const target = document.getElementById(TARGET_MENU_ID);
    if (!target) {
      log("target menu not found yet (will retry on later events)");
      return;
    }

    const menupopup = (target.nodeName && target.nodeName.toLowerCase() === "menupopup")
      ? target
      : (target.querySelector && (target.querySelector("menupopup") || target));

    if (!menupopup) {
      log("no menupopup available");
      return;
    }

    targetMenupopup = menupopup;

    // Initial move (user default behaviour)
    try { moveItems(menupopup); } catch (e) { console.error(e); }

    // Attach MutationObserver to catch lazily-added items
    const observer = new MutationObserver(muts => {
      for (const m of muts) {
        if (m.type === "childList" && (m.addedNodes && m.addedNodes.length)) {
          // If we restored for this open, don't re-move while restored
          if (restoredForThisOpen) continue;
          moveItems(menupopup);
        }
      }
    });

    try {
      observer.observe(menupopup, { childList: true, subtree: true });
      log("mutation observer attached");
    } catch (e) {
      console.warn("[more-menu] failed to attach observer, will rely on one-shot move", e);
    }

    // Handle context menu showing/hiding
    try {
      menupopup.addEventListener("popupshowing", () => {
        // If skip flag is set, restore before the menu is visible
        if (skipMoveThisOpen) {
          restoreItems();
          restoredForThisOpen = true;
        }
      });

      menupopup.addEventListener("popuphidden", () => {
        // If we restored temporarily for this open, re-apply the move now
        if (restoredForThisOpen) {
          // small timeout to avoid race with other handlers
          setTimeout(() => {
            try { moveItems(menupopup); } catch (e) { console.error(e); }
            restoredForThisOpen = false;
            skipMoveThisOpen = false;
          }, 50);
        }
      });
    } catch (e) {
      console.warn("[more-menu] popup event hookup failed", e);
    }

    log("more-menu initialized");
  }

  // Document-level listener to detect Shift key when opening context menu
  function onDocumentContextMenu(e) {
    try {
      // Only react if we're dealing with the target menu
      skipMoveThisOpen = !!e.shiftKey;
      if (skipMoveThisOpen && targetMenupopup) {
        // restore items so the upcoming menu open shows the full menu
        restoreItems();
        restoredForThisOpen = true;
        log("Shift held: restoring original menu for this open");
      }
    } catch (err) { console.error(err); }
  }

  // Setup
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(initOnce, 200);
  } else {
    window.addEventListener("load", () => setTimeout(initOnce, 200), { once: true });
  }

  // Always listen for contextmenu to detect Shift (capture to run early)
  try {
    document.addEventListener("contextmenu", onDocumentContextMenu, true);
  } catch (e) { console.warn("[more-menu] failed to attach contextmenu listener", e); }

  // Cleanup on unload
  window.addEventListener("unload", () => {
    try { document.removeEventListener("contextmenu", onDocumentContextMenu, true); } catch (e) {}
  }, { once: true });

})();
