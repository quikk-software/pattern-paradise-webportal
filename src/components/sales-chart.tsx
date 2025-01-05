'use client';

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { GetOrderAnalyticsResponse } from '@/@types/api-types';
import { NoDataAvailable } from '@/components/no-data-available';

interface SalesChartProps {
  data: GetOrderAnalyticsResponse['totalRevenuePerMonth'];
}

export function SalesChart({ data }: SalesChartProps) {
  if (data.length === 0) {
    return <NoDataAvailable />;
  }

  return (
    <ChartContainer
      config={{
        total: {
          label: 'Total',
          color: 'hsl(var(--chart-1))',
        },
      }}
    >
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data.map((month) => ({
            name: month.month,
            total: month.revenue,
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
          <Line type="monotone" dataKey="total" stroke="var(--color-total)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
