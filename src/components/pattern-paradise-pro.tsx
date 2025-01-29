'use client';

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Check } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import SubscribeButton from '@/lib/components/SubscribeButton';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import Link from 'next/link';
import { PRO_MEMBERSHIP_PRICE } from '@/lib/constants';

export function PatternParadiseProComponent() {
  const { subscriptionStatus } = useSelector((s: Store) => s.auth);

  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }));
  }, [controls]);

  const features = [
    'Upload multiple patterns with language options per listing',
    'Featured patterns marked and displayed at the top',
    'Featured tester calls marked and displayed at the top',
    "Appear at the top of tester applicant's lists",
    'Share documents and videos in tester call chats',
  ];

  const faqs = [
    {
      question: 'What is Pattern Paradise Pro?',
      answer:
        'Pattern Paradise Pro is our premium subscription plan that offers advanced features for pattern creators and sellers, including multi-language support and enhanced visibility for your patterns and tester calls.',
    },
    {
      question: 'How much does Pattern Paradise Pro cost?',
      answer: `The Pattern Paradise Pro subscription is available for just ${PRO_MEMBERSHIP_PRICE} per month.`,
    },
    {
      question: 'Can I cancel my subscription at any time?',
      answer:
        'Yes, you can cancel your Pattern Paradise Pro subscription at any time. Your benefits will continue until the end of your current billing period.',
    },
    {
      question: 'What happens after I cancel my subscription?',
      answer:
        'Your patterns will not be marked as featured anymore, you will also not be able to use the Pro features when creating your pattern listings. Patterns which you have created with Pattern Paradise Pro will still have their translated patterns available for buyers.',
    },
  ];

  const isPro = subscriptionStatus !== 'Inactive';

  return (
    <div>
      <header className="border-b border-gray-200">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-black"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Pattern Paradise Pro
        </motion.h1>
        <motion.p
          className="my-4 text-xl text-center text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Elevate Your Crafting Business
        </motion.p>
      </header>

      <section className="text-center mt-4 mb-16">
        <motion.h2
          className="text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          custom={0}
        >
          Unlock Premium Features
        </motion.h2>
        <motion.p
          className="text-xl mb-8 text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          custom={1}
        >
          Take your pattern business to the next level with our Pro plan for just{' '}
          <strong>{PRO_MEMBERSHIP_PRICE}</strong> per month
        </motion.p>
        {isPro ? (
          <span>
            You already have a Pattern Paradise Pro subscription. Start using it by{' '}
            <Link href="/app/secure/sell/submit" className="text-blue-500 underline">
              creating patterns
            </Link>{' '}
            or{' '}
            <Link href="/app/secure/test" className="text-blue-500 underline">
              apply for tester calls
            </Link>
            !
          </span>
        ) : (
          <motion.div
            className="flex justify-center w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={controls}
            custom={2}
          >
            <SubscribeButton />
          </motion.div>
        )}
      </section>

      <section className="mb-16">
        <motion.h2
          className="text-3xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          custom={3}
        >
          Pro Features
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-white to-gray-100 p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              custom={index + 4}
            >
              <Check className="text-black mb-4" size={24} />
              <p className="text-gray-800">{feature}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mb-16 text-center">
        <motion.h2
          className="text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          custom={9}
        >
          Pricing
        </motion.h2>
        <motion.p
          className="text-2xl font-bold mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          custom={10}
        >
          {PRO_MEMBERSHIP_PRICE}/month
        </motion.p>
        {isPro ? (
          <span>
            You already have a Pattern Paradise Pro subscription. Start using it by{' '}
            <Link href="/app/secure/sell/submit" className="text-blue-500 underline">
              creating patterns
            </Link>{' '}
            or{' '}
            <Link href="/app/secure/test" className="text-blue-500 underline">
              apply for tester calls
            </Link>
            !
          </span>
        ) : (
          <div className="flex justify-center w-full">
            <SubscribeButton />
          </div>
        )}
      </section>

      <section>
        <motion.h2
          className="text-3xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          custom={13}
        >
          Frequently Asked Questions
        </motion.h2>
        <Accordion type="single" collapsible className="mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              custom={index + 14}
            >
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger className="text-black hover:text-gray-600 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">{faq.answer}</AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
