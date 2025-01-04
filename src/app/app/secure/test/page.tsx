import { ListingComponent } from '@/components/listing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import React from 'react';
import Link from 'next/link';

export default function TestPage() {
  return (
    <div className="container mx-auto flex flex-col gap-4">
      <Card className="w-full border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Link href={'/app/secure/test/chats'}>
            <Button className="w-full">My chats</Button>
          </Link>
          <Link href={'/app/secure/test/testings'}>
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
