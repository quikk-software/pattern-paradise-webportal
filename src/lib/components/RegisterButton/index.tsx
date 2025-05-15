'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function RegisterButton() {
  return (
    <div className="relative">
      <Button
        size="lg"
        className={cn(
          'relative overflow-hidden font-semibold text-base px-8 py-6 transition-all duration-300 shadow-lg',
          'bg-primary hover:bg-primary/90 text-primary-foreground',
          'flex items-center gap-2 group',
        )}
      >
        <span>Register Now</span>
        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
      </Button>
    </div>
  );
}
