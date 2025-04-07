import { Card, CardContent } from '@/components/ui/card';
import { GetProductResponse } from '@/@types/api-types';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: GetProductResponse;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/app/products/${product.id}`}>
      <Card className="w-full overflow-hidden shadow-lg">
        <div className="w-full h-[200px] bg-gray-100">
          <Image
            src={product.imageUrls?.at(0) || ''}
            alt={product.title}
            className="object-cover"
            loading="eager"
            width={448}
            height={450}
            style={{
              width: '100%',
              height: '450px',
            }}
            onError={(e) => {
              e.currentTarget.src = '';
            }}
          />
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between gap-2 items-start mb-2">
            <h2 className="text-lg font-bold line-clamp-1">{product.title}</h2>
            <span className="text-base font-semibold text-green-600">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
