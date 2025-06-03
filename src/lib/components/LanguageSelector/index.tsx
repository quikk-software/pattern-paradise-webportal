'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname } from 'next/navigation';
import ReactCountryFlag from 'react-country-flag';
import { useLocale } from 'use-intl';

interface Language {
  name: string;
  code: string;
  countryCode: string;
}

const languages: Language[] = [
  {
    name: 'English',
    code: 'en',
    countryCode: 'US',
  },
  {
    name: 'Deutsch',
    code: 'de',
    countryCode: 'DE',
  },
];

export interface LanguageSelectorProps {
  currentLanguage?: string;
}

export function LanguageSelector({ currentLanguage = 'en' }: LanguageSelectorProps) {
  const pathname = usePathname();
  const currentLocale = useLocale();

  function switchLocale(newLocale: string) {
    window.location.href = `${process.env.NEXT_PUBLIC_URL}/${newLocale}${pathname.slice(currentLocale.length + 1)}`;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 h-8 px-2">
          <ReactCountryFlag
            countryCode={languages.find((l) => l.code === currentLanguage)?.countryCode ?? ''}
            svg
            style={{ width: '1.25rem', height: '1rem' }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        {languages.map((language) => (
          <DropdownMenuItem key={language.code} asChild>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => switchLocale(language.code)}
            >
              <div className="flex items-center gap-2">
                <ReactCountryFlag
                  countryCode={language.countryCode}
                  svg
                  style={{ width: '1.25rem', height: '1rem' }}
                />
                <span>{language.name}</span>
              </div>
              {currentLanguage === language.code && <Check className="h-4 w-4" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
