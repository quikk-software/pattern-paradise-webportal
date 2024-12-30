import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProductHashtagsProps {
  hashtags: string[];
}

export default function ProductHashtags({ hashtags }: ProductHashtagsProps) {
  if (hashtags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 my-4">
      {hashtags.map((tag, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="text-sm font-medium bg-primary/10 hover:bg-primary/20 transition-colors duration-200"
        >
          #{tag}
        </Badge>
      ))}
    </div>
  );
}
