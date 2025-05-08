import React from 'react';
import { THEME_BG_CLASSES } from '@/lib/constants';

interface DescriptionProps {
  description?: string;
  theme?: string;
}

export default function Description({ description, theme = 'amber' }: DescriptionProps) {
  if (!description) {
    return null;
  }

  return (
    <div className="mt-4 w-full bg-white rounded-lg border border-muted bg-muted/10 p-3 transition-all duration-300 group-hover/link:border-muted/50">
      <div className="flex items-center gap-2 mb-1.5">
        <div className={`h-1 w-1 rounded-full ${THEME_BG_CLASSES[theme]}`}></div>
        <h3 className="text-sm font-semibold text-foreground">About Me</h3>
      </div>
      <div className="relative pl-3">
        <div
          className={`absolute left-0 top-0 bottom-0 w-0.5 ${THEME_BG_CLASSES[theme]} bg-opacity-30`}
        ></div>
        <p className="text-sm leading-relaxed text-foreground/90 italic">
          &quot;{description}&quot;
        </p>
      </div>
    </div>
  );
}
