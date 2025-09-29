"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { CircleCheckBig } from "lucide-react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { DeleteDialog } from "@/components/modal/DeleteModal";

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
  status: "pending" | "accepted" | "rejected";
  image: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalFollowers: number;
  tier: "top" | "mid" | "low";
}

type StatusFilter = "all" | "accepted" | "rejected";

function CreatorsManagementList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const { data: session } = useSession();
  const token = (session?.user as { accessToken: string })?.accessToken;

  const queryClient = useQueryClient();

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch creators
  const { data, isLoading } = useQuery({
    queryKey: ["creatorsData", currentPage, debouncedSearch, statusFilter],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        searchTerm: debouncedSearch,
      });
      if (statusFilter !== "all") queryParams.append("status", statusFilter);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/creator?${queryParams}`
      );
      if (!res.ok) throw new Error("Failed to fetch creators data");
      return res.json();
    },
  });

  const creatorsData = data?.data?.data || [];
  const meta = data?.data?.meta;
  const totalPages = meta?.total ? Math.ceil(meta.total / meta.limit) : 1;
  const startItem = (currentPage - 1) * (meta?.limit || 10) + 1;
  const endItem = Math.min(currentPage * (meta?.limit || 10), meta?.total || 0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(
    null
  );

  // Mutation to update creator status
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "accepted" | "rejected";
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/creator/status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["creatorsData"] });
      toast.success(data.message || "Status updated successfully");
    },
    onError: (err) => {
      toast.error((err as Error).message || "Failed to update status");
    },
  });

  const handleStatusUpdate = (id: string, status: "accepted" | "rejected") => {
    updateStatusMutation.mutate({ id, status });
  };

  const deleteCreatorMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/creator/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete creator");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["creatorsData"] });
      toast.success(data.message || "Creator deleted successfully");
    },
    onError: (err) => {
      toast.error((err as Error).message || "Failed to delete creator");
    },
  });

  const handleDeleteClick = (id: string) => {
    setSelectedCreatorId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCreatorId) deleteCreatorMutation.mutate(selectedCreatorId);
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
    <div className="text-white min-h-screen p-6">
      <div className="flex justify-between mb-10">
        <PageHeader
          title="Creators Management"
          breadcrumb="Dashboard > Creators Management"
          btnText="Add Category"
          icon={Plus}
        />

        <div className="flex gap-4">
          <div className="w-[200px]">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as StatusFilter)}
            >
              <SelectTrigger className="w-full h-[48px] text-white border-slate-700">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 text-white">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-[40%] -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-white bg-[#131313] border-slate-700 h-12 w-[400px] text-base"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#2A2A2A] rounded-lg border border-gray-700">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-gray-600 hover:bg-transparent">
                <TableHead className="text-gray-300 font-medium bg-gray-700 h-12 px-4">
                  Creator Name
                </TableHead>
                <TableHead className="text-gray-300 font-medium bg-gray-700 h-12 px-4">
                  Email
                </TableHead>
                <TableHead className="text-gray-300 font-medium bg-gray-700 h-12 px-4">
                  Phone
                </TableHead>
                <TableHead className="text-gray-300 font-medium bg-gray-700 h-12 px-4">
                  Link
                </TableHead>
                <TableHead className="text-gray-300 font-medium bg-gray-700 h-12 px-4 text-end">
                  <span className="mr-10">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx} className="border-b border-[#B6B6B633]">
                    <TableCell>
                      <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-40 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : creatorsData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-400 py-6"
                  >
                    No creators found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                creatorsData.map((creator: Creator) => (
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
                      {creator.socialMedia?.[0] && (
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
                        <CreatorModal createorsId={creator._id} />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(creator._id)}
                          className="p-1 h-auto text-red-700 hover:text-white hover:bg-gray-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </Button>

                        {/* Status buttons/icons */}
                        {creator.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              disabled={updateStatusMutation.isPending}
                              className="px-3 py-1 bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
                              onClick={() =>
                                handleStatusUpdate(creator._id, "accepted")
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              disabled={updateStatusMutation.isPending}
                              className="px-3 py-1 bg-red-600 text-white hover:bg-red-700 transition-colors"
                              onClick={() =>
                                handleStatusUpdate(creator._id, "rejected")
                              }
                            >
                              Reject
                            </Button>
                          </>
                        )}

                        {creator.status === "accepted" && (
                          <CircleCheckBig className="text-cyan-500 w-6 h-6" />
                        )}

                        {creator.status === "rejected" && (
                          <X className="text-red-500 w-6 h-6" />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* ✅ Only show pagination if total > limit */}
        {meta?.total > (meta?.limit || 10) && (
          <div className="flex items-center justify-between p-6 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Showing {startItem} to {endItem} of {meta?.total || 0} results
            </div>
            <div className="flex items-center gap-1">
              {renderPaginationButtons()}
            </div>
          </div>
        )}
      </div>
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        loading={deleteCreatorMutation.isPending}
      />
    </div>
  );
}

export default CreatorsManagementList;
