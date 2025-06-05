<h1 align="center">context-menu-icons-for-Zen</h1>
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
 ⚠️⚠️⚠️If you are using Nebula version 2.9:⚠️⚠️⚠️
You need to restore the `sidebar.css` file in Nebula to version 2.8. Otherwise, some errors will occur.([You can directly obtain the 2.8 version of the file here.](https://github.com/1247343406/context-menu-icons-for-Zen/blob/1fbf240bb748cd7c6e0b370890d5a1d8da1a5d07/Sidebar.css)) This is because Zen removed the context menu, 和 Nebula had to temporarily remove the code related to the icons for supporting the context menu in version 2.9. Therefore, we need to revert these deleted codes. Don't worry. In the next version of Nebula, we will revert these deleted items.In the next version of Nebula, this mod will be directly integrated.



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
