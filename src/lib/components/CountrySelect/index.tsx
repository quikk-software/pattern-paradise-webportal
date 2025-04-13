import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COUNTRIES } from '@/lib/constants';
import ReactCountryFlag from 'react-country-flag';

interface CountrySelectProps {
  country?: string;
  handleCountryChange: (value: string, country?: string) => void;
  fullWidth?: boolean;
  allowedCountries?: string[];
  disabled?: boolean;
  text?: string;
}

export default function CountrySelect({
  country,
  handleCountryChange,
  fullWidth,
  allowedCountries,
  disabled = false,
  text = 'Select country',
}: CountrySelectProps) {
  return (
    <div className="flex-grow">
      <Select
        value={country ?? ''}
        onValueChange={(value) => handleCountryChange(value, country)}
        disabled={disabled}
      >
        <SelectTrigger className={`${fullWidth ? 'w-full' : 'w-[180px]'}`}>
          <SelectValue placeholder={text} />
        </SelectTrigger>
        <SelectContent>
          {(allowedCountries && allowedCountries?.length > 0
            ? COUNTRIES.filter((country) => allowedCountries?.includes(country.country))
            : COUNTRIES
          ).map((entry) => (
            <SelectItem key={entry.country} value={entry.country}>
              <div className="flex items-center">
                <ReactCountryFlag countryCode={entry.country} svg className="mr-2" />
                {entry.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
