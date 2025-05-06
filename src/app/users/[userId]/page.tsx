import React from 'react';
import UserAccountComponent from '@/components/user-account';
import NotFoundPage from '@/app/not-found';
import { Metadata } from 'next';
import { getUserById } from '@/lib/api/static/user/getUserById';
import { APP_DOMAIN } from '@/lib/constants';

type Props = {
  params: Promise<{ userId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const userId = (await params).userId;
  const user = await getUserById(userId);
  const userName = user?.firstName || user?.username;

  const title = `${userName}'s Profile | Pattern Paradise`;
  const description = `Check out ${userName}'s patterns, tester calls, and more on Pattern Paradise.`;
  const imageUrl =
    user?.imageUrl?.replace('/upload/', '/upload/w_1200,h_630,c_pad,b_white/') ??
    `${process.env.NEXT_PUBLIC_URL ?? APP_DOMAIN}/favicons/ms-icon-310x310.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${userName}'s profile image`,
        },
      ],
      url: `${process.env.NEXT_PUBLIC_URL ?? APP_DOMAIN}/app/users/${userId}`,
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
