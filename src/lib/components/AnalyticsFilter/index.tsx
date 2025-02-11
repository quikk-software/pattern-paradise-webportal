'use client';

import React, { useState } from 'react';
import { CalendarIcon, FilterIcon, Trash } from 'lucide-react';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { setEndDate, setStartDate, reset } from '@/lib/features/analytics/analyticsSlice';
import { GetOrderAnalyticsResponse } from '@/@types/api-types';

interface AnalyticsFilterProps {
  userId: string;
  fetch: (userId: string, startDate?: Date, endDate?: Date) => Promise<GetOrderAnalyticsResponse>;
  isLoading: boolean;
  isError: boolean;
  errorDetail?: string;
}

export default function AnalyticsFilter({
  userId,
  fetch,
  isLoading,
  isError,
  errorDetail,
}: AnalyticsFilterProps) {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const dispatch = useDispatch();
  const { startDate, endDate } = useSelector((s: Store) => s.analytics);

  const handleFilter = () => {
    fetch(userId, startDate, endDate);
  };

  const resetFilter = () => {
    dispatch(reset());
    fetch(userId);
  };

  return (
    <div className="space-y-4">
      <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full sm:w-[240px] justify-start text-left font-normal',
              !startDate && 'text-muted-foreground',
            )}
            onClick={() => setStartDateOpen(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, 'PPP') : <span>Start Date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={(value) => {
              dispatch(setStartDate(value));
              setStartDateOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full sm:w-[240px] justify-start text-left font-normal',
              !endDate && 'text-muted-foreground',
            )}
            onClick={() => setEndDateOpen(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, 'PPP') : <span>End Date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={(value) => {
              dispatch(setEndDate(value));
              setEndDateOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button className="w-full" onClick={handleFilter} disabled={isLoading}>
        {isLoading ? (
          <LoadingSpinnerComponent size="sm" className="h-4 w-4" />
        ) : (
          <FilterIcon className="h-4 w-4" />
        )}
        Apply Filters
      </Button>
      <Button className="w-full" variant={'outline'} onClick={resetFilter}>
        <Trash className="h-4 w-4" />
        Reset Filters
      </Button>
      {isError ? (
        <p className="text-sm text-red-500">
          Something went wrong{errorDetail ? `: ${errorDetail}` : ''}
        </p>
      ) : null}
    </div>
  );
}
