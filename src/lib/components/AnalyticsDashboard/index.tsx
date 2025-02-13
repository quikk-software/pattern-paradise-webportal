import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SalesChart } from '@/components/sales-chart';
import { RecentSales } from '@/components/recent-sales';
import { FeesComparison } from '@/components/fees-comparison';
import { StatusDistribution } from '@/components/status-distribution';
import { GetOrderAnalyticsResponse } from '@/@types/api-types';

interface AnalyticsDashboardProps {
  analytics: GetOrderAnalyticsResponse;
}

export default function AnalyticsDashboard({ analytics }: AnalyticsDashboardProps) {
  return (
    <div className="flex-1 space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSales}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Number((analytics.totalRevenue ?? 0).toFixed(2)).toLocaleString('en-US')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Number((analytics.averageSaleRevenue ?? 0).toFixed(2)).toLocaleString('en-US')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Number(analytics.completionRate ?? 0).toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesChart data={analytics.totalRevenuePerMonth} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              You made {analytics.totalSalesOfCurrentMonth} sales this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales recentSales={analytics.lastSales} />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Fees Comparison</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <FeesComparison fees={analytics.feesComparisonPerMonth} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusDistribution orderStatusDistribution={analytics.orderStatusDistribution} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
