import { ListingComponent } from '@/components/listing';
import { listProducts } from '@/lib/api/static/product/listProducts';
import { NavbarComponent } from '@/components/navbar';
import AnimatedLanding from '@/components/animated-landing';

export default async function Home() {
  const products = await listProducts();

  return (
    <div>
      <NavbarComponent background="primary" />
      <AnimatedLanding />
      <section className="container mx-auto py-12 md:py-24 lg:py-32">
        <ListingComponent listingType={'sell'} defaultProducts={products} />
      </section>
    </div>
  );
}
