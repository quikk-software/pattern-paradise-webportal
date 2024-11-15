import { ListingComponent } from '@/components/listing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import React from 'react';
import Link from 'next/link';

export default function TestPage() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full max-w-2xl mx-auto border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Link href="/test/chats">
            <Button className="w-full">My chats</Button>
          </Link>
          <Link href="/sell/testings">
            <Button className="w-full" variant="outline">
              My testings
            </Button>
          </Link>
        </CardContent>
      </Card>
      <ListingComponent listingType={'test'} defaultProducts={[]} />
    </div>
  );
}
