// CMI | Add Context Menu Icons to you Zen/Firefox
// Enable the necessary configurations. Please do not modify this part of the code.:
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);
user_pref("svg.context-properties.content.enabled", true); 

// ———— END ————


// 📚 Preferences 📚
// (Please refer to https://github.com/1247343406/context-menu-icons-for-Zen#-preferences- for a detailed description.)

user_pref("cmi-main__context-menu-icons-option", 1); //This attribute enables you to select the icon package，use numbers to make a selection.

user_pref("cmi-main__ContextMenu--better", true); //Use the better context menu.

user_pref("cmi-extensions__icon--grayscale", false); //[icons style]Add grayscale filter to extensions icons of context-menu(v1.3.0 add)

user_pref("cmi-extensions__icon--align", false); //[icons style] Align the icons of the extension with those of CMI(Default: Off. Turning this on will make the context menu more orderly.)(1.4 add，Only tested on Zen.)

user_pref("cmi-extensions__text--align", false); //[text style] Align the text of the extension with those of CMI(Default: Off. Turning this on will make the context menu more orderly.)(v1.4 add, ⚠️ This function has been temporarily delete.))

user_pref("cmi-bookmarks__item--centered", false); //[bookmarks]Centered Bookmark Toolbar Items(v1.3.0 add)

user_pref("cmi-bookmarks__icon--hide", false); //[bookmarks]Hide the redundant icons in the bookmark toolbar (Recommended to enable, which can make the bookmark bar more concise)(v1.3.0 add)
