'use client';

import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function PatternParadiseProComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }));
  }, [controls]);

  const features = [
    'Select multiple patterns with language options',
    'Automatic translation of listings into various languages',
    'Featured patterns marked and displayed at the top',
    'Featured tester calls marked and displayed at the top',
    'Automatic translation of tester call pages',
  ];

  const faqs = [
    {
      question: 'What is Pattern Paradise Pro?',
      answer:
        'Pattern Paradise Pro is our premium subscription plan that offers advanced features for pattern creators and sellers, including multi-language support and enhanced visibility for your patterns and tester calls.',
    },
    {
      question: 'How much does Pattern Paradise Pro cost?',
      answer: 'The Pattern Paradise Pro subscription is available for just €9.99 per month.',
    },
    {
      question: 'Can I cancel my subscription at any time?',
      answer:
        'Yes, you can cancel your Pattern Paradise Pro subscription at any time. Your benefits will continue until the end of your current billing period.',
    },
    {
      question: 'What happens when I cancel my subscription?',
      answer:
        'Your patterns will not be marked as featured anymore, you will also not be able to use the Pro features when creating your pattern listings. Furthermore, existing patterns of yours which you have created with Pattern Paradise Pro will not loose translations and multi-pattern uploads.',
    },
    {
      question: 'How do the automatic translations work?',
      answer:
        'Our advanced AI-powered translation system automatically translates your patterns and tester calls into multiple languages, helping you reach a global audience without extra effort.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 text-black">
      <header className="container mx-auto px-4 py-8 border-b border-gray-200">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-black"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Pattern Paradise Pro
        </motion.h1>
        <motion.p
          className="mt-4 text-xl text-center text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Elevate Your Crafting Business
        </motion.p>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
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
            Take your pattern business to the next level with our Pro plan
          </motion.p>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={controls} custom={2}>
            <Button
              size="lg"
              className="bg-black hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105"
              onClick={() => setIsOpen(true)}
            >
              Subscribe Now
            </Button>
          </motion.div>
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
            €9.99/month
          </motion.p>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={controls} custom={12}>
            <Button
              size="lg"
              className="bg-black hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105"
              onClick={() => setIsOpen(true)}
            >
              Get Started
            </Button>
          </motion.div>
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
          <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={controls}
                custom={index + 14}
              >
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-black hover:text-gray-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700">{faq.answer}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </section>
      </main>

      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg p-8 max-w-md w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <h2 className="text-2xl font-bold mb-4">Subscribe to Pattern Paradise Pro</h2>
            <p className="mb-4 text-gray-600">
              Enter your details to get started with your Pro subscription.
            </p>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
              >
                Start My Pro Subscription
              </Button>
            </form>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 text-gray-600 hover:text-black"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
