<h1 align="center">Context-Menu-Icons</h1>

<div align="center">
  <a href="https://zen-browser.app/">
    <img width="120" alt="Zen Browser" src="https://github.com/user-attachments/assets/d6ab3ddf-6630-4062-92d0-22497d2a3f9a" />
  </a>
</div>

<h2 align="center">Make browser context menus clearer and easier to use.</h2>
<p align="center">Add icons, fold less-used items, and customize menus and the bookmark bar. Supports Zen Browser and Firefox.</p>

## Main features

- 🖼️ Add icons to context-menu items with two icon styles: FluentUI and ZenUI.
- 🎨 Refine context-menu spacing and appearance.
- ✅ Optionally hide unavailable menu items. For example, when there are no tabs with the same title, the "Close Duplicate Tabs" menu option is displayed in gray by default, but this mod will hide it.
- 📚 Fold less-used items into a **Show more options** submenu.
- 🔖 Customize bookmark toolbar alignment, visibility, and auto-hide behavior.

---

## Preview

The following screenshots compare the two icon packs. **ZenUI** is shown on the left and **FluentUI** on the right.

<table>
  <tr>
    <th align="center">ZenUI</th>
    <th align="center">FluentUI</th>
  </tr>
  <tr>
    <td width="50%"><img width="100%" alt="Context menu using ZenUI icons" src="https://github.com/user-attachments/assets/5fa65f0f-ce17-438e-8c90-04863d254420" /></td>
    <td width="50%"><img width="100%" alt="Context menu using FluentUI icons" src="https://github.com/user-attachments/assets/55219a33-8c18-431c-8d76-0436cc1df605" /></td>
  </tr>
</table>

### Folded menu comparison

The first image shows the menu with folding **off**. The next two show the folded menu **on**, including the additional options submenu.

<table>
  <tr>
    <th align="center">Folding off</th>
    <th align="center">Folding on</th>
    <th align="center">Folding on · More options</th>
  </tr>
  <tr>
    <td width="33.3%"><img width="100%" alt="Context menu with folding disabled" src="https://github.com/user-attachments/assets/145bb738-4e63-443b-97a2-e40302d35884" /></td>
    <td width="33.3%"><img width="100%" alt="Context menu with folding enabled" src="https://github.com/user-attachments/assets/8214acf3-9b46-46e4-b9f9-1b44de0324a7" /></td>
    <td width="33.3%"><img width="100%" alt="Folded menu showing more options" src="https://github.com/user-attachments/assets/a1083640-6828-4aa1-85d4-5880a6fff966" /></td>
  </tr>
</table>

---

## 📖 CMI-fold-menu-JS Guide

### Overview

Starting with [CMI v2.1](https://github.com/Starry-AXQG/Context-Menu-Icons/releases/tag/v2.1), the included JavaScript module can simplify long context menus. It moves selected items from the page context menu (`contentAreaContextMenu`) into a **Show more options** submenu, while keeping them accessible.

### Demo

Watch the folding menu in action:

https://github.com/user-attachments/assets/d813ad3e-d63a-44f0-8502-12ad23c81dea

### Key features

- Fold selected menu items by ID into a **Show more options** submenu.
- Set the item list with a CSS variable or an `about:config` preference.
- Customize the submenu label with a CSS variable or preference.
- Toggle folding for the hovered item with **Caps Lock**, then **Ctrl + Shift + A** while the context menu is open.
- Hold **Shift** while opening a context menu to temporarily show the original, unfolded menu.
- Preserve moved items' visual appearance where possible.

### Hotkeys

| Action | Keys |
| --- | --- |
| Add or remove the hovered item from the fold list | With the context menu open and pointer over an item, turn on Caps Lock, then press `Ctrl` + `Shift` + `A`. |
| Temporarily show the full menu | Hold `Shift` while opening the context menu. |

For submenu items, press the toggle hotkey before the submenu expands.

### Configure folding

Enable the page-menu folding script by setting `cmi-fold_menu_item-enable` to `true`. Then add IDs to `cmi-fold-item-IDs` (comma- or space-separated), or use the CSS variable in `CMI-config.css`:

```css
:root {
  --cmi-fold-item-ids: "context-openlink, context-openlinkprivate, context-sendlinktodevice";
  --cmi-fold-menu-label: "Show more options";
}
```

The script includes localization for common languages. Use `cmi-fold-menu-label` or `--cmi-fold-menu-label` to provide a custom label.

The script also contains optional tab-menu folding preferences: `cmi-fold_tab_menu_item-enable` and `cmi-fold-tab-item-IDs`. Enable these manually only if you need them. Avoid folding the Share item; it may not have a usable ID. If the tab menu stops working after changing its fold list, remove the `cmi-fold-tab-item-IDs` preference from your profile's `prefs.js` and restart the browser.

---

## 🔖 Installation

### Recommended: install with Sine

[Sine](https://github.com/CosmoCreeper/Sine) is a community mod manager for Firefox-based browsers. It makes installation, updates, and preference management easier.

1. Install Sine using its [installation guide](https://github.com/CosmoCreeper/Sine#%EF%B8%8F-installation).
2. Search for **Context Menu Icons** in Sine and select **Install**.
3. Restart the browser if prompted.

### Manual installation

Manual installs require you to replace the files when you want to update.

1. Create a `chrome` folder in your browser profile. For Zen, see the [Live Editing guide](https://docs.zen-browser.app/guides/live-editing).
2. Download the project using **Code → Download ZIP** or get a package from [Releases](https://github.com/Starry-AXQG/Context-Menu-Icons/releases).
3. Copy the package contents into the profile's `chrome` folder.
4. In Firefox, set `svg.context-properties.content.enabled` to `true` in `about:config`.
5. Restart the browser.

---

## ⚙️ Preference settings

Sine users can manage settings from the mod's page in Sine. For a manual install, open `about:config`, search for the preference, and add it if needed. Boolean options use `true` or `false`; numeric options use the values shown below. Most options are off by default unless indicated.

### Browser and context-menu settings

| Preference | Values | Description |
| --- | --- | --- |
| `svg.context-properties.content.enabled` | `true` | Required for the icons to work in Firefox. Sine handles this setting. |
| `cmi-Switch-Icon-Package` | `0` off · `1` FluentUI · `2` ZenUI | Select the icon pack. Default: `1`. |
| `cmi-Switch-Gecko-Branch` | `1` Zen · `0` Firefox | Select the browser branch. Set to `0` in Firefox. |
| `cmi-Disable-Better-Context-Menu` | `true` / `false` | Disable CMI's enhanced context-menu styling. Default: `false`. |
| `cmi-Disable-BCM-Gradient-Effect` | `true` / `false` | Disable the hover gradient effect. Default: `false`. |
| `cmi-BCM-border-radius` | CSS length | Set the enhanced context-menu corner radius. Default: `12px`. |
| `cmi-fold_menu_item-enable` | `true` / `false` | Enable folding selected page context-menu items. Default: `false`. |
| `cmi-fold-item-IDs` | Comma- or space-separated IDs | Select the page-menu items to fold. |
| `cmi-fold-menu-label` | Text | Customize the page-menu fold submenu label. |
| `cmi-fold_tab_menu_item-enable` | `true` / `false` | Enable optional tab context-menu folding. Default: `false`. |
| `cmi-fold-tab-item-IDs` | Comma- or space-separated IDs | Select tab-menu items to fold. |
| `cmi-fold-tab-menu-label` | Text | Customize the tab-menu fold submenu label. |
| `cmi-Hide-Inactive-Items-TabContextMenu` | `true` / `false` | Hide unavailable items in tab context menus. Default: `false`. |
| `cmi-Hide-Inactive-Items-ContentAreaContextMenu` | `true` / `false` | Hide unavailable items in page context menus (beta). Default: `false`. |
| `cmi-Grayscale-Extensions-Icons` | `true` / `false` | Apply a grayscale effect to extension icons. Default: `false`. |
| `cmi-menuseparator-opacity` | `0`–`1` | Set context-menu separator opacity. Default: `0.5`. |

### Bookmark bar and other settings

| Preference | Values | Description |
| --- | --- | --- |
| `cmi-Center-Bookmark-Items` | `true` / `false` | Center bookmark toolbar items. Default: `false`. |
| `cmi-Hide-Folder-Icons` | `true` / `false` | Hide bookmark folder icons. Default: `false`. |
| `cmi-Hide-Bookmark-Element` | `0`–`3` | `0` show all · `1` hide favicons · `2` hide names · `3` hide both. Default: `0`. |
| `cmi-Hide-OAiT-Item` | `true` / `false` | Hide the “Open All in Tabs” bookmark item. Default: `false`. |
| `cmi-Auto-Hide-BookmarkBar` | `0`–`3` | `0` off · `1` reveal on hover · `2` reveal while searching · `3` both. Default: `0`. |
| `cmi-AHB-enable-JS` | `true` / `false` | Improve auto-hide behavior, including drag and touch interactions. Default: `false`. |
| `cmi-Restore-Search-Button` | `true` / `false` | Restore the search button beside the address bar in Zen. Default: `false`. |

### Context-menu spacing

These optional settings adjust alignment. Use the suffix `_1` for FluentUI or `_2` for ZenUI where shown. The defaults are defined in `CMI-config.css`; clear a preference to restore its default.

| Preference | Applies to | Description |
| --- | --- | --- |
| `cmi-Padding-Container` | Both packs | Left padding for text in container-tab menus. Default: `30px`. |
| `cmi-checkmark-margin-left_x` | Pack `x` | Left margin of checkmarks. Default: `6px`. |
| `cmi-checkmark-margin-left_cover_x` | Pack `x` | Left margin of checkmarks when an item is checked. Default: `6px`. |
| `cmi-checkmark-margin-right_x` | Pack `x` | Right margin of checkmarks. Defaults: FluentUI `8px`, ZenUI `8px`. |
| `cmi-checkmark-margin-right_cover_x` | Pack `x` | Right margin of checkmarks when an item is checked. Default: `8px`. |
| `cmi-non-checkmark-subitems-padding_x` | Pack `x` | Align other submenu items when a checkmark is present. Default: `14px`. |
| `cmi-extension-icon-leftmargin_x` | Pack `x` | Left margin for browser extension icons. Default: `-6px`. |
| `cmi-menu-text-leftmargin_x` | Pack `x` | Left margin for browser extension menu text. Default: `2px`. |
| `cmi-fluentui-icons-leftmargin` | FluentUI | Left margin for CMI icons. Default: `6px`. |
| `cmi-fluentui-text-leftmargin` | FluentUI | Left margin for text beside CMI icons. Default: `8px`. |
| `cmi-zenui-icons-leftmargin` | ZenUI | Left margin for CMI icons. Default: `6px`. |
| `cmi-zenui-text-leftmargin` | ZenUI | Left margin for text beside CMI icons. Default: `12px`. |

---

## Compatibility

CMI supports **Zen Browser** and **Firefox**. For Firefox, set `cmi-Switch-Gecko-Branch` to `0` and enable `svg.context-properties.content.enabled`. Check the [release notes](https://github.com/Starry-AXQG/Context-Menu-Icons/releases) for browser-version compatibility.

## License

See [LICENSE](LICENSE).

## Star History

<a href="https://www.star-history.com/#Starry-AXQG/Context-Menu-Icons&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Starry-AXQG/Context-Menu-Icons&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=Starry-AXQG/Context-Menu-Icons&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Starry-AXQG/Context-Menu-Icons&type=Date" />
  </picture>
</a>
