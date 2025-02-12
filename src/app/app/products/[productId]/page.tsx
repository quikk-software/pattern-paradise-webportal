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

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product?.imageUrls,
      url: `${APP_DOMAIN}/app/products/${productId}`,
      tags: (product?.category ? [product.category] : []).concat([
        ...(product?.subCategories ?? []),
      ]),
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { productId: string } }) {
  return <ProductPageComponent productId={params.productId} />;
}
