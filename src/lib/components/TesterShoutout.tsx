import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useGetTestingByProductId, useListTesterApplications } from '@/lib/api/testing';
import UserDetailsCardWrapper from '@/lib/wrappers/UserDetailsCardWrapper';

interface TesterShoutoutProps {
  productId: string;
}

export default function TesterShoutout({ productId }: TesterShoutoutProps) {
  const { fetch, data } = useGetTestingByProductId();
  const { fetch: fetchTesters, data: testers } = useListTesterApplications({});

  useEffect(() => {
    fetch(productId);
  }, [productId]);

  useEffect(() => {
    if (!data?.id) {
      return;
    }
    fetchTesters(data.id, {
      status: ['Approved', 'Declined'],
      sortKey: 'assignedAt',
      direction: 'asc',
      filter: [],
    });
  }, [data?.id]);

  if (testers?.length === 0 || data?.status !== 'Approved') {
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
          {testers
            ?.filter((tester) => !tester.isHidden)
            .map((tester) => (
              <UserDetailsCardWrapper
                user={tester.user}
                showFlag={false}
                showRoles={false}
                key={tester.user.id}
              />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
