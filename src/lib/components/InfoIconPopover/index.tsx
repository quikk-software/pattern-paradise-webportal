'use client';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface QuestionMarkPopoverProps {
  title: string;
  content: string;
}

export function InfoIconPopover({ title, content }: QuestionMarkPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Open information popover</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{title}</h4>
            <p className="text-sm text-muted-foreground">{content}</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
