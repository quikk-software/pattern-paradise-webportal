import React from 'react';
import ProductPageComponent from '@/components/product-page';
import { getProduct } from '@/lib/api/static/product/getProduct';
import { Metadata } from 'next';
import { APP_DOMAIN, APP_NAME, APP_TITLE, THEME_COLOR } from '@/lib/constants';
import { generateTitle } from '@/lib/utils';

type Props = {
  params: Promise<{ productId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const productId = (await params).productId;
  const product = await getProduct(productId);

  const title = product?.title
    ? `${product.isFree ? 'Get' : 'Buy'} ${generateTitle({
        title: product.title,
        category: product.category,
      })} ${product.isFree ? 'free ' : ''}pattern | Pattern Paradise`
    : 'Pattern Details | Pattern Paradise';
  const description = `Check out this ${product?.isFree ? 'free ' : ''}${product?.category ? `${product?.category.toLowerCase()} pattern ` : 'pattern '}${
    product?.title
      ? ` '${generateTitle({
          title: product.title,
        })}'`
      : ''
  }.`;
  const imageUrl =
    product?.imageUrls?.[0]?.replace('/upload/', '/upload/w_1200,h_630,c_fill/') ??
    `${process.env.NEXT_PUBLIC_URL ?? APP_DOMAIN}/favicons/ms-icon-310x310.png`;

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
          alt: product?.description
            ? product.description
            : product?.title
              ? product.title
              : 'Pattern Paradise Product',
        },
      ],
      url: `${process.env.NEXT_PUBLIC_URL ?? APP_DOMAIN}/app/products/${productId}`,
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
          alt: product?.description
            ? product.description
            : product?.title
              ? product.title
              : 'Pattern Paradise Product',
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
      canonical: `${process.env.NEXT_PUBLIC_URL ?? APP_DOMAIN}/app/products/${productId}`,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { productId: string } }) {
  const product = await getProduct(params.productId);

  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product?.title,
    image: product?.imageUrls?.at(0),
    description: product?.description,
    sku: params.productId,
    brand: {
      '@type': 'Brand',
      name: 'Pattern Paradise',
    },
    color: 'Multicolor',
    gender: 'unisex',
    ageGroup: 'adult',
    offers: {
      '@type': 'Offer',
      url: `${APP_DOMAIN}/app/products/${params.productId}`,
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
            addressCountry: 'US',
          },
        },
        {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '0.00',
            currency: 'EUR',
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'DE',
          },
        },
      ],
    },
    isAccessibleForFree: String(product?.isFree) === 'true',
    audience: [
      { '@type': 'Audience', audienceType: 'crocheters' },
      { '@type': 'Audience', audienceType: 'knitters' },
      { '@type': 'Audience', audienceType: 'cross stitchers' },
      { '@type': 'Audience', audienceType: 'sewists' },
      { '@type': 'Audience', audienceType: 'embroiderers' },
      { '@type': 'Audience', audienceType: 'quilters' },
      { '@type': 'Audience', audienceType: 'weavers' },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductPageComponent productId={params.productId} />
    </>
  );
}
