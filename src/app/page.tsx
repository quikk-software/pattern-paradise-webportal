import { ListingComponent } from '@/components/listing';
import { listProducts } from '@/lib/api/static/product/listProducts';
import LandingHero from '@/components/landing-hero';
import { FEATURED_PRODUCTS_LENGTH } from '@/lib/constants';

export default async function Home() {
  const products = await listProducts();

  return (
    <div>
      <LandingHero products={products.slice(0, FEATURED_PRODUCTS_LENGTH).reverse()} />
      <ListingComponent listingType={'sell'} defaultProducts={products} />
    </div>
  );
}
