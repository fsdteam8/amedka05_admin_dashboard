"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  PieLabelRenderProps,
} from "recharts";

const chartData = [
  { name: "Guangdong", value: 20, color: "#EF4444" },
  { name: "Anhui", value: 20, color: "#F59E0B" },
  { name: "Taiwan", value: 20, color: "#10B981" },
  { name: "Yunnan", value: 20, color: "#06B6D4" },
  { name: "Gansu", value: 20, color: "#8B5CF6" },
  { name: "Sichuan", value: 30, color: "#EC4899" },
  { name: "Shanxi", value: 30, color: "#F97316" },
  { name: "Shandong", value: 30, color: "#EAB308" },
];

const legendData = [
  { name: "Guangdong", percentage: "20%", color: "#EF4444" },
  { name: "Anhui", percentage: "20%", color: "#F59E0B" },
  { name: "Taiwan", percentage: "20%", color: "#10B981" },
  { name: "Yunnan", percentage: "20%", color: "#06B6D4" },
  { name: "Gansu", percentage: "20%", color: "#8B5CF6" },
  { name: "Sichuan", percentage: "30%", color: "#EC4899" },
  { name: "Shanxi", percentage: "30%", color: "#F97316" },
  { name: "Shandong", percentage: "30%", color: "#EAB308" },
];

export function TripsChart() {
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
  ) {
    return null;
  }

  // ✅ Ensure values are numbers (not strings like "50%")
  const cxNum = typeof cx === "number" ? cx : parseFloat(cx);
  const cyNum = typeof cy === "number" ? cy : parseFloat(cy);
  const innerNum = typeof innerRadius === "number" ? innerRadius : parseFloat(innerRadius);
  const outerNum = typeof outerRadius === "number" ? outerRadius : parseFloat(outerRadius);

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
                fill="#8884d8"
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
