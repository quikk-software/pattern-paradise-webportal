import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import { ListingComponent } from '@/components/listing';
import { listProducts } from '@/lib/api/static/product/listProducts';
import { NavbarComponent } from '@/components/navbar';

export default async function Home() {
  const products = await listProducts();

  return (
    <div>
      <NavbarComponent />
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Welcome to {APP_NAME}
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Discover beautiful crochet and knitting patterns for your next project. From cozy
                blankets to cute amigurumi, we&apos;ve got you covered!
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/auth/registration?redirect=/sell">
                <Button>Start selling</Button>
              </Link>
              <Link href="/auth/registration?redirect=/test">
                <Button variant="outline">Become a tester</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <ListingComponent listingType={'sell'} defaultProducts={products} />
      </section>
    </div>
  );
}
