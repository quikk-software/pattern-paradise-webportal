'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslations } from 'use-intl';

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
  const t = useTranslations();

  return (
    <Select value={selectedCraft} onValueChange={onCraftChange}>
      <SelectTrigger id="craft" className="w-full">
        <SelectValue placeholder="Select a craft" />
      </SelectTrigger>
      <SelectContent>
        {hasAll ? <SelectItem value="All">{t('common.categories.all')}</SelectItem> : null}
        <SelectItem value="Crocheting">{t('common.categories.crocheting')}</SelectItem>
        <SelectItem value="Knitting">{t('common.categories.knitting')}</SelectItem>
        <SelectItem value="Cross Stitch">{t('common.categories.crossStitch')}</SelectItem>
        <SelectItem value="Sewing">{t('common.categories.sewing')}</SelectItem>
        <SelectItem value="Embroidery">{t('common.categories.embroidery')}</SelectItem>
        <SelectItem value="Quilting">{t('common.categories.quilting')}</SelectItem>
        <SelectItem value="Weaving">{t('common.categories.weaving')}</SelectItem>
      </SelectContent>
    </Select>
  );
}
