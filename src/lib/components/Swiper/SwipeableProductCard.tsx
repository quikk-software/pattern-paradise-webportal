import { Card, CardContent } from '@/components/ui/card';
import { GetProductResponse } from '@/@types/api-types';
import Image from 'next/image';

interface ProductCardProps {
  product: GetProductResponse;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="w-full overflow-hidden shadow-lg">
      {/* Fixed height image container */}
      <div className="w-full h-[200px] bg-gray-100">
        <Image
          src={product.imageUrls?.at(0) || ''}
          alt={product.title}
          className="object-cover"
          loading="eager"
          width={1000}
          height={500}
          style={{
            width: '100%',
            height: '500px',
          }}
          onError={(e) => {
            e.currentTarget.src = '';
          }}
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-bold">{product.description}</h2>
          <span className="text-base font-semibold text-green-600">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
