import * as translations from "../i18n";

export type Language = keyof typeof translations;

export const isLanguage = (language: string): language is Language =>
  language in translations;
