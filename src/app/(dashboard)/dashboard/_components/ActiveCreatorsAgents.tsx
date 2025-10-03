"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

export const description = "Active Creators & Agents Chart";

// 🔹 Types
type ApiItem = {
  _id: number;
  label: string;
  count: number;
};

type ApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    creators: ApiItem[];
    agents: ApiItem[];
  };
};

type ChartDataItem = {
  date: string;
  creators: number;
  agents: number;
};

const chartConfig = {
  creators: {
    label: "Creators",
    color: "#6366F1", // Purple/Blue
  },
  agents: {
    label: "Agents",
    color: "#9CA3AF", // Gray
  },
};

// 🔹 Skeleton Component
function ChartSkeleton() {
  return (
    <div className="bg-[#2A2A2A] rounded-lg text-white w-full py-6">
      <div className="flex items-center justify-between mb-6 px-6">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-48 bg-gray-700 rounded"></div>
          <div className="flex gap-4">
            <div className="h-3 w-20 bg-gray-700 rounded"></div>
            <div className="h-3 w-20 bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="h-8 w-32 bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="h-[400px] w-full px-6">
        <div className="w-full h-full bg-gray-800 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
}

export function ActiveCreatorsAgents() {
  const { data: session } = useSession();
  const token = (session?.user as { accessToken?: string } | undefined)
    ?.accessToken;

  const {
    data,
    isLoading,
    isError,
  } = useQuery<ApiResponse>({
    queryKey: ["activeCreators", token],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/active-creator-agent`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch active creators/agents");
      return res.json();
    },
    enabled: !!token,
  });

  // 🔹 Transform API response into chart-friendly data
  const chartData: ChartDataItem[] = useMemo(() => {
    if (!data?.data) return [];
    const { creators, agents } = data.data;

    return creators.map((creator, i) => ({
      date: creator.label,
      creators: creator.count,
      agents: agents[i]?.count ?? 0,
    }));
  }, [data]);

  if (isLoading) return <ChartSkeleton />;

  if (isError) {
    return (
      <div className="bg-[#2A2A2A] rounded-lg text-white w-full py-6 flex justify-center items-center h-[400px]">
        <p className="text-red-500">Failed to load chart data.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#2A2A2A] rounded-lg text-white w-full py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-6">
        <div>
          <p className="text-[20px] font-medium leading-[120%] text-white mb-3">
            Active Creators & Agents
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <span className="text-sm text-gray-300">Creators</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <span className="text-sm text-gray-300">Agents</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="none"
              stroke="#4B5563"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              tickFormatter={(value) => `${value}`}
            />
            <Line
              type="monotone"
              dataKey="creators"
              stroke={chartConfig.creators.color}
              strokeWidth={2}
              dot={{
                fill: chartConfig.creators.color,
                strokeWidth: 0,
                r: 4,
              }}
              activeDot={{
                r: 6,
                fill: chartConfig.creators.color,
              }}
            />
            <Line
              type="monotone"
              dataKey="agents"
              stroke={chartConfig.agents.color}
              strokeWidth={2}
              dot={{
                fill: chartConfig.agents.color,
                strokeWidth: 0,
                r: 4,
              }}
              activeDot={{
                r: 6,
                fill: chartConfig.agents.color,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
