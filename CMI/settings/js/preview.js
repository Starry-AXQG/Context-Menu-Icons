/* =============================================================
 * CMI · Live context menu preview & native menu launcher
 * ============================================================= */
"use strict";

(() => {
  const CMI = window.CMI;
  const { $, el, state, topWin, Svcs, inChrome, valueOf, pick, t } = CMI;

  const PREVIEW_LABELS = {
    en: {
      back: "Back",
      reload: "Reload",
      bookmark: "Bookmark Page",
      save: "Save Page As…",
      screenshot: "Take Screenshot",
      viewSource: "View Page Source",
      sidebar: "Show Sidebar",
      fold: "Show more options",
      inspect: "Inspect",
    },
    "zh-CN": {
      back: "后退",
      reload: "重新加载",
      bookmark: "将此页加为书签",
      save: "将页面另存为…",
      screenshot: "截图",
      viewSource: "查看页面源代码",
      sidebar: "显示侧边栏",
      fold: "显示更多选项",
      inspect: "检查",
    },
    "zh-TW": {
      back: "上一頁",
      reload: "重新載入",
      bookmark: "將此頁加入書籤",
      save: "另存新檔…",
      screenshot: "擷取螢幕畫面",
      viewSource: "檢視網頁原始碼",
      sidebar: "顯示側邊欄",
      fold: "顯示更多選項",
      inspect: "檢測",
    },
    ja: {
      back: "戻る",
      reload: "再読み込み",
      bookmark: "このページをブックマーク",
      save: "名前を付けてページを保存…",
      screenshot: "スクリーンショットを撮影",
      viewSource: "ページのソースを表示",
      sidebar: "サイドバーを表示",
      fold: "その他のオプションを表示",
      inspect: "調査",
    },
    ko: {
      back: "뒤로",
      reload: "새로 고침",
      bookmark: "이 페이지 북마크",
      save: "다른 이름으로 페이지 저장…",
      screenshot: "스크린샷 찍기",
      viewSource: "페이지 소스 보기",
      sidebar: "사이드바 보기",
      fold: "더 많은 옵션 표시",
      inspect: "검사",
    },
  };

  function previewLabel(id) {
    const table = PREVIEW_LABELS[state.lang] || PREVIEW_LABELS.en;
    return table[id] || PREVIEW_LABELS.en[id] || id;
  }

  function contextMenuClass() {
    const win = topWin;
    if (!win) return null;
    try {
      if (win.nsContextMenu) return win.nsContextMenu;
    } catch {}
    try {
      const mod = win.ChromeUtils.importESModule("chrome://browser/content/nsContextMenu.sys.mjs");
      return mod?.nsContextMenu || null;
    } catch {}
    return null;
  }

  function openNativeMenu(anchor) {
    if (!inChrome) {
      CMI.ui?.toast(t("previewNativeUnavailable"), "danger");
      return false;
    }
    try {
      const win = topWin;
      const menu = win.document.getElementById("contentAreaContextMenu");
      const klass = contextMenuClass();
      if (!menu || !klass) throw new Error("context menu unavailable");

      const browser = win.gBrowser?.selectedBrowser;
      if (!browser) throw new Error("no browser");

      let actor = null;
      try {
        actor = browser.browsingContext?.currentWindowGlobal?.getActor("ContextMenu") || null;
      } catch {}
      if (!actor) {
        actor = { manager: { domProcess: { remoteType: "web" } }, hiding() {} };
      }

      let principal = null;
      try {
        principal = Svcs.scriptSecurityManager.getSystemPrincipal();
      } catch {}

      klass.contentData = {
        context: { shouldDisplay: true, inTabBrowser: true, principal },
        browser,
        actor,
        selectionInfo: { text: "", fullText: "", docSelectionIsCollapsed: true },
        spellInfo: null,
        userContextId: 0,
      };

      if (menu.state === "open") menu.hidePopup();

      const rect = anchor.getBoundingClientRect();
      const baseX = win.mozInnerScreenX ?? win.screenX ?? 0;
      const baseY = win.mozInnerScreenY ?? win.screenY ?? 0;
      let offsetX = 0;
      let offsetY = 0;
      try {
        const area = browser.getBoundingClientRect();
        offsetX = area.left;
        offsetY = area.top;
      } catch {}
      const screenX = baseX + offsetX + rect.left;
      const screenY = baseY + offsetY + rect.bottom + 4;
      menu.openPopupAtScreen(screenX, screenY, true);
      return true;
    } catch (err) {
      console.warn("[CMI] native context menu failed", err);
      try {
        if (topWin?.nsContextMenu) topWin.nsContextMenu.contentData = null;
      } catch {}
      CMI.ui?.toast(t("previewNativeUnavailable"), "danger");
      return false;
    }
  }

  function packDir(pack) {
    if (pack === 2) return "../ZenUI";
    if (pack === 0) return "";
    return "../FluentUI";
  }

  function iconNode(iconFile, pack) {
    const dir = packDir(pack);
    const icon = el("span", "preview-ico");
    if (!dir || !iconFile) return icon;
    icon.style.backgroundImage = `url("${dir}/${iconFile}")`;
    icon.dataset.mask = "on";
    return icon;
  }

  function buildPreviewItems(foldEnabled, foldLabel) {
    return [
      { id: "back", icon: "arrow-left.svg", inactive: true },
      { id: "reload", icon: "reload.svg" },
      { id: "bookmark", icon: "bookmark.svg" },
      { separator: true },
      { id: "save", icon: "save.svg" },
      { id: "screenshot", icon: "screenshot.svg" },
      { id: "viewSource", icon: "source-code.svg" },
      { separator: true },
      { id: "sidebar", type: "checkbox", checked: true },
      ...(foldEnabled ? [{ id: "fold", customLabel: foldLabel, icon: "accessibility.svg", submenu: true }] : []),
      { id: "inspect", icon: "inspect.svg" },
    ];
  }

  function renderPreview() {
    const menu = $("#preview-menu");
    const empty = $("#preview-empty");
    if (!menu) return;

    const pack = Number(valueOf("cmi-Switch-Icon-Package", 1));
    const hideInactive = !!valueOf("cmi-Hide-Inactive-Items-ContentAreaContextMenu", false);
    const foldEnabled = !!valueOf("cmi-fold_menu_item-enable", false);
    const foldLabel = String(valueOf("cmi-fold-menu-label", "") || "").trim();

    menu.textContent = "";
    if (empty) empty.hidden = true;
    menu.hidden = false;
    menu.dataset.icons = pack === 0 ? "off" : "on";

    const items = buildPreviewItems(foldEnabled, foldLabel);
    for (const item of items) {
      if (item.separator) {
        menu.append(el("div", "preview-sep"));
        continue;
      }
      if (hideInactive && item.inactive) continue;

      const row = el("div", "preview-item");
      if (item.inactive) row.classList.add("is-inactive");
      if (item.submenu) row.classList.add("is-submenu");

      if (item.type === "checkbox") {
        const check = el("span", item.checked ? "preview-check" : "preview-check is-empty");
        if (item.checked && pack !== 0) {
          check.style.backgroundImage = `url("${packDir(pack)}/checkmark.svg")`;
          check.dataset.mask = "on";
        }
        row.append(check);
      } else if (pack !== 0) {
        row.append(iconNode(item.icon, pack));
      }

      row.append(el("span", "preview-label", item.customLabel || previewLabel(item.id)));
      if (item.submenu) row.append(el("span", "preview-chevron"));
      menu.append(row);
    }
  }

  function updatePreview() {
    const pack = Number(valueOf("cmi-Switch-Icon-Package", 1));
    const pill = $("#preview-pack");
    if (pill) {
      const names = pick("enum", "cmi-Switch-Icon-Package") || {};
      pill.textContent = names[String(pack)] || (pack === 2 ? "ZenUI" : "FluentUI");
      pill.dataset.tone = pack === 0 ? "warn" : "ok";
    }

    const menu = $("#preview-menu");
    if (menu) {
      const disableBcm = !!valueOf("cmi-Disable-Better-Context-Menu", false);
      const disableGrad = !!valueOf("cmi-Disable-BCM-Gradient-Effect", false);
      const radius = disableBcm ? "8px" : String(valueOf("cmi-BCM-border-radius", "12px") || "12px");
      const sep = Number(valueOf("cmi-menuseparator-opacity", "0.5"));
      const gapKey = pack === 2 ? "cmi-zenui-text-leftmargin" : "cmi-fluentui-text-leftmargin";
      const padKey = pack === 2 ? "cmi-non-checkmark-subitems-padding_2" : "cmi-non-checkmark-subitems-padding_1";

      menu.dataset.bcm = disableBcm ? "off" : "on";
      menu.dataset.gradient = !disableBcm && !disableGrad ? "on" : "off";
      menu.style.setProperty("--preview-radius", radius);
      menu.style.setProperty("--preview-sep", String(Number.isFinite(sep) ? sep : 0.5));
      menu.style.setProperty("--preview-gap", String(valueOf(gapKey, pack === 2 ? "12px" : "8px")));
      menu.style.setProperty("--preview-pad", String(valueOf(padKey, "14px")));
    }
    renderPreview();
  }

  CMI.preview = {
    openNativeMenu,
    updatePreview,
  };
})();
