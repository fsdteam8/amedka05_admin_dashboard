"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, X } from "lucide-react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { DeleteDialog } from "@/components/modal/DeleteModal";
import { RequestAgentModal } from "@/components/modal/RequestAgentModal";
import { UpdateAgentModal } from "@/components/modal/UpdateAgentModal";

interface Agent {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  country: string;
  designation: string;
  brandName: string;
  workingFrom: string;
  status: "pending" | "accepted" | "rejected";
  image: string;
}

function AgentsList() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { data: session } = useSession();
  const token = (session?.user as { accessToken: string })?.accessToken;

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["agentData", currentPage],
    queryFn: async () => {
      const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/agent`);
      url.searchParams.set("page", currentPage.toString());
      url.searchParams.set("limit", itemsPerPage.toString());

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch agent data");
      return res.json();
    },
  });

  const agents: Agent[] = data?.data || [];
  const meta = data?.meta || { page: 1, limit: itemsPerPage, total: 0 };
  const totalPages = Math.ceil(meta.total / meta.limit);
  const startItem = (currentPage - 1) * meta.limit + 1;
  const endItem = Math.min(currentPage * meta.limit, meta.total);

  // ✅ Delete Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  // ✅ Mutation: update agent status
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "accepted" | "rejected";
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/agent/status/${id}`,
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
      queryClient.invalidateQueries({ queryKey: ["agentData"] });
      toast.success(data.message || "Status updated successfully");
    },
    onError: (err) => {
      toast.error((err as Error).message || "Failed to update status");
    },
  });

  const handleStatusUpdate = (id: string, status: "accepted" | "rejected") => {
    updateStatusMutation.mutate({ id, status });
  };

  // ✅ Mutation: delete agent
  const deleteAgentMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/agent/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete agent");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["agentData"] });
      toast.success(data.message || "Agent deleted successfully");
      setDeleteDialogOpen(false);
    },
    onError: (err) => {
      toast.error((err as Error).message || "Failed to delete agent");
    },
  });

  const handleDeleteClick = (id: string) => {
    setSelectedAgentId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedAgentId) deleteAgentMutation.mutate(selectedAgentId);
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
          title="Request From Agents"
          breadcrumb="Dashboard > Request From Agents"
          btnText="Add Category"
          icon={Plus}
        />
      </div>

      <div className="bg-[#2A2A2A] rounded-lg border border-gray-700">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-gray-600 hover:bg-transparent">
                <TableHead className="text-gray-300 font-medium bg-gray-700 h-12 px-4">
                  Agent Name
                </TableHead>
                <TableHead className="text-gray-300 font-medium bg-gray-700 h-12 px-4">
                  Agent Email
                </TableHead>
                <TableHead className="text-gray-300 font-medium bg-gray-700 h-12 px-4">
                  Phone Number
                </TableHead>
                <TableHead className="text-gray-300 font-medium bg-gray-700 h-12 px-4">
                  Country
                </TableHead>
                <TableHead className="text-gray-300 font-medium bg-gray-700 h-12 px-4 text-end">
                  <span className="mr-5">Action</span>
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
                      <Skeleton className="h-6 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-40 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : agents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-gray-400"
                  >
                    No agents found.
                  </TableCell>
                </TableRow>
              ) : (
                agents.map((agent) => (
                  <TableRow
                    key={agent._id}
                    className="border-b border-[#B6B6B633] hover:bg-gray-750"
                  >
                    <TableCell className="text-gray-200 px-4 py-4">
                      {agent.fullName}
                    </TableCell>
                    <TableCell className="text-gray-200 px-4 py-4">
                      {agent.email}
                    </TableCell>
                    <TableCell className="text-gray-200 px-4 py-4">
                      {agent.phoneNumber}
                    </TableCell>
                    <TableCell className="px-4 py-4">{agent.country}</TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        {/* <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(agent._id)}
                          className="p-1 h-auto hover:text-white hover:bg-gray-600 transition-colors"
                        >
                          <Edit size={16} />
                        </Button> */}
                        <UpdateAgentModal agentId={agent._id}/>
                        
                        {/* <AgentModal agentId={agent._id} /> */}
                        <RequestAgentModal agentId={agent._id} />

                        {/* ✅ Delete button */}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(agent._id)}
                          className="p-1 h-auto text-red-700 hover:text-white hover:bg-gray-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </Button>

                        {/* ✅ Status buttons */}
                        {agent.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              disabled={updateStatusMutation.isPending}
                              className="px-3 py-1 bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
                              onClick={() =>
                                handleStatusUpdate(agent._id, "accepted")
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              disabled={updateStatusMutation.isPending}
                              className="px-3 py-1 bg-red-600 text-white hover:bg-red-700 transition-colors"
                              onClick={() =>
                                handleStatusUpdate(agent._id, "rejected")
                              }
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {agent.status === "accepted" && (
                          <CircleCheckBig className="text-cyan-500 w-6 h-6" />
                        )}
                        {agent.status === "rejected" && (
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

        {/* ✅ Pagination */}
        {meta.total > itemsPerPage && (
          <div className="flex items-center justify-between p-6 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Showing {startItem} to {endItem} of {meta.total} results
            </div>
            <div className="flex items-center gap-1">
              {renderPaginationButtons()}
            </div>
          </div>
        )}
      </div>

      {/* ✅ Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        loading={deleteAgentMutation.isPending}
      />
    </div>
  );
}

export default AgentsList;
