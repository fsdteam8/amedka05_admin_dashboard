"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { X, Video, Edit } from "lucide-react";

interface EditTripModalProps {
  eventId: string;
}

export function EditTripModal({ eventId }: EditTripModalProps) {
  // Fetch single event by ID
  const { data: singleMedia, isLoading } = useQuery({
    queryKey: ["singleMedia", eventId],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/event/${eventId}`);
      if (!res.ok) throw new Error("Failed to fetch event");
      const data = await res.json();
      return data.data; // the "data" field from your API response
    },
    enabled: !!eventId, // only fetch if eventId exists
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-auto text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
        >
          <Edit size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#131313] border-gray-700 text-white max-w-md p-0 gap-0">
        {/* Close Button */}
        <div className="flex justify-end p-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-6 pb-6 -mt-3 space-y-6">
          {/* Video URL */}
          <div className="space-y-2">
            <label className="text-white text-sm font-normal">Video URL:</label>
            <Input
              placeholder="URL..."
              className="bg-[#2a2a2a] border-[#404040] text-white placeholder:text-gray-500 focus:border-[#7DD3DD] focus:ring-[#7DD3DD] h-10"
              value={isLoading ? "Loading..." : singleMedia?.url || ""}
              readOnly={isLoading} // prevent editing while loading
            />
            <p className="text-red-400 text-xs invisible">Error message</p>
          </div>

          {/* Video Upload */}
          <div className="space-y-2">
            <label className="text-white text-sm font-normal">Video:</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg py-16 px-8 text-center hover:border-[#7DD3DD] transition-colors relative">
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 rounded-lg bg-[#3a3a3a]">
                  <Video size={24} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-400">
                  Click to upload video or drag and drop
                </p>
              </div>
            </div>
            <p className="text-red-400 text-xs invisible">Error message</p>
          </div>

          {/* Submit Button */}
          <Button className="w-full bg-[#7DD3DD] hover:bg-[#6bc2cc] text-black font-medium py-2.5 h-auto rounded-md">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
