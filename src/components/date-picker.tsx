'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Trash } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
  date?: Date;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  min?: Date;
  max?: Date;
  disabled?: boolean;
}

export function DatePicker({ date, setDate, min, max, disabled = false }: DatePickerProps) {
  return (
    <Popover>
      <div className="flex gap-2 items-center w-full">
        <PopoverTrigger className="space-x-2 w-full">
          <Button
            type="button"
            variant={'outline'}
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        {date ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              setDate(undefined);
            }}
          >
            <Trash />
          </Button>
        ) : null}
      </div>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          fromDate={min}
          toDate={max}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
