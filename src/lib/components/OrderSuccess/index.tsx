import Image from 'next/image';
import Link from 'next/link';
import { Check, ArrowRight, ShoppingBag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getCurrencySymbol } from '@/lib/utils';

interface OrderSuccessProps {
  orderId: string;
  orderNumber: string;
  date: string;
  pattern: {
    name: string;
    description: string;
    price: string;
    currency: string;
    image: string;
  };
}

export default function OrderSuccess({ orderId, orderNumber, date, pattern }: OrderSuccessProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You For Your Purchase!</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          We&apos;ll send a confirmation email to your inbox once your payment has been successfully
          processed by our payment provider. After that, you&apos;ll be able to download the
          pattern.
        </p>
      </div>

      <Card className="mb-8 border-2 border-gray-100">
        <CardContent className="pt-6 space-y-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            {orderNumber ? (
              <span className="text-sm text-gray-500">Order #{orderNumber}</span>
            ) : null}
          </div>

          <div className="flex gap-2 justify-between text-sm text-gray-500 mb-6">
            <span className="flex-1">Order Date: {date}</span>
            <span className="font-semibold">
              Total: {getCurrencySymbol(pattern.currency)}
              {pattern.price}
            </span>
          </div>

          <div className="flex gap-4">
            <div className="relative h-24 w-24 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
              <Image src={pattern.image} alt={pattern.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{pattern.name}</h3>
              <p className="font-medium line-clamp-2">{pattern.description}</p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button size="sm" variant="outline" className="h-8" asChild>
              <Link href={`/app/secure/auth/me/orders/${orderId}`}>View Details</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-50 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">What&apos;s Next?</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <div className="h-6 w-6 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-amber-800 text-sm font-medium">1</span>
            </div>
            <p className="text-gray-700">Download your pattern and save it to your device.</p>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-6 w-6 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-amber-800 text-sm font-medium">2</span>
            </div>
            <p className="text-gray-700">
              Check your email for your download link (in case you need it later).
            </p>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-6 w-6 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-amber-800 text-sm font-medium">3</span>
            </div>
            <p className="text-gray-700">
              Enjoy creating your project and share your finished work with us!
            </p>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="gap-2" asChild>
          <Link href="/app/secure/auth/me/patterns">
            <ShoppingBag className="h-4 w-4" />
            My Patterns
          </Link>
        </Button>
        <Button variant="outline" className="gap-2" asChild>
          <Link href="/browse">
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
