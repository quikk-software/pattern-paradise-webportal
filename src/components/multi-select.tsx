import { useEffect, useState } from 'react';
import { SearchBar } from './search-bar';
import { CategoryAccordion } from './category-accordion';
import { CraftSelector } from './craft-selector';

interface MultiSelectProps {
  initialCategories: any;
  onChange: (selectedOptions: {
    craft: string;
    options: { [key: string]: { name: string; selected: boolean }[] };
  }) => void;
  injectCategories: boolean;
  overrideCraft?: string;
}

export function MultiSelect({
  initialCategories,
  onChange,
  injectCategories,
  overrideCraft,
}: MultiSelectProps) {
  const [selectedCraft, setSelectedCraft] = useState<string>(overrideCraft ?? 'Crocheting');
  const [categories, setCategories] = useState<any>(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!injectCategories) {
      return;
    }
    handleOptionToggle();
  }, [injectCategories]);

  const handleCraftChange = (craft: string) => {
    setSelectedCraft(craft);
    onChange({ craft, options: {} });
    setCategories(initialCategories);
  };

  const handleOptionToggle = (
    subcategoryName?: string,
    selectedOption?: { name: string; selected: boolean },
  ) => {
    const newCategories = categories.map((category: any) => {
      if (category.name === selectedCraft) {
        return {
          ...category,
          subcategories: category.subcategories.map((subcategory: any) => {
            if (subcategory.name === subcategoryName) {
              return {
                ...subcategory,
                options: subcategory.options.map((option: any) => {
                  if (option.name === selectedOption?.name) {
                    return { ...option, selected: !option.selected };
                  }
                  return option;
                }),
              };
            }
            return subcategory;
          }),
        };
      }
      return category;
    });

    setCategories(newCategories);

    const selectedCategory = newCategories.find((category: any) => category.name === selectedCraft);
    const selectedOptions = selectedCategory?.subcategories.reduce(
      (acc: any, subcategory: any) => {
        acc[subcategory.name] = subcategory.options
          .filter((option: any) => option.selected)
          .map((option: any) => option);
        return acc;
      },
      {} as { [key: string]: string[] },
    );

    onChange({ craft: selectedCraft, options: selectedOptions || {} });
  };

  const selectedCategory = categories.find((category: any) => category.name === selectedCraft);

  const filteredSubcategories =
    selectedCategory?.subcategories.map((subcategory: any) => {
      return {
        ...subcategory,
        options: subcategory.options.filter((option: any) => {
          return option.name?.toLowerCase().includes(searchTerm.toLowerCase());
        }),
      };
    }) || [];

  if (selectedCraft === 'All') {
    return null;
  }

  return (
    <div className="w-full mx-auto space-y-4">
      {!overrideCraft ? (
        <CraftSelector selectedCraft={selectedCraft} onCraftChange={handleCraftChange} />
      ) : null}
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      <CategoryAccordion
        subcategories={filteredSubcategories}
        onOptionToggle={handleOptionToggle}
      />
    </div>
  );
}
