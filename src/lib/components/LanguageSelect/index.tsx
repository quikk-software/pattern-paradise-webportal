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
}

export default function LanguageSelect({
  language,
  handleLanguageChange,
  fullWidth,
}: LanguageSelectProps) {
  return (
    <div className="flex-grow">
      <Select
        value={language ?? ''}
        onValueChange={(value) => handleLanguageChange(value, language)}
      >
        <SelectTrigger className={`${fullWidth ? 'w-full' : 'w-[180px]'}`}>
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((lang) => (
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
