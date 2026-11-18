/* =============================================================
 * CMI · UI rendering (tabs, panels, field controls, dialogs)
 * ============================================================= */
"use strict";

(() => {
  const CMI = window.CMI;
  const {
    $,
    $$,
    el,
    state,
    inChrome,
    LOCALES,
    fieldOf,
    prefExists,
    currentValue,
    defaultValueOf,
    isModified,
    browserLocale,
    langName,
    fieldLabel,
    fieldHelp,
    tabText,
    groupText,
    enumText,
    fmt,
    t,
  } = CMI;

  function tabsWithFields() {
    const { TAB_ORDER } = CMI.schema;
    return TAB_ORDER.filter((id) => id === "advanced" || state.fields.some((field) => field.tab === id));
  }

  function renderTabs() {
    const tabs = $("#tabs");
    const { TAB_SVG } = CMI.schema;
    tabs.textContent = "";
    for (const id of tabsWithFields()) {
      const btn = el("button", "tab");
      btn.type = "button";
      btn.dataset.tab = id;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", String(state.activeTab === id));

      const ico = el("span", "tab-ico");
      ico.innerHTML = TAB_SVG[id] || "";
      const label = el("span", "tab-label", tabText(id, "title"));

      btn.append(ico, label);
      btn.addEventListener("click", () => selectTab(id));
      tabs.append(btn);
    }
  }

  function selectTab(id) {
    state.activeTab = id;
    for (const btn of $$("#tabs .tab")) {
      btn.setAttribute("aria-selected", String(btn.dataset.tab === id));
    }
    for (const panel of $$("#panels .panel")) {
      panel.dataset.active = String(panel.dataset.tab === id);
    }
  }

  // ---------------------------------------------------------
  // Field controls
  // ---------------------------------------------------------
  function makeSwitch(field) {
    const label = el("label", "switch");
    const input = el("input");
    input.type = "checkbox";
    input.checked = !!currentValue(field);
    input.setAttribute("aria-label", fieldLabel(field));
    const track = el("span", "track");
    track.append(el("span", "knob"));
    label.append(input, track);
    input.addEventListener("change", () => CMI.applyField(field, input.checked));
    return { node: label, sync: () => (input.checked = !!currentValue(field)) };
  }

  function makeSegmented(field) {
    const wrap = el("div", "segmented");
    wrap.setAttribute("role", "group");
    const buttons = [];
    for (const option of field.options) {
      const value = Number(option.value);
      const btn = el("button", "seg");
      btn.type = "button";
      btn.dataset.value = String(value);
      btn.append(document.createTextNode(enumText(field, value)));
      btn.setAttribute("aria-pressed", String(Number(currentValue(field)) === value));
      btn.addEventListener("click", () => CMI.applyField(field, value));
      buttons.push(btn);
      wrap.append(btn);
    }
    return {
      node: wrap,
      sync: () => {
        const current = Number(currentValue(field));
        for (const btn of buttons) {
          btn.setAttribute("aria-pressed", String(Number(btn.dataset.value) === current));
        }
      },
    };
  }

  function makeSlider(field) {
    const wrap = el("div", "range-control");
    const range = el("input", "range-slider");
    range.type = "range";
    range.min = String(field.min);
    range.max = String(field.max);
    range.step = String(field.step || 0.05);
    range.setAttribute("aria-label", fieldLabel(field));

    const numInput = el("input", "input range-num");
    numInput.type = "text";
    numInput.inputMode = "decimal";
    numInput.spellcheck = false;
    numInput.setAttribute("aria-label", fieldLabel(field));

    const syncValues = () => {
      const val = String(currentValue(field) ?? field.default ?? field.min);
      const parsed = Number(val);
      range.value = Number.isFinite(parsed) ? String(parsed) : String(field.default ?? field.min);
      numInput.value = val;
      numInput.dataset.invalid = "false";
    };
    syncValues();

    range.addEventListener("input", () => {
      numInput.value = range.value;
      numInput.dataset.invalid = "false";
      CMI.applyField(field, range.value);
    });

    const commitText = () => {
      const raw = numInput.value.trim();
      const num = Number(raw);
      if (raw === "" || Number.isNaN(num) || num < field.min || num > field.max) {
        numInput.dataset.invalid = "true";
        return;
      }
      numInput.dataset.invalid = "false";
      range.value = String(num);
      CMI.applyField(field, String(num));
    };

    numInput.addEventListener("change", commitText);
    numInput.addEventListener("blur", commitText);
    numInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        commitText();
      }
    });

    wrap.append(range, numInput);
    return { node: wrap, sync: syncValues };
  }

  function makeInput(field) {
    const wrap = el("div", "input-wrap");
    const input = el("input", field.control === "text" ? "input input-wide" : "input");
    input.type = "text";
    input.spellcheck = false;
    input.value = String(currentValue(field) ?? "");
    input.placeholder = field.hasDefault ? String(field.default) : "";
    input.setAttribute("aria-label", fieldLabel(field));

    const commit = () => {
      const raw = input.value.trim();
      if (field.control === "range") {
        const num = Number(raw);
        if (raw === "" || Number.isNaN(num) || num < field.min || num > field.max) {
          input.dataset.invalid = "true";
          return;
        }
        input.dataset.invalid = "false";
        CMI.applyField(field, num);
        return;
      }
      input.dataset.invalid = "false";
      CMI.applyField(field, raw);
    };

    input.addEventListener("change", commit);
    input.addEventListener("blur", commit);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        commit();
      }
    });

    if (field.control === "range") {
      const hint = el("span", "input-hint", `${field.min}–${field.max}`);
      wrap.append(input, hint);
    } else {
      wrap.append(input);
    }

    return {
      node: wrap,
      sync: () => {
        input.value = String(currentValue(field) ?? "");
        input.dataset.invalid = "false";
      },
    };
  }

  function makeControl(field) {
    if (field.type === "bool") return makeSwitch(field);
    if (field.options && field.options.length) return makeSegmented(field);
    if (field.control === "slider") return makeSlider(field);
    return makeInput(field);
  }

  function renderField(field) {
    const row = el("div", "field");
    row.dataset.key = field.key;

    const main = el("div", "field-main");
    main.append(el("div", "field-label", fieldLabel(field)), el("p", "field-help", fieldHelp(field)));
    main.append(el("code", "field-key", field.key));

    const control = el("div", "field-control");
    const widget = makeControl(field);

    const reset = el("button", "row-reset");
    reset.type = "button";
    reset.title = t("rowResetTitle");
    reset.innerHTML =
      '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3.2a4.8 4.8 0 1 0 3.6 1.5"/><path d="M12.2 2.2v3h-3"/></svg>';
    reset.addEventListener("click", () => {
      CMI.applyField(field, defaultValueOf(field));
      toast(fmt(t("toastRestoreRow"), { label: fieldLabel(field) }));
    });

    control.append(widget.node, reset);
    row.append(main, control);
    field.ui = { row, widget, reset };
    updateFieldState(field);
    return row;
  }

  function updateFieldState(field) {
    if (!field.ui) return;
    const mod = isModified(field);
    field.ui.row.dataset.modified = String(mod);
    if (field.ui.reset) field.ui.reset.disabled = !mod;

    const keyCode = field.ui.row.querySelector(".field-key");
    if (keyCode) keyCode.dataset.modifiedLabel = t("modified");

    const gate = CMI.schema.gateOf(field.key);
    if (gate) {
      const gateField = fieldOf(gate);
      const enabled = gateField ? !!currentValue(gateField) : true;
      field.ui.row.dataset.disabled = String(!enabled);
    }
  }

  function refreshAllStates() {
    for (const field of state.fields) updateFieldState(field);
  }

  // ---------------------------------------------------------
  // Panels & cards
  // ---------------------------------------------------------
  function cardHeading(tabId, title, intro) {
    const head = el("div", "card-head");
    const titleWrap = el("div", "card-head-title");
    const ico = el("span", "card-head-ico");
    ico.innerHTML = CMI.schema.TAB_SVG[tabId] || "";
    const textWrap = el("div");
    textWrap.append(el("h2", null, title), el("p", null, intro));
    titleWrap.append(ico, textWrap);
    head.append(titleWrap);
    return head;
  }

  function buildGuideCard() {
    const card = el("div", "card guide");
    const head = el("div", "card-head");
    const headText = el("div");
    headText.append(el("h2", null, t("guideTitle")), el("p", null, t("guideIntro")));
    head.append(headText);

    const body = el("div", "card-body");
    const list = el("ul", "guide-list");
    for (const key of ["guideF1", "guideF2", "guideF3", "guideF4"]) {
      list.append(el("li", null, t(key)));
    }
    body.append(list);

    body.append(el("div", "group-title", t("guideHotkeys")));
    const keys = el("ul", "guide-list guide-keys");
    keys.append(el("li", null, t("guideHotkey1")), el("li", null, t("guideHotkey2")));
    body.append(keys);

    const note = el("p", "guide-note", t("guideConfig"));
    const link = el("a", "link guide-link", t("guideMore"));
    link.href = "https://github.com/Starry-AXQG/Context-Menu-Icons#-cmi-fold-menu-js-guide";
    note.append(" ", link);
    body.append(note);

    card.append(head, body);
    return card;
  }

  function buildAdvancedCard() {
    const card = el("div", "card");
    const head = cardHeading("advanced", t("advancedTitle"), t("advancedIntro"));
    const body = el("div", "card-body");

    const tableWrap = el("div", "table-wrap");
    const table = el("table", "raw-table");
    const thead = el("thead");
    const hrow = el("tr");
    for (const label of [t("tableKey"), t("tableType"), t("tableValue"), t("tableDefault")]) {
      hrow.append(el("th", null, label));
    }
    thead.append(hrow);

    const tbody = el("tbody");
    for (const field of state.fields) {
      const row = el("tr");
      const live = prefExists(field.key);
      row.append(
        el("td", null, field.key),
        el("td", null, field.type),
        el("td", null, live ? String(currentValue(field)) : t("notSet")),
        el("td", null, field.hasDefault ? String(field.default) : t("cssDefault"))
      );
      tbody.append(row);
    }
    table.append(thead, tbody);
    tableWrap.append(table);
    body.append(tableWrap);
    card.append(head, body);
    return card;
  }

  function renderPanels() {
    const panels = $("#panels");
    panels.textContent = "";
    for (const tabId of tabsWithFields()) {
      const panel = el("section", "panel");
      panel.dataset.tab = tabId;
      panel.dataset.active = String(state.activeTab === tabId);
      panel.setAttribute("role", "tabpanel");

      if (tabId === "advanced") {
        panel.append(buildAdvancedCard());
        panels.append(panel);
        continue;
      }

      if (tabId === "fold") panel.append(buildGuideCard());

      const card = el("div", "card");
      const head = cardHeading(tabId, tabText(tabId, "title"), tabText(tabId, "intro"));
      const body = el("div", "card-body");
      const groups = new Map();
      for (const field of state.fields.filter((item) => item.tab === tabId)) {
        if (!groups.has(field.group)) groups.set(field.group, []);
        groups.get(field.group).push(field);
      }
      for (const [groupName, fields] of groups) {
        body.append(el("div", "group-title", groupText(groupName)));
        for (const field of fields) body.append(renderField(field));
      }

      card.append(head, body);
      panel.append(card);
      panels.append(panel);
    }
  }

  function renderAdvancedValues() {
    const panel = $$("#panels .panel").find((item) => item.dataset.tab === "advanced");
    if (!panel) return;
    panel.textContent = "";
    panel.append(buildAdvancedCard());
  }

  // ---------------------------------------------------------
  // Chrome, language, toast, and dialog
  // ---------------------------------------------------------
  function renderLangSelect() {
    const select = $("#lang-select");
    if (!select) return;
    select.textContent = "";
    const auto = el("option", null, fmt(t("languageAuto"), { lang: langName(browserLocale()) }));
    auto.value = CMI.LANG_AUTO;
    select.append(auto);
    for (const id of LOCALES.order) {
      const option = el("option", null, langName(id));
      option.value = id;
      select.append(option);
    }
    select.value = state.langPref;
  }

  function applyI18n() {
    document.documentElement.lang = state.lang;
    for (const node of $$("[data-i18n]")) {
      const key = node.dataset.i18n;
      if (key) node.textContent = t(key);
    }
    for (const node of $$("[data-i18n-title]")) {
      const key = node.dataset.i18nTitle;
      if (key) node.title = t(key);
    }
    const tabs = $("#tabs");
    if (tabs) tabs.setAttribute("aria-label", t("tabsAria"));
  }

  function renderConfigState() {
    const pill = $("#config-state");
    if (!pill) return;
    const map = {
      idle: ["stateSaved", ""],
      saved: ["stateSaved", "ok"],
      exported: ["stateExported", "ok"],
      imported: ["stateImported", "ok"],
      error: ["stateError", "warn"],
    };
    const [key, tone] = map[state.config.status] || map.idle;
    pill.textContent = t(key);
    pill.dataset.tone = tone;
  }

  function renderMeta() {
    const sub = $("#brand-sub");
    if (sub) sub.textContent = t("brandSub", { version: state.version || "—" });

    const build = $("#about-build");
    if (build) {
      build.textContent = t("aboutBuild", {
        count: state.fields.length,
        mode: inChrome ? t("modeChrome") : t("modePreview"),
      });
    }

    const banner = $("#banner");
    if (!banner) return;
    if (inChrome) {
      banner.hidden = true;
      return;
    }
    banner.hidden = false;
    banner.dataset.tone = "warn";
    banner.textContent = t("bannerNoChrome");
  }

  let toastTimer = 0;
  function toast(message, tone) {
    const node = $("#toast");
    if (!node) return;
    node.textContent = message;
    node.dataset.tone = tone || "";
    node.dataset.show = "true";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      node.dataset.show = "false";
    }, 2600);
  }

  function confirmDialog(title, text, okLabel) {
    const dialog = $("#confirm");
    $("#confirm-title").textContent = title;
    $("#confirm-text").textContent = text;
    $("#confirm-ok").textContent = okLabel || t("confirmTitleDefault");
    return new Promise((resolve) => {
      const done = () => {
        dialog.removeEventListener("close", done);
        resolve(dialog.returnValue === "ok");
      };
      dialog.addEventListener("close", done);
      dialog.showModal();
    });
  }

  CMI.ui = {
    tabsWithFields,
    renderTabs,
    selectTab,
    renderPanels,
    renderAdvancedValues,
    refreshAllStates,
    renderLangSelect,
    applyI18n,
    renderConfigState,
    renderMeta,
    toast,
    confirmDialog,
  };
})();
