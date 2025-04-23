'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface CardRadioOption {
  id: string;
  title: string;
  description: string;
}

interface CardRadioGroupProps {
  selectedOption: string | null;
  setSelectedOption: React.Dispatch<React.SetStateAction<string | null>>;
  question: string;
  description?: string | React.ReactNode;
  options: CardRadioOption[];
}

export default function CardRadioGroup({
  selectedOption,
  setSelectedOption,
  question,
  description,
  options,
}: CardRadioGroupProps) {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold">{question}</h3>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>

      <div className="grid gap-4 grid-cols-2">
        {options.map((option) => (
          <div key={option.id} className="relative">
            <input
              type="radio"
              id={option.id}
              name="mystery-box-option"
              className="sr-only"
              checked={selectedOption === option.id}
              onChange={() => setSelectedOption(option.id)}
            />
            <Label htmlFor={option.id} className="cursor-pointer block h-full">
              <Card
                className={`h-full transition-all ${
                  selectedOption === option.id
                    ? 'border-2 border-primary'
                    : 'hover:border-muted-foreground/50'
                }`}
              >
                <CardHeader>
                  <CardTitle>{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {selectedOption === option.id && (
                    <div className="absolute top-2 right-2 h-4 w-4 text-primary">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
