"use client";
import React, { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";

export const description = "Contact Reports Bar Chart";

const chartData = [
  { month: "JAN", thisYear: 800, lastYear: 1000 },
  { month: "FEB", thisYear: 900, lastYear: 750 },
  { month: "MAR", thisYear: 650, lastYear: 850 },
  { month: "APR", thisYear: 720, lastYear: 600 },
  { month: "MAY", thisYear: 850, lastYear: 950 },
  { month: "JUN", thisYear: 680, lastYear: 800 },
  { month: "JUL", thisYear: 750, lastYear: 900 },
  { month: "AUG", thisYear: 820, lastYear: 650 },
  { month: "SEP", thisYear: 900, lastYear: 750 },
  { month: "OCT", thisYear: 600, lastYear: 880 },
  { month: "NOV", thisYear: 750, lastYear: 920 },
  { month: "DEC", thisYear: 950, lastYear: 600 },
];

const chartConfig = {
  thisYear: {
    label: "This Year",
    color: "#EAB308", // Yellow/Gold color matching your image
  },
  lastYear: {
    label: "Last Year",
    color: "#3B82F6", // Blue color matching your image
  },
};

export function ContactReports() {
  const [activeFilter, setActiveFilter] = useState("This Year");
  const filters = ["This Year", "Last Year"];

  return (
    <div className="bg-[#2A2A2A] rounded-lg  text-white w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 p-6">
        <div>
          <p className="text-[20px] font-medium leading-[120%] text-white mb-3">
            Active Creators & Agents
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
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            barCategoryGap="20%"
          >
            <CartesianGrid 
              strokeDasharray="none" 
              stroke="#4B5563" 
              horizontal={true}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              dy={5}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickFormatter={(value) => {
                if (value >= 1000) return `${value / 1000}k`;
                return value.toString();
              }}
              domain={[0, 1000]}
              ticks={[0, 250, 500, 750, 1000]}
              tickCount={5}
            />
            <Bar 
              dataKey="thisYear" 
              fill={chartConfig.thisYear.color} 
              radius={[2, 2, 0, 0]}
              maxBarSize={25}
            />
            <Bar 
              dataKey="lastYear" 
              fill={chartConfig.lastYear.color} 
              radius={[2, 2, 0, 0]}
              maxBarSize={25}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}