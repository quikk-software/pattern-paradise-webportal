import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CategoryProps {
  category: string;
  subCategories: string[];
}

export default function ProductCategories({ category, subCategories }: CategoryProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="text-xs">
          {category}
        </Badge>
        {subCategories.map((subCategory, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {subCategory}
          </Badge>
        ))}
      </div>
    </div>
  );
}
