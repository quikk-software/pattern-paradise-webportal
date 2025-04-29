import { ListingComponent } from '@/components/listing';
import { APP_DESCRIPTION, APP_NAME, FEATURED_PRODUCTS_LENGTH } from '@/lib/constants';
import HeroV2 from '@/lib/components/HeroV2';
import { listProductsForShowcase } from '@/lib/api/static/product/listProductsForShowcase';
import Footer from '@/components/footer';
import type { Metadata } from 'next';
import pages from '@/lib/hooks/routes';

const page = pages.find((page) => page.pathname === '/');

export const metadata: Metadata = {
  title: page?.title ?? APP_NAME,
  description: page?.description ?? APP_DESCRIPTION,
};

export default async function Home() {
  const products = await listProductsForShowcase();

  return (
    <div>
      <HeroV2 products={products.slice(0, FEATURED_PRODUCTS_LENGTH).reverse()} />
      <div className="mx-auto container px-4 py-8">
        <ListingComponent listingType={'sell'} infiniteScroll={false} />
      </div>
      <Footer />
    </div>
  );
}
