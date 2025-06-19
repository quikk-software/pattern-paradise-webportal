'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Clock, Sparkles } from 'lucide-react';

interface PriceSaleBadgeProps {
  originalPrice: number;
  salePrice: number;
  currency: string;
  saleDueDate?: string | Date;
  className?: string;
}

export function PriceSaleBadge({
  originalPrice,
  salePrice,
  saleDueDate,
  currency,
  className,
}: PriceSaleBadgeProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(saleDueDate ?? '').getTime() - new Date().getTime();

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [saleDueDate]);

  if (isExpired) {
    return null;
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div className="bg-gradient-to-r from-red-50 to-amber-50 border-2 border-orange-500 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
            <h3 className="font-bold text-orange-600">Limited Time Offer!</h3>
          </div>
        </div>

        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-2xl font-bold text-orange-600">
            {currency}
            {salePrice.toFixed(2)}
          </span>
          <span className="text-gray-500 line-through text-sm">
            {currency}
            {originalPrice.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="h-4 w-4" />
          <span className="text-sm">Offer ends in:</span>
        </div>

        {saleDueDate ? (
          <div className="grid grid-cols-4 gap-1 mt-2">
            {[
              { value: timeLeft.days, label: 'Days' },
              { value: timeLeft.hours, label: 'Hours' },
              { value: timeLeft.minutes, label: 'Mins' },
              { value: timeLeft.seconds, label: 'Secs' },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="bg-white w-full text-center py-1 rounded border border-orange-200 font-mono text-lg font-bold text-orange-600">
                  {String(item.value).padStart(2, '0')}
                </div>
                <span className="text-xs text-gray-600 mt-1">{item.label}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
