import React from 'react';
import ProductPageComponent from '@/components/product-page';
import { getProduct } from '@/lib/api/static/product/getProduct';
import { Metadata } from 'next';
import { APP_DOMAIN } from '@/lib/constants';

type Props = {
  params: Promise<{ productId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const productId = (await params).productId;
  const product = await getProduct(productId);

  const title = product?.title
    ? `Buy ${product.title} ${product.category} Pattern on Pattern Paradise`
    : 'Shop Crochet Pattern on Pattern Paradise';
  const description = `Check out this ${product?.category ? `${product?.category.toLowerCase()} pattern ` : 'pattern '}${product?.title ? ` '${product?.title}'` : ''}.`;
  const imageUrl =
    product?.imageUrls?.[0] ??
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
  };
}

export default async function ProductDetailPage({ params }: { params: { productId: string } }) {
  return <ProductPageComponent productId={params.productId} />;
}
