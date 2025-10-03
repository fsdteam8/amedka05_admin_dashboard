"use client";
import React from "react";
import Image from "next/image";
import PageHeader from "@/components/DashboardHeader/pageHeader";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

export default function OverViewCard() {
  const { data: session } = useSession();
  const token = (session?.user as { accessToken?: string })?.accessToken;

  const {
    data: OverView,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["overview", token],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/overview`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch overview data");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="w-full p-[40px]">
        <PageHeader
          title="Dashboard"
          breadcrumb="Dashboard > OverView"
          btnText="Add Category"
          icon={Plus}
        />

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-[#2A2A2A] p-5 rounded-xl border-b-4 border-[#7DD3DD] flex items-center justify-between shadow-lg h-[120px]"
            >
              <div className="flex flex-col flex-1">
                <Skeleton className="h-6 w-32 mb-3 rounded-md bg-gray-700" />
                <Skeleton className="h-5 w-20 rounded-md bg-gray-700" />
              </div>
              <Skeleton className="h-[60px] w-[60px] rounded-md bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full p-[40px]">
        <p className="text-red-500">Failed to load overview data.</p>
      </div>
    );
  }

  return (
    <div className="w-full p-[40px]">
      <div className="mb-[32px]">
        <PageHeader
          title="Dashboard"
          breadcrumb="Dashboard > OverView"
          btnText="Add Category"
          icon={Plus}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Creators */}
        <div className="bg-[#2A2A2A] p-5 rounded-xl border-b-4 border-[#7DD3DD] flex items-center justify-between shadow-lg h-[120px]">
          <div className="flex flex-col">
            <p className="text-[20px] font-medium text-[#FFFFFF] mb-3">
              Total Creators
            </p>
            <div className="flex items-center gap-2">
              <div className="w-[15px] h-[15px] rounded-full bg-green-500"></div>
              <p className="text-[18px] font-medium leading-[120%] text-[#B6B6B6]">
                {OverView?.data?.creators ?? 0}
              </p>
            </div>
          </div>
          <Image
            src="/images/cardImage1.png"
            alt="creators"
            width={60}
            height={60}
            className="object-contain"
          />
        </div>

        {/* Total Agents */}
        <div className="bg-[#2A2A2A] p-5 rounded-xl border-b-4 border-[#7DD3DD] flex items-center justify-between shadow-lg h-[120px]">
          <div className="flex flex-col">
            <p className="text-[20px] font-medium text-[#FFFFFF] mb-3">
              Total Agents
            </p>
            <div className="flex items-center gap-2">
              <div className="w-[15px] h-[15px] rounded-full bg-blue-500"></div>
              <p className="text-[18px] font-medium leading-[120%] text-[#B6B6B6]">
                {OverView?.data?.agent ?? 0}
              </p>
            </div>
          </div>
          <Image
            src="/images/cardImage1.png"
            alt="agents"
            width={60}
            height={60}
            className="object-contain"
          />
        </div>

        {/* Total Contacts */}
        <div className="bg-[#2A2A2A] p-5 rounded-xl border-b-4 border-[#7DD3DD] flex items-center justify-between shadow-lg h-[120px]">
          <div className="flex flex-col">
            <p className="text-[20px] font-medium text-[#FFFFFF] mb-3">
              Total Contacts
            </p>
            <div className="flex items-center gap-2">
              <div className="w-[15px] h-[15px] rounded-full bg-gray-500"></div>
              <p className="text-[18px] font-medium leading-[120%] text-[#B6B6B6]">
                {OverView?.data?.contacts ?? 0}
              </p>
            </div>
          </div>
          <Image
            src="/images/cardImage3.png"
            alt="contacts"
            width={60}
            height={60}
            className="object-contain"
          />
        </div>

        {/* Total Trips */}
        <div className="bg-[#2A2A2A] p-5 rounded-xl border-b-4 border-[#7DD3DD] flex items-center justify-between shadow-lg h-[120px]">
          <div className="flex flex-col">
            <p className="text-[20px] font-medium text-[#FFFFFF] mb-3">
              Total Trips
            </p>
            <div className="flex items-center gap-2">
              <div className="w-[15px] h-[15px] rounded-full bg-yellow-500"></div>
              <p className="text-[18px] font-medium leading-[120%] text-[#B6B6B6]">
                {OverView?.data?.trips ?? 0}
              </p>
            </div>
          </div>
          <Image
            src="/images/cardImage2.png"
            alt="trips"
            width={60}
            height={60}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
