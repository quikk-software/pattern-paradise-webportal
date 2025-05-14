'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Store, CloudOff, LogIn } from 'lucide-react';
import GoBackButton from '@/lib/components/GoBackButton';
import { motion } from 'framer-motion';

export function NotFoundComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  if (!mounted) return null;

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 py-12 rounded-xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="relative"
        variants={itemVariants}
        whileHover={{ rotate: [0, -5, 5, -5, 0], transition: { duration: 0.5 } }}
      >
        <CloudOff className="w-32 h-32 text-primary/30 mb-8" />
        <motion.div
          className="absolute -top-4 -right-4 text-4xl"
          animate={{
            opacity: [0, 1, 0],
            y: [0, -20],
            scale: [1, 1.2, 0.8],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 3,
            repeatDelay: 1,
          }}
        >
          ✨
        </motion.div>
      </motion.div>

      <motion.h1
        className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent pb-1 mb-6"
        variants={itemVariants}
      >
        404 - Page Not Found
      </motion.h1>

      <motion.p className="text-xl text-muted-foreground mb-10 max-w-md" variants={itemVariants}>
        Looks like this page has unraveled 🧵
        <br />
        The link you followed might be broken, or the pattern you’re looking for has been stitched
        into the wrong corner of the internet.
      </motion.p>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-md"
        variants={itemVariants}
      >
        <GoBackButton className="sm:col-span-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground" />

        <Button
          asChild
          variant="outline"
          className="flex items-center space-x-2 border-primary/20 hover:border-primary/50"
        >
          <Link href="/">
            <Store className="w-4 h-4 mr-2" />
            Home
          </Link>
        </Button>

        <Button asChild variant="default" className="flex items-center space-x-2">
          <Link href="/auth/login">
            <LogIn className="w-4 h-4 mr-2" />
            Login
          </Link>
        </Button>

        <Button asChild variant="ghost" className="flex items-center space-x-2 hover:bg-primary/10">
          <Link href="/help">Need Help?</Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
