import { ListingComponent } from '@/components/listing';
import { listProducts } from '@/lib/api/static/product/listProducts';
import { NavbarComponent } from '@/components/navbar';
import LandingHero from '@/components/landing-hero';

const MAX_FEATURED_PRODUCTS = 3;

export default async function Home() {
  const products = await listProducts();

  return (
    <div>
      <NavbarComponent background={'none'} />
      <div className="px-4 max-w-7xl mx-auto">
        <LandingHero products={products.slice(0, MAX_FEATURED_PRODUCTS)} />
        <ListingComponent listingType={'sell'} defaultProducts={products} />
      </div>
    </div>
  );
}
