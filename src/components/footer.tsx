import React from 'react';
import Link from 'next/link';
import PatternParadiseIcon from '@/lib/icons/PatternParadiseIcon';
import XIcon from '@/lib/icons/XIcon';
import InstagramIcon from '@/lib/icons/InstagramIcon';
import ThreadsIcon from '@/lib/icons/ThreadsIcon';
import RedditIcon from '@/lib/icons/RedditIcon';
import TikTokIcon from '@/lib/icons/TikTokIcon';
import PinterestIcon from '@/lib/icons/PinterestIcon';
import GithubIcon from '@/lib/icons/GithubIcon';
import NewsletterSignup from '@/components/newsletter-signup';
import { Mail, UserRoundCheck } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Trustpilot from '@/lib/components/Trustpilot';

export default async function Footer() {
  const t = await getTranslations();

  return (
    <footer className="w-full border-t border-border bg-muted">
      <div className="container flex flex-col gap-8 pt-12 pb-8 px-4 md:px-6 lg:flex-row lg:gap-16">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-8">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-primary-soft/30 flex items-center justify-center">
                  <PatternParadiseIcon className="h-6 w-6 fill-primary" />
                </div>
                <span className="inline-block font-display font-bold text-xl">
                  Pattern <span className="italic text-primary">Paradise</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Where Creativity <span className="italic text-primary font-display">Pays</span> Off.
              </p>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <UserRoundCheck className="h-5 w-5 text-primary" />
                <span className="inline-block font-display font-semibold">{t('footer.followUs')}</span>
              </div>
              <div className="flex gap-3 items-center justify-start flex-wrap">
                <SocialLink 
                  href="https://pinterest.com/patternparadis3/" 
                  label="Follow Pattern Paradise on Pinterest"
                >
                  <PinterestIcon className="h-5 w-5" />
                </SocialLink>
                <SocialLink 
                  href="https://www.tiktok.com/@the.patternparadise"
                  label="Follow Pattern Paradise on TikTok"
                >
                  <TikTokIcon className="h-5 w-5" />
                </SocialLink>
                <SocialLink 
                  href="https://www.instagram.com/the.patternparadise"
                  label="Follow Pattern Paradise on Instagram"
                >
                  <InstagramIcon className="h-5 w-5" />
                </SocialLink>
                <SocialLink 
                  href="https://www.threads.com/@the.patternparadise"
                  label="Follow Pattern Paradise on Threads"
                >
                  <ThreadsIcon className="h-5 w-5" />
                </SocialLink>
                <SocialLink 
                  href="https://x.com/patternparadis3"
                  label="Follow Pattern Paradise on X"
                >
                  <XIcon className="h-5 w-5" />
                </SocialLink>
                <SocialLink 
                  href="https://www.reddit.com/r/patternparadise/"
                  label="Follow Pattern Paradise on Reddit"
                >
                  <RedditIcon className="h-5 w-5" />
                </SocialLink>
                <SocialLink 
                  href="https://github.com/quikk-software"
                  label="Follow Pattern Paradise on Github"
                >
                  <GithubIcon className="h-5 w-5" />
                </SocialLink>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-primary" />
              <span className="inline-block font-display font-semibold">{t('footer.newsletter')}</span>
            </div>
            <NewsletterSignup />
          </div>
        </div>
      </div>

      {/* Trustpilot */}
      <div className="pb-12">
        <Trustpilot />
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border py-6 bg-card/50">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:px-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Pattern Paradise. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/terms-and-privacy?action=scrollToTermsAndConditions"
              className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {t('footer.terms')}
            </Link>
            <Link
              href="/terms-and-privacy?action=scrollToPrivacyPolicy"
              className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {t('footer.privacy')}
            </Link>
            <Link
              href="/sitemap.xml"
              target="_blank"
              className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300"
              rel="nofollow"
            >
              {t('footer.sitemap')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ 
  href, 
  label, 
  children 
}: { 
  href: string; 
  label: string; 
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="h-10 w-10 rounded-full bg-card/60 shadow-clay-card flex items-center justify-center text-muted-foreground hover:text-primary hover:-translate-y-1 hover:shadow-clay-card-hover transition-all duration-300"
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-label={label}
    >
      {children}
    </Link>
  );
}
