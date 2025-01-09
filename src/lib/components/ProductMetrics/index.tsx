import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, BarChart } from 'lucide-react';
import { useGetProductMetrics } from '@/lib/api/metric';
import React, { useEffect } from 'react';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';

interface ProductMetricsProps {
  productId: string;
}

export default function ProductMetrics({ productId }: ProductMetricsProps) {
  const { fetch, data, isLoading, isError } = useGetProductMetrics();

  useEffect(() => {
    if (!productId) {
      return;
    }
    fetch(productId);
  }, [productId]);

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
    <div className="flex flex-col gap-1">
      <h3>Product Metrics</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.productViews}</div>
            <p className="text-xs text-muted-foreground">Total views</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.productImpressions}</div>
            <p className="text-xs text-muted-foreground">Total impressions</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
