<h1 align="center">context-menu-icons-for-Zen/Firefox</h1>
<div align="center">
    <a href="https://zen-browser.app/">
        <img width="120" alt="zen-badge-dark" src="https://github.com/user-attachments/assets/d6ab3ddf-6630-4062-92d0-22497d2a3f9a" />
    </a>
</div>

<h2 align="center">Bring the icon of the context menu back to Zen browser</h2>

![image](https://github.com/user-attachments/assets/0e939644-34fc-4284-b0de-3c062be2bf3a)
![PixPin_2025-06-05_12-58-00](https://github.com/user-attachments/assets/bb940cbf-70ad-4705-9805-eff50b945e52)

![PixPin_2025-06-02_22-09-48](https://github.com/user-attachments/assets/c0461249-4f38-46da-bb25-62f3568a943d)
![PixPin_2025-06-05_12-56-29](https://github.com/user-attachments/assets/9fe910ac-2736-47e4-b3ef-fc4ed81b796c)

✨ Some preview images of display effects, all the menus have been correctly mapped with icons

## Important reminder: This mod is only for users who want to bring back the context menu icons but do not want to install [Nebula](https://github.com/JustAdumbPrsn/Zen-Nebula). I have already integrated this mod into Nebula. Therefore, if you have already installed and are using [Nebula](https://github.com/JustAdumbPrsn/Zen-Nebula), you do not need to install this mod. (Personally, I recommend that you give Nebula a try. :) ) 
# 🚀 Announcement:
Now, it also supports usage on Firefox.（since mod v1.2.1)

---

## 🔖 **Installation Guide** (Windows, macOS, 和 Linux)


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
   
***——————————In addition to manual installation, you can also install it directly through Sine.————————————***

**1.First**

Instal [Sine](https://github.com/CosmoCreeper/Sine)
       
**2.Second**

search`Context menu icons`then click on "Install"
   
![image_20250605130835](https://github.com/user-attachments/assets/bfcefded-71e2-45bc-9aef-0f8c4c47c1d7)

---
By the way, I couldn't find the original icon of Zen, so I used  [FluentUI](https://github.com/microsoft/fluentui-system-icons) instead.
In order to ensure a consistent icon style, the icons of the menu have also been replaced accordingly:

![PixPin_2025-06-02_22-10-33](https://github.com/user-attachments/assets/2d450fdd-5b3b-4ff3-a9e2-823c35e23009)
![PixPin_2025-06-05_12-54-55](https://github.com/user-attachments/assets/4d870447-a329-4682-8e5e-b50b53e44627)

## 📚 Preferences 📚

***Access `about:config`via the address bar,Search for and add the attribute names given below***

1. `cmi-main__context-menu-icons-only`

If you only want to bring back the icon of the context menu without modifying any other icons, starting from version 1.2, you can set `cmi-main__context-menu-icons-only` 在 `about:config`to "true" to undo this change.

Although I personally don't like icons with inconsistent styles, someone has already made a suggestion, so I followed it. [issue]([https://github.com/CosmoCreeper/Sine](https://github.com/JustAdumbPrsn/Zen-Nebula/pull/142#issuecomment-2943082241))

2. ·cmi-extensions__icon--grayscale`

[icons style]Add grayscale filter to extensions icons of context-menu(v1.3.0)

4. `cmi-bookmarks__item--centered`

[bookmarks]Centered Bookmark Toolbar Items(v1.3.0)

6. `cmi-bookmarks__icon--hide`

[bookmarks]Hide the redundant icons in the bookmark toolbar (Recommended to enable, which can make the bookmark bar more concise)(v1.3.0)
