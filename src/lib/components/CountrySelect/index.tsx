'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { COUNTRIES } from '@/lib/constants';
import ReactCountryFlag from 'react-country-flag';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Get the selected country name
  const selectedCountry = COUNTRIES.find((c) => c.country === country);

  // Filter countries based on search query and allowedCountries
  const filteredCountries = React.useMemo(() => {
    let filtered =
      allowedCountries && allowedCountries.length > 0
        ? COUNTRIES.filter((country) => allowedCountries.includes(country.country))
        : COUNTRIES;

    if (searchQuery) {
      filtered = filtered.filter((country) =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  }, [allowedCountries, searchQuery]);

  // Focus the input when the popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      // Small delay to ensure the popover is fully rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      // Clear search when closed
      setSearchQuery('');
    }
  }, [open]);

  return (
    <div className={cn('relative', fullWidth ? 'w-full' : 'w-[180px]')}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn('justify-between', fullWidth ? 'w-full' : 'w-[180px]')}
            disabled={disabled}
          >
            {selectedCountry ? (
              <div className="flex items-center">
                <ReactCountryFlag countryCode={selectedCountry.country} svg className="mr-2" />
                {selectedCountry.name}
              </div>
            ) : (
              <span>{text}</span>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <div className="flex items-center border-b p-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              ref={inputRef}
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {searchQuery && (
              <X
                className="h-4 w-4 shrink-0 opacity-50 cursor-pointer"
                onClick={() => setSearchQuery('')}
              />
            )}
          </div>
          <ScrollArea className="h-[300px]">
            {filteredCountries.length > 0 ? (
              <div className="flex flex-col py-1">
                {filteredCountries.map((entry) => (
                  <div
                    key={entry.country}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-muted',
                      country === entry.country && 'bg-muted',
                    )}
                    onClick={() => {
                      handleCountryChange(entry.country, country);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      <ReactCountryFlag countryCode={entry.country} svg className="mr-2" />
                      {entry.name}
                    </div>
                    {country === entry.country && <Check className="h-4 w-4" />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No countries found
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}
