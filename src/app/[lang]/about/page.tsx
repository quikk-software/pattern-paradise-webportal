import React from 'react';
import AboutPageComponent from '@/components/about-page';
import { generatePageMetadata } from '@/lib/core/metadata';

const JSON_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://pattern-paradise.shop/#website',
    name: 'Pattern Paradise',
    alternateName: 'Pattern Paradise – Where Creativity Pays Off',
    url: 'https://pattern-paradise.shop',
    inLanguage: ['en', 'de'],
    description:
      'Pattern Paradise is an online marketplace and community for crochet and knitting patterns. It is a platform where designers sell digital patterns and makers discover, buy, and test handmade designs.',
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: 'https://pattern-paradise.shop/en/?q={search_term_string}',
        'query-input': 'required name=search_term_string',
        inLanguage: 'en',
      },
      {
        '@type': 'SearchAction',
        target: 'https://pattern-paradise.shop/de/?q={search_term_string}',
        'query-input': 'required name=search_term_string',
        inLanguage: 'de',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://pattern-paradise.shop/#organization',
    name: 'Pattern Paradise',
    url: 'https://pattern-paradise.shop',
    logo: 'https://pattern-paradise.shop/icons/ios/512.png',
    slogan: 'Where Creativity Pays Off.',
    description:
      'Pattern Paradise is a global marketplace and community for crochet and knitting enthusiasts. It is designed to help creators monetize patterns and to help makers find inspiring digital designs.',
    brand: {
      '@type': 'Brand',
      name: 'Pattern Paradise',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': 'https://pattern-paradise.shop/en/about#about',
    url: 'https://pattern-paradise.shop/en/about',
    name: 'About Pattern Paradise',
    inLanguage: 'en',
    isPartOf: { '@id': 'https://pattern-paradise.shop/#website' },
    about: { '@id': 'https://pattern-paradise.shop/#organization' },
    description:
      'This page explains what Pattern Paradise is and what it offers. Pattern Paradise is a platform that connects creatives worldwide to share, perfect, and celebrate handmade pattern creations.',
    mainEntity: {
      '@type': 'Organization',
      '@id': 'https://pattern-paradise.shop/#organization',
      name: 'Pattern Paradise',
      slogan: 'Where Creativity Pays Off.',
      knowsAbout: [
        'Crochet patterns',
        'Knitting patterns',
        'Pattern testing',
        'Digital downloads',
        'Community collaboration',
        'Tutorial collaboration',
      ],
      makesOffer: [
        {
          '@type': 'Offer',
          name: 'Buy & Sell Patterns',
          description:
            'It is a marketplace for unique crochet and knitting patterns that supports independent designers.',
        },
        {
          '@type': 'Offer',
          name: 'Pattern Testing',
          description:
            'It is a way for designers to improve patterns with feedback from a community of skilled testers.',
        },
        {
          '@type': 'Offer',
          name: 'Collaborative Tools',
          description:
            'It is a set of collaboration features for working together on tutorials and pattern design.',
        },
      ],
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: 'https://pattern-paradise.shop/favicons/ms-icon-310x310.png',
    },
    publisher: { '@id': 'https://pattern-paradise.shop/#organization' },
    translationOfWork: {
      '@type': 'CreativeWork',
      '@id': 'https://pattern-paradise.shop/de/about#about',
    },
  },
];

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return generatePageMetadata('/about', params.lang);
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, '\\u003c') }}
      />
      <AboutPageComponent />
    </>
  );
}
