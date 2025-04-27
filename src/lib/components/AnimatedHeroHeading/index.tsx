'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnimatedHeroHeading() {
  const [currentText, setCurrentText] = useState('Crocheting');
  const texts = ['Crocheting', 'Knitting'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev === texts[0] ? texts[1] : texts[0]));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
      <span className="block">
        Your{' '}
        <span className="relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={currentText}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-block"
            >
              {currentText}
            </motion.span>
          </AnimatePresence>
        </span>{' '}
      </span>
      <span className="block text-primary">Pattern Paradise</span>
    </h1>
  );
}
