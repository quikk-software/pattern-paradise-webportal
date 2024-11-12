'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, ShoppingBag, TestTube } from 'lucide-react';
import Link from 'next/link';

export function SellPageComponent() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Your Crochet Hub</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link href="/sell/submit" className="block">
          <Button
            variant="outline"
            className="w-full h-full min-h-[100px] flex flex-col items-center justify-center gap-2"
          >
            <PlusCircle className="h-8 w-8" />
            <span className="text-lg font-semibold">Create a new pattern</span>
          </Button>
        </Link>
        <Link href="/sell/orders" className="block">
          <Button
            variant="outline"
            className="w-full h-full min-h-[100px] flex flex-col items-center justify-center gap-2 "
          >
            <ShoppingBag className="h-8 w-8" />
            <span className="text-lg font-semibold">Show my orders</span>
          </Button>
        </Link>
        <Link href="/sell/testings" className="block">
          <Button
            variant="outline"
            className="w-full h-full min-h-[100px] flex flex-col items-center justify-center gap-2 "
          >
            <TestTube className="h-8 w-8" />
            <span className="text-lg font-semibold">View your testings</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
