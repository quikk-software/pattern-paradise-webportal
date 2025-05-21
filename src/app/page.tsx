import { ListingComponent } from '@/components/listing';
import { FEATURED_PRODUCTS_LENGTH } from '@/lib/constants';
import HeroV2 from '@/lib/components/HeroV2';
import { listProductsForShowcase } from '@/lib/api/static/product/listProductsForShowcase';
import Footer from '@/components/footer';
import { generatePageMetadata } from '@/lib/core/metadata';
import FAQPageComponent from '@/lib/components/FAQ';
import React from 'react';

export const metadata = generatePageMetadata('/');

export default async function Home() {
  const products = await listProductsForShowcase();

  return (
    <div>
      <HeroV2 products={products.slice(0, FEATURED_PRODUCTS_LENGTH).reverse()} />
      <div className="mx-auto container px-4 py-8 space-y-8">
        <ListingComponent status={'Released'} infiniteScroll={false} />
        <FAQPageComponent />
      </div>
      <Footer />
    </div>
  );
}
