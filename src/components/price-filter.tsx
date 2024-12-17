'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PriceFilterProps {
  onFilterChange: (filter: { isFree: boolean; minPrice: number }) => void;
  value: number;
  isFree: boolean;
  maxPrice?: number;
}

export default function PriceFilter({
  isFree,
  value,
  onFilterChange,
  maxPrice = 100,
}: PriceFilterProps) {
  // Local state for slider value to ensure smooth interaction
  const [sliderValue, setSliderValue] = useState(value);

  // Debounced update to parent state
  const handleSliderChangeEnd = () => {
    onFilterChange({ isFree, minPrice: sliderValue });
  };

  const handleFreeChange = (checked: boolean) => {
    onFilterChange({ isFree: checked, minPrice: sliderValue });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-primary">Price Filter</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="price-range" className="text-sm font-medium text-muted-foreground">
                Minimum price (double-click slider to activate price range filter)
              </Label>
              <span className="text-sm font-semibold text-primary self-end">
                ${sliderValue.toFixed(2)}
              </span>
            </div>
            <Slider
              id="price-range"
              min={3}
              max={maxPrice}
              step={0.01}
              value={[sliderValue]} // Local state value for smooth sliding
              onValueChange={(value) => setSliderValue(value[0])} // Update local state
              onValueCommit={handleSliderChangeEnd} // Commit only on end of sliding
              onClick={() => {
                if (isFree) {
                  handleFreeChange(false);
                }
              }}
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
