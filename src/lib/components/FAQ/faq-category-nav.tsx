'use client';

import { FAQ_CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Info, Scissors, Users, Badge, UserRoundSearch } from 'lucide-react';
import PatternParadiseIcon from '@/lib/icons/PatternParadiseIcon';

interface FAQCategoryNavProps {
  activeCategory: string;
  onChange: (category: string) => void;
}

export const FAQCategoryNav: React.FC<FAQCategoryNavProps> = ({ activeCategory, onChange }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'all':
        return <Info className="w-5 h-5" />;
      case 'info':
        return <UserRoundSearch className="w-5 h-5" />;
      case 'scissors':
        return <PatternParadiseIcon className="w-5 h-5" />;
      case 'users':
        return <Users className="w-5 h-5" />;
      case 'badge':
        return <Badge className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8 sm:gap-4">
      {FAQ_CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => onChange(category.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300',
            'border-2 hover:bg-primary/10',
            activeCategory === category.id
              ? 'bg-primary/10 border-primary/30 text-primary'
              : 'bg-white border-muted text-muted-foreground',
          )}
        >
          <span className="transition-transform duration-300 group-hover:rotate-12">
            {getIcon(category.icon)}
          </span>
          <span>{category.label}</span>
        </button>
      ))}
    </div>
  );
};
