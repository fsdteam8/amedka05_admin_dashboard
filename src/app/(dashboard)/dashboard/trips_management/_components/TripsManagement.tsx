"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";
import PageHeader from "@/components/DashboardHeader/pageHeader";
import { CreateTripModal } from "@/components/modal/CreateTripModal";
// Mock data for trips
const tripsData = [
  {
    id: 1,
    title: "China, Beijing",
    location: "Beihai Park, China, Beijing",
    dateRange: "19 Nov 2025 - 22 Nov 2025",
    participants: 4,
    image: "/api/placeholder/300/200",
  },
  {
    id: 2,
    title: "China, Beijing",
    location: "Beihai Park, China, Beijing",
    dateRange: "19 Nov 2025 - 22 Nov 2025",
    participants: 12,
    image: "/api/placeholder/300/200",
  },
  {
    id: 3,
    title: "China, Beijing",
    location: "Beihai Park, China, Beijing",
    dateRange: "19 Nov 2025 - 22 Nov 2025",
    participants: 8,
    image: "/api/placeholder/300/200",
  },
  {
    id: 4,
    title: "China, Beijing",
    location: "Beihai Park, China, Beijing",
    dateRange: "19 Nov 2025 - 22 Nov 2025",
    participants: 25,
    image: "/api/placeholder/300/200",
  },
  {
    id: 5,
    title: "China, Beijing",
    location: "Beihai Park, China, Beijing",
    dateRange: "19 Nov 2025 - 22 Nov 2025",
    participants: 12,
    image: "/api/placeholder/300/200",
  },
  {
    id: 6,
    title: "China, Beijing",
    location: "Beihai Park, China, Beijing",
    dateRange: "19 Nov 2025 - 22 Nov 2025",
    participants: 8,
    image: "/api/placeholder/300/200",
  },
  {
    id: 7,
    title: "China, Beijing",
    location: "Beihai Park, China, Beijing",
    dateRange: "19 Nov 2025 - 22 Nov 2025",
    participants: 15,
    image: "/api/placeholder/300/200",
  },
  {
    id: 8,
    title: "China, Beijing",
    location: "Beihai Park, China, Beijing",
    dateRange: "19 Nov 2025 - 22 Nov 2025",
    participants: 20,
    image: "/api/placeholder/300/200",
  },
];

function TripsManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(tripsData.length / itemsPerPage);

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, tripsData.length);

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tripsData.slice(startIndex, endIndex);
  };

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
    <div className="p-6 min-h-screen">
      <div className="flex justify-between mb-10">
        <div>
          <PageHeader
            title="Trip Management"
            breadcrumb="Plan, organize, and oversee every journey with ease."
            btnText="Add Category"
            icon={Plus}
          />
        </div>

        <div className="flex gap-4">
          {/* <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create New Trip
          </Button> */}
          <CreateTripModal />
        </div>
      </div>
      {/* Trip Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {getCurrentPageData().map((trip) => (
          <Card
            key={trip.id}
            className="bg-[#2A2A2A] border-gray-700 overflow-hidden group hover:bg-gray-750 transition-colors"
          >
            <div className="relative">
              {/* Trip Image */}
              <div
                className="h-48 bg-cover bg-center relative"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url("/images/tripimage.jpg")',
                }}
              >
                {/* Overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>

                {/* Title overlay */}
                <div className="absolute top-4 left-4">
                  <h3 className="text-white text-lg font-semibold drop-shadow-lg">
                    {trip.title}
                  </h3>
                </div>

                {/* External link icon */}
                <div className="absolute top-4 right-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto text-white hover:text-gray-300 hover:bg-white/20 transition-colors"
                  >
                    <ExternalLink size={16} />
                  </Button>
                </div>
              </div>

              {/* Card Content */}
              <CardContent className="p-4 space-y-3">
                {/* Location */}
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="text-sm">{trip.location}</span>
                </div>

                {/* Date Range */}
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="text-sm">{trip.dateRange}</span>
                </div>

                {/* Participants */}
                <div className="flex items-center gap-2 text-gray-300">
                  <Users size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="text-sm">
                    {trip.participants} Participants
                  </span>
                  {/* Status indicators */}
                  <div className="ml-auto flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto text-red-700 hover:text-white hover:bg-gray-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
                    >
                      <Edit size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-6"> 
        <div className="text-sm text-gray-400">
          Showing {startItem} to {endItem} of {tripsData.length} results
        </div>

        <div className="flex items-center gap-1">
          {renderPaginationButtons()}
        </div>
      </div>
    </div>
  );
}

export default TripsManagement;
