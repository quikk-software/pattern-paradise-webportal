'use client';

import React from 'react';
import { FAQ_ITEMS } from '@/lib/constants';
import { PRO_MEMBERSHIP_PRICE } from '@/lib/constants';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';

interface FAQItemProps {
  selectedAccordionItem?: string;
  setSelectedAccordionItem: (value: string | undefined) => void;
  activeCategory: string;
}

export const FAQItem: React.FunctionComponent<FAQItemProps> = ({
  selectedAccordionItem,
  setSelectedAccordionItem,
  activeCategory,
}) => {
  const filteredItems =
    activeCategory === 'all'
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === activeCategory);

  const formatAnswer = (item: (typeof FAQ_ITEMS)[0]) => {
    if (!item.hasLink) {
      return item.answer;
    }

    let result = item.answer;

    if (item.id === 'item-2' || item.id === 'item-8') {
      result = result.replace(
        /Pro Membership/g,
        `<Link href="/pro" className="font-medium text-primary hover:underline transition-colors">Pro Membership</Link>`,
      );

      if (item.id === 'item-8') {
        result = result.replace(
          `subscription.`,
          `subscription for ${PRO_MEMBERSHIP_PRICE} per month.`,
        );
      }
    }

    if (item.id === 'collaborate') {
      result = result.replace(
        /Register as a Tester/g,
        `<Link href="/auth/registration?preselectedRoles=Tester&redirect=/app/test" className="font-medium text-primary hover:underline transition-colors" rel="nofollow">Register as a Tester</Link>`,
      );

      result = result.replace(
        /Profile Settings/g,
        `<Link href="/app/secure/auth/me" className="font-medium text-primary hover:underline transition-colors" rel="nofollow">Profile Settings</Link>`,
      );

      result = result.replace(
        /browse Tester Calls/g,
        `<Link href="/app/tester-calls" className="font-medium text-primary hover:underline transition-colors" rel="nofollow">browse Tester Calls</Link>`,
      );
    }

    // Convert the Link markers back to actual components
    const parts = result.split(/<Link|<\/Link>/);
    const processedParts = [];

    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // Regular text
        processedParts.push(parts[i]);
      } else {
        // Link part
        const linkProps = parts[i].match(/href="([^"]*)"[^>]*>(.*)/);
        if (linkProps) {
          const [, href, text] = linkProps;
          const relProp = parts[i].includes('rel="nofollow"') ? { rel: 'nofollow' } : {};
          processedParts.push(
            <Link
              key={`link-${i}`}
              href={href}
              className="font-medium text-primary hover:underline transition-colors"
              {...relProp}
            >
              {text}
            </Link>,
          );
        }
      }
    }

    return <>{processedParts}</>;
  };

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      value={selectedAccordionItem}
      onValueChange={(value) => setSelectedAccordionItem(value)}
    >
      {filteredItems.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AccordionItem
            value={item.id}
            className="mb-4 overflow-hidden border border-border rounded-lg shadow-sm group hover:shadow-md transition-shadow duration-300"
          >
            <AccordionTrigger className="px-6 py-5 text-lg font-medium bg-gradient-to-r from-white to-secondary/20 group-data-[state=open]:from-secondary/10 group-data-[state=open]:to-secondary/30 transition-all duration-300">
              <div className="flex items-center justify-between w-full">
                <div className="text-left">
                  <span className="text-primary">{item.question}</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 text-base leading-relaxed bg-white">
              <div className="prose prose-sm max-w-none text-muted-foreground">
                {formatAnswer(item)}
              </div>
            </AccordionContent>
          </AccordionItem>
        </motion.div>
      ))}
    </Accordion>
  );
};
