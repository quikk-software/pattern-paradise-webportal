'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { COUNTRIES, COUNTRY_GROUPS } from '@/lib/constants';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';

interface CountrySelectorProps {
  excludedCountries: string[];
  setExcludedCountries: (selection: string[]) => void;
  isLoading?: boolean;
  callback?: (countries: string[]) => void;
}

export default function CountryGroupSelector({
  excludedCountries,
  setExcludedCountries,
  callback,
  isLoading,
}: CountrySelectorProps) {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  // Sync group selection from excluded countries
  useEffect(() => {
    const matchedGroups = COUNTRY_GROUPS.filter((group) =>
      group.countries.every((code) => excludedCountries.includes(code)),
    ).map((group) => group.id);
    setSelectedGroups(matchedGroups);
  }, [excludedCountries]);

  const toggleGroup = (groupId: string) => {
    let updatedGroups = [...selectedGroups];
    const isSelected = selectedGroups.includes(groupId);

    if (isSelected) {
      updatedGroups = updatedGroups.filter((id) => id !== groupId);
    } else {
      updatedGroups.push(groupId);
    }

    setSelectedGroups(updatedGroups);

    // Calculate combined unique countries from selected groups
    const newExcluded = Array.from(
      new Set(
        updatedGroups.map((id) => COUNTRY_GROUPS.find((g) => g.id === id)?.countries || []).flat(),
      ),
    );
    setExcludedCountries(newExcluded);
  };

  const clearSelection = () => {
    setSelectedGroups([]);
    setExcludedCountries([]);
  };

  const getCountryName = (code: string) =>
    COUNTRIES.find(({ country }) => country === code)?.name || code;

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex flex-wrap gap-2">
        {COUNTRY_GROUPS.map((group) => (
          <Badge
            key={group.id}
            variant={selectedGroups.includes(group.id) ? 'default' : 'outline'}
            className={`
                cursor-pointer py-1.5 px-3 text-sm
                ${selectedGroups.includes(group.id) ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}
              `}
            onClick={() => toggleGroup(group.id)}
          >
            {group.name}
            <span className="ml-1.5 text-xs opacity-70">({group.countries.length})</span>
          </Badge>
        ))}
      </div>

      {excludedCountries.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">
              Excluded countries ({excludedCountries.length}):
            </h3>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                clearSelection();
              }}
              className="h-8 px-2 text-xs"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear all
            </Button>
          </div>

          <ScrollArea className="h-[200px] border rounded-md p-3">
            <div className="flex flex-wrap gap-2">
              {excludedCountries
                .sort((a, b) => getCountryName(a).localeCompare(getCountryName(b)))
                .map((code) => (
                  <Badge key={code} variant="secondary" className="py-1">
                    {getCountryName(code)}
                  </Badge>
                ))}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">No countries excluded</h3>
        </div>
      )}

      <Button onClick={() => callback?.(excludedCountries)} disabled={isLoading}>
        {isLoading && <LoadingSpinnerComponent size="sm" className="text-white mr-2" />}
        Update Excluded Countries
      </Button>
    </div>
  );
}
