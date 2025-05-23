'use client';

import ProductCard from '@/lib/components/ProductCard';
import { GetProductResponse } from '@/@types/api-types';

export default function ProductListing({ products }: { products: GetProductResponse[] }) {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
        Our Popular Patterns
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.title}
            price={product.price}
            isFree={product.isFree}
            imageUrls={product.imageUrls}
            creatorId={product.creatorId}
            category={product.category}
            subCategories={product.subCategories}
            salePrice={product.salePrice}
            salePriceDueDate={product.salePriceDueDate}
          />
        ))}
      </div>
    </div>
  );
}
