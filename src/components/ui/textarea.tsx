import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[120px] w-full rounded-3xl border-0 bg-muted px-6 py-4 text-base text-foreground shadow-clay-pressed ring-offset-background transition-all duration-300',
          'placeholder:text-muted-foreground',
          'focus:bg-card focus:ring-4 focus:ring-primary/25 focus:shadow-clay-card focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
