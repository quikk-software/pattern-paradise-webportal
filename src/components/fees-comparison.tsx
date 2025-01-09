'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { GetOrderAnalyticsResponse } from '@/@types/api-types';
import { NoDataAvailable } from '@/components/no-data-available';

interface FeesComparisonProps {
  fees: GetOrderAnalyticsResponse['feesComparisonPerMonth'];
}

export function FeesComparison({ fees }: FeesComparisonProps) {
  if (fees.length === 0) {
    return <NoDataAvailable />;
  }

  return (
    <ChartContainer
      config={{
        paypalFee: {
          label: 'PayPal',
          color: 'hsl(var(--chart-1))',
        },
        platformFee: {
          label: 'Pattern Paradise',
          color: 'hsl(var(--chart-2))',
        },
      }}
    >
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={fees.map((fee) => ({
            name: fee.month,
            paypalFee: fee.totalPayPalFee,
            platformFee: fee.totalPlatformFee,
          }))}
        >
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="paypalFee" fill="var(--color-paypalFee)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="platformFee" fill="var(--color-platformFee)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
