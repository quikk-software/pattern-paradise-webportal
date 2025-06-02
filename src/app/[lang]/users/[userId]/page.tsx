import React from 'react';
import UserAccountComponent from '@/components/user-account';
import NotFoundPage from '@/app/[lang]/not-found';
import { Metadata } from 'next';
import { getUserById } from '@/lib/api/static/user/getUserById';
import { APP_DOMAIN, APP_TITLE, THEME_COLOR } from '@/lib/constants';

type Props = {
  params: Promise<{ userId: string; lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const userId = p.userId;
  const lang = p.lang;
  const user = await getUserById(userId);
  const userName = user?.firstName || user?.username;

  const title = `${userName}'s Profile | Pattern Paradise`;
  const description = `Check out ${userName}'s patterns, tester calls, and more on Pattern Paradise.`;
  const hasBannerImage = !!user?.bannerImageUrl;
  const imageUrl =
    user?.bannerImageUrl?.replace('/upload/', '/upload/w_1200,h_630,c_fill/') ??
    user?.imageUrl?.replace('/upload/', '/upload/w_630,h_630,c_fill/') ??
    `${process.env.NEXT_PUBLIC_URL ?? APP_DOMAIN}/favicons/ms-icon-310x310.png`;

  return {
    title,
    description,
    applicationName: APP_TITLE,
    appleWebApp: {
      title,
      capable: true,
      statusBarStyle: 'black-translucent',
    },
    formatDetection: {
      telephone: false,
    },
    icons: {
      icon: '/favicons/favicon.ico?v=3',
      shortcut: '/favicon.ico?v=3',
      apple: '/icons/ios/512.png',
      other: [
        { rel: 'apple-touch-icon', url: '/favicons/apple-icon-152x152.png', sizes: '152x152' },
        { rel: 'apple-touch-icon', url: '/favicons/apple-icon-180x180.png', sizes: '180x180' },
        { rel: 'manifest', url: '/manifest.webmanifest' },
      ],
    },
    openGraph: {
      title,
      description,
      type: 'profile',
      siteName: title,
      images: [
        {
          url: imageUrl,
          width: hasBannerImage ? 1200 : 630,
          height: 630,
          alt: `${userName}'s profile image`,
        },
      ],
      url: `${process.env.NEXT_PUBLIC_URL ?? APP_DOMAIN}/${lang}/users/${userId}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${userName}'s profile image`,
        },
      ],
    },
    manifest: '/manifest.webmanifest',
    other: {
      'mobile-web-app-capable': 'yes',
      'msapplication-config': '/favicons/browserconfig.xml',
      'msapplication-TileColor': THEME_COLOR,
      'msapplication-tap-highlight': 'no',
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_URL ?? APP_DOMAIN}/app/users/${userId}`,
    },
  };
}

export default async function SellUserPage({ params }: { params: { userId: string } }) {
  const user = await getUserById(params.userId);

  if (!user) {
    return <NotFoundPage />;
  }

  return <UserAccountComponent user={user} />;
}
