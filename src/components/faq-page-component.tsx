'use client';

import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';
import { PRO_MEMBERSHIP_PRICE } from '@/lib/constants';
import useAction from '@/lib/core/useAction';

export default function FAQPageComponent() {
  const [selectedAccordionItem, setSelectedAccordionItem] = useState<string | undefined>(undefined);

  const { action } = useAction();

  useEffect(() => {
    setSelectedAccordionItem(action);
  }, [action]);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-primary mb-8">
          Frequently Asked Questions
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            value={selectedAccordionItem}
            onValueChange={(value) => setSelectedAccordionItem(value)}
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold text-[#8B4513] text-left">
                What is Pattern Paradise?
              </AccordionTrigger>
              <AccordionContent>
                Pattern Paradise is an online marketplace that connects crochet and knitting
                enthusiasts. We provide a platform for designers to sell their unique patterns and
                for buyers to discover a wide range of high-quality, handmade designs. We also offer
                collaborative tools for pattern testing and refinement.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold text-[#8B4513] text-left">
                How does Pattern Paradise make money?
              </AccordionTrigger>
              <AccordionContent>
                We charge a 5% fee on the gross value of each pattern sold. This fee helps us
                maintain and improve our platform, develop new collaboration tools, and ensure the
                quality of patterns shared in our community. We also offer a{' '}
                <Link href="/pro" className="text-blue-500 underline">
                  Pro Membership
                </Link>{' '}
                for users who need advanced features and want to be the highest ranked on Pattern
                Paradise.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold text-[#8B4513] text-left">
                What is a pattern?
              </AccordionTrigger>
              <AccordionContent>
                A pattern is a detailed set of instructions for creating handmade items using
                crochet or knitting techniques. It includes step-by-step directions, stitch counts,
                measurements, and sometimes visual aids. Patterns serve as blueprints for crafting
                various items, from clothing to home decor.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold text-[#8B4513] text-left">
                How are patterns delivered?
              </AccordionTrigger>
              <AccordionContent>
                All patterns on Pattern Paradise are available as digital downloads. Once purchased,
                you can instantly access and start your project.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-semibold text-[#8B4513] text-left">
                Can I sell my own patterns on Pattern Paradise?
              </AccordionTrigger>
              <AccordionContent>
                Yes! Pattern Paradise welcomes designers to showcase and sell their unique patterns.
                You can easily upload your designs and set your own prices. We&apos;ll handle the
                transactions and provide tools to help you manage your pattern sales.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg font-semibold text-[#8B4513] text-left">
                What makes Pattern Paradise unique?
              </AccordionTrigger>
              <AccordionContent>
                Pattern Paradise stands out due to our strong ties with the crocheting and knitting
                community on social media. We leverage these connections to increase designers&apos;
                visibility, promote patterns, and attract more creators and buyers to our platform.
                We also offer innovative collaboration tools for pattern testing and refinement.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="collaborate">
              <AccordionTrigger className="text-lg font-semibold text-[#8B4513] text-left">
                How can I collaborate on pattern testing?
              </AccordionTrigger>
              <AccordionContent>
                Pattern Paradise provides advanced tools for tutorials and feedback. You can
                participate in pattern testing, offer suggestions for improvements, and help refine
                designs before they&apos;re finalized. This collaborative approach ensures
                high-quality patterns and fosters community engagement.{' '}
                <Link
                  href="/auth/registration?preselectedRoles=Tester&redirect=/app/test"
                  className="text-blue-500 underline"
                >
                  Register as a Tester
                </Link>{' '}
                or update your selected roles in your{' '}
                <Link href="/app/secure/auth/me" className="text-blue-500 underline">
                  Profile Settings
                </Link>
                . Once you have everything set up, you can{' '}
                <Link href="/app/secure/test" className="text-blue-500 underline">
                  browse Tester Calls
                </Link>
                .
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-8">
              <AccordionTrigger className="text-lg font-semibold text-[#8B4513] text-left">
                Is there a membership fee to join Pattern Paradise?
              </AccordionTrigger>
              <AccordionContent>
                No, there&apos;s no membership fee to join Pattern Paradise. Our platform is free to
                use for both designers and buyers. We only charge a 5% fee on successful pattern
                sales. If you are interested in a{' '}
                <Link href="/pro" className="text-blue-500 underline">
                  Pro membership
                </Link>{' '}
                for advanced features, you can purchase this in a separate subscription for{' '}
                {PRO_MEMBERSHIP_PRICE}
                per month.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
