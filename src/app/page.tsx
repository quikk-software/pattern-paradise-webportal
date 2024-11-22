import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
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
      <section className="w-full py-12 md:py-24 lg:py-32">
        <ListingComponent listingType={'sell'} defaultProducts={products} />
      </section>
    </div>
  );
}
