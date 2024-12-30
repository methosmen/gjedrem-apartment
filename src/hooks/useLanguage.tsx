import { create } from "zustand";
import { translations, Language } from "@/lib/translations";

type LanguageStore = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

export const useLanguage = create<LanguageStore>((set, get) => ({
  language: "no",
  setLanguage: (language) => set({ language }),
  t: (key: string) => {
    const { language } = get();
    const keys = key.split(".");
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return value || key;
  },
}));