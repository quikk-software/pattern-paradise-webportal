import * as Select from '@radix-ui/react-select';
import { CATEGORIES } from '@/lib/constants';
import { ChevronDownIcon } from 'lucide-react';

interface CategorySelectProps {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}

export default function CategorySelect({ category, setCategory }: CategorySelectProps) {
  return (
    <Select.Root value={category} onValueChange={setCategory}>
      <Select.Trigger className="flex items-center justify-between p-2 border rounded">
        <Select.Value placeholder="Select a Category" />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Content className="border rounded shadow-md bg-white">
        {CATEGORIES.map((category) => (
          <Select.Group key={category.name}>
            <Select.Label className="px-4 py-2 font-bold">{category.name}</Select.Label>
            {category.subcategories.map((subcategory) => (
              <div key={subcategory.name} className="px-4">
                <p className="mt-2 font-medium">{subcategory.name}</p>
                {subcategory.options.map((option) => (
                  <Select.Item
                    key={option.name}
                    value={option.name}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  >
                    {option.name}
                  </Select.Item>
                ))}
              </div>
            ))}
          </Select.Group>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
