import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";

const LOCALES = [
    {
        code: "tr",
        name: "Türkçe",
        file: require("./messages/tr-TR.json"),
    },
    {
        code: "en",
        name: "English",
        file: require("./messages/en-US.json"),
    },
];

const resources = LOCALES.reduce((acc: any, lang) => {
    acc[lang.code] = { translation: lang.file };
    return acc;
}, {});

const language =
    RNLocalize.findBestLanguageTag(LOCALES.map((l) => l.code))?.languageTag ||
    "tr";

i18n.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: "tr",
    interpolation: { escapeValue: false },
});

export const loadLanguageResources = async (lang: string) => {
    try {
        const loader = LOCALES.find((l) => l.code === lang);
        if (loader) {
            const data = loader.file;
            i18n.addResourceBundle(lang, "translation", data, true, true);
        }
    } catch (error) {
        console.error(`Dil yüklenirken hata oluştu (${lang}):`, error);
    }
};

// İlk dili yükle
loadLanguageResources(language);

export default i18n;
