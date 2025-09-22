"use client";
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  Trash2,
} from "lucide-react";
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
import Image from "next/image";

const creatorsData = [
  {
    id: 1,
    name: "John Smith",
    serial: "1",
    date: "25/05/2025",
    link: "http://www.xonwork.com",
    image: "/images/media.png",
  },
  {
    id: 2,
    name: "John Smith",
    serial: "1",
    date: "25/05/2025",
    link: "http://www.xonwork.com",
    image: "/images/media.png",
  },
  {
    id: 3,
    name: "John Smith",
    serial: "1",
    date: "25/05/2025",
    link: "http://www.xonwork.com",
    image: "/images/media.png",
  },
  {
    id: 4,
    name: "John Smith",
    serial: "1",
    date: "25/05/2025",
    link: "http://www.xonwork.com",
    image: "/images/media.png",
  },
  {
    id: 5,
    name: "John Smith",
    serial: "1",
    date: "25/05/2025",
    link: "http://www.xonwork.com",
    image: "/images/media.png",
  },
  {
    id: 6,
    name: "John Smith",
    serial: "1",
    date: "25/05/2025",
    link: "http://www.xonwork.com",
    image: "/images/media.png",
  },
  {
    id: 7,
    name: "John Smith",
    serial: "1",
    date: "25/05/2025",
    link: "http://www.xonwork.com",
    image: "/images/media.png",
  },
  {
    id: 8,
    name: "John Smith",
    serial: "1",
    date: "25/05/2025",
    link: "http://www.xonwork.com",
    image: "/images/media.png",
  },
  {
    id: 9,
    name: "John Smith",
    serial: "1",
    date: "25/05/2025",
    link: "http://www.xonwork.com",
    image: "/images/media.png",
  },
  {
    id: 10,
    name: "John Smith",
    serial: "1",
    date: "25/05/2025",
    link: "http://www.xonwork.com",
    image: "/images/media.png",
  },
];

function MediaManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 12;
  const itemsPerPage = 10;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, creatorsData.length);

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
            title="Media Management"
            breadcrumb="Plan, track, and manage every event with ease."
            // btnLink="/dashboard/category/add"
            btnText="Add Category"
            icon={Plus}
          />
        </div>

        {/* <div className="flex gap-4">
          <div className="w-[200px]">
            <Select>
              <SelectTrigger className="w-full h-[48px] bg-slate-800 text-white border-slate-700">
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
              className="pl-12 bg-slate-800 text-white border-slate-700 h-12 text-lg"
            />
          </div>
        </div> */}
      </div>
      <div className="bg-[#2A2A2A] rounded-lg border border-gray-700">
        {/* Table Container */}
        <div className="overflow-x-auto">
          <Table className="w-full">
            {/* Table Header */}
            <TableHeader>
              <TableRow className="border-b border-gray-600 hover:bg-transparent">
                <TableHead className="text-gray-300 font-medium bg-gray-700 h-12 px-4">
                  Video
                </TableHead>
                <TableHead className="text-gray-300 font-medium bg-gray-700 h-12 px-4">
                  Serial No
                </TableHead>
                <TableHead className="text-gray-300 font-medium bg-gray-700 h-12 px-4 text-center">
                  Date
                </TableHead>
                {/* <TableHead className="text-gray-300 font-medium bg-gray-700 h-12 px-4">
                  Link
                </TableHead> */}
                <TableHead className="text-gray-300 text-end font-medium bg-gray-700 h-12 px-4">
                  <span className="mr-16">Action</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {creatorsData.map((creator) => (
                <TableRow
                  key={creator.id}
                  className="border-b border-[#B6B6B633] hover:bg-gray-750"
                >
                  <TableCell className="text-gray-200 px-4 py-4">
                    <div className="">
                      <Image
                        src={creator.image}
                        alt="iagme"
                        width={200}
                        height={200}
                        className="w-[120px] h-[70px]"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-200 px-4 py-4">
                    {creator.serial}
                  </TableCell>
                  <TableCell className="text-gray-200 px-4 py-4 text-center">
                    {creator.date}
                  </TableCell>
                  {/* <TableCell className="px-4 py-4">
                    <a
                      href={creator.link}
                      className="text-blue-400 hover:text-blue-300 underline transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {creator.link}
                    </a>
                  </TableCell> */}
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2 mr-7">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
                      >
                        <Eye size={16} />
                      </Button>
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
            Showing {startItem} to {endItem} of {totalPages} results
          </div>

          <div className="flex items-center gap-1">
            {renderPaginationButtons()}
          </div>
        </div> 
      </div>
    </div>
  );
}

export default MediaManagement;
