import { ListingComponent } from '@/components/listing';
import { listProducts } from '@/lib/api/static/product/listProducts';
import { FEATURED_PRODUCTS_LENGTH } from '@/lib/constants';
import HeroV2 from '@/lib/components/HeroV2';

export default async function Home() {
  const products = await listProducts({});

  return (
    <div>
      <HeroV2 products={products.slice(0, FEATURED_PRODUCTS_LENGTH).reverse()} />
      <div className="mx-auto container px-4 py-8">
        <ListingComponent listingType={'sell'} />
      </div>
    </div>
  );
}
