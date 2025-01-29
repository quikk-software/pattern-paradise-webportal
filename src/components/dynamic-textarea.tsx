'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const DynamicTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        const newHeight = Math.min(Math.max(textarea.scrollHeight, 40), 4 * 24);
        textarea.style.height = `${newHeight}px`;
      }
    };

    React.useEffect(() => {
      adjustHeight();
    }, [props.value]);

    return (
      <textarea
        className={cn(
          'flex w-full rounded-md border border-input bg-background px-3 py-2 text-md ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          'placeholder:text-md',
          'resize-none',
          'min-h-[2.5rem]',
          'max-h-[96px]',
          'overflow-y-auto',
          className,
        )}
        ref={(element) => {
          textareaRef.current = element;
          if (typeof ref === 'function') {
            ref(element);
          } else if (ref) {
            ref.current = element;
          }
        }}
        rows={1}
        onInput={adjustHeight}
        {...props}
      />
    );
  },
);
DynamicTextarea.displayName = 'DynamicTextarea';

export { DynamicTextarea };
