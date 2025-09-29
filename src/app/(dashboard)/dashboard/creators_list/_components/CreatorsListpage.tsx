"use client";
import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteDialog } from "@/components/modal/DeleteModal";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { CreatorModal } from "@/components/modal/CreatorModal";
import { UpdateCreator } from "@/components/modal/UpdateCreator";

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
  socialMedia: SocialMedia[];
}

function CreatorsListpage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const queryClient = useQueryClient();
  const itemsPerPage = 10;
  const { data: session } = useSession();
  const token = (session?.user as { accessToken: string })?.accessToken;

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(
    null
  );

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1); // reset to first page on search
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch creators
  const { data, isLoading } = useQuery({
    queryKey: ["creatorsData", currentPage, debouncedQuery],
    queryFn: async () => {
      const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/creator`);
      url.searchParams.set("page", currentPage.toString());
      url.searchParams.set("limit", itemsPerPage.toString());
      if (debouncedQuery) url.searchParams.set("searchTerm", debouncedQuery);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch creators");
      return res.json();
    },
  });

  const creatorsData: Creator[] = data?.data?.data || [];
  const meta = data?.data?.meta;
  const totalPages = meta?.total ? Math.ceil(meta.total / meta.limit) : 1;
  const startItem = (currentPage - 1) * (meta?.limit || 10) + 1;
  const endItem = Math.min(currentPage * (meta?.limit || 10), meta?.total || 0);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/creator/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete creator");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["creatorsData"] });
      setDeleteDialogOpen(false);
      setSelectedCreatorId(null);
      toast.success(data.message || "Creator deleted successfully");
    },
    onError: (err) => {
      toast.error((err as Error).message || "Failed to delete creator");
    },
  });

  // Pagination buttons
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

  const handleDeleteClick = (id: string) => {
    setSelectedCreatorId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCreatorId) deleteMutation.mutate(selectedCreatorId);
  };

  return (
    <div className="text-white min-h-screen p-6">
      <div className="flex justify-between mb-10">
        <PageHeader
          title="Creators List Page"
          breadcrumb="Dashboard > Creators List Page"
          btnText="Add Category"
          icon={Plus}
        />

        <div className="relative w-[400px]">
          <Search className="absolute left-4 top-[40%] -translate-y-1/2 text-slate-400 h-5 w-5" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-white bg-[#131313] border-slate-700 h-12 text-lg"
          />
        </div>
      </div>

      <div className="bg-[#2A2A2A] rounded-lg border border-gray-700">
        <div className="overflow-x-auto">
          <Table className="w-full table-fixed">
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

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : creatorsData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-gray-400"
                  >
                    No creators found.
                  </TableCell>
                </TableRow>
              ) : (
                creatorsData.map((creator) => (
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
                    <TableCell className="px-4 py-4 truncate">
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
                      <div className="flex items-center gap-2">
                        <UpdateCreator creatorId={creator._id} />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto text-blue-500 hover:text-white hover:bg-gray-600 transition-colors"
                        >
                          <CreatorModal createorsId={creator._id} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto text-red-700 hover:text-white hover:bg-gray-600 transition-colors"
                          onClick={() => handleDeleteClick(creator._id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {meta?.total > (meta?.limit || 10) && (
          <div className="flex items-center justify-between p-6 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Showing {startItem} to {endItem} of {meta?.total} results
            </div>
            <div className="flex items-center gap-1">
              {renderPaginationButtons()}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

export default CreatorsListpage;
