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
  Plus,
  Trash2,
} from "lucide-react";
import PageHeader from "@/components/DashboardHeader/pageHeader";
import { CreateTripModal } from "@/components/modal/CreateTripModal";
import { UpdateTripModal } from "@/components/modal/UpdateTripModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteDialog } from "@/components/modal/DeleteModal";
import { useSession } from "next-auth/react";

// ✅ Trip type
type Trip = {
  _id: string;
  country: string;
  location: string;
  startDate: string;
  endDate: string;
  participants: number;
  image: string;
};

function TripsManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);
  const itemsPerPage = 8;
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = (session?.user as { accessToken: string })?.accessToken;

  // ✅ API call
  const { data, isLoading } = useQuery({
    queryKey: ["trips", currentPage],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/trip?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch trips");
      return res.json();
    },
  });

  const trips: Trip[] = data?.data?.data || [];
  const meta = data?.data?.meta;
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 1;
  const startItem = meta ? (meta.page - 1) * meta.limit + 1 : 0;
  const endItem = meta ? Math.min(meta.page * meta.limit, meta.total) : 0;

  // ✅ Delete mutation
  const deleteTripMutation = useMutation({
    mutationFn: async (tripId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/trip/${tripId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete trip");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Trip deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      setDeleteOpen(false);
      setTripToDelete(null);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete trip");
    },
  });

  const handleDeleteClick = (tripId: string) => {
    setTripToDelete(tripId);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (tripToDelete) deleteTripMutation.mutate(tripToDelete);
  };

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
          <CreateTripModal />
        </div>
      </div>

      {/* Trip Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading
          ? Array.from({ length: itemsPerPage }).map((_, i) => (
              <Card
                key={i}
                className="bg-[#2A2A2A] border-gray-700 animate-pulse h-64"
              >
                <div className="h-48 bg-gray-700"></div>
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-600 rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))
          : trips.map((trip) => (
              <Card
                key={trip._id}
                className="bg-[#2A2A2A] border-gray-700 overflow-hidden group hover:bg-gray-750 transition-colors"
              >
                <div className="relative">
                  <div
                    className="h-48 bg-cover bg-center relative"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${trip.image})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white text-lg font-semibold drop-shadow-lg">
                        {trip.country}
                      </h3>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto text-white hover:text-gray-300 hover:bg-white/20 transition-colors"
                      >
                        {/* <ExternalLink size={16} /> */}
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin
                        size={16}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <span className="text-sm">{trip.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar
                        size={16}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <span className="text-sm">
                        {new Date(trip.startDate).toLocaleDateString()} -{" "}
                        {new Date(trip.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-300">
                      <Users size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="text-sm">
                        {trip.participants} Participants
                      </span>

                      <div className="ml-auto flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto text-red-700 hover:text-white hover:bg-gray-600 transition-colors"
                          onClick={() => handleDeleteClick(trip._id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                        <UpdateTripModal trip={trip._id} />
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
          Showing {startItem} to {endItem} of {meta?.total || 0} results
        </div>
        <div className="flex items-center gap-1">{renderPaginationButtons()}</div>
      </div>

      {/* ✅ Delete Dialog */}
      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Trip"
        description="Are you sure you want to delete this trip? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteTripMutation.isPending}
      />
    </div>
  );
}

export default TripsManagement;
