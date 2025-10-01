"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Facebook, Instagram } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

interface Agent {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  country: string;
  designation: string;
  brandName: string;
  workingFrom: string;
  status: string;
  image: string;
}

interface RequestAgentModalProps {
  agentId: string;
}

export function RequestAgentModal({ agentId }: RequestAgentModalProps) {
  const { data: response, isLoading, error } = useQuery<{
    data: Agent;
  }>({
    queryKey: ["singleAgent", agentId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/agent/${agentId}`
      );
      if (!res.ok) throw new Error("Failed to fetch agent data");
      return res.json();
    },
    enabled: !!agentId,
  });

  const agent = response?.data;

  if (isLoading) return <div>Loading...</div>;
  if (error || !agent) return <div>Failed to load agent data.</div>;

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

      <DialogContent className="bg-[#131313] border-gray-700 text-white max-w-4xl p-0 gap-0">
        <div className="p-7 space-y-4">
          {/* Profile Section */}
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
                <label className="text-white text-base mr-2">Country:</label>
                <span className="text-[#929292] text-sm">{agent.country}</span>
              </div>
              <div>
                <label className="text-white text-base mr-2">Designation:</label>
                <span className="text-[#929292] text-sm">{agent.designation}</span>
              </div>
              <div>
                <label className="text-white text-base mr-2">Brand Name:</label>
                <span className="text-[#929292] text-sm">{agent.brandName}</span>
              </div>
              <div>
                <label className="text-white text-base mr-2">Working From:</label>
                <span className="text-[#929292] text-sm">{agent.workingFrom}</span>
              </div>
            </div>
            <div className="w-[138px] h-[89px]">
              <Image
                width={400}
                height={400}
                src={agent.image || "/images/creatorImage.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Social Media Section */}
          <div className="space-y-3">
            <label className="text-white text-base">Social Media:</label>

            <div className="flex items-center gap-2">
              <Facebook size={16} className="text-blue-500" />
              <span className="text-gray-400 text-base">Facebook</span>
            </div>
            <input
              type="text"
              value="http://www.facebook.com"
              readOnly
              className="w-full bg-[#2A2A2A] border border-gray-600 rounded px-3 py-2 text-sm text-blue-400 focus:outline-none focus:border-gray-500"
            />

            <div className="flex items-center gap-2 mt-3">
              <Instagram size={16} className="text-pink-500" />
              <span className="text-gray-400 text-base">Instagram</span>
            </div>
            <input
              type="text"
              value="https://www.instagram.com"
              readOnly
              className="w-full bg-[#2A2A2A] border border-gray-600 rounded px-3 py-2 text-sm text-blue-400 focus:outline-none focus:border-gray-500"
            />
          </div>

          {/* Bio Section */}
          <div className="space-y-2">
            <label className="text-gray-400 text-base">Bio:</label>
            <div className="bg-[#2A2A2A] border border-gray-600 rounded p-3">
              <p className="text-gray-300 text-[18px] leading-[150%]">
                {/* You can replace this with a dynamic bio if API has it */}
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry
                s standard dummy
                text ever since the 1500s.
              </p>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <label className="text-gray-400 text-base">Description:</label>
            <div className="bg-[#2A2A2A] border border-gray-600 rounded p-3">
              <p className="text-gray-300 text-[18px] leading-[150%]">
                {/* You can replace this with a dynamic description if API has it */}
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industrys standard dummy
                text ever since the 1500s.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
