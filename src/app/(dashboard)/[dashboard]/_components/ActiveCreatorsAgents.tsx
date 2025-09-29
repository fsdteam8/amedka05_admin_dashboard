"use client";
import React, { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";

export const description = "Active Creators & Agents Chart";

const chartData = [
  { date: "3 Oct", creators: 2000, agents: 0 },
  { date: "10 Oct", creators: 3200, agents: 1800 },
  { date: "14 Oct", creators: 2800, agents: 1600 },
  { date: "20 Oct", creators: 4200, agents: 2800 },
  { date: "23 Oct", creators: 3800, agents: 3200 },
  { date: "27 Oct", creators: 3400, agents: 1000 },
  { date: "30 Oct", creators: 5000, agents: 3000 },
];

const chartConfig = {
  creators: {
    label: "Creators",
    color: "#6366F1", // Purple/Blue color matching your image
  },
  agents: {
    label: "Agents", 
    color: "#9CA3AF", // Gray color matching your image
  },
};

export function ActiveCreatorsAgents() {
  const [activeTab, setActiveTab] = useState("Month");
  const tabs = ["Day", "Week", "Month", "Year"];

  return (
    <div className="bg-[#2A2A2A] rounded-lg text-white w-full py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-6"> 
        <div className="">
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
        
        {/* Tab buttons */}
        <div className="flex bg-gray-700 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                activeTab === tab
                  ? "bg-cyan-500 text-white font-medium"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
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
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickFormatter={(value) => `${value / 1000}k`}
              domain={[0, 5000]}
              ticks={[0, 1000, 2000, 3000, 4000, 5000]}
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
                stroke: chartConfig.creators.color
              }}
              activeDot={{ 
                r: 6, 
                fill: chartConfig.creators.color,
                stroke: chartConfig.creators.color
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
                stroke: chartConfig.agents.color
              }}
              activeDot={{ 
                r: 6, 
                fill: chartConfig.agents.color,
                stroke: chartConfig.agents.color
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}