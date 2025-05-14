import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";
import { useCookie } from "#app"; // ✅ Import useCookie for SSR compatibility

export const useAppLangStore = defineStore("appLang", {
  state: () => ({
    appLanguage: useCookie("elmo3lm_elmosa3d_app_lang", { default: () => "ar" }), // ✅ Use cookies instead of localStorage
  }),

  actions: {
    setAppLocale(payload:string) {
      this.appLanguage = payload;
      const langCookie = useCookie("elmo3lm_elmosa3d_app_lang");
      langCookie.value = payload; // ✅ Set language cookie
    },

    handelAppDefaultLanguage() {
      const i18n = useI18n();

      if (!this.appLanguage) {
        this.setAppLocale("ar");
        i18n.locale.value = "ar";
        document.querySelector("body")?.setAttribute("dir", "rtl");
      } else {
        i18n.locale.value = this.appLanguage as "ar" | "en";
        document.querySelector("body")?.setAttribute(
          "dir",
          this.appLanguage === "en" ? "ltr" : "rtl"
        );
      }
    },

    changeAppLanguage(payload:string) {
      const i18n = useI18n();

      if (payload === "en") {
        this.setAppLocale("en");
        i18n.locale.value = "en";
        document.querySelector("body")?.setAttribute("dir", "ltr");
      } else {
        this.setAppLocale("ar");
        i18n.locale.value = "ar";
        document.querySelector("body")?.setAttribute("dir", "rtl");
      }

      location.reload(); // ✅ Reload page to apply changes
    },
  },
});
