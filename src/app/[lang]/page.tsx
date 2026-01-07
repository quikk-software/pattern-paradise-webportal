import { ListingComponent } from '@/components/listing';
import { FEATURED_PRODUCTS_LENGTH } from '@/lib/constants';
import HeroV2 from '@/lib/components/HeroV2';
import { listProductsForShowcase } from '@/lib/api/static/product/listProductsForShowcase';
import Footer from '@/components/footer';
import { generatePageMetadata } from '@/lib/core/metadata';
import FAQPageComponent from '@/lib/components/FAQ';
import React from 'react';
import MysteryPatternHero from '@/lib/components/MysteryPatternHero';

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
      'Pattern Paradise is an online marketplace for crochet and knitting patterns. It is a platform where designers sell digital patterns and makers discover, buy, and test high-quality crochet and knitting designs.',
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
    '@type': 'CollectionPage',
    '@id': 'https://pattern-paradise.shop/en#home',
    url: 'https://pattern-paradise.shop/en',
    name: 'Pattern Paradise – Crochet & Knitting Patterns',
    inLanguage: 'en',
    description:
      'This page lists featured crochet and knitting patterns available on Pattern Paradise. It helps users browse, search, and discover digital patterns created by independent designers.',
    isPartOf: { '@id': 'https://pattern-paradise.shop/#website' },
    about: ['Crochet patterns', 'Knitting patterns', 'Pattern testing', 'Digital downloads'],
    mainEntity: {
      '@type': 'ItemList',
      '@id': 'https://pattern-paradise.shop/en#featured-itemlist',
      name: 'Featured crochet and knitting patterns',
      description:
        'A curated list of popular and featured crochet and knitting patterns available for instant digital download.',
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: 'https://pattern-paradise.shop/favicons/ms-icon-310x310.png',
    },
    publisher: { '@id': 'https://pattern-paradise.shop/#organization' },
    alternateName: 'Homepage (English)',
    sameAs: [],
    isBasedOn: [],
    hasPart: [],
    translationOfWork: {
      '@type': 'CreativeWork',
      '@id': 'https://pattern-paradise.shop/de#home',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': 'https://pattern-paradise.shop/de#home',
    url: 'https://pattern-paradise.shop/de',
    name: 'Pattern Paradise – Häkel- & Strickanleitungen',
    inLanguage: 'de',
    description:
      'Diese Seite zeigt ausgewählte Häkel- und Strickanleitungen auf Pattern Paradise. Sie hilft dabei, digitale Anleitungen von unabhängigen Designer:innen zu durchsuchen, zu entdecken und herunterzuladen.',
    isPartOf: { '@id': 'https://pattern-paradise.shop/#website' },
    about: ['Häkelanleitungen', 'Strickanleitungen', 'Pattern Testing', 'Digitale Downloads'],
    mainEntity: {
      '@type': 'ItemList',
      '@id': 'https://pattern-paradise.shop/de#featured-itemlist',
      name: 'Ausgewählte Häkel- und Strickanleitungen',
      description:
        'Eine kuratierte Liste beliebter und ausgewählter Häkel- und Strickanleitungen als sofortiger digitaler Download.',
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: 'https://pattern-paradise.shop/favicons/ms-icon-310x310.png',
    },
    publisher: { '@id': 'https://pattern-paradise.shop/#organization' },
    alternateName: 'Startseite (Deutsch)',
    sameAs: [],
    isBasedOn: [],
    hasPart: [],
    workTranslation: {
      '@type': 'CreativeWork',
      '@id': 'https://pattern-paradise.shop/en#home',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://pattern-paradise.shop/en#faq',
    url: 'https://pattern-paradise.shop/en#faq',
    name: 'Pattern Paradise FAQ',
    inLanguage: 'en',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Pattern Paradise?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pattern Paradise is an online marketplace for crochet and knitting patterns. It is a platform for designers to sell digital patterns and for makers to buy, download, and test crochet and knitting designs.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does Pattern Paradise make money?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pattern Paradise earns revenue by charging a 5% fee on each successful pattern sale. It also offers an optional Pro Membership that provides advanced tools and increased visibility for creators.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is a pattern?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A pattern is a digital set of step-by-step instructions used to create handmade items with crochet or knitting techniques. It typically includes stitch instructions, measurements, and visual guidance.',
        },
      },
      {
        '@type': 'Question',
        name: 'How are patterns delivered?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Patterns on Pattern Paradise are delivered as instant digital downloads. After purchase, the files can be accessed immediately and used offline.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can designers sell patterns on Pattern Paradise?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Pattern Paradise allows designers to upload, price, and sell their own crochet and knitting patterns while retaining full ownership of their work.',
        },
      },
      {
        '@type': 'Question',
        name: 'What makes Pattern Paradise unique?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pattern Paradise combines a digital marketplace with community-driven pattern testing. It is closely connected to crochet and knitting communities and helps designers improve quality and reach more buyers.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is there a membership fee?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'There is no fee to join Pattern Paradise. The platform is free to use, and a 5% fee is applied only when a pattern is sold. A Pro Membership is available for creators who want advanced features.',
        },
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://pattern-paradise.shop/de#faq',
    url: 'https://pattern-paradise.shop/de#faq',
    name: 'Pattern Paradise FAQ',
    inLanguage: 'de',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Was ist Pattern Paradise?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pattern Paradise ist ein Online-Marktplatz für Häkel- und Strickanleitungen. Es ist eine Plattform, auf der Designer:innen digitale Anleitungen verkaufen und Maker:innen Anleitungen kaufen, herunterladen und gemeinsam testen können.',
        },
      },
      {
        '@type': 'Question',
        name: 'Wie verdient Pattern Paradise Geld?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pattern Paradise verdient Geld über eine Gebühr von 5% auf jeden erfolgreichen Verkauf einer Anleitung. Zusätzlich gibt es eine optionale Pro-Mitgliedschaft mit erweiterten Tools und mehr Sichtbarkeit für Creator.',
        },
      },
      {
        '@type': 'Question',
        name: 'Was ist eine Anleitung?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Eine Anleitung ist eine digitale Schritt-für-Schritt-Beschreibung zum Herstellen eines handgemachten Projekts mit Häkel- oder Stricktechniken. Sie enthält typischerweise Maschenangaben, Maße und oft auch visuelle Hilfen.',
        },
      },
      {
        '@type': 'Question',
        name: 'Wie werden Anleitungen geliefert?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Anleitungen auf Pattern Paradise werden als sofortige digitale Downloads bereitgestellt. Nach dem Kauf sind die Dateien direkt verfügbar und können auch offline genutzt werden.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kann ich meine eigenen Anleitungen auf Pattern Paradise verkaufen?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ja. Pattern Paradise ermöglicht es Designer:innen, eigene Häkel- und Strickanleitungen hochzuladen, zu bepreisen und zu verkaufen, während sie die vollständigen Rechte an ihrem Werk behalten.',
        },
      },
      {
        '@type': 'Question',
        name: 'Was macht Pattern Paradise besonders?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pattern Paradise verbindet einen digitalen Marktplatz mit community-getriebenem Pattern Testing. Es ist eng mit Häkel- und Strick-Communities verknüpft und hilft Designer:innen, Qualität zu verbessern und mehr Käufer zu erreichen.',
        },
      },
      {
        '@type': 'Question',
        name: 'Gibt es eine Mitgliedsgebühr?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nein, es gibt keine Gebühr, um Pattern Paradise zu nutzen. Die Plattform ist kostenlos, und eine Gebühr von 5% fällt nur bei einem Verkauf an. Optional gibt es eine Pro-Mitgliedschaft für erweiterte Funktionen.',
        },
      },
    ],
  },
];

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return generatePageMetadata('/', params.lang);
}

export default async function Home({ searchParams }: { searchParams: { [key: string]: string } }) {
  const sp = await searchParams;
  const products = await listProductsForShowcase();

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, '\\u003c') }}
      />
      <HeroV2 products={products.slice(0, FEATURED_PRODUCTS_LENGTH).reverse()} />
      <MysteryPatternHero />
      <div className="mx-auto container px-4 py-8 space-y-8">
        <ListingComponent initialQuery={sp} status={'Released'} infiniteScroll={false} />
        <FAQPageComponent />
      </div>
      <Footer />
    </div>
  );
}
