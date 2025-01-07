import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, BarChart } from 'lucide-react';
import { useGetTestingMetrics } from '@/lib/api/metric';
import React, { useEffect } from 'react';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';

interface TestingMetricsProps {
  testingId: string;
}

export default function TestingMetrics({ testingId }: TestingMetricsProps) {
  const { fetch, data, isLoading, isError } = useGetTestingMetrics();

  useEffect(() => {
    if (!testingId) {
      return;
    }
    fetch(testingId);
  }, [testingId]);

  if (isError) {
    return null;
  }

  if (isLoading || !data) {
    return (
      <div className="flex justify-center items-center">
        <LoadingSpinnerComponent />
      </div>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.testingViews}</div>
          <p className="text-xs text-muted-foreground">Total views</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Impressions</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.testingImpressions}</div>
          <p className="text-xs text-muted-foreground">Total impressions</p>
        </CardContent>
      </Card>
    </div>
  );
}
