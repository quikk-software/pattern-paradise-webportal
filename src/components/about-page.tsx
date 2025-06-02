'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import creativeWomenIllustration from '@/assets/illustrations/undraw_creative_woman_re_u5tk.svg';
import connectIllustration from '@/assets/illustrations/undraw_connection_re_lcud.svg';
import { APP_NAME } from '@/lib/constants';
import useLanguage from '@/i18n/useLanguage';

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
  const { t } = useLanguage();

  return (
    <div>
      {/* Hero Section */}
      <motion.section
        className="text-center mb-16"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        <motion.h1 className="text-4xl font-bold mb-4" variants={fadeIn}>
          {t('about:title', {
            appName: APP_NAME,
          })}{' '}
          👋
        </motion.h1>
        <motion.p className="text-xl text-muted-foreground mb-8" variants={fadeIn}>
          {t('about:subtitle')}
        </motion.p>
        <motion.div variants={fadeIn} className="relative">
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
          {t('about:features.title')}
        </motion.h2>
        <motion.div className="grid md:grid-cols-3 gap-8" variants={stagger}>
          <FeatureCard
            title={t('about:features.itemTitle1')}
            description={t('about:features.itemDescription1')}
            icon="💰"
          />
          <FeatureCard
            title={t('about:features.itemTitle2')}
            description={t('about:features.itemDescription2')}
            icon="🧶"
          />
          <FeatureCard
            title={t('about:features.itemTitle3')}
            description={t('about:features.itemDescription3')}
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
            <h2 className="text-3xl font-semibold mb-4">{t('about:community.title')}</h2>
            <p className="text-lg mb-4">{t('about:community.description1')}</p>
            <p className="text-lg">{t('about:community.description2')}</p>
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
          {t('about:cta.title')}
        </motion.h2>
        <motion.p className="text-xl text-muted-foreground mb-8" variants={fadeIn}>
          {t('about:cta.description')}
        </motion.p>
        <motion.div variants={fadeIn}>
          <Button asChild size="lg">
            <Link href="/%5Blang%5D/auth/registration">{t('about:cta.button')}</Link>
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
