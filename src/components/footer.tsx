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

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col gap-6 py-12 px-4 md:px-6 lg:flex-row lg:gap-12">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <PatternParadiseIcon className="h-6 w-6" />
                <span className="inline-block font-bold">Pattern Paradise</span>
              </div>
              <p className="text-sm text-muted-foreground">Where creativity pays off.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <UserRoundCheck className="h-6 w-6" />
                <span className="inline-block font-bold">Follow Us</span>
              </div>
              <div className="flex gap-4 items-center justify-start">
                <Link
                  href="https://pinterest.com/patternparadis3/"
                  className="text-muted-foreground hover:text-foreground"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label="Follow Pattern Paradise on Pinterest"
                >
                  <PinterestIcon className="h-6 w-6" />
                </Link>
                <Link
                  href="https://www.tiktok.com/@the.patternparadise"
                  className="text-muted-foreground hover:text-foreground"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <TikTokIcon className="h-6 w-6" />
                </Link>
                <Link
                  href="https://www.instagram.com/the.patternparadise"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground"
                  rel="noopener noreferrer nofollow"
                >
                  <InstagramIcon className="h-6 w-6" />
                </Link>
                <Link
                  href="https://www.threads.com/@the.patternparadise"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground"
                  rel="noopener noreferrer nofollow"
                >
                  <ThreadsIcon className="h-6 w-6" />
                </Link>
                <Link
                  href="https://x.com/patternparadis3"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground"
                  rel="noopener noreferrer nofollow"
                >
                  <XIcon className="h-6 w-6" />
                </Link>
                <Link
                  href="https://www.reddit.com/r/patternparadise/"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground"
                  rel="noopener noreferrer nofollow"
                >
                  <RedditIcon className="h-6 w-6" />
                </Link>
                <Link
                  href="https://github.com/quikk-software"
                  className="text-muted-foreground hover:text-foreground"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label="Follow Pattern Paradise on Github"
                >
                  <GithubIcon className="h-6 w-6 text-black" />
                </Link>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-6 w-6" />
              <span className="inline-block font-bold">Newsletter & Updates</span>
            </div>
            <NewsletterSignup />
          </div>
        </div>
      </div>
      <div className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:px-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Pattern Paradise. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/terms-and-privacy?action=scrollToTermsAndConditions"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Terms of Service
            </Link>
            <Link
              href="/terms-and-privacy?action=scrollToPrivacyPolicy"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/sitemap.xml"
              target="_blank"
              className="text-xs text-muted-foreground hover:text-foreground"
              rel="nofollow"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
