'use client';

import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { GetOrderAnalyticsResponse } from '@/@types/api-types';
import { NoDataAvailable } from '@/components/no-data-available';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8A2BE2',
  '#5F9EA0',
  '#7FFF00',
  '#DC143C',
  '#FF7F50',
  '#6A5ACD',
  '#20B2AA',
  '#FF6347',
  '#FFD700',
  '#4682B4',
];

interface StatusDistributionProps {
  orderStatusDistribution: GetOrderAnalyticsResponse['orderStatusDistribution'];
}

export function StatusDistribution({ orderStatusDistribution }: StatusDistributionProps) {
  if (orderStatusDistribution.length === 0) {
    return <NoDataAvailable />;
  }

  return (
    <ChartContainer
      config={{
        name: {
          label: 'Status',
          color: 'hsl(var(--chart-1))',
        },
        value: {
          label: 'Count',
          color: 'hsl(var(--chart-2))',
        },
      }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={orderStatusDistribution.map((osd) => ({
              name: osd.status,
              value: osd.count,
            }))}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {orderStatusDistribution.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
