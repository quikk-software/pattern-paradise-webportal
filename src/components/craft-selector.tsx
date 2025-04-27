import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CraftSelectorProps {
  selectedCraft: string;
  onCraftChange: (craft: string) => void;
  hasAll?: boolean;
}

export function CraftSelector({
  selectedCraft,
  onCraftChange,
  hasAll = false,
}: CraftSelectorProps) {
  return (
    <Select value={selectedCraft} onValueChange={onCraftChange}>
      <SelectTrigger id="craft" className="w-full">
        <SelectValue placeholder="Select a craft" />
      </SelectTrigger>
      <SelectContent>
        {hasAll ? <SelectItem value="All">All</SelectItem> : null}
        <SelectItem value="Crocheting">Crocheting</SelectItem>
        <SelectItem value="Knitting">Knitting</SelectItem>
        <SelectItem value="Cross Stitch">Cross Stitch</SelectItem>
        <SelectItem value="Sewing">Sewing</SelectItem>
        <SelectItem value="Embroidery">Embroidery</SelectItem>
        <SelectItem value="Quilting">Quilting</SelectItem>
        <SelectItem value="Weaving">Weaving</SelectItem>
      </SelectContent>
    </Select>
  );
}
