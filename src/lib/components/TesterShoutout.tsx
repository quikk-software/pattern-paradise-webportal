import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { InfoBoxComponent } from '@/components/info-box';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReviewCard from '@/lib/components/ReviewCard';
import { useGetTestingByProductId } from '@/lib/api/testing';
import UserDetailsCard from '@/lib/components/UserDetailsCard';

interface TesterShoutoutProps {
  productId: string;
}

export default function TesterShoutout({ productId }: TesterShoutoutProps) {
  const { fetch, data } = useGetTestingByProductId();

  useEffect(() => {
    fetch(productId);
  }, [productId]);

  if (data?.testers?.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Tester Shoutout</h2>
        <p className="text-md">
          A special thanks to our testers who took their time and effort to ensure the quality of
          this pattern🧡
        </p>
        <div className="space-y-2">
          {data?.testers?.map((tester) => (
            <UserDetailsCard user={tester} showFlag={false} showRoles={false} key={tester.id} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
