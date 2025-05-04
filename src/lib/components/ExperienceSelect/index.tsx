import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EXPERIENCE_LEVELS } from '@/lib/constants';
import { Controller, Control } from 'react-hook-form';

interface ExperienceSelectProps {
  control: Control<any>;
  name: string;
}

export default function ExperienceSelect({ control, name }: ExperienceSelectProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: 'Experience level is required' }}
      render={({ field }) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger className="w-full" aria-label="Select an experience level">
            <SelectValue placeholder="Select an experience level" />
          </SelectTrigger>
          <SelectContent>
            {EXPERIENCE_LEVELS.map((experience) => (
              <SelectItem key={experience} value={experience}>
                {experience}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}
