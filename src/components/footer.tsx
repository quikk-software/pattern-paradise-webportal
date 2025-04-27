import React from 'react';
import Link from 'next/link';
import PatternParadiseIcon from '@/lib/icons/PatternParadiseIcon';
import XIcon from '@/lib/icons/XIcon';
import InstagramIcon from '@/lib/icons/InstagramIcon';
import ThreadsIcon from '@/lib/icons/ThreadsIcon';
import RedditIcon from '@/lib/icons/RedditIcon';
import TikTokIcon from '@/lib/icons/TikTokIcon';

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col gap-6 py-12 px-4 md:px-6 lg:flex-row lg:gap-12">
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <Link href="/" className="flex items-center space-x-2">
              <PatternParadiseIcon className="h-6 w-6" />
              <span className="inline-block font-bold">Pattern Paradise</span>
            </Link>
            <p className="text-sm text-muted-foreground">Where creativity pays off.</p>
          </div>
          <div className="space-y-1">
            <span className="inline-block font-medium">Follow Us</span>
            <div className="flex gap-4">
              <Link
                href="https://www.tiktok.com/@the.patternparadise"
                className="text-muted-foreground hover:text-foreground"
                target="_blank"
              >
                <TikTokIcon className="h-6 w-6" />
              </Link>
              <Link
                href="https://www.instagram.com/the.patternparadise"
                target="_blank"
                className="text-muted-foreground hover:text-foreground"
              >
                <InstagramIcon className="h-6 w-6" />
              </Link>
              <Link
                href="https://www.threads.com/@the.patternparadise"
                target="_blank"
                className="text-muted-foreground hover:text-foreground"
              >
                <ThreadsIcon className="h-6 w-6" />
              </Link>
              <Link
                href="https://x.com/patternparadis3"
                target="_blank"
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon className="h-6 w-6" />
              </Link>
              <Link
                href="https://www.reddit.com/r/patternparadise/"
                target="_blank"
                className="text-muted-foreground hover:text-foreground"
              >
                <RedditIcon className="h-6 w-6" />
              </Link>
            </div>
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
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
