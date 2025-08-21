import { createContext, useContext } from "react";

import { en } from "../i18n";

export const TranslationContext = createContext(en);

export const useTranslation = () => useContext(TranslationContext);
