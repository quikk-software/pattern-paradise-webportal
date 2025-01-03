"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    name: "Jan",
    platformFee: 400,
    paypalFee: 240,
  },
  {
    name: "Feb",
    platformFee: 300,
    paypalFee: 139,
  },
  {
    name: "Mar",
    platformFee: 200,
    paypalFee: 980,
  },
  {
    name: "Apr",
    platformFee: 278,
    paypalFee: 390,
  },
  {
    name: "May",
    platformFee: 189,
    paypalFee: 480,
  },
  {
    name: "Jun",
    platformFee: 239,
    paypalFee: 380,
  },
  {
    name: "Jul",
    platformFee: 349,
    paypalFee: 430,
  },
]

export function FeesComparison() {
  return (
    <ChartContainer
      config={{
        platformFee: {
          label: "Platform Fee",
          color: "hsl(var(--chart-1))",
        },
        paypalFee: {
          label: "PayPal Fee",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="platformFee" fill="var(--color-platformFee)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="paypalFee" fill="var(--color-paypalFee)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

