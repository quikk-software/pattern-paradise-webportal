import React from 'react';
import ProductPageComponent from '@/components/product-page';
import { getProduct } from '@/lib/api/static/product/getProduct';
import { Metadata } from 'next';
import { APP_DOMAIN } from '@/lib/constants';
import { generateTitle } from '@/lib/utils';

type Props = {
  params: Promise<{ productId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const productId = (await params).productId;
  const product = await getProduct(productId);

  const title = product?.title
    ? `Buy ${generateTitle({
        title: product.title,
        category: product.category,
      })} Pattern | Pattern Paradise`
    : 'Pattern Details | Pattern Paradise';
  const description = `Check out this ${product?.category ? `${product?.category.toLowerCase()} pattern ` : 'pattern '}${product?.title ? ` '${product?.title}'` : ''}.`;
  const imageUrl =
    product?.imageUrls?.[0]?.replace('/upload/', '/upload/w_1200,h_630,c_fill/') ??
    `${process.env.NEXT_PUBLIC_URL ?? APP_DOMAIN}/favicons/ms-icon-310x310.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
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
    image: product?.imageUrls,
    description: product?.description,
    sku: params.productId,
    brand: {
      '@type': 'Brand',
      name: 'Pattern Paradise',
    },
    offers: {
      '@type': 'Offer',
      url: `${APP_DOMAIN}/app/products/${params.productId}`,
      priceCurrency: 'USD',
      price: product?.price ?? '0.00',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
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
