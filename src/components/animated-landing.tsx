'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export default function AnimatedLanding() {
  const { accessToken } = useSelector((s: Store) => s.auth);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const isLoggedIn = !!accessToken;

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted overflow-hidden">
      <motion.div
        className="container px-4 md:px-6 mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center space-y-4 text-center">
          <motion.div className="space-y-2" variants={itemVariants}>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Welcome to {APP_NAME}
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Discover beautiful crochet and knitting patterns for your next project. From cozy
              blankets to cute amigurumi, we&apos;ve got you covered!
            </p>
          </motion.div>
          <motion.div className="space-x-4" variants={itemVariants}>
            {isLoggedIn ? (
              <Link href="/sell">
                <Button>Start selling</Button>
              </Link>
            ) : (
              <Link href="/auth/registration?preselectedRoles=Seller&redirect=/sell">
                <Button>Start selling</Button>
              </Link>
            )}
            {isLoggedIn ? (
              <Link href="/test">
                <Button variant="outline">Show tester calls</Button>
              </Link>
            ) : (
              <Link href="/auth/registration?preselectedRoles=Tester&redirect=/test">
                <Button variant="outline">Become a tester</Button>
              </Link>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
