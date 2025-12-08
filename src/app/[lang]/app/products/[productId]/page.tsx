import React from 'react';
import ProductPageComponent from '@/components/product-page';
import { getProduct } from '@/lib/api/static/product/getProduct';
import { Metadata } from 'next';
import { APP_DOMAIN, APP_NAME, APP_TITLE, COUNTRIES, THEME_COLOR } from '@/lib/constants';
import { capitalizeWords, generateTitle } from '@/lib/utils';
import { listProducts } from '@/lib/api/static/product/listProducts';
import logger from '@/lib/core/logger';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ productId: string; lang: string }>;
};

export async function generateStaticParams() {
  const products = await listProducts({ overridePageNumber: 1, overridePageSize: 9999 });
  const locales = ['en', 'de'];

  return locales.flatMap((lang) =>
    products.map((product) => ({
      lang,
      productId: product.id,
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const productId = p.productId;
  const lang = p.lang;

  const t = await getTranslations();

  let product: Awaited<ReturnType<typeof getProduct>> | null = null;

  try {
    product = await getProduct(productId);
  } catch (error) {
    logger.error(`Failed to fetch product ${productId}`, error);
  }

  const fallbackTitle = t('product.fallbackTitle');
  const fallbackDescription = t('product.fallbackDescription');
  const fallbackImage = `${process.env.NEXT_PUBLIC_URL ?? APP_DOMAIN}/favicons/ms-icon-310x310.png`;

  const category =
    product?.category === 'Crocheting'
      ? t('product.category.crochet')
      : product?.category === 'Knitting'
        ? t('product.category.knitting')
        : product?.category;

  const title = product?.title
    ? t('product.title', {
        item1: product.isFree ? t('product.get') : t('product.buy'),
        item2: generateTitle({
          title: product.title,
          category,
        }),
        item3: product.isFree ? t('product.free') : '',
      })
    : fallbackTitle;

  const description = product
    ? t('product.description', {
        item1: product.isFree ? t('product.free') : '',
        item2: product.category
          ? `${product.category.toLowerCase()} ${t('product.pattern')}`
          : t('product.pattern'),
        item3: `'${generateTitle({
          title: product.title,
        })}'`,
      })
    : fallbackDescription;

  const imageUrl =
    product?.imageUrls?.[0]?.replace('/upload/', '/upload/w_1200,h_630,c_fill/') ?? fallbackImage;

  const altText = product?.description || product?.title || t('product.altFallback');

  const pageUrl = `${process.env.NEXT_PUBLIC_URL ?? APP_DOMAIN}/${lang}/app/products/${productId}`;

  return {
    title,
    description,
    applicationName: APP_TITLE,
    appleWebApp: {
      capable: true,
      title: APP_NAME,
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
      type: 'website',
      siteName: APP_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: altText,
        },
      ],
      url: pageUrl,
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
          alt: altText,
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
      canonical: pageUrl,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { productId: string } }) {
  const p = await params;
  const product = await getProduct(p.productId);

  const t = await getTranslations();

  const category =
    product?.category === 'Crocheting'
      ? t('product.category.crochet')
      : product?.category === 'Knitting'
        ? t('product.category.knitting')
        : product?.category;

  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: `${capitalizeWords(
      generateTitle({
        title: product?.title,
        category,
      }),
    )} ${t('product.pattern')}`.trim(),
    image: product?.imageUrls,
    description: product?.description,
    sku: p.productId,
    brand: {
      '@type': 'Brand',
      name: 'Pattern Paradise',
    },
    color: 'Multicolor',
    gender: 'unisex',
    ageGroup: 'adult',
    offers: {
      '@type': 'Offer',
      url: `${APP_DOMAIN}/app/products/${p.productId}`,
      priceCurrency: 'USD',
      price: product?.price ?? '0.00',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      shippingDetails: [
        {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '0.00',
            currency: 'USD',
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: COUNTRIES.map(({ country }) => country),
          },
        },
      ],
    },
    isAccessibleForFree: String(product?.isFree) === 'true',
    audience: [
      { '@type': 'Audience', audienceType: t('product.audience.crocheters') },
      { '@type': 'Audience', audienceType: t('product.audience.knitters') },
      { '@type': 'Audience', audienceType: t('product.audience.crossStitchers') },
      { '@type': 'Audience', audienceType: t('product.audience.sewists') },
      { '@type': 'Audience', audienceType: t('product.audience.embroiderers') },
      { '@type': 'Audience', audienceType: t('product.audience.quilters') },
      { '@type': 'Audience', audienceType: t('product.audience.weavers') },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductPageComponent productId={p.productId} />
    </>
  );
}
