import { ListingComponent } from '@/components/listing';
import { listProducts } from '@/lib/api/static/product/listProducts';
import LandingHero from '@/components/landing-hero';

const MAX_FEATURED_PRODUCTS = 3;

export default async function Home() {
  const products = await listProducts();

  return (
    <div>
      <LandingHero products={products.slice(0, MAX_FEATURED_PRODUCTS)} />
      <ListingComponent listingType={'sell'} defaultProducts={products} />
    </div>
  );
}
