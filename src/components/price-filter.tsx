'use client';

import { SetStateAction, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PriceFilterProps {
  onFilterChange: (filter: { isFree: boolean; minPrice: number; maxPrice: number }) => void;
  priceRange: number[];
  setPriceRange: (value: SetStateAction<number[]>) => void;
}

export default function PriceFilter({
  onFilterChange,
  priceRange,
  setPriceRange,
}: PriceFilterProps) {
  const [isFree, setIsFree] = useState(false);

  const handleFreeChange = (checked: boolean) => {
    setIsFree(checked);
    onFilterChange({ isFree: checked, minPrice: priceRange[0], maxPrice: priceRange[1] });
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    onFilterChange({ isFree, minPrice: value[0], maxPrice: value[1] });
  };

  const minPrice = priceRange[0];
  const maxPrice = priceRange[1];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-primary">Price Filter</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="price-range" className="text-sm font-medium text-muted-foreground">
                Minimum price
              </Label>
              <span className="text-sm font-semibold text-primary">${minPrice.toFixed(2)}</span>
            </div>
            <Slider
              id="price-range"
              min={3}
              max={maxPrice}
              step={0.01}
              value={[minPrice]}
              onValueChange={handlePriceChange}
              disabled={isFree}
              className={cn(
                'w-full',
                '[&_[role=slider]]:h-5 [&_[role=slider]]:w-5',
                '[&_[role=slider]]:border-primary/50',
                '[&_.range-slider-track]:h-3',
                '[&_.range-slider-range]:h-3',
              )}
            />
          </div>

          <div className="flex items-center space-x-2 pt-2 border-t border-border">
            <Checkbox id="free" checked={isFree} onCheckedChange={handleFreeChange} />
            <Label
              htmlFor="free"
              className="text-sm font-medium leading-none cursor-pointer select-none"
            >
              Show free patterns
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
