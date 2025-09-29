"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Eye, Instagram, Youtube, Linkedin } from "lucide-react";
import Image from "next/image";

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
  status: string;
  image: string[];
  createdAt: string;
  updatedAt: string;
  totalFollowers: number;
  tier: string;
}

export function CreatorModal({ createorsId }: { createorsId: string }) {
  const {
    data: singleCreatorResponse,
    isLoading,
    error,
  } = useQuery<{ data: Creator }>({
    queryKey: ["singleCreator", createorsId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/creator/${createorsId}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch creator data");
      }

      return res.json();
    },
    enabled: !!createorsId,
  });

  const singleCreator = singleCreatorResponse?.data;

  if (isLoading) return <div>Loading...</div>;
  if (error || !singleCreator) return <div>Failed to load creator data.</div>;

  const getSocialLink = (platform: string) => {
    return singleCreator.socialMedia.find(
      (sm) => sm.platform.toLowerCase() === platform.toLowerCase()
    )?.link;
  };

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
                <span className="text-[#929292] text-sm">
                  {singleCreator.fullName}
                </span>
              </div>
              <div>
                <label className="text-white text-base mr-2">Email:</label>
                <span className="text-[#929292] text-sm">{singleCreator.email}</span>
              </div>
              <div>
                <label className="text-white text-base mr-2">Phone Number:</label>
                <span className="text-[#929292] text-sm">{singleCreator.phoneNumber}</span>
              </div>
              <div>
                <label className="text-white text-base mr-2">Total Followers:</label>
                <span className="text-[#929292] text-sm">{singleCreator.totalFollowers}</span>
              </div>
            </div>
            <div className="w-[138px] h-[89px]">
              <Image
                width={400}
                height={400}
                src={singleCreator.image[0] || "/images/creatorImage.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Social Media Section */}
          <div className="space-y-3">
            <label className="text-white text-base">Social Media:</label>

            {/* YouTube */}
            {getSocialLink("YouTube") && (
              <>
                <div className="flex items-center gap-2">
                  <Youtube size={16} className="text-red-600" />
                  <span className="text-gray-400 text-base">YouTube</span>
                </div>
                <input
                  type="text"
                  value={getSocialLink("YouTube") || ""}
                  readOnly
                  className="w-full bg-[#2A2A2A] border border-gray-600 rounded px-3 py-2 text-sm text-blue-400 focus:outline-none focus:border-gray-500"
                />
              </>
            )}

            {/* Instagram */}
            {getSocialLink("Instagram") && (
              <>
                <div className="flex items-center gap-2 mt-3">
                  <Instagram size={16} className="text-pink-500" />
                  <span className="text-gray-400 text-base">Instagram</span>
                </div>
                <input
                  type="text"
                  value={getSocialLink("Instagram") || ""}
                  readOnly
                  className="w-full bg-[#2A2A2A] border border-gray-600 rounded px-3 py-2 text-sm text-blue-400 focus:outline-none focus:border-gray-500"
                />
              </>
            )}

            {/* LinkedIn */}
            {getSocialLink("LinkedIn") && (
              <>
                <div className="flex items-center gap-2 mt-3">
                  <Linkedin size={16} className="text-blue-500" />
                  <span className="text-gray-400 text-base">LinkedIn</span>
                </div>
                <input
                  type="text"
                  value={getSocialLink("LinkedIn") || ""}
                  readOnly
                  className="w-full bg-[#2A2A2A] border border-gray-600 rounded px-3 py-2 text-sm text-blue-400 focus:outline-none focus:border-gray-500"
                />
              </>
            )}
          </div>

          {/* Bio Section */}
          <div className="space-y-2">
            <label className="text-gray-400 text-base">Bio:</label>
            <div className="bg-[#2A2A2A] border border-gray-600 rounded p-3">
              <p className="text-gray-300 text-[18px] leading-[150%]">{singleCreator.bio}</p>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <label className="text-gray-400 text-base">Description:</label>
            <div className="bg-[#2A2A2A] border border-gray-600 rounded p-3">
              <p className="text-gray-300 text-[18px] leading-[150%]">
                {singleCreator.description}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
