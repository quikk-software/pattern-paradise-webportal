import React from 'react';
import ReactCountryFlag from 'react-country-flag';

export default function CountryFlag({ languageCode }: { languageCode: string }) {
  const getCountryCode = (code: string) => {
    const countryCodes = {
      ar: 'SA', // Arabic - Saudi Arabia
      cs: 'CZ', // Czech - Czech Republic
      da: 'DK', // Danish - Denmark
      en: 'GB', // English - United Kingdom
      nl: 'NL', // Dutch - Netherlands
      de: 'DE', // German - Germany
      ru: 'RU', // Russian - Russia
      fr: 'FR', // French - France
      fi: 'FI', // Finnish - Finland
      el: 'GR', // Greek - Greece
      iw: 'IL', // Hebrew - Israel
      it: 'IT', // Italian - Italy
      jp: 'JP', // Japanese - Japan
      ko: 'KR', // Korean - South Korea
      no: 'NO', // Norwegian - Norway
      pl: 'PL', // Polish - Poland
      es: 'ES', // Spanish - Spain
      sv: 'SE', // Swedish - Sweden
      tr: 'TR', // Turkish - Turkey
      uk: 'UA', // Ukrainian - Ukraine
    };
    // @ts-ignore
    return countryCodes?.[code] ?? 'EN';
  };

  return <ReactCountryFlag countryCode={getCountryCode(languageCode)} aria-label={languageCode} />;
}
