import { ListingComponent } from '@/components/listing';
import { listProducts } from '@/lib/api/static/product/listProducts';
import { NavbarComponent } from '@/components/navbar';
import LandingHero from '@/components/landing-hero';

const MAX_FEATURED_PRODUCTS = 3;

export default async function Home() {
  const products = await listProducts();

  return (
    <div className="max-w-7xl mx-auto">
      <NavbarComponent background={'none'} />
      <div className="px4">
        <LandingHero products={products.slice(0, MAX_FEATURED_PRODUCTS)} />
        <ListingComponent listingType={'sell'} defaultProducts={products} />
      </div>
    </div>
  );
}
