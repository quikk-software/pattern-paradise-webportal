import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useGetTestingByProductId } from '@/lib/api/testing';
import UserDetailsCardWrapper from '@/lib/wrappers/UserDetailsCardWrapper';

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
            <UserDetailsCardWrapper
              user={tester}
              showFlag={false}
              showRoles={false}
              key={tester.id}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
