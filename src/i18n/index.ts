import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translations from "@/i18n/translations";
import { DEFAULT_LANGUAGE } from "@/i18n/i18n.constants";

i18n.use(initReactI18next).init({
  resources: translations,
  lng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
