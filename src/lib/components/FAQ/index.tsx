'use client';

import { useState } from 'react';
import { FAQCategoryNav } from './faq-category-nav';
import { FAQItem } from './faq-item';
import { motion } from 'framer-motion';

export default function FAQPageComponent() {
  const [selectedAccordionItem, setSelectedAccordionItem] = useState<string | undefined>(undefined);
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 bg-primary/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50" />
      <div className="absolute bottom-0 right-0 bg-primary/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl opacity-40" />

      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-primary sm:text-4xl md:text-5xl mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground">
            Find answers to common questions about Pattern Paradise and how our platform works.
          </p>
        </motion.div>

        <FAQCategoryNav activeCategory={activeCategory} onChange={setActiveCategory} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <FAQItem
            selectedAccordionItem={selectedAccordionItem}
            setSelectedAccordionItem={setSelectedAccordionItem}
            activeCategory={activeCategory}
          />
        </motion.div>
      </div>
    </div>
  );
}
