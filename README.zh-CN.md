<h1 align="center">Context-Menu-Icons</h1>

<p align="center">
  <a href="README.md">English</a> · <b>简体中文</b>
</p>

<div align="center">
  <a href="https://zen-browser.app/">
    <img width="120" alt="Zen Browser" src="https://github.com/user-attachments/assets/d6ab3ddf-6630-4062-92d0-22497d2a3f9a" />
  </a>
</div>

<h2 align="center">让浏览器的右键菜单更清晰、更好用。</h2>
<p align="center">添加图标、折叠低频项目、自定义菜单与书签栏。支持 Zen Browser 和 Firefox。</p>

## 主要功能

- 🖼️ 为右键菜单项添加图标，提供 FluentUI 与 ZenUI 两种图标风格。
- 🎨 调整右键菜单的间距与外观，改进视觉体验。
- ✅ 可自动隐藏不可用的菜单项。例如没有同名标签页时，「关闭重复标签页」通常是灰的，本模组会直接把它隐藏。
- 📚 把不常用的项目收进 **显示更多选项** 子菜单。只需要使用快捷键轻松改变显隐状态，所见即所得。
- 🔖 改进书签栏使用体验。自定义书签工具栏的对齐方式、显示状态与自动隐藏行为。

---

## 效果预览

下列截图对比了两套图标包。**左侧为 ZenUI**，**右侧为 FluentUI**。

<table>
  <tr>
    <th align="center">ZenUI</th>
    <th align="center">FluentUI</th>
  </tr>
  <tr>
    <td width="50%"><img width="100%" alt="使用 ZenUI 图标的右键菜单" src="https://github.com/user-attachments/assets/5fa65f0f-ce17-438e-8c90-04863d254420" /></td>
    <td width="50%"><img width="100%" alt="使用 FluentUI 图标的右键菜单" src="https://github.com/user-attachments/assets/55219a33-8c18-431c-8d76-0436cc1df605" /></td>
  </tr>
</table>

### 折叠效果对比

第一张是**关闭**折叠的菜单；后两张是**开启**折叠后的菜单，包含「显示更多选项」子菜单。

<table>
  <tr>
    <th align="center">关闭折叠</th>
    <th align="center">开启折叠</th>
    <th align="center">开启折叠 · 更多选项</th>
  </tr>
  <tr>
    <td width="33.3%"><img width="100%" alt="关闭折叠时的右键菜单" src="https://github.com/user-attachments/assets/145bb738-4e63-443b-97a2-e40302d35884" /></td>
    <td width="33.3%"><img width="100%" alt="开启折叠时的右键菜单" src="https://github.com/user-attachments/assets/8214acf3-9b46-46e4-b9f9-1b44de0324a7" /></td>
    <td width="33.3%"><img width="100%" alt="展开更多选项的折叠菜单" src="https://github.com/user-attachments/assets/a1083640-6828-4aa1-85d4-5880a6fff966" /></td>
  </tr>
</table>

---

## 📖 CMI-fold-menu-JS 使用指南

### 概述

自 [CMI v2.1](https://github.com/Starry-AXQG/Context-Menu-Icons/releases/tag/v2.1) 起，随包附带的 JavaScript 模块可以精简过长的右键菜单：把页面右键菜单（`contentAreaContextMenu`）里的指定项目移入 **显示更多选项** 子菜单，同时保证它们依旧可用。

### 演示

折叠菜单的实际效果：

https://github.com/user-attachments/assets/d813ad3e-d63a-44f0-8502-12ad23c81dea

### 核心特性

- 按 ID 把选定的菜单项折叠进 **显示更多选项** 子菜单。
- 用 CSS 变量或 `about:config` 偏好设置项目列表。
- 用 CSS 变量或偏好自定义子菜单名称。
- 菜单打开时，保持 **Caps Lock** 开启，再按 **Ctrl + Shift + A**，即可把当前悬停的项目加入或移出折叠列表。要求大写锁定为前提是为了减少潜在的误触发。
- 打开右键菜单时按住 **Shift**，可以临时显示未折叠的原始菜单。（类似Windows11的右键菜单）
- 尽量保留被移动项目的视觉样式。这保证了CMI添加的图标能够在移动后也正常显示。

### 快捷键

| 操作 | 按键 |
| --- | --- |
| 把悬停项目加入或移出折叠列表 | 菜单打开且指针停在某个项目上时，先开启 Caps Lock，再按 `Ctrl` + `Shift` + `A`。 |
| 临时显示完整菜单 | 打开右键菜单时按住 `Shift`。 |

对于子菜单项目，请在子菜单展开之前按下切换快捷键。

### 配置折叠

把 `cmi-fold_menu_item-enable` 设为 `true` 即可启用页面菜单折叠脚本。然后在 `cmi-fold-item-IDs` 里填入项目 ID（逗号或空格分隔），或者直接使用 `CMI-config.css` 中的 CSS 变量：

```css
:root {
  --cmi-fold-item-ids: "context-openlink, context-openlinkprivate, context-sendlinktodevice";
  --cmi-fold-menu-label: "显示更多选项";
}
```

脚本内置了常见语言的本地化文案。如需自定义名称，请使用 `cmi-fold-menu-label` 或 `--cmi-fold-menu-label`。

脚本还包含可选的标签菜单折叠偏好：`cmi-fold_tab_menu_item-enable` 与 `cmi-fold-tab-item-IDs`。只有在确有需要时才手动启用。请避免折叠「分享」项目，它可能没有可用的 ID。如果修改折叠列表后标签菜单失效，请从配置文件的 `prefs.js` 中删除 `cmi-fold-tab-item-IDs` 偏好并重启浏览器。

---

## 🔖 安装

### 推荐：通过 Sine 安装

[Sine](https://github.com/CosmoCreeper/Sine) 是一款面向 Firefox 系浏览器的社区模组管理器，让安装、更新和偏好管理都更省事。

1. 按照 Sine 的[安装指南](https://github.com/CosmoCreeper/Sine#%EF%B8%8F-installation)装好 Sine。
2. 在 Sine 中搜索 **Context Menu Icons**，点击 **安装**。
3. 如有提示，重启浏览器。

| ⚠️：如果模组没有正常工作，请打开配置面板，确认该选项已启用。 |
| --- |
| <img width="1918" height="1270" alt="PixPin_2026-10-30_23-23-09" src="https://github.com/user-attachments/assets/05012fe1-a4ca-4fcd-951c-372695f2bfdf" /> |

### 手动安装

手动安装意味着每次更新都需要自行替换文件。

1. 在浏览器配置文件夹（profile）里新建 `chrome` 文件夹。Zen 用户可参考[实时编辑指南](https://docs.zen-browser.app/guides/live-editing)。
2. 通过 **Code → Download ZIP** 下载项目，或从 [Releases](https://github.com/Starry-AXQG/Context-Menu-Icons/releases) 获取发布包。
3. 把压缩包内容复制进配置文件夹的 `chrome` 目录。
4. 在 `about:config` 中把 `svg.context-properties.content.enabled` 设为 `true`。
5. 重启浏览器。

---

## ⚙️ 偏好设置

Sine 用户可以直接在模组页面里管理设置。手动安装的用户请打开 `about:config`，搜索对应偏好，按需新增。布尔项使用 `true` 或 `false`；数值项使用下表列出的取值。除特别说明外，大多数选项默认关闭。

### 🎛️ HTML 设置面板

CMI 自带一个整页设置面板，位于 `CMI/settings/preferences.html`。在 Sine 中点击 Context Menu Icons 卡片上的 **配置**（Configure）按钮即可打开。

面板会根据本页表格自动生成，下面列出的每一项偏好都会自动出现在面板里。改动会立即写入 `about:config`：大部分选项即时生效，少数可能需要重启浏览器。


### 浏览器与右键菜单设置

| 偏好 | 取值 | 说明 |
| --- | --- | --- |
| `svg.context-properties.content.enabled` | `true` | 图标在 Firefox 中生效的前提。Sine 会自动处理。 |
| `cmi-Switch-Icon-Package` | `0` 关闭 · `1` FluentUI · `2` ZenUI | 选择图标包。默认：`1`。 |
| `cmi-Switch-Gecko-Branch` | `1` Zen · `0` Firefox | 选择浏览器分支。Firefox 用户请设为 `0`。 |
| `cmi-Disable-Better-Context-Menu` | `true` / `false` | 关闭 CMI 的增强右键菜单样式。默认：`false`。 |
| `cmi-Disable-BCM-Gradient-Effect` | `true` / `false` | 关闭悬停时的渐变高亮。默认：`false`。 |
| `cmi-BCM-border-radius` | CSS 长度 | 设置增强右键菜单的圆角半径。默认：`12px`。 |
| `cmi-fold_menu_item-enable` | `true` / `false` | 启用页面右键菜单项目折叠。默认：`false`。 |
| `cmi-fold-item-IDs` | 逗号或空格分隔的 ID | 选择要折叠的页面菜单项目。 |
| `cmi-fold-menu-label` | 文本 | 自定义页面菜单折叠子菜单的名称。 |
| `cmi-fold_tab_menu_item-enable` | `true` / `false` | 启用可选的标签菜单折叠。默认：`false`。 |
| `cmi-fold-tab-item-IDs` | 逗号或空格分隔的 ID | 选择要折叠的标签菜单项目。 |
| `cmi-fold-tab-menu-label` | 文本 | 自定义标签菜单折叠子菜单的名称。 |
| `cmi-Hide-Inactive-Items-TabContextMenu` | `true` / `false` | 隐藏标签右键菜单中的不可用项。默认：`false`。 |
| `cmi-Hide-Inactive-Items-ContentAreaContextMenu` | `true` / `false` | 隐藏页面右键菜单中的不可用项（beta）。默认：`false`。 |
| `cmi-Grayscale-Extensions-Icons` | `true` / `false` | 给扩展图标加上灰度效果。默认：`false`。 |
| `cmi-menuseparator-opacity` | `0`–`1` | 设置右键菜单分隔线的透明度。默认：`0.5`。 |

### 书签栏与其他设置

| 偏好 | 取值 | 说明 |
| --- | --- | --- |
| `cmi-Center-Bookmark-Items` | `true` / `false` | 书签工具栏项目居中显示。默认：`false`。 |
| `cmi-Hide-Folder-Icons` | `true` / `false` | 隐藏书签文件夹图标。默认：`false`。 |
| `cmi-Hide-Bookmark-Element` | `0`–`3` | `0` 全部显示 · `1` 隐藏图标 · `2` 隐藏名称 · `3` 两者都隐藏。默认：`0`。 |
| `cmi-Hide-OAiT-Item` | `true` / `false` | 隐藏书签中的「在标签页中打开全部」项目。默认：`false`。 |
| `cmi-Auto-Hide-BookmarkBar` | `0`–`3` | `0` 关闭 · `1` 悬停时显示 · `2` 搜索时显示 · `3` 两者都启用。默认：`0`。 |
| `cmi-AHB-enable-JS` | `true` / `false` | 改进自动隐藏行为，涵盖拖拽与触摸交互。默认：`false`。 |
| `cmi-Restore-Search-Button` | `true` / `false` | 在 Zen 的地址栏旁恢复搜索按钮。默认：`false`。 |

### 右键菜单间距

以下为可选的排版微调。凡标注处，用后缀 `_1` 表示 FluentUI、`_2` 表示 ZenUI。默认值定义在 `CMI-config.css` 中；清空对应偏好即可恢复默认。

| 偏好 | 适用 | 说明 |
| --- | --- | --- |
| `cmi-Padding-Container` | 两套图标包 | 容器标签页菜单中文字的左侧内边距。默认：`30px`。 |
| `cmi-checkmark-margin-left_x` | 图标包 `x` | 勾选标记的左外边距。默认：`6px`。 |
| `cmi-checkmark-margin-left_cover_x` | 图标包 `x` | 项目处于勾选状态时，勾选标记的左外边距。默认：`6px`。 |
| `cmi-checkmark-margin-right_x` | 图标包 `x` | 勾选标记的右外边距。默认：FluentUI `8px`、ZenUI `8px`。 |
| `cmi-checkmark-margin-right_cover_x` | 图标包 `x` | 项目处于勾选状态时，勾选标记的右外边距。默认：`8px`。 |
| `cmi-non-checkmark-subitems-padding_x` | 图标包 `x` | 出现勾选标记时，其他子菜单项的对齐内边距。默认：`14px`。 |
| `cmi-extension-icon-leftmargin_x` | 图标包 `x` | 浏览器扩展图标的左外边距。默认：`-6px`。 |
| `cmi-menu-text-leftmargin_x` | 图标包 `x` | 浏览器扩展菜单文字的左外边距。默认：`2px`。 |
| `cmi-fluentui-icons-leftmargin` | FluentUI | CMI 图标的左外边距。默认：`6px`。 |
| `cmi-fluentui-text-leftmargin` | FluentUI | CMI 图标旁文字的左外边距。默认：`8px`。 |
| `cmi-zenui-icons-leftmargin` | ZenUI | CMI 图标的左外边距。默认：`6px`。 |
| `cmi-zenui-text-leftmargin` | ZenUI | CMI 图标旁文字的左外边距。默认：`12px`。 |

---

## 兼容性

CMI 支持 **Zen Browser** 与 **Firefox**。无论使用哪个浏览器，都请确保 `about:config` 中的 `svg.context-properties.content.enabled` 已设为 `true`。浏览器版本兼容情况请查看[发行说明](https://github.com/Starry-AXQG/Context-Menu-Icons/releases)。

## 许可证

见 [LICENSE](LICENSE)。

## Star 趋势

<a href="https://www.star-history.com/#Starry-AXQG/Context-Menu-Icons&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Starry-AXQG/Context-Menu-Icons&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=Starry-AXQG/Context-Menu-Icons&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Starry-AXQG/Context-Menu-Icons&type=Date" />
  </picture>
</a>
