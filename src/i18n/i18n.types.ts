import { ReactCountryFlagProps } from "react-country-flag";

export enum Language {
  EN = "en",
  DE = "de",
}

/**
 * Resolve language names in native language, so we do not have to keep track of them in i18n files.
 */
export const languageResolverInNativeLanguage: Record<Language, string> = {
  [Language.DE]: "Deutsch",
  [Language.EN]: "English",
};

/**
 * Resolve language names for react-country-flag.
 */
export const languageResolverForReactCountryFlag: Record<Language, ReactCountryFlagProps["countryCode"]> = {
  [Language.DE]: "DE",
  [Language.EN]: "GB",
};
