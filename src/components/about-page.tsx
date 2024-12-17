'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import creativeWomenIllustration from '@/assets/illustrations/undraw_creative_woman_re_u5tk.svg';
import connectIllustration from '@/assets/illustrations/undraw_connection_re_lcud.svg';
import { APP_NAME } from '@/lib/constants';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.section
        className="text-center mb-16"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        <motion.h1 className="text-4xl font-bold mb-4" variants={fadeIn}>
          Welcome to {APP_NAME} 👋
        </motion.h1>
        <motion.p className="text-xl text-muted-foreground mb-8" variants={fadeIn}>
          Connecting creatives worldwide to share, perfect, and celebrate handmade pattern
          creations.
        </motion.p>
        <motion.div variants={fadeIn}>
          <Image
            src={creativeWomenIllustration}
            alt="Colorful yarn and crochet hooks"
            width={600}
            height={600}
            className="rounded-lg shadow-lg mx-auto"
          />
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section className="mb-16" initial="initial" animate="animate" variants={stagger}>
        <motion.h2 className="text-3xl font-semibold mb-8 text-center" variants={fadeIn}>
          What We Offer
        </motion.h2>
        <motion.div className="grid md:grid-cols-3 gap-8" variants={stagger}>
          <FeatureCard
            title="Buy & Sell Patterns"
            description="A marketplace for unique crochet and knitting patterns, supporting independent designers."
            icon="💰"
          />
          <FeatureCard
            title="Pattern Testing"
            description="Ensure your designs are flawless with our community of skilled testers."
            icon="🧶"
          />
          <FeatureCard
            title="Collaborative Tools"
            description="Work together on tutorials and designs with our advanced collaboration features."
            icon="🤝"
          />
        </motion.div>
      </motion.section>

      {/* Community Section */}
      <motion.section
        className="mb-16 bg-muted p-8 rounded-lg"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        <div className="md:flex items-center">
          <motion.div className="md:w-1/2 mb-8 md:mb-0" variants={fadeIn}>
            <h2 className="text-3xl font-semibold mb-4">Join Our Creative Community</h2>
            <p className="text-lg mb-4">
              Pattern Paradise is more than just a marketplace – it&apos;s a thriving community of
              passionate crafters, designers, and artists.
            </p>
            <p className="text-lg">
              Share your creations, get inspired, and connect with like-minded individuals from
              around the globe.
            </p>
          </motion.div>
          <motion.div className="md:w-1/2 md:pl-8" variants={fadeIn}>
            <Image
              src={connectIllustration}
              alt="Community of crafters"
              width={600}
              height={600}
              className="rounded-lg shadow-lg mx-auto"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="text-center"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        <motion.h2 className="text-3xl font-semibold mb-4" variants={fadeIn}>
          Ready to Join Pattern Paradise?
        </motion.h2>
        <motion.p className="text-xl text-muted-foreground mb-8" variants={fadeIn}>
          Start your journey in the world&apos;s most vibrant handmade pattern community today!
        </motion.p>
        <motion.div variants={fadeIn}>
          <Button asChild size="lg">
            <Link href="/auth/registration">Join Now</Link>
          </Button>
        </motion.div>
      </motion.section>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <motion.div variants={fadeIn}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="text-4xl mr-2">{icon}</span>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}
