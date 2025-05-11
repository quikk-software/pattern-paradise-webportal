'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useAffiliate from '@/lib/core/useAffiliate';
import Link from 'next/link';

interface WelcomeBannerProps {
  userName?: string;
  onContinue?: () => void;
  className?: string;
  hideOnInvalidAffiliate?: boolean;
  minimal?: boolean;
  buttonText?: string;
}

export default function WelcomeBanner({
  userName,
  onContinue = () => {},
  className,
  hideOnInvalidAffiliate = false,
  minimal = false,
  buttonText = 'Continue to Registration',
}: WelcomeBannerProps) {
  const [mounted, setMounted] = useState(false);

  const { affiliate } = useAffiliate();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isValidAffiliate = ['crochetbygenna'].includes(affiliate ?? '');

  if (!isValidAffiliate && hideOnInvalidAffiliate) {
    return null;
  }

  return (
    <div className={cn('relative overflow-hidden rounded-xl p-8 mb-8', className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-amber-500/20" />

      {!minimal ? (
        <div className="absolute top-6 right-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Sparkles className="h-6 w-6 text-amber-500" />
          </motion.div>
        </div>
      ) : null}

      <div className="relative z-10">
        {!minimal ? (
          <>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="bg-primary/10 p-2 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary">Join our community</span>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl font-bold tracking-tight mb-3"
            >
              {userName ? `Welcome, ${userName}!` : 'Welcome to our platform!'}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground mb-6 max-w-md"
            >
              We&apos;re excited to have you join us. Complete your registration to unlock all
              features and start your journey with us.
            </motion.p>
          </>
        ) : null}

        {isValidAffiliate ? (
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground mb-6 max-w-md"
          >
            Register Now and Unlock <strong>2 Weeks of Commission-Free Selling</strong> with{' '}
            <Link href={`/users/${affiliate}`} rel={'nofollow'} className="text-blue-500 underline">
              @{affiliate}
            </Link>
            !
          </motion.p>
        ) : null}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            onClick={(e) => {
              e.preventDefault();
              onContinue();
            }}
            className="group"
          >
            {buttonText}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>

      <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
    </div>
  );
}
