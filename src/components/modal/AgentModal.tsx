"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

export function AgentModal({ agentId }: { agentId?: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["agent", agentId],
    queryFn: async () => {
      if (!agentId) return null;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/agent/${agentId}`
      );
      if (!res.ok) throw new Error("Failed to fetch agent data");
      return res.json();
    },
    enabled: !!agentId, // only fetch if agentId exists
  });

  const agent = data?.data;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-auto text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
        >
          <Eye size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#131313] border-gray-700 text-white max-w-2xl p-0 gap-0">
        <div className="p-7 space-y-4">
          {isLoading ? (
            <p className="text-gray-400">Loading...</p>
          ) : error ? (
            <p className="text-red-500">Failed to load agent data.</p>
          ) : agent ? (
            <div className="flex gap-10">
              <div className="space-y-2">
                <div>
                  <label className="text-white text-base mr-2">Name:</label>
                  <span className="text-[#929292] text-sm">{agent.fullName}</span>
                </div>
                <div>
                  <label className="text-white text-base mr-2">Email:</label>
                  <span className="text-[#929292] text-sm">{agent.email}</span>
                </div>
                <div>
                  <label className="text-white text-base mr-2">Phone Number:</label>
                  <span className="text-[#929292] text-sm">{agent.phoneNumber}</span>
                </div>
                <div>
                  <label className="text-white text-base mr-2">Country :</label>
                  <span className="text-[#929292] text-sm">{agent.country}</span>
                </div>
                <div>
                  <label className="text-white text-base mr-2">Designation :</label>
                  <span className="text-[#929292] text-sm">{agent.designation}</span>
                </div>
                <div>
                  <label className="text-white text-base mr-2">Brand name :</label>
                  <span className="text-[#929292] text-sm">{agent.brandName}</span>
                </div>
                <div>
                  <label className="text-white text-base mr-2">Working From :</label>
                  <span className="text-[#929292] text-sm">{agent.workingFrom}</span>
                </div>
              </div>
              <div className="w-[138px] h-[89px]">
                <Image
                  width={400}
                  height={400}
                  src={agent.image || "/images/creatorImage.png"}
                  alt={agent.fullName || "Profile"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-400">No agent data available.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
