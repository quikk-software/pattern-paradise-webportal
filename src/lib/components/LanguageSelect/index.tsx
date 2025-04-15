import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LANGUAGES } from '@/lib/constants';
import ReactCountryFlag from 'react-country-flag';

interface LanguageSelectProps {
  language?: string;
  handleLanguageChange: (value: string, language?: string) => void;
  fullWidth?: boolean;
  allowedLanguages?: string[];
  disabled?: boolean;
  text?: string;
}

export default function LanguageSelect({
  language,
  handleLanguageChange,
  fullWidth,
  allowedLanguages,
  disabled = false,
  text = 'Select language',
}: LanguageSelectProps) {
  return (
    <div className="flex-grow">
      <Select
        value={language ?? ''}
        onValueChange={(value) => handleLanguageChange(value, language)}
        disabled={disabled}
      >
        <SelectTrigger
          aria-label={'Select a language'}
          className={`${fullWidth ? 'w-full' : 'w-[180px]'}`}
        >
          <SelectValue placeholder={text} />
        </SelectTrigger>
        <SelectContent>
          {(allowedLanguages && allowedLanguages?.length > 0
            ? LANGUAGES.filter((language) => allowedLanguages?.includes(language.code))
            : LANGUAGES
          ).map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center">
                <ReactCountryFlag countryCode={lang.country} svg className="mr-2" />
                {lang.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
