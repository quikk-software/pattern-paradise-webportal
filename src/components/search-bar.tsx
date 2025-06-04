'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useTranslations } from 'use-intl';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const t = useTranslations();

  return (
    <div className="relative">
      <Search className="absolute left-2 top-3 h-4 w-4 z-50 text-muted-foreground" />
      <Input
        placeholder={t('common.categories.search')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}
