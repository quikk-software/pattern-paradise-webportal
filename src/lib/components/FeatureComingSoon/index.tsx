'use client';

import { Bell } from 'lucide-react';
import Link from 'next/link';
import NewsletterSignup from '@/components/newsletter-signup';
import SocialBadges from '@/lib/components/SocialBadges';

export default function FeatureComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                <Bell className="mr-1 h-3 w-3" />
                Coming Soon
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Our exciting new feature is on the way
              </h1>

              <p className="text-slate-500">
                We&apos;re working hard to bring you something amazing. Sign up to be the first to
                know when we launch.
              </p>

              <div className="space-y-3">
                <NewsletterSignup />
                <p className="text-xs text-slate-400">
                  We&apos;ll notify you when we launch. No spam, we promise.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <SocialBadges />
            </div>
          </div>

          <div className="md:w-1/2 bg-slate-900 p-8 md:p-10 flex items-center justify-center">
            <div className="relative w-full h-64 md:h-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 opacity-80 blur-xl"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-white text-5xl md:text-7xl font-bold">Soon</div>
                  <div className="text-amber-300 mt-2 text-lg md:text-xl">Worth the wait</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
          Return to homepage
        </Link>
      </div>
    </div>
  );
}
