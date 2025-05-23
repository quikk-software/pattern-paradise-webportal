import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import * as React from 'react';

interface SubcategorySelectProps {
  subcategory: Record<any, any>;
  onOptionToggle: (
    subcategoryName: string,
    selectedOption: { name: string; selected: boolean },
  ) => void;
}

export function SubcategorySelect({ subcategory, onOptionToggle }: SubcategorySelectProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {subcategory.options.map((option: any, index: any) => (
        <div key={`${option.name}-${index}`} className="flex items-center space-x-2">
          <Checkbox
            id={`${subcategory.name}-${option.name}`}
            checked={option.selected}
            onCheckedChange={() => {
              onOptionToggle(subcategory.name, option);
            }}
          />
          <Label className="cursor-pointer" htmlFor={`${subcategory.name}-${option.name}`}>
            {option.name}
          </Label>
        </div>
      ))}
    </div>
  );
}
