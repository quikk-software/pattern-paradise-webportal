import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';

const patterns = [
  {
    id: 1,
    name: 'Cozy Blanket',
    price: 5.99,
    image: '/placeholder.svg?height=200&width=200',
  },
  {
    id: 2,
    name: 'Summer Top',
    price: 4.99,
    image: '/placeholder.svg?height=200&width=200',
  },
  {
    id: 3,
    name: 'Cute Amigurumi',
    price: 3.99,
    image: '/placeholder.svg?height=200&width=200',
  },
  {
    id: 4,
    name: 'Warm Scarf',
    price: 2.99,
    image: '/placeholder.svg?height=200&width=200',
  },
  {
    id: 5,
    name: 'Baby Booties',
    price: 1.99,
    image: '/placeholder.svg?height=200&width=200',
  },
  {
    id: 6,
    name: 'Flower Granny Square',
    price: 0.99,
    image: '/placeholder.svg?height=200&width=200',
  },
];

export default function Home() {
  return (
    <div>
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
              <Link href="/sell">
                <Button>Start selling</Button>
              </Link>
              <Link href="/test">
                <Button variant="outline">Become a tester</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
            Our Popular Patterns
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {patterns.map((pattern) => (
              <Card key={pattern.id} className="flex flex-col">
                <CardHeader>
                  <Image
                    src={pattern.image}
                    alt={pattern.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                    width={200}
                    height={200}
                  />
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardTitle>{pattern.name}</CardTitle>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-lg font-bold">${pattern.price.toFixed(2)}</span>
                  <Button>Add to Cart</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
