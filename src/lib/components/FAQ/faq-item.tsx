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
import { getTranslations } from 'next-intl/server';

export default async function FAQItem() {
  const t = await getTranslations();

  const faqItems = FAQ_ITEMS(t);

  const formatAnswer = (item: (typeof faqItems)[0]) => {
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
    <Accordion type="single" collapsible className="w-full">
      {faqItems.map((item) => (
        <div key={item.id}>
          <AccordionItem
            value={item.id}
            className="mb-4 overflow-hidden border border-border rounded-lg shadow-sm group hover:shadow-md transition-shadow duration-300"
          >
            <AccordionTrigger
              disabled
              className="px-6 py-5 text-lg font-medium bg-gradient-to-r from-white to-secondary/20 group-data-[state=open]:from-secondary/10 group-data-[state=open]:to-secondary/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between w-full">
                <div className="text-left">
                  <span className="text-primary">{item.question}</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent forceMount className="px-6 py-4 text-base leading-relaxed bg-white">
              <div className="prose prose-sm max-w-none text-muted-foreground">
                {formatAnswer(item)}
              </div>
            </AccordionContent>
          </AccordionItem>
        </div>
      ))}
    </Accordion>
  );
}
