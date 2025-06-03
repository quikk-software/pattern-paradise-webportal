'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'use-intl';

export default function AnimatedHeroHeading() {
  const [currentText, setCurrentText] = useState('');

  const t = useTranslations();

  const initialCategory = t('landing.hero.categories.crocheting');

  useEffect(() => {
    if (!initialCategory) {
      return;
    }
    setCurrentText(initialCategory);
  }, [initialCategory]);

  const texts = [t('landing.hero.categories.crocheting'), t('landing.hero.categories.knitting')];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev === texts[0] ? texts[1] : texts[0]));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!currentText) {
    return null;
  }

  return (
    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
      <span className="block">
        {t('landing.hero.your')}{' '}
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
      <b className="block text-primary">Pattern Paradise</b>
    </h1>
  );
}
