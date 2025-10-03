"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";

export const description = "Contact Reports Bar Chart";

// 🔹 Chart colors
const chartConfig = {
  thisYear: {
    label: "This Year",
    color: "#EAB308", // Yellow/Gold
  },
  lastYear: {
    label: "Last Year",
    color: "#3B82F6", // Blue
  },
};

// 🔹 Types
type TrendItem = { month: string; count: number };
type YearData = { year: number; trend: TrendItem[] };
type ApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    summary: { totalContacts: number; creatorCount: number; agentCount: number };
    thisYear: YearData;
    lastYear: YearData;
  };
};

export function ContactReports() {
  const [activeFilter, setActiveFilter] = useState<"This Year" | "Last Year">("This Year");
  const filters: Array<"This Year" | "Last Year"> = ["This Year", "Last Year"];

  const { data: session } = useSession();
  const token = (session?.user as { accessToken?: string } | undefined)?.accessToken;

  // 🔹 Fetch API data
  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ["contactReport", token],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/contact-report`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch contact report data");
      return res.json();
    },
    enabled: !!token,
  });

  // 🔹 Transform API response into chart data
  const chartData = useMemo(() => {
    if (!data?.data) return [];
    const thisYearTrend = data.data.thisYear.trend;
    const lastYearTrend = data.data.lastYear.trend;

    return thisYearTrend.map((item, index) => ({
      month: item.month,
      thisYear: item.count,
      lastYear: lastYearTrend[index]?.count ?? 0,
    }));
  }, [data]);

  // 🔹 Filter chart data based on active filter
  const filteredChartData = useMemo(() => {
    if (!chartData) return [];
    return chartData.map((item) => ({
      month: item.month,
      thisYear: activeFilter === "This Year" ? item.thisYear : 0,
      lastYear: activeFilter === "Last Year" ? item.lastYear : 0,
    }));
  }, [chartData, activeFilter]);

  // 🔹 Loading skeleton
  if (isLoading) {
    return (
      <div className="bg-[#2A2A2A] rounded-lg w-full p-6">
        <div className="h-6 w-1/3 bg-gray-700 rounded mb-4 animate-pulse"></div>
        <div className="flex gap-2 mb-6">
          {filters.map((filter) => (
            <div key={filter} className="h-6 w-16 bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="h-[400px] w-full bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#2A2A2A] rounded-lg text-white w-full py-6 flex justify-center items-center h-[400px]">
        <p className="text-red-500">Failed to load chart data.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#2A2A2A] rounded-lg text-white w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 p-6">
        <div>
          <p className="text-[20px] font-medium leading-[120%] text-white mb-3">
            Contact reports
          </p>
        </div>
        {/* Filter buttons */}
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 text-xs rounded border transition-colors ${
                activeFilter === filter
                  ? "bg-yellow-500 text-black border-yellow-500 font-medium"
                  : "bg-transparent text-gray-400 border-gray-600 hover:text-white hover:border-gray-500"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[400px] w-full pb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="none" stroke="#4B5563" horizontal vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} dy={5} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              tickFormatter={(value) => (value >= 1000 ? `${value / 1000}k` : value.toString())}
              domain={[0, Math.max(...chartData.map((d) => Math.max(d.thisYear, d.lastYear, 1000)))]}
            />
            <Bar dataKey="thisYear" fill={chartConfig.thisYear.color} radius={[2, 2, 0, 0]} maxBarSize={25} />
            <Bar dataKey="lastYear" fill={chartConfig.lastYear.color} radius={[2, 2, 0, 0]} maxBarSize={25} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
