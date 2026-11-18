/* =============================================================
 * CMI · Preference schema parser (README.md + built-in fallback)
 * ============================================================= */
"use strict";

(() => {
  const CMI = window.CMI;
  const { SVG_PREF } = CMI;

  const TAB_ORDER = ["appearance", "menu", "fold", "bookmarks", "spacing", "advanced"];

  // Crisp 16x16 stroke SVGs for each tab, replacing inconsistent OS emojis.
  const TAB_SVG = {
    appearance:
      '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.6"/><circle cx="6.2" cy="6.6" r="0.9" fill="currentColor" stroke="none"/><circle cx="9.8" cy="6.6" r="0.9" fill="currentColor" stroke="none"/><path d="M5.5 10.2c.8.9 1.6 1.3 2.5 1.3s1.7-.4 2.5-1.3"/></svg>',
    menu:
      '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2.5" y="2.5" width="11" height="11" rx="2.4"/><path d="M5.2 6h5.6M5.2 8.5h5.6M5.2 11h3.6"/></svg>',
    fold:
      '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 4.2h11M2.5 8h7M2.5 11.8h11"/><path d="M11.2 6.5l2.3 1.5-2.3 1.5"/></svg>',
    bookmarks:
      '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.2 2.4h7.6a1 1 0 0 1 1 1v10.2L8 10.6l-4.8 3V3.4a1 1 0 0 1 1-1z"/></svg>',
    spacing:
      '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 3.5v9M13.5 3.5v9M5.2 8h5.6"/><path d="M6.8 6.2L5 8l1.8 1.8M9.2 6.2L11 8l-1.8 1.8"/></svg>',
    advanced:
      '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 5.2L2.8 8l2.7 2.8M10.5 5.2L13.2 8l-2.7 2.8M8.8 3.6l-1.6 8.8"/></svg>',
  };

  // Preferences the panel deliberately hides: their effect is derived from the
  // per-pack keys and they only add noise.
  const HIDDEN_KEYS = new Set([
    "cmi-fluentui-icons-leftmargin",
    "cmi-fluentui-text-leftmargin",
    "cmi-zenui-icons-leftmargin",
    "cmi-zenui-text-leftmargin",
  ]);

  const GROUP_OF_KEY = {
    [SVG_PREF]: "base",
    "cmi-Switch-Icon-Package": "icons",
    "cmi-Switch-Gecko-Branch": "icons",
    "cmi-Grayscale-Extensions-Icons": "icons",
    "cmi-Disable-Better-Context-Menu": "container",
    "cmi-Disable-BCM-Gradient-Effect": "container",
    "cmi-BCM-border-radius": "container",
    "cmi-menuseparator-opacity": "container",
    "cmi-Hide-Inactive-Items-TabContextMenu": "inactive",
    "cmi-Hide-Inactive-Items-ContentAreaContextMenu": "inactive",
    "cmi-Restore-Search-Button": "other",
    "cmi-fold_menu_item-enable": "pageMenu",
    "cmi-fold-item-IDs": "pageMenu",
    "cmi-fold-menu-label": "pageMenu",
    "cmi-fold_tab_menu_item-enable": "tabMenu",
    "cmi-fold-tab-item-IDs": "tabMenu",
    "cmi-fold-tab-menu-label": "tabMenu",
    "cmi-Center-Bookmark-Items": "arrange",
    "cmi-Hide-Folder-Icons": "icons",
    "cmi-Hide-Bookmark-Element": "visibility",
    "cmi-Hide-OAiT-Item": "visibility",
    "cmi-Auto-Hide-BookmarkBar": "autoHide",
    "cmi-AHB-enable-JS": "autoHide",
  };

  const TAB_OF_KEY = {
    [SVG_PREF]: "appearance",
    "cmi-Switch-Icon-Package": "appearance",
    "cmi-Switch-Gecko-Branch": "appearance",
    "cmi-Grayscale-Extensions-Icons": "appearance",
    "cmi-Disable-Better-Context-Menu": "appearance",
    "cmi-Disable-BCM-Gradient-Effect": "appearance",
    "cmi-BCM-border-radius": "appearance",
    "cmi-menuseparator-opacity": "appearance",
    "cmi-Hide-Inactive-Items-TabContextMenu": "menu",
    "cmi-Hide-Inactive-Items-ContentAreaContextMenu": "menu",
    "cmi-Restore-Search-Button": "menu",
    "cmi-fold_menu_item-enable": "fold",
    "cmi-fold-item-IDs": "fold",
    "cmi-fold-menu-label": "fold",
    "cmi-fold_tab_menu_item-enable": "fold",
    "cmi-fold-tab-item-IDs": "fold",
    "cmi-fold-tab-menu-label": "fold",
    "cmi-Center-Bookmark-Items": "bookmarks",
    "cmi-Hide-Folder-Icons": "bookmarks",
    "cmi-Hide-Bookmark-Element": "bookmarks",
    "cmi-Hide-OAiT-Item": "bookmarks",
    "cmi-Auto-Hide-BookmarkBar": "bookmarks",
    "cmi-AHB-enable-JS": "bookmarks",
  };

  function gateOf(key) {
    if (key === "cmi-fold-item-IDs" || key === "cmi-fold-menu-label") return "cmi-fold_menu_item-enable";
    if (key === "cmi-fold-tab-item-IDs" || key === "cmi-fold-tab-menu-label") return "cmi-fold_tab_menu_item-enable";
    return null;
  }

  function stripTicks(text) {
    return String(text ?? "").replace(/`/g, "").trim();
  }

  function parseDefaults(desc) {
    const out = {};
    const tail = /Defaults?\s*:\s*(.+?)\.?\s*$/.exec(desc || "");
    if (!tail) return out;
    const chunk = tail[1];
    const perPack = [...chunk.matchAll(/(FluentUI|ZenUI)\s*`([^`]+)`/g)];
    if (perPack.length) {
      for (const [, pack, value] of perPack) out[pack === "FluentUI" ? "_1" : "_2"] = stripTicks(value);
      return out;
    }
    const single = /`([^`]+)`/.exec(chunk);
    if (single) out.any = stripTicks(single[1]);
    return out;
  }

  function parseEnumOptions(values) {
    const pairs = [...String(values).matchAll(/`([^`]+)`\s*([^·`|]*)/g)]
      .map(([, value, label]) => ({ value: stripTicks(value), label: stripTicks(label) }))
      .filter((item) => item.value !== "" && /^-?\d+(?:\.\d+)?$/.test(item.value));
    if (pairs.length < 2 || pairs.some((item) => !item.label)) return null;
    return pairs;
  }

  function parseEnumFromDesc(desc) {
    const cleaned = String(desc || "").split(/\bDefaults?\s*:/)[0];
    const pairs = [...cleaned.matchAll(/`(\d+)`\s*([^·`|]+)/g)]
      .map(([, value, label]) => ({ value, label: stripTicks(label) }))
      .filter((item) => item.label && item.label.length <= 40);
    if (pairs.length < 2) return null;
    const seen = new Set();
    return pairs.filter((item) => (seen.has(item.value) ? false : seen.add(item.value)));
  }

  function classify(values, desc) {
    const text = String(values || "");
    const defaults = parseDefaults(desc);
    const onlyTrue = /`true`/.test(text) && !/`false`/.test(text);
    const onlyFalse = /`false`/.test(text) && !/`true`/.test(text);

    if (/`true`/.test(text) && /`false`/.test(text)) {
      return { type: "bool", default: String(defaults.any ?? "false").toLowerCase() === "true" };
    }
    if (onlyTrue) return { type: "bool", default: true };
    if (onlyFalse) return { type: "bool", default: false };

    const enumOptions = parseEnumOptions(text) || parseEnumFromDesc(desc);
    if (enumOptions) {
      return {
        type: "int",
        control: "enum",
        options: enumOptions,
        default: defaults.any == null ? Number(enumOptions[0].value) : Number(defaults.any),
      };
    }

    const range = /`(-?\d+(?:\.\d+)?)`\s*[–—-]\s*`(-?\d+(?:\.\d+)?)`/.exec(text);
    if (range) {
      const isDecimal = `${defaults.any ?? ""}${range[1]}${range[2]}`.includes(".");
      if (isDecimal) {
        return {
          type: "string",
          control: "slider",
          min: Number(range[1]),
          max: Number(range[2]),
          step: 0.05,
          default: defaults.any ?? String(range[1]),
        };
      }
      return {
        type: "int",
        control: "range",
        min: Number(range[1]),
        max: Number(range[2]),
        step: 1,
        default: defaults.any == null ? Number(range[1]) : Number(defaults.any),
      };
    }

    const wide = /comma-|space-separated|^text$/i.test(text.trim());
    return {
      type: "string",
      control: wide ? "text" : "input",
      default: defaults.any ?? null,
    };
  }

  function isSpacingSection(section) {
    return /spacing/i.test(section || "");
  }

  function rowToFields(row) {
    const base = classify(row.values, row.desc);
    const packEntries = row.key.includes("_x")
      ? [
          { key: row.key.replace(/_x/g, "_1"), pack: "FluentUI" },
          { key: row.key.replace(/_x/g, "_2"), pack: "ZenUI" },
        ]
      : [{ key: row.key, pack: null }];
    const defaults = parseDefaults(row.desc);

    return packEntries.map((entry) => {
      const packIndex = entry.pack === "FluentUI" ? "_1" : entry.pack === "ZenUI" ? "_2" : null;
      let def = base.default;
      if (packIndex && defaults[packIndex] != null) def = defaults[packIndex];
      else if (packIndex && defaults.any != null) def = defaults.any;

      if (base.type === "int" && typeof def === "string") def = Number(def);
      if (base.type === "bool" && typeof def === "string") def = def.toLowerCase() === "true";
      if (base.type === "int" && Number.isNaN(def)) def = base.control === "range" ? base.min : 0;

      const spacing = isSpacingSection(row.section);
      const tab = TAB_OF_KEY[entry.key] || (spacing ? "spacing" : "menu");
      const cleanKey = entry.key.replace(/_[12]$/, "");

      return {
        key: entry.key,
        pack: entry.pack,
        type: base.type,
        control: base.control ?? (base.type === "bool" ? "switch" : "input"),
        options: base.options ?? null,
        min: base.min,
        max: base.max,
        step: base.step,
        default: def,
        hasDefault: def != null && def !== "",
        fallbackLabel: cleanKey,
        readme: row.desc,
        tab,
        group: GROUP_OF_KEY[entry.key] || (spacing ? entry.pack || "global" : "other"),
      };
    });
  }

  function buildSchemaFromReadme(md) {
    const rows = [];
    let section = "";
    for (const line of md.split(/\r?\n/)) {
      const heading = /^###\s+(.+?)\s*$/.exec(line);
      if (heading) {
        section = heading[1].trim();
        continue;
      }
      if (!line.startsWith("|")) continue;
      const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
      if (cells.length < 3) continue;
      const key = stripTicks(cells[0]);
      if (!/^[A-Za-z][\w.\-]*$/.test(key) || !/[._-]/.test(key)) continue;
      rows.push({ section, key, values: cells[1], desc: cells[2] });
    }
    return rows.flatMap((row) => rowToFields(row));
  }

  const FALLBACK_ROWS = [
    [SVG_PREF, "`true`", "Required for the icons to work. Default: `true`."],
    ["cmi-Switch-Icon-Package", "`0` off · `1` FluentUI · `2` ZenUI", "Select the icon pack. Default: `1`."],
    ["cmi-Switch-Gecko-Branch", "`1` Zen · `0` Firefox", "Select the browser branch. Default: `1`."],
    ["cmi-Disable-Better-Context-Menu", "`true` / `false`", "Disable enhanced styling. Default: `false`."],
    ["cmi-Disable-BCM-Gradient-Effect", "`true` / `false`", "Disable hover gradient. Default: `false`."],
    ["cmi-BCM-border-radius", "CSS length", "Corner radius. Default: `12px`."],
    ["cmi-Grayscale-Extensions-Icons", "`true` / `false`", "Grayscale extension icons. Default: `false`."],
    ["cmi-menuseparator-opacity", "`0`–`1`", "Separator opacity. Default: `0.5`."],
    ["cmi-Hide-Inactive-Items-TabContextMenu", "`true` / `false`", "Hide inactive tab items. Default: `false`."],
    ["cmi-Hide-Inactive-Items-ContentAreaContextMenu", "`true` / `false`", "Hide inactive page items. Default: `false`."],
    ["cmi-Restore-Search-Button", "`true` / `false`", "Restore the search button. Default: `false`."],
    ["cmi-fold_menu_item-enable", "`true` / `false`", "Enable folding. Default: `false`."],
    ["cmi-fold-item-IDs", "Comma- or space-separated IDs", "Items to fold."],
    ["cmi-fold-menu-label", "Text", "Fold submenu label."],
    ["cmi-fold_tab_menu_item-enable", "`true` / `false`", "Enable tab folding. Default: `false`."],
    ["cmi-fold-tab-item-IDs", "Comma- or space-separated IDs", "Tab items to fold."],
    ["cmi-fold-tab-menu-label", "Text", "Tab fold label."],
    ["cmi-Center-Bookmark-Items", "`true` / `false`", "Center bookmark items. Default: `false`."],
    ["cmi-Hide-Folder-Icons", "`true` / `false`", "Hide folder icons. Default: `false`."],
    ["cmi-Hide-Bookmark-Element", "`0` show all · `1` hide favicons · `2` hide names · `3` hide both", "Bookmark element. Default: `0`."],
    ["cmi-Hide-OAiT-Item", "`true` / `false`", "Hide open-all-in-tabs. Default: `false`."],
    ["cmi-Auto-Hide-BookmarkBar", "`0` off · `1` reveal on hover · `2` reveal while searching · `3` both", "Auto hide. Default: `0`."],
    ["cmi-AHB-enable-JS", "`true` / `false`", "Improved auto-hide. Default: `false`."],
    ["cmi-Padding-Container", "CSS length", "Container menu padding. Default: `30px`."],
    ["cmi-checkmark-margin-left_x", "CSS length", "Checkmark left margin. Default: `6px`."],
    ["cmi-checkmark-margin-left_cover_x", "CSS length", "Checked left margin. Default: `6px`."],
    ["cmi-checkmark-margin-right_x", "CSS length", "Checkmark right margin. Defaults: FluentUI `8px`, ZenUI `8px`."],
    ["cmi-checkmark-margin-right_cover_x", "CSS length", "Checked right margin. Default: `8px`."],
    ["cmi-non-checkmark-subitems-padding_x", "CSS length", "Align other subitems. Default: `14px`."],
    ["cmi-extension-icon-leftmargin_x", "CSS length", "Extension icon margin. Default: `-6px`."],
    ["cmi-menu-text-leftmargin_x", "CSS length", "Extension text margin. Default: `2px`."],
    ["cmi-fluentui-icons-leftmargin", "CSS length", "FluentUI icon margin. Default: `6px`."],
    ["cmi-fluentui-text-leftmargin", "CSS length", "FluentUI text margin. Default: `8px`."],
    ["cmi-zenui-icons-leftmargin", "CSS length", "ZenUI icon margin. Default: `6px`."],
    ["cmi-zenui-text-leftmargin", "CSS length", "ZenUI text margin. Default: `12px`."],
  ];

  function buildFallbackSchema() {
    return FALLBACK_ROWS.flatMap(([key, values, desc]) =>
      rowToFields({ section: "Context-menu spacing", key, values, desc })
    );
  }

  CMI.schema = {
    TAB_ORDER,
    TAB_SVG,
    HIDDEN_KEYS,
    gateOf,
    buildSchemaFromReadme,
    buildFallbackSchema,
  };
})();
