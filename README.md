<h1 align="center">Context-Menu-Icons</h1>
<div align="center">
    <a href="https://zen-browser.app/">
        <img width="120" alt="zen-badge-dark" src="https://github.com/user-attachments/assets/d6ab3ddf-6630-4062-92d0-22497d2a3f9a" />
    </a>
</div>

<h2 align="center">Bring the icon of the context menu back to Zen/Firefox</h2>

Demo image:
FluentUI(left side）, ZenUI(right side)

![PixPin_2025-07-06_21-04-53](https://github.com/user-attachments/assets/c2da0b31-b811-4c32-a245-e888d00562c7)

Demo for CMI-fold-menu-JS:

https://github.com/user-attachments/assets/f8b4e420-0512-4b51-b923-53252b7c6f8a

✨ Some preview images of display effects, all the menus have been correctly mapped with icons

# 🚀 Announcement:
This project will undergo frequent and continuous updates to ensure that it remains functional even after browser updates.

Added appropriate icons to the context menus of zenFolderand zenWorkspace(Zen v1.15b)  ✅

✨Since version 1.4, you can choose from two sets of icon packs: ZenUI or FluentUI （For the Firefox browser, you can only choose FluentUI.）

If you are using Firefox v140 or Zen v1.14, please use the CMI v1.5.Otherwise, please use v1.4.1

Now, it also supports usage on Firefox.（since mod v1.2.1)

---

## CMI-fold-menu-JS Guide:

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

  
### Configuration (For Advanced Users)

#### 1.CSS variable (portable)

Add to CMI-config.css:

`
:root {
  --cmi-fold-item-ids: "context-openlink, context-openlinkprivate, context-sendlinktodevice";/* Add menu item ids */
  
  --cmi-fold-menu-label: "Show more options"; 
/*Cover the "Show more options" text (This mod has built-in localization for common languages. However, if you are not satisfied with the localization of the script, or if your language is not included in the localization, you can manually specify the displayed text here. */)
}
`

#### 2.about:config (quick edit)

1.Create a new string pref cmi-fold-item-IDs and set a comma or space separated list of ids, e.g.:
`
context-openlink, context-openlinkprivate, context-sendlinktodevice
`

2. cmi-fold-menu-label
Cover the "Show more options" text (This mod has built-in localization for common languages. However, if you are not satisfied with the localization of the script, or if your language is not included in the localization, you can manually specify the displayed text here.

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
   


***Method Two： install manually（not recommend)***
（Manual installation requires you to frequently manually replace the files in order to support future updates.)

1. 📁 **Create the Chrome Folder**
   If you haven't already, follow the [Zen Live Editing Guide](https://docs.zen-browser.app/guides/live-editing) to create your `chrome` folder.

2. 📦 **Download the Mod(Choose any one of the following download methods.)**
   - Download the files from the repository (click "Code",then click"Download ZIP")
   - Download the file from the [latest release](https://github.com/1247343406/context-menu-icons-for-Zen/releases).
   - Extract it and paste the `icons` folder inside your `chrome` directory.

4. 🧩 **Apply the Mod**
   You have two options:

   **Option A** – *Manual Import*
   - Open your `userChrome.css` and add:
     ```css
     @import "icons/icons.css";
     ```
  no have userChrome.css?
  
  **Option B-1**
   - open (or create) `userContent.css` and add:
     ```css
     @import "icons/icons.css";
     ```
   **Option B-2** – *Use Provided Files*
   - Use the `userChrome.css`  files provided in the ZIP and paste them directly into your `chrome` folder.

5. 🔄 **Restart the Browser**
   Reopen Zen to apply the UI changes.

If you choose to install manually, you will need to perform some simple configuration tasks.
[Here you can view all the preference settings of CMI.](https://github.com/1247343406/context-menu-icons-for-Zen?tab=readme-ov-file#-preferences-)

*** ⚠️If you are using the Firefox browser and choose to install manually⚠️  ***

you must ensure that in `about:config`, the setting of `svg.context-properties.content.enabled` is set to `true`. This preference is a necessary condition for the mod to function properly. The mod has incorporated the detection of this preference. If you do not do this, the mod will directly refuse to execute.If you use Sine, all these tasks will be completed automatically.

If all of the above are confirmed to be correct, after restarting the browser, you should be able to see the changes.
---


## 📚 Preferences 📚

（If you use Sine, you can directly manage the preferences of the mod through Sine.)

***Access `about:config`via the address bar,Search for and add the attribute names given below***

![图片](https://github.com/user-attachments/assets/a2bdc842-1890-4387-838e-faa3cd42e29b)




1. `cmi-Switch-Icon-Package` （Whether you have changed this attribute value or not, the default choice is to use FluentUI）.

[Main]This attribute enables you to select the icon package，use numbers to make a selection(v1.4 add)

    If you want to use FluentUI：1

   
<img width="240" height="613" alt="image" src="https://github.com/user-attachments/assets/7efa6b0a-8d4d-4791-a0c4-028b1fe20715" />



   If you want to use ZenUI：2
    
<img width="226" height="613" alt="image" src="https://github.com/user-attachments/assets/dbea869e-9dda-4605-a7de-b88b6d40f50b" />




2. `cmi-Disable-Better-Context-Menu`

 Use the better context menu. (v1.5 add)  Demo image:
 
Starting from version 1.7, this preference is enabled by default without any configuration. You can set it to "true" to disable it.

![图片](https://github.com/user-attachments/assets/e43cfff5-49b7-4990-b243-0821d63eec25)


3. `cmi-Hide-Inactive-Items-TabContextMenu`

   ✂️ Hide the inactive items in tab-Context-Menu (BETA)

4. `cmi-Hide-Inactive-Items-ContentAreaContextMenu`
5. 
   ✂️ Hide the inactive items in ContentArea-Context-Menu (BETA)
   
6. `cmi-Grayscale-Extensions-Icons`

[icons style]Add grayscale filter to extensions icons of context-menu(v1.3.0 add)

4.`cmi-Align-Extension-Icons`

[Text Style] Align the icons of the extension with those of CMI(Default: Off. Turning this on will make the context menu more orderly.) (1.4 add)

5.`cmi-Align-Extension-Texts`

[Text Style] Align the text of the extension with those of CMI(Default: Off. Turning this on will make the context menu more orderly.) (v1.4 add)


6. `cmi-Center-Bookmark-Items`

[ Bookmark Toolbar Style ]Centered Bookmark Toolbar Items(v1.3.0 add)

7. `cmi-Hide-Folder-Icon`

[ Bookmark Toolbar Style ] Hidden Bookmark Folder Icon 📁 ( Enable to make bookmark toolbar more concise )(v1.3.0 add)

8. `cmi-Switch-PC-Platform`
📚 Choose the platform you are on. 
Only when you are using this mod on a Linux system, or when this mod is malfunctioning, can you try to modify this preference setting. (v1.9.5 add)
Windows、MacOS: `1`
Linux: `2`

9. `cmi-Hide-OAiT-Item`
    Hide "Open All in Tab" menu item
<img width="641" height="452" alt="image" src="https://github.com/user-attachments/assets/089331e9-3896-46b1-8784-31fb7c69f799" />

---

## CMI-config file (Only for CMI v2.0 and above)
** This content will show you the normal working state of CMI and provide a simple guide to inform you of the differences between the self-repair process and the demonstration images. The default configuration file only ensures that the Zen browser can achieve perfect alignment effect on Windows and Linux platforms.**

1. ---
<img width="350" height="700" alt="image" src="https://github.com/user-attachments/assets/cf581b19-694a-4901-84d3-c6ef93d356b8" />

Is it different from what you tab menu style? Please enable `cmi-Align-Extension-Icons` and modify the following values.

<img width="2388" height="88" alt="image" src="https://github.com/user-attachments/assets/cd0b1584-bfff-48ec-a3d8-225213608040" />

2. ---
<img width="671" height="170" alt="image" src="https://github.com/user-attachments/assets/78021c8f-3220-49af-a48d-4ec6f21b6fc1" />

Is it different from what you Forward / Backward menu style? Please enable `cmi-Align-Extension-Icons` and modify the following values.

<img width="2388" height="215" alt="image" src="https://github.com/user-attachments/assets/15be89a0-dead-4b0e-95ae-d4bb8b57d8cb" />

3. ---
<img width="497" height="613" alt="image" src="https://github.com/user-attachments/assets/b11c9d60-523a-4f87-8364-b7b93db97531" />

Is it different from what you bookmark menu style? Please:

<img width="2407" height="358" alt="image" src="https://github.com/user-attachments/assets/8c0c8dce-020f-450d-8603-b59411355245" />

4. ---
<img width="472" height="410" alt="image" src="https://github.com/user-attachments/assets/a4adb931-97fd-424d-92b4-cdf040cca4a7" />

Are these sub-menus properly aligned? If not, just modify this.

<img width="2412" height="57" alt="image" src="https://github.com/user-attachments/assets/d80786be-d2e6-4f62-83bd-244e0edf1391" />
