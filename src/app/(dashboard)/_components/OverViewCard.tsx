"use client";
import React from "react";
import Image from "next/image";
import PageHeader from "@/components/DashboardHeader/pageHeader";
import { Plus } from "lucide-react";

type Stat = {
  title: string;
  value: string;
  change: string;
  image: string;
  color: string;
};

export default function OverViewCard() {
  const stats: Stat[] = [
    {
      title: "Total Creators",
      value: "51,250k",
      change: "+10%",
      image: "/images/cardImage1.png",
      color: "text-green-500",
    },
    {
      title: "Total Agents",
      value: "51,250",
      change: "+10%",
      image: "/images/cardImage1.png",
      color: "text-blue-500",
    },
    {
      title: "Total Contacts",
      value: "2,550",
      change: "+10%",
      image: "/images/cardImage3.png",
      color: "text-gray-500",
    },
    {
      title: "Total Trips",
      value: "25",
      change: "+10%",
      image: "/images/cardImage2.png",
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="w-full p-[40px]">
      <div className="mb-[32px]">
        <PageHeader
          title="Dashboard"
          breadcrumb="Dashboard > OverView"
          // btnLink="/dashboard/category/add"
          btnText="Add Category"
          icon={Plus}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-[#2A2A2A] p-5 rounded-xl border-b-4 border-[#7DD3DD] flex items-center justify-between shadow-lg h-[120px]"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <p className="text-[20px] font-medium text-[#FFFFFF]">
                  {stat.title}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[15px] h-[15px] rounded-full bg-green-500"></div>
                <p className="text-[18px] font-medium leading-[120%] text-[#B6B6B6]">
                  {stat.value}
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Image
                src={stat.image}
                alt="icon-image"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
