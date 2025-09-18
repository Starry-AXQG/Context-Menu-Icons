/*
 more-menu.js
 Sine mod script for Zen (move specific items from contentAreaContextMenu
 into a new submenu labelled "显示更多选项")

 Usage: put this file in your mod repo under chrome/more-menu.js and install
 via Sine. Optionally include a userChrome.css for styling.

 Notes:
 - This script moves these menuitems (if present):
   #context-openlink
   #context-openlinkprivate
   #context-sendlinktodevice
 - It attempts to move existing nodes (preserves event handlers). If an item
   is created later (lazy), a MutationObserver will pick it up and move it.
 - To revert, uninstall the mod or remove this file from the mod and restart.
*/
(function () {
  "use strict";

  const TARGET_MENU_ID = "contentAreaContextMenu"; // 页面右键菜单
  const MOVE_IDS = [
    "context-openlink",
    "context-openlinkprivate",
    "context-sendlinktodevice",
  ];
  const MORE_MENU_ID = "sine-more-menu";
  const MORE_POPUP_ID = "sine-more-menupopup";

  function createXUL(tag) {
    // 在 Zen/Firefox 的 chrome 上通常支持 createXULElement
    return (document.createXULElement ? document.createXULElement(tag) : document.createElement(tag));
  }

  function log(...args) {
    try {
      console.debug("[more-menu]", ...args);
    } catch (e) {}
  }

  // 创建或获取 "显示更多选项" menu
  function ensureMoreMenu(menupopup) {
    let existing = document.getElementById(MORE_MENU_ID);
    if (existing && menupopup.contains(existing)) return existing;

    // 如果存在但在另一个 menupopup 下，先移除以避免重复
    if (existing && existing.parentNode && existing.parentNode !== menupopup) {
      try { existing.parentNode.removeChild(existing); } catch (e) {}
      existing = null;
    }

    if (existing) return existing;

    try {
      const menu = createXUL("menu");
      menu.id = MORE_MENU_ID;
      menu.setAttribute("label", "显示更多选项");
      menu.setAttribute("anonid", "sine-more-menu");
      // 可选：加 icon 或 accesskey
      // menu.setAttribute('accesskey', 'M');

      const popup = createXUL("menupopup");
      popup.id = MORE_POPUP_ID;
      menu.appendChild(popup);

      // 把 new menu append 到 menupopup 的末尾
      menupopup.appendChild(menu);
      log("created more menu");
      return menu;
    } catch (e) {
      console.error("[more-menu] create failed:", e);
      return null;
    }
  }

  // 尝试把目标 id 的节点移动到 morePopup（保留原事件绑定）
  function moveItems(menupopup) {
    try {
      const moreMenu = ensureMoreMenu(menupopup);
      if (!moreMenu) return;
      const morePopup = moreMenu.querySelector("menupopup");
      if (!morePopup) return;

      MOVE_IDS.forEach(id => {
        try {
          const el = document.getElementById(id);
          if (!el) return;
          // 只有在 el 当前父节点属于目标 menupopup 时移动，避免误移动到别的菜单
          if (el.parentNode && (el.parentNode === menupopup || menupopup.contains(el.parentNode))) {
            // 若已在 morePopup 中则跳过
            if (morePopup.contains(el)) return;
            try {
              morePopup.appendChild(el);
              el.classList && el.classList.add("sine-moved");
              log("moved", id);
            } catch (e) {
              // 若直接移动失败，改为克隆并隐藏原位置
              const clone = el.cloneNode(true);
              morePopup.appendChild(clone);
              try { el.style.display = "none"; el.classList && el.classList.add("sine-hidden-original"); } catch (ex) {}
              log("cloned and hid original", id);
            }
          }
        } catch (e) {
          console.error("[more-menu] move error for", id, e);
        }
      });
    } catch (e) {
      console.error("[more-menu] moveItems error:", e);
    }
  }

  function initOnce() {
    const target = document.getElementById(TARGET_MENU_ID);
    if (!target) {
      log("target menu not found yet (will retry on later events)");
      return;
    }

    // target 可能本身就是 menupopup，或是包含 menupopup
    const menupopup = (target.nodeName && target.nodeName.toLowerCase() === "menupopup")
      ? target
      : (target.querySelector && (target.querySelector("menupopup") || target));

    if (!menupopup) {
      log("no menupopup available");
      return;
    }

    // 首次尝试移动已有项目
    moveItems(menupopup);

    // 监听子节点变化，处理延迟创建或扩展时的节点
    const observer = new MutationObserver(muts => {
      // 在有新节点加入时再次尝试移动
      for (const m of muts) {
        if (m.type === "childList" && (m.addedNodes && m.addedNodes.length)) {
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

    // 当窗口卸载时清理 observer
    window.addEventListener("unload", () => {
      try { observer.disconnect(); } catch (e) {}
    }, { once: true });

    // 绑定 popupshowing 事件以防万一（某些情况下菜单在 show 时才构建完整）
    try {
      menupopup.addEventListener("popupshowing", function onshow() {
        try { moveItems(menupopup); } catch (e) {}
      });
    } catch (e) {
      // 忽略
    }

    log("more-menu initialized");
  }

  // 如果文档未就绪，等待 load。Sine 的注入点通常在 chrome 上运行，尽量兼容多种情形
  if (document.readyState === "complete" || document.readyState === "interactive") {
    // 轻延时以便 UI 元素构建
    setTimeout(initOnce, 200);
  } else {
    window.addEventListener("load", () => setTimeout(initOnce, 200), { once: true });
  }
})();
