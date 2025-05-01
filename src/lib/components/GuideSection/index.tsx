'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GuideProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export default function GuideSection({
  title,
  description,
  children,
  className,
  defaultOpen = false,
}: GuideProps) {
  return (
    <Card className={cn('overflow-hidden border border-border', className)}>
      <Accordion type="single" collapsible defaultValue={defaultOpen ? title : undefined}>
        <AccordionItem value={title} className="border-b-0">
          <div className="flex items-center px-6 py-4 w-full">
            <AccordionTrigger className="flex-1 hover:no-underline py-0">
              <div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              </div>
            </AccordionTrigger>
          </div>
          <AccordionContent>
            <CardContent className="pb-6 pt-0">{children}</CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
