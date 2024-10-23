import React from 'react';
import { ProductPageComponent } from '@/components/product-page';

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  return <ProductPageComponent productId={params.productId} />;
}
