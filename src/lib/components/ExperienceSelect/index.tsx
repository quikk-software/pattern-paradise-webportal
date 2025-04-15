import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EXPERIENCE_LEVELS, ExperienceLevel } from '@/lib/constants';

interface ExperienceSelectProps {
  selectedExperienceLevel: ExperienceLevel;
  setSelectedExperienceLevel: (selectedExperienceLevel: ExperienceLevel) => void;
  id?: string;
}

export default function ExperienceSelect({
  selectedExperienceLevel,
  setSelectedExperienceLevel,
  id = 'experienceLevel',
}: ExperienceSelectProps) {
  return (
    <Select value={selectedExperienceLevel} onValueChange={setSelectedExperienceLevel}>
      <SelectTrigger className="w-full" aria-label={'Select an experience label'}>
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
  );
}
