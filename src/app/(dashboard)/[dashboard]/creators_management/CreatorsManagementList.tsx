"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Search, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/DashboardHeader/pageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CreatorModal } from "@/components/modal/CreatorModal";
import { useQuery } from "@tanstack/react-query";

interface SocialMedia {
  platform: string;
  link: string;
  followers: number;
  _id: string;
}

interface Creator {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  bio: string;
  description: string;
  socialMedia: SocialMedia[];
  interests: string[];
  status: "pending" | "accepted" | "rejected"; // যদি এই ৩টা fixed থাকে, না হলে string
  image: string[];
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  __v: number;
  totalFollowers: number;
  tier: "top" | "mid" | "low"; // যদি fixed হয়, না হলে string
}

function CreatorsManagementList() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data } = useQuery({
    queryKey: ["creatorsData", currentPage],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/creator?page=${currentPage}&limit=10`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch creators data");
      }
      return res.json();
    },
  });

  const creatorsData = data?.data?.data || [];
  const meta = data?.data?.meta;
  const totalPages = meta?.total ? Math.ceil(meta.total / meta.limit) : 1;
  const startItem = (currentPage - 1) * (meta?.limit || 10) + 1;
  const endItem = Math.min(currentPage * (meta?.limit || 10), meta?.total || 0);

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    // Previous button
    buttons.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 p-0 bg-gray-700 border-gray-600 text-white hover:bg-gray-600 disabled:opacity-50"
      >
        <ChevronLeft />
      </Button>
    );

    // Page numbers
    for (let i = 1; i <= Math.min(maxVisiblePages, totalPages); i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(i)}
          className={`w-10 h-10 p-0 ${
            currentPage === i
              ? "bg-[#7DD3DD] border-[#7DD3DD] text-white hover:bg-cyan-600"
              : "bg-gray-700 border-[#7DD3DD] text-white hover:bg-gray-600"
          }`}
        >
          {i}
        </Button>
      );
    }

    // Next button
    buttons.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={() =>
          currentPage < totalPages && setCurrentPage(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className="w-10 h-10 p-0 bg-gray-700 border-gray-600 text-white hover:bg-gray-600 disabled:opacity-50"
      >
        <ChevronRight />
      </Button>
    );

    return buttons;
  };

  return (
    <div className="text-white min-h-screen p-6">
      <div className="flex justify-between mb-10">
        <div>
          <PageHeader
            title="Creators Management"
            breadcrumb="Dashboard > Creators Management"
            btnText="Add Category"
            icon={Plus}
          />
        </div>

        <div className="flex gap-4">
          <div className="w-[200px]">
            <Select>
              <SelectTrigger className="w-full h-[48px] text-white border-slate-700">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 text-white">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative [400px]">
            <Search className="absolute left-4 top-[40%] -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              placeholder="Search..."
              className="text-white bg-[#131313] border-slate-700 h-12 text-lg"
            />
          </div>
        </div>
      </div>
      <div className="bg-[#2A2A2A] rounded-lg border border-gray-700">
        {/* Table Container */}
        <div className="overflow-x-auto">
          <Table className="w-full">
            {/* Table Header */}
            <TableHeader>
              <TableRow className="border-b border-gray-600 hover:bg-transparent">
                <TableHead className="text-gray-300 font-medium bg-gray-700 h-12 px-4">
                  Creator Name
                </TableHead>
                <TableHead className="text-gray-300 font-medium bg-gray-700 h-12 px-4">
                  Creator Email
                </TableHead>
                <TableHead className="text-gray-300 font-medium bg-gray-700 h-12 px-4">
                  Phone Number
                </TableHead>
                <TableHead className="text-gray-300 font-medium bg-gray-700 h-12 px-4">
                  Link
                </TableHead>
                <TableHead className="text-gray-300 font-medium bg-gray-700 h-12 px-4 text-end">
                  <span className="mr-16">Action</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {creatorsData.map((creator: Creator) => (
                <TableRow
                  key={creator._id}
                  className="border-b border-[#B6B6B633] hover:bg-gray-750"
                >
                  <TableCell className="text-gray-200 px-4 py-4">
                    {creator.fullName}
                  </TableCell>
                  <TableCell className="text-gray-200 px-4 py-4">
                    {creator.email}
                  </TableCell>
                  <TableCell className="text-gray-200 px-4 py-4">
                    {creator.phoneNumber}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {creator.socialMedia?.length > 0 && (
                      <a
                        href={creator.socialMedia[0].link}
                        className="text-blue-400 hover:text-blue-300 underline transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {creator.socialMedia[0].platform}
                      </a>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-2 justify-end mr-9">
                      <CreatorModal createorsId = {creator?._id}/>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto text-red-700 hover:text-white hover:bg-gray-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </Button>
                      <Button
                        size="sm"
                        className="px-3 py-1 bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
                      >
                        Accept
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <div className="text-sm text-gray-400">
            Showing {startItem} to {endItem} of {meta?.total || 0} results
          </div>

          <div className="flex items-center gap-1">
            {renderPaginationButtons()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatorsManagementList;
