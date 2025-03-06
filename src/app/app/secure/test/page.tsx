import { ListingComponent } from '@/components/listing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import React from 'react';
import Link from 'next/link';

export default function TestPage() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Link href={'/app/secure/test/chats'} rel={'nofollow'}>
            <Button className="w-full">My Chats</Button>
          </Link>
          <Link href={'/app/secure/test/testings'} rel={'nofollow'}>
            <Button className="w-full" variant="outline">
              My Testings
            </Button>
          </Link>
        </CardContent>
      </Card>
      <ListingComponent listingType={'test'} />
    </div>
  );
}
