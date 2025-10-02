"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Edit, Plus, Trash2 } from "lucide-react";
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
import { CreateCollaboratModal } from "@/components/modal/CreateCollaboratModal";
import { useDeletePartnership, useGetPartnership } from "@/hooks/apiCalling";
import { useSession } from "next-auth/react";
import { TableSkeleton } from "@/components/Skeleton";
import { DeleteDialog } from "@/components/modal/DeleteModal";


function Partnerships() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState("");
  const { data: session } = useSession();
  const token = (session?.user as { accessToken: string })?.accessToken;
  const getPartnership = useGetPartnership(token, currentPage, itemsPerPage);
  const [add, setAdd] = useState(false);
  const partnerships = getPartnership.data?.data.data || [];
  const meta = getPartnership.data?.data?.meta;
  const totalPages = meta?.total ? Math.ceil(meta.total / meta.limit) : 1;

  const startItem = (currentPage - 1) * (meta?.limit || 10) + 1;
  const endItem = Math.min(currentPage * (meta?.limit || 10), meta?.total || 0);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); // Delete modal open state
  const [deleteId, setDeleteId] = useState("");
  const deletePartnership = useDeletePartnership(token, deleteId);
  // Pagination
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
          className={`w-10 h-10 p-0 ${currentPage === i
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

  const handleDelete = () => {
    deletePartnership.mutate(undefined, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        getPartnership.refetch();
      },
    });
  };

  return (
    <div className="text-white min-h-screen p-6">
      <div className="flex justify-between mb-10">
        <PageHeader
          title="Partnerships & Collaborations"
          breadcrumb="Plan, organize, and oversee every journey with ease."
          btnText="Add Category"
          icon={Plus}
        />

        <div>
          <Button
            onClick={() => {
              setAdd(true);
              setId("");
              setIsOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Collaboration
          </Button>
        </div>
      </div>

      <div className="bg-[#2A2A2A] rounded-lg border border-gray-700">
        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-gray-600 hover:bg-transparent">
                <TableHead className="text-gray-300 font-medium bg-gray-700 h-12 px-4">
                  Image
                </TableHead>
                <TableHead className="text-gray-300 font-medium bg-gray-700 h-12 px-4">
                  Serial No
                </TableHead>
                <TableHead className="text-gray-300 font-medium bg-gray-700 h-12 px-4">
                  Title
                </TableHead>
                <TableHead className="text-gray-300 font-medium bg-gray-700 h-12 px-4 text-center">
                  Description
                </TableHead>
                <TableHead className="text-gray-300 text-end font-medium bg-gray-700 h-12 px-4">
                  <span className="mr-16">Action</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {getPartnership.isLoading ? (
                <TableSkeleton rows={5} />
              ) : partnerships.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-gray-400"
                  >
                    No partnerships found.
                  </TableCell>
                </TableRow>
              ) : (
                partnerships.map((p, i) => (
                  <TableRow
                    key={p._id}
                    className="border-b border-[#B6B6B633] hover:bg-gray-750"
                  >
                    <TableCell className="px-4 py-4">
                      <Image
                        src={p.image}
                        alt="partnership"
                        width={120}
                        height={70}
                        className="w-[120px] h-[70px] rounded-md"
                      />
                    </TableCell>
                    <TableCell className="text-gray-200 px-4 py-4">
                      {startItem + i}
                    </TableCell>
                    <TableCell className="text-gray-200 px-4 py-4 text-center">
                      {p?.title}
                    </TableCell>
                    <TableCell className="text-gray-200 px-4 py-4 text-center">
                      {p?.description.slice(0, 20) + "..."}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2 mr-7">
                        <Button
                          onClick={() => {
                            setIsDeleteOpen(true);
                            setDeleteId(p._id);
                          }}
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto text-red-700 hover:text-white hover:bg-gray-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </Button>
                        <Button
                          onClick={() => {
                            setAdd(false);
                            setId(p._id);
                            setIsOpen(true);
                          }}
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto hover:text-white hover:bg-gray-600 transition-colors"
                        >
                          <Edit size={16} />
                        </Button>

                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {meta && meta?.total > (meta?.limit || 10) && (
          <div className="flex items-center justify-between p-6 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Showing {startItem} to {endItem} of {meta?.total} results
            </div>
            <div className="flex items-center gap-1">{renderPaginationButtons()}</div>
          </div>
        )}
      </div>
      <CreateCollaboratModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        id={id}
        add={add}
      />
      <DeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        loading={deletePartnership.isPending}
      />
    </div>
  );
}

export default Partnerships;
