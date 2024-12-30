import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface CraftSelectorProps {
  selectedCraft: string;
  onCraftChange: (craft: string) => void;
}

export function CraftSelector({ selectedCraft, onCraftChange }: CraftSelectorProps) {
  return (
    <RadioGroup
      value={selectedCraft}
      onValueChange={onCraftChange}
      className="flex space-x-4"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="Crocheting" id="crocheting" />
        <Label htmlFor="crocheting">Crocheting</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="Knitting" id="knitting" />
        <Label htmlFor="knitting">Knitting</Label>
      </div>
    </RadioGroup>
  )
}

