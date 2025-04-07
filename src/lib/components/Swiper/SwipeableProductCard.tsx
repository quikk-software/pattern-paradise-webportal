import { Card, CardContent } from '@/components/ui/card';
import { GetProductResponse } from '@/@types/api-types';

interface ProductCardProps {
  product: GetProductResponse;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="w-full h-full flex flex-col overflow-hidden shadow-lg">
      <div className="w-full relative flex-1">
        <img
          src={product.imageUrls?.at(0) || ''}
          alt={product.title}
          style={{
            height: '100%',
          }}
          className="object-cover"
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
  );
}
