import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SubcategorySelect } from './subcategory-select';

interface CategoryAccordionProps {
  subcategories: Record<any, any>[];
  onOptionToggle: (
    subcategoryName: string,
    selectedOption: { name: string; selected: boolean },
  ) => void;
}

export function CategoryAccordion({ subcategories, onOptionToggle }: CategoryAccordionProps) {
  return (
    <Accordion type="multiple" className="w-full">
      {subcategories.map((subcategory) => (
        <AccordionItem key={subcategory.name} value={subcategory.name}>
          <AccordionTrigger>{subcategory.name}</AccordionTrigger>
          <AccordionContent>
            <SubcategorySelect subcategory={subcategory} onOptionToggle={onOptionToggle} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
