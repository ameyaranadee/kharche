"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { dummyMonthlyData } from "@/lib/dummy-data";

const formatDollar = (v: number) => `$${(v / 1000).toFixed(1)}k`;

export default function TrendChart() {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={dummyMonthlyData} barGap={4} barCategoryGap="28%">
          <CartesianGrid vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
          />
          <YAxis
            hide
            tickFormatter={formatDollar}
          />
          <Tooltip
            formatter={(value) => [`$${Number(value).toLocaleString()}`]}
            cursor={{ fill: "#f5f5f5" }}
            contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          />
          <Legend
            iconType="square"
            iconSize={10}
            wrapperStyle={{ fontSize: 12, color: "#6b7280", paddingTop: 8 }}
          />
          <Bar dataKey="income" name="Income" fill="#7EC8AD" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" name="Expenses" fill="#F4A191" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
