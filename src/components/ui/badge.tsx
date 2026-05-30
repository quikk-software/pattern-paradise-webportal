import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary/10 text-primary hover:bg-primary/20',
        secondary:
          'border-transparent bg-secondary/10 text-secondary hover:bg-secondary/20',
        destructive:
          'border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20',
        success: 'border-transparent bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
        outline: 'border-border text-foreground bg-transparent',
        // Craft-specific variants for crochet/knitting marketplace
        crochet: 'border-transparent bg-amber-50 text-amber-700 hover:bg-amber-100',
        knit: 'border-transparent bg-sky-50 text-sky-700 hover:bg-sky-100',
        beginner: 'border-transparent bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
        intermediate: 'border-transparent bg-amber-50 text-amber-700 hover:bg-amber-100',
        advanced: 'border-transparent bg-rose-50 text-rose-700 hover:bg-rose-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
