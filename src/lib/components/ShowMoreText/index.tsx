'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ProductDescriptionProps {
  description: string;
  maxRows?: number;
  className?: string;
  btnClassName?: string;
}

export default function ProductDescription({
  description,
  maxRows = 4,
  className,
  btnClassName,
}: ProductDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const [maxHeight, setMaxHeight] = useState<string>('none');
  const contentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (contentRef.current && typeof window !== 'undefined') {
      const lineHeight = parseInt(window.getComputedStyle(contentRef.current).lineHeight);
      const calculatedMaxHeight = lineHeight * maxRows;
      setMaxHeight(`${calculatedMaxHeight}px`);

      // Use setTimeout to ensure content has been rendered
      setTimeout(() => {
        if (contentRef.current) {
          setShowMoreButton(contentRef.current.scrollHeight > calculatedMaxHeight);
        }
      }, 0);
    }
  }, [description, maxRows]);

  return (
    <div className="flex flex-col gap-2">
      <p
        ref={contentRef}
        className={cn([
          `text-sm text-gray-600 overflow-hidden transition-all duration-300 ease-in-out whitespace-pre-line`,
          className,
        ])}
        style={{ maxHeight: isExpanded ? 'none' : maxHeight }}
      >
        {description}
      </p>
      {showMoreButton ? (
        <span
          className={cn(['text-primary underline text-sm text-right', btnClassName])}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </span>
      ) : null}
    </div>
  );
}
