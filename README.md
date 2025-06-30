<h1 align="center">Context-Menu-Icons</h1>
<div align="center">
    <a href="https://zen-browser.app/">
        <img width="120" alt="zen-badge-dark" src="https://github.com/user-attachments/assets/d6ab3ddf-6630-4062-92d0-22497d2a3f9a" />
    </a>
</div>

<h2 align="center">Bring the icon of the context menu back to Zen/Firefox</h2>

✨Since version 1.4, you can choose from two sets of icon packs: ZenUI or FluentUI （For the Firefox browser, you can only choose FluentUI.）

FluentUI

![图片](https://github.com/user-attachments/assets/9ab97b1a-8fc7-4b79-b06d-e6249accf0c4)
![图片](https://github.com/user-attachments/assets/8bf05d10-8154-4af9-b41f-f17b1201f74c)

ZenUI

![图片](https://github.com/user-attachments/assets/0fac45f8-81ae-43fc-948f-cfe750749725)
![图片](https://github.com/user-attachments/assets/9e4a9492-4318-4f86-83b9-e95d69bf0fea)


✨ Some preview images of display effects, all the menus have been correctly mapped with icons

# 🚀 Announcement:
Now, it also supports usage on Firefox.（since mod v1.2.1)

---

## 🔖 **Installation Guide** (Windows, macOS, 和 Linux)
***—————————— Method One（recommend)： install it directly through Sine ————————————***

(By installing this mod using Sine, you can always receive subsequent updates for this mod.And it is also more convenient to modify the preference settings provided by this mod.)

**1.First**

Instal [Sine](https://github.com/CosmoCreeper/Sine)
       
**2.Second**

search`Context menu icons`then click on "Install"
   
![image_20250605130835](https://github.com/user-attachments/assets/bfcefded-71e2-45bc-9aef-0f8c4c47c1d7)

***—————————— Method Two： install manually ————————————***
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
   - 打开 (or create) `userContent.css` and add:
     ```css
     @import "icons/icons.css";
     ```
   **Option B-2** – *Use Provided Files*
   - Use the `userChrome.css`  files provided in the ZIP and paste them directly into your `chrome` folder.

5. 🔄 **Restart the Browser**
   Reopen Zen to apply the UI changes.


*** ⚠️If you are using the Firefox browser and choose to install manually⚠️  ***

you must ensure that in `about:config`, the setting of `svg.context-properties.content.enabled` is set to `true`. This preference is a necessary condition for the mod to function properly. The mod has incorporated the detection of this preference. If you do not do this, the mod will directly refuse to execute.If you use Sine, all these tasks will be completed automatically.


---


## 📚 Preferences 📚

（If you use Sine, you can directly manage the preferences of the mod through Sine.)

***Access `about:config`via the address bar,Search for and add the attribute names given below***

![PixPin_2025-07-01_00-03-10](https://github.com/user-attachments/assets/af8fbe28-e9f0-4b01-ad9e-9d0f5db288e9)


1. `cmi-main__context-menu-icons-option`
[Main]This attribute enables you to select the icon package，use numbers to make a selection(v1.4 add)

    If you want to use FluentUI：1

   
![图片](https://github.com/user-attachments/assets/b28b9cd5-6fad-421e-81bd-0b73a7bba6df)


   If you want to use ZenUI：2
    
![图片](https://github.com/user-attachments/assets/d26a2174-8862-46b5-94fe-56c2f7d30aa9)


2. `cmi-extensions__icon--grayscale`

[icons style]Add grayscale filter to extensions icons of context-menu(v1.3.0 add)

3.`cmi-extensions__icon--align`

[icons style] Align the icons of the extension with those of CMI(Default: Off. Turning this on will make the context menu more orderly.)(1.4 add)

4.`cmi-extensions__text--align`

[text style] Align the text of the extension with those of CMI(Default: Off. Turning this on will make the context menu more orderly.)(v1.4 add)


5. `cmi-bookmarks__item--centered`

[bookmarks]Centered Bookmark Toolbar Items(v1.3.0 add)

6. `cmi-bookmarks__icon--hide`

[bookmarks]Hide the redundant icons in the bookmark toolbar (Recommended to enable, which can make the bookmark bar more concise)(v1.3.0 add)
