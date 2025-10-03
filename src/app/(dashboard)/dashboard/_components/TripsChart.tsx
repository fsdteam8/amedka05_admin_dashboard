"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  PieLabelRenderProps,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton"; // ✅ Shadcn Skeleton

// 🔹 API Response Type (array of trips)
type Trip = {
  _id: string;
  country: string;
  location: string;
  startDate: string;
  endDate: string;
  participants: number;
  image: string;
  createdAt: string;
  updatedAt: string;
};

type TripApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: Trip[];
};

// 🔹 Chart Data Type
type ChartItem = {
  name: string;
  value: number;
  color: string;
};

export function TripsChart() {
  const { data: session } = useSession();
  const token = (session?.user as { accessToken?: string } | undefined)
    ?.accessToken;

  const { data, isLoading, isError } = useQuery<TripApiResponse>({
    queryKey: ["trips", token],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/trips`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch trips data");
      return res.json();
    },
    enabled: !!token,
  });

  // 🔹 Prepare chart + legend data
  const { chartData, legendData } = useMemo(() => {
    if (!data?.data) return { chartData: [], legendData: [] };

    const now = new Date();
    let completedTrips = 0;
    let ongoingTrips = 0;
    let upcomingTrips = 0;

    data.data.forEach((trip) => {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);

      if (end < now) {
        completedTrips++;
      } else if (start <= now && end >= now) {
        ongoingTrips++;
      } else {
        upcomingTrips++;
      }
    });

    const total = completedTrips + ongoingTrips + upcomingTrips || 1;

    const chart: ChartItem[] = [
      { name: "Completed", value: completedTrips, color: "#22C55E" },
      { name: "Ongoing", value: ongoingTrips, color: "#3B82F6" },
      { name: "Upcoming", value: upcomingTrips, color: "#FACC15" },
    ];

    const legend = chart.map((item) => ({
      ...item,
      percentage: `${((item.value / total) * 100).toFixed(0)}%`,
    }));

    return { chartData: chart, legendData: legend };
  }, [data]);

  // 🔹 Label inside pie slices
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: PieLabelRenderProps) => {
    if (
      cx === undefined ||
      cy === undefined ||
      innerRadius === undefined ||
      outerRadius === undefined ||
      percent === undefined
    )
      return null;

    const cxNum = Number(cx);
    const cyNum = Number(cy);
    const innerNum = Number(innerRadius);
    const outerNum = Number(outerRadius);

    const RADIAN = Math.PI / 180;
    const radius = innerNum + (outerNum - innerNum) * 0.5;
    const x = cxNum + radius * Math.cos(-midAngle * RADIAN);
    const y = cyNum + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cxNum ? "start" : "end"}
        dominantBaseline="central"
        fontSize={14}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // 🔹 Skeleton Loader
  if (isLoading) {
    return (
      <div className="bg-[#2A2A2A] rounded-lg p-6 h-[430px] flex flex-col">
        <Skeleton className="h-6 w-24 mb-6" />
        <div className="flex items-center justify-between flex-1">
          {/* Fake Pie Chart Skeleton */}
          <Skeleton className="h-[300px] w-[300px] rounded-full" />

          {/* Fake Legend Skeleton */}
          <div className="flex flex-col space-y-3 ml-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="w-3 h-3 rounded-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-10 ml-8" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#2A2A2A] rounded-lg p-6 flex items-center justify-center h-[430px]">
        <p className="text-red-500">Failed to load trips data.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#2A2A2A] rounded-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[20px] font-medium leading-[120%] text-white mb-3">
          Trips
        </p>
      </div>

      <div className="flex items-center justify-between h-[430px]">
        {/* Chart Section */}
        <div>
          <ResponsiveContainer width={300} height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                innerRadius={60}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend Section */}
        <div className="flex flex-col space-y-3 ml-8">
          {legendData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between min-w-32"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-gray-300 text-sm">{item.name}</span>
              </div>
              <span className="text-white text-sm font-medium ml-8">
                {item.percentage}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
