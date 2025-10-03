"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
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
import { UploadModal } from "@/components/modal/UploadModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReactPlayer from "react-player";
import { EditTripModal } from "@/components/modal/EditTripModal";
import { useSession } from "next-auth/react";
import { DeleteDialog } from "@/components/modal/DeleteModal";
import { toast } from "sonner";

type MediaItem = {
  _id: string;
  video?: string;
  url?: string;
  createdAt: string;
};

function MediaManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const itemsPerPage = 10;

  const { data: session } = useSession();
  const token = (session?.user as { accessToken?: string } | undefined)
    ?.accessToken;

  const queryClient = useQueryClient();

  // Fetch media data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["media", currentPage],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/event?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch media");
      return res.json();
    },
    enabled: !!token,
  });

  const mediaData: MediaItem[] = data?.data?.data || [];
  const meta = data?.data?.meta || { page: 1, limit: itemsPerPage, total: 0 };

  const totalPages = Math.ceil(meta.total / meta.limit);
  const startItem = (meta.page - 1) * meta.limit + 1;
  const endItem = Math.min(meta.page * meta.limit, meta.total);

  // Delete media mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/event/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete media");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["media", currentPage] });
      toast.success(data?.message || "Media delete successfully !");
      setDeleteModalOpen(false);
      setSelectedMediaId(null);
    },
    onError: (err) => {
      toast.error(err.message || "Media Not Delete !");
    },
  });

  const openDeleteModal = (id: string) => {
    setSelectedMediaId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedMediaId) deleteMutation.mutate(selectedMediaId);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    // Previous
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

    // Next
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

  if (isLoading) return <div className="p-6 text-white">Loading media...</div>;
  if (isError)
    return <div className="p-6 text-red-500">Failed to load media.</div>;

  return (
    <div className="text-white min-h-screen p-6">
      <div className="flex justify-between mb-10">
        <PageHeader
          title="Media Management"
          breadcrumb="Plan, track, and manage every event with ease."
          btnText="Add Category"
          icon={Plus}
        />
        <UploadModal />
      </div>

      <div className="bg-[#2A2A2A] rounded-lg border border-gray-700">
        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="w-full">
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
                <TableHead className="text-gray-300 text-end font-medium bg-gray-700 h-12 px-4">
                  <span className="mr-16">Action</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {mediaData.map((item, index) => (
                <TableRow
                  key={item._id}
                  className="border-b border-[#B6B6B633] hover:bg-gray-750"
                >
                  <TableCell className="text-gray-200 px-4 py-4">
                    {item.video ? (
                      <ReactPlayer
                        src={item.video}
                        width="120px"
                        height="70px"
                        controls
                      />
                    ) : item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline hover:text-blue-300"
                      >
                        {item.url}
                      </a>
                    ) : (
                      "No media"
                    )}
                  </TableCell>

                  <TableCell className="text-gray-200 px-4 py-4">
                    {startItem + index}
                  </TableCell>
                  <TableCell className="text-gray-200 px-4 py-4 text-center">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2 mr-7">
                      <EditTripModal eventId={item._id} />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto text-red-700 hover:text-white hover:bg-gray-600 transition-colors"
                        onClick={() => openDeleteModal(item._id)}
                        disabled={deleteMutation.isPending}
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
            Showing {startItem} to {endItem} of {meta.total} results
          </div>
          <div className="flex items-center gap-1">
            {renderPaginationButtons()}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

export default MediaManagement;
