<h1 align="center">Context-Menu-Icons</h1>
<div align="center">
    <a href="https://zen-browser.app/">
        <img width="120" alt="zen-badge-dark" src="https://github.com/user-attachments/assets/d6ab3ddf-6630-4062-92d0-22497d2a3f9a" />
    </a>
</div>

<h2 align="center">Improve your context menu by adding icons, folding redundant menu items, and more. Support Firefox/Zen</h2>

## Main function:
	- 🖼️ Add icons: Add appropriate icons to the context menu of the browser to make it easier to use
	- 🖊️️️ Optimize the style: Optimize the style of the tab-Context-Menu to make it look more modern and concise.
	- ✅️ Automatically manage menu items, allowing you to have them automatically hidden when they are unavailable.
	- 📚 Fold menu items: Easily manage the menu items you don't frequently use and fold them to a place where you don't want to see them.
## Additional preference settings:
	- 📏 Center bookmark toolbar items
	- 👁️ Hidden unnecessary elements of bookmark-bar 
	- ✨ Automatically hide the bookmark bar (Enhanced through JS, it is applicable to various scenarios.)

---

Demo image ( Support two sets of linear icons with different styles. FluentUI left, ZenUI right):

![PixPin_2025-07-06_21-04-53](https://github.com/user-attachments/assets/c2da0b31-b811-4c32-a245-e888d00562c7)

Demo for CMI-fold-menu-JS (Fold the unnecessary menu items like the context menu in Windows 11 for ease of use):

https://github.com/user-attachments/assets/c64dfaef-c7a3-4834-a6c7-d98365218d43

# 📢 Announcement:
This project will undergo frequent and continuous updates to ensure that it remains functional even after browser updates.

Added appropriate icons to the context menus of zenFolderand zenWorkspace(Zen v1.15b)  ✅

✨Since version 1.4, you can choose from two sets of icon packs: ZenUI or FluentUI （For the Firefox browser, you can only choose FluentUI.）

If you are using Firefox v140 or Zen v1.14, please use the CMI v1.5.Otherwise, please use v1.4.1

Now, it also supports usage on Firefox.(since mod v1.2.1)

---

## 📖 CMI-fold-menu-JS Guide:

### Overview
In version 2.1, CMI introduced JavaScript code to help users simplify the lengthy context menus. Fold infrequently used context menu items from the page context menu (contentAreaContextMenu) into a single submenu labeled "Show More Options". The goal is to declutter the context menu while preserving full access to folded item

### Key Features

- 🗂️ Fold selected menuitems (by id) into a "Show more options" submenu.

- 📄 Two configuration sources: a CSS variable (--cmi-fold-item-ids) for portable configs, or an about:config string preference (cmi-fold-item-IDs).

- 🖱️ Toggle script enable/disable with pref cmi-fold_menu_item-enable.

- ✏️ Customizable submenu label via CSS var or pref.

- 🌟 Quick-toggle hotkey: while context menu is open and pointer is hovering an item, keep the `CapsLock` key on, and `Ctrl` + `Shift` + `A` to toggle that item's folded/unfolded state (it will be added to or removed from the fold list) 🚀 This hotkey enables you to easily add menu items to the configuration without the need for you to manually copy the IDs of the menu items.

- ⌨️ Holding Shift while opening the context menu temporarily disables folding and hides the "Show more options" item to reveal the original full menu.

- Attempts to preserve moved items' visual appearance (icons/styles) by snapshotting inline styles/attributes where possible.

### Hotkey & Usage

- Toggle hovered item: Keep the `CapsLock` key on, and `Ctrl` + `Shift` + `A` when context menu open and pointer is on a menu item.

- Show full menu temporarily: hold `Shift` while opening context menu.

- Submenu items: for items with submenus, press the hotkey quickly (before the submenu expands) for best results.


Demo for CMI-fold-menu-JS:

https://github.com/user-attachments/assets/c64dfaef-c7a3-4834-a6c7-d98365218d43



### 🛠️ Configuration (For Advanced Users)

#### 1.CSS variable (portable)

Add to CMI-config.css:

```
:root {
  --cmi-fold-item-ids: "context-openlink, context-openlinkprivate, context-sendlinktodevice";	/* Add menu item ids */

  --cmi-fold-menu-label: "Show more options"; /*Cover the "Show more options" text (This mod has built-in localization for common languages. However, if you are not satisfied with the localization of the script, or if your language is not included in the localization, you can manually specify the displayed text here. */)
}
```  


#### 2.about:config (quick edit)

1.Create a new string pref `cmi-fold-item-IDs` and set a comma or space separated list of ids, e.g.:
```
context-openlink, context-openlinkprivate, context-sendlinktodevice
```

2. `cmi-fold-menu-label`

Cover the "Show more options" text (This mod has built-in localization for common languages. However, if you are not satisfied with the localization of the script, or if your language is not included in the localization, you can manually specify the displayed text here.


3.✨ `cmi-fold_tab_menu_item-enable`

Enable the function of the folding tab menu:
⚠️：
Please manually enable it through , as it may not be necessary for all users. \n
Please do not attempt to collapse the "share" menu item, as it has no ID and thus may cause errors. \n
If an error has occurred, please go to your user profile, locate the prefs.js file, search for cmi-fold-tab-item-IDs, and delete that line. Then restart your browser.

---

## 🔖 **Installation Guide** (Windows, macOS, and Linux)
***Method One（recommend)： install it directly through Sine***

<h2>🧭 What is Sine?</h2>
<p>Sine is a community-driven mod/theme manager for all Firefox-based browsers, designed to be a more efficient, powerful, user-friendly, and compatible alternative to manual installation.</p>

(By installing this mod using Sine, you can always receive subsequent updates for this mod.And it is also more convenient to modify the preference settings provided by this mod. Due to the frequent updates of this project, we recommend that you install this mod via Sine. This way, you will receive automatic updates.)

**1.First**

Instal [Sine](https://github.com/CosmoCreeper/Sine)

If you don't know how to install Sine, [please click here to view the Sine installation Guide.](https://github.com/CosmoCreeper/Sine#%EF%B8%8F-installation)
       
**2.Second**

![image_20250828183818](https://github.com/user-attachments/assets/4b13b78e-63d6-4247-a3f6-3a4b97192278)

search`Context menu icons`then click on "Install"
   


***Method Two： install manually（not recommend, not support advanced functions of CMI)***
（Manual installation requires you to frequently manually replace the files in order to support future updates.)

1. 📁 **Create the Chrome Folder**
   If you haven't already, follow the [Zen Live Editing Guide](https://docs.zen-browser.app/guides/live-editing) to create your `chrome` folder.

2. 📦 **Download the Mod(Choose any one of the following download methods.)**
   - Download the files from the repository (click "Code",then click"Download ZIP")
   - Download the file from the [latest release](https://github.com/Starry-AXQG/context-menu-icons-for-Zen/releases).
   - Move all the files in the compressed package to the `chrome` folder.

3. 🔄 **Restart the Browser**
   Reopen browser to apply the UI changes.

If you choose to install manually, you will need to perform some simple configuration tasks.
[Here you can view all the preference settings of CMI.](https://github.com/Starry-AXQG/context-menu-icons-for-Zen?tab=readme-ov-file#-preferences-)

***⚠️If you are using the Firefox browser and choose to install manually⚠***

you must ensure that in `about:config`, the setting of `svg.context-properties.content.enabled` is set to `true`. This preference is a necessary condition for the mod to function properly. The mod has incorporated the detection of this preference. If you do not do this, the mod will directly refuse to execute.If you use Sine, all these tasks will be completed automatically.

If all of the above are confirmed to be correct, after restarting the browser, you should be able to see the changes.

---

## ⚙️ Preference settings

   - If you use Sine, you can directly manage all the preferences of the mod through Sine.
   - The following instructions are applicable only to users who perform the installation manually.

***Access `about:config`via the address bar,Search for and add the attribute names given below***

![图片](https://github.com/user-attachments/assets/a2bdc842-1890-4387-838e-faa3cd42e29b)



1. `cmi-Switch-Icon-Package` （Whether you have changed this attribute value or not, the default choice is to use FluentUI）.

This attribute enables you to select the icon package，use numbers to make a selection(v1.4 add)

   - If you want to use FluentUI：1

   
<img width="240" height="613" alt="image" src="https://github.com/user-attachments/assets/7efa6b0a-8d4d-4791-a0c4-028b1fe20715" />



   - If you want to use ZenUI：2
    
<img width="226" height="613" alt="image" src="https://github.com/user-attachments/assets/dbea869e-9dda-4605-a7de-b88b6d40f50b" />



2. `cmi-Switch-Gecko-Branch`

   - Indicate the browser you are using.
   - If you are using Firefox, please set it to `0`,If you neglect this configuration, then an anomaly is almost inevitable.
   - If you use Zen, you don't need to do anything.

3. `cmi-Disable-Better-Context-Menu`

 Use the better context menu. (v1.5 add)  Demo image:
 
Starting from version 1.7, this preference is enabled by default without any configuration. You can set it to "true" to disable it.

![图片](https://github.com/user-attachments/assets/e43cfff5-49b7-4990-b243-0821d63eec25)


3. `cmi-Hide-Inactive-Items-TabContextMenu`

   ✂️ Hide the inactive items in tab-Context-Menu

4. `cmi-Hide-Inactive-Items-ContentAreaContextMenu`

   ✂️ Hide the inactive items in ContentArea-Context-Menu (BETA)
   
5. `cmi-Grayscale-Extensions-Icons`

[icons style]Add grayscale filter to extensions icons of context-menu(v1.3.0 add)

6. `cmi-Center-Bookmark-Items`

[ Bookmark Toolbar Style ]Centered Bookmark Toolbar Items(v1.3.0 add)

7. `cmi-Hide-Folder-Icon`

[ Bookmark Toolbar Style ] Hidden Bookmark Folder Icon 📁 ( Enable to make bookmark toolbar more concise )(v1.3.0 add)

8. `cmi-Hide-Bookmark-Element`

[ Bookmark Toolbar Style ] Hide the other elements of the bookmark toolbar

	- 0: No change
	- 1: Hide Favcons
	- 2: Hide Bookmark Names
	- 3: Hide All (not suggest)

9. `cmi-Hide-OAiT-Item`
    Hide "Open All in Tab" menu item
<img width="641" height="452" alt="image" src="https://github.com/user-attachments/assets/089331e9-3896-46b1-8784-31fb7c69f799" />

10. `cmi-Auto-Hide-BookmarkBar`

Enable the function of automatically hiding bookmarks

	- 0: Disable
	- 1: Display while hover the toolbar
	- 2: Display while search
	- 3: Display in both cases

---

## 📏 Customize the margin of the context menu

***These settings are usually regarded as an advanced optional option. The default settings already meet the needs of the majority of people.***

***Therefore, these more extensive settings are more suitable for users who wish to make more detailed adjustments to the context menu.***

###

Global(No matter which set of icon packages you choose)

  1.The left margin of the text in the Menu of Container-Tabs: `cmi-Padding-Container`

###

Single(From here on, all the settings allow you to make separate configurations for each of the two icon packs.Please replace `x` with number 1 or 2. 1:FluentUl, 2:ZenUI)

- 2.The left margin of the checkmark icon in normal circumstances: `cmi-checkmark-margin-left_x`

- 3.The left margin of the checkmark icon after the menu item is checked: `cmi-checkmark-margin-left_cover_x`

- 4.The right margin of the checkmark icon in normal circumstances: `cmi-checkmark-margin-right_x`

- 5.The right margin of the checkmark icon after the menu item is checked: `cmi-checkmark-margin-right_cover_x`

- 6.The padding of most sub-menu items: `cmi-submenu-padding_x`

- 7.The padding of most sub-menu items after the menu item is checked: `cmi-submenu-padding_cover_x`

- 8.Very few special sub-menu items padding: `cmi-special-submenu-padding_x`

- 9.When a checkmark item is selected among the context menu items, the margins of the other unselected menu items will be adjusted accordingly: `cmi-non-checkmark-subitems-padding_x`

- 10.Optional: Advanced customization - The left margin of icons from browser extension in context menu: `cmi-extension-icon-leftmargin_x`

- 11.Optional: Advanced customization - The left margin of menu text in context menu: `cmi-menu-text-leftmargin_x`

 (This will simultaneously modify the margin rules that have already been in effect for CMI. You can re-adjust the margin rules of CMI
 
## Star History

<a href="https://www.star-history.com/#Starry-AXQG/Context-Menu-Icons&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Starry-AXQG/Context-Menu-Icons&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=Starry-AXQG/Context-Menu-Icons&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Starry-AXQG/Context-Menu-Icons&type=Date" />
 </picture>
</a>
