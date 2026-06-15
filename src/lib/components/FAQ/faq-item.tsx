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

    // Only link/advertise Pro while the feature is active (same gating as the /pro route).
    const proActive = process.env.NEXT_PUBLIC_PATTERN_PARADISE_PRO_ACTIVE === 'true';
    if (proActive && (item.id === 'item-2' || item.id === 'item-8')) {
      result = result.replace(
        /Pro Membership/g,
        `<Link href="/pro" className="font-medium text-primary-accessible hover:underline transition-colors">Pro Membership</Link>`,
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
        /Profile Settings/g,
        `<Link href="/app/secure/auth/me" className="font-medium text-primary-accessible hover:underline transition-colors" rel="nofollow">Profile Settings</Link>`,
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
              className="font-medium text-primary-accessible hover:underline transition-colors"
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
            className="mb-4 overflow-hidden border border-border rounded-2xl shadow-[0_4px_20px_rgba(43,33,24,0.06)] group hover:shadow-[0_8px_30px_rgba(43,33,24,0.1)] transition-shadow duration-300"
          >
            <AccordionTrigger
              disabled
              className="px-6 py-5 text-lg font-medium bg-card hover:bg-muted/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between w-full">
                <div className="text-left">
                  <span className="text-foreground">{item.question}</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent forceMount className="px-6 py-4 text-base leading-relaxed bg-card">
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
