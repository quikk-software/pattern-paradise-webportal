import { Badge } from '@/components/ui/badge';
import { Label } from '@radix-ui/react-label';

interface SelectedOptionsProps {
  selectedOptions: {
    craft: string;
    options: { [key: string]: { name: string; selected: boolean }[] };
  };
}

export function SelectedOptions({ selectedOptions }: SelectedOptionsProps) {
  const { craft, options } = selectedOptions;
  const hasSelectedOptions = Object.values(options).some((arr) => arr.length > 0);

  if (!hasSelectedOptions) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label className="block text-lg font-semibold">Selected Categories</Label>
        <div className="text-md underline">{craft}</div>
      </div>
      <div className="space-y-4">
        {Object.entries(options).map(
          ([subcategory, selectedOpts]) =>
            selectedOpts.length > 0 && (
              <div key={subcategory} className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{subcategory}</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedOpts.map((option: any) => (
                    <Badge key={option.name} variant="secondary">
                      {option.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  );
}
