import React from 'react';
import { Instagram } from 'lucide-react';
import Image from 'next/image';
import AppleLogo from '@/assets/logos/apple-logo.svg';
import GooglePlayLogo from '@/assets/logos/google-play-logo.png';

export default function SocialBadges() {
  return (
    <div className="mb-2">
      <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center justify-center">
          <a
            href="https://instagram.com/the.patternparadise"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              borderWidth: '1px',
              padding: '0.3rem',
            }}
            className="flex flex-row gap-2 items-center justify-center w-[100px] rounded-sm border-[#a6a6a6] text-white bg-black"
          >
            <Instagram className="h-5 w-5" />

            <div className="flex flex-col gap-2">
              <span
                className="font-medium"
                style={{
                  fontSize: '0.5rem',
                  lineHeight: 0.25,
                }}
              >
                Follow us on
              </span>
              <span
                className="text-xs font-semibold"
                style={{
                  lineHeight: 0.25,
                }}
              >
                Instagram
              </span>
            </div>
          </a>
        </div>
        <a
          href="https://apps.apple.com/de/app/pattern-paradise/id6742999886"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center text-white"
        >
          <Image
            src={AppleLogo}
            alt={'Pattern Paradise on Apple App Store'}
            width={100}
            height={50}
          />
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=shop.pattern_paradise.preview.twa"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center text-white"
        >
          <Image
            src={GooglePlayLogo}
            alt={'Pattern Paradise on Apple App Store'}
            width={100}
            height={50}
          />
        </a>
      </div>
    </div>
  );
}
