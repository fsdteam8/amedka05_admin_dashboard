"use client";
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Plus,
  Search,
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
import { Input } from "@/components/ui/input";

const creatorsData = [
  {
    id: 1,
    name: "John Smith",
    email: "rajul123@gmail.com",
    phone: "(208) 555-0112",
    link: "http://www.xonwork.com",
  },
  {
    id: 2,
    name: "Kristin Watson",
    email: "felicia.reid@example.com",
    phone: "(505) 555-0125",
    link: "http://www.treequote.com",
  },
  {
    id: 3,
    name: "Wade Warren",
    email: "curtis.weaver@example.com",
    phone: "(229) 555-0109",
    link: "http://www.sofware.com",
  },
  {
    id: 4,
    name: "Wade Warren",
    email: "curtis.weaver@example.com",
    phone: "(229) 555-0109",
    link: "http://www.sofware.com",
  },
  {
    id: 5,
    name: "Wade Warren",
    email: "curtis.weaver@example.com",
    phone: "(229) 555-0109",
    link: "http://www.sofware.com",
  },
  {
    id: 6,
    name: "Wade Warren",
    email: "curtis.weaver@example.com",
    phone: "(229) 555-0109",
    link: "http://www.sofware.com",
  },
  {
    id: 7,
    name: "Wade Warren",
    email: "curtis.weaver@example.com",
    phone: "(229) 555-0109",
    link: "http://www.sofware.com",
  },

  {
    id: 8,
    name: "Wade Warren",
    email: "curtis.weaver@example.com",
    phone: "(229) 555-0109",
    link: "http://www.sofware.com",
  },{
    id: 9,
    name: "Wade Warren",
    email: "curtis.weaver@example.com",
    phone: "(229) 555-0109",
    link: "http://www.sofware.com",
  },
  {
    id: 10,
    name: "Wade Warren",
    email: "curtis.weaver@example.com",
    phone: "(229) 555-0109",
    link: "http://www.sofware.com",
  },

  // ... rest of your data
];

function CreatorsListpage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 12;
  const itemsPerPage = 10;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, creatorsData.length);

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

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
        <PageHeader
          title="Creators List Page "
          breadcrumb="Dashboard > Creators List Page "
          btnText="Add Category"
          icon={Plus}
        />

        <div className="relative w-[400px]">
          <Search className="absolute left-4 top-[40%] -translate-y-1/2 text-slate-400 h-5 w-5" />
          <Input
            placeholder="Search..."
            className="text-white bg-[#131313] border-slate-700 h-12 text-lg"
          />
        </div>
      </div>

      <div className="bg-[#2A2A2A] rounded-lg border border-gray-700">
        {/* Table Container */}
        <div className="overflow-x-auto">
          <Table className="w-full table-fixed">
            {/* Table Header */}
            <TableHeader>
              <TableRow className="border-b border-gray-600 hover:bg-transparent">
                <TableHead className="w-[20%] text-gray-300 font-medium bg-gray-700 h-12 px-4">
                  Creator Name
                </TableHead>
                <TableHead className="w-[25%] text-gray-300 font-medium bg-gray-700 h-12 px-4">
                  Creator Email
                </TableHead>
                <TableHead className="w-[20%] text-gray-300 font-medium bg-gray-700 h-12 px-4">
                  Phone Number
                </TableHead>
                <TableHead className="w-[25%] text-gray-300 font-medium bg-gray-700 h-12 px-4">
                  Link
                </TableHead>
                <TableHead className="w-[10%] text-gray-300 font-medium bg-gray-700 h-12 px-4">
                  Action
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
                    {creator.name}
                  </TableCell>
                  <TableCell className="text-gray-200 px-4 py-4">
                    {creator.email}
                  </TableCell>
                  <TableCell className="text-gray-200 px-4 py-4">
                    {creator.phone}
                  </TableCell>
                  <TableCell className="px-4 py-4 truncate">
                    <a
                      href={creator.link}
                      className="text-blue-400 hover:text-blue-300 underline transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {creator.link}
                    </a>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto text-red-700 hover:text-white hover:bg-gray-600 transition-colors"
                      >
                        <Trash2 size={16} />
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

export default CreatorsListpage;
