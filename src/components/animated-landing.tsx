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
    <section
      className={`w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-primary to-[#ed8332] overflow-hidden`}
    >
      <motion.div
        className="container px-4 md:px-6 mx-auto relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center space-y-8 text-center relative z-10">
          <motion.div className="space-y-2" variants={itemVariants}>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white drop-shadow-md">
              Welcome to {APP_NAME}
            </h1>
            <p className="mx-auto max-w-[700px] text-white/90 md:text-xl drop-shadow">
              Discover beautiful crochet and knitting patterns for your next project. From cozy
              blankets to cute amigurumi, we&apos;ve got you covered!
            </p>
          </motion.div>
          <motion.div className="space-x-4" variants={itemVariants}>
            {isLoggedIn ? (
              <Link href="/app/secure/sell">
                <Button className="bg-white text-[#f4930b] hover:bg-white/90 font-semibold">
                  Start selling
                </Button>
              </Link>
            ) : (
              <Link href="/auth/registration?preselectedRoles=Seller&redirect=/app/secure/sell">
                <Button className="bg-white text-[#f4930b] hover:bg-white/90 font-semibold">
                  Start selling
                </Button>
              </Link>
            )}
            {isLoggedIn ? (
              <Link href="/app/secure/test">
                <Button
                  variant="outline"
                  className="bg-transparent border-white text-white border-2 font-semibold"
                >
                  Show tester calls
                </Button>
              </Link>
            ) : (
              <Link href="/auth/registration?preselectedRoles=Tester&redirect=/app/secure/test">
                <Button
                  variant="outline"
                  className="bg-transparent border-white text-white border-2 font-semibold"
                >
                  Become a tester
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
