"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { X, Video, Edit } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface EditTripModalProps {
  eventId: string;
}

export function EditTripModal({ eventId }: EditTripModalProps) {
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch single event by ID
  const { data: singleMedia, isLoading } = useQuery({
    queryKey: ["singleMedia", eventId],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/event/${eventId}`);
      if (!res.ok) throw new Error("Failed to fetch event");
      const data = await res.json();
      return data.data;
    },
    enabled: !!eventId,
  });

  // Populate URL when data loads
  useEffect(() => {
    if (singleMedia?.video) {
      setVideoUrl(singleMedia.video);
    }
  }, [singleMedia]);

  // Handle manual URL change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
  };

  // Handle video file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setVideoUrl(file.name); // show file name in input
    }
  };

  // Handle click on drop area
  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  console.log("single", singleMedia);

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
              value={isLoading ? "Loading..." : videoUrl}
              onChange={handleChange}
              readOnly={isLoading}
            />
          </div>

          {/* Video Upload */}
          <div className="space-y-2">
            <label className="text-white text-sm font-normal">Video:</label>
            <div
              className="border-2 border-dashed border-gray-600 rounded-lg py-16 px-8 text-center hover:border-[#7DD3DD] transition-colors relative cursor-pointer"
              onClick={handleClickUpload}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  setSelectedFile(file);
                  setVideoUrl(file.name);
                }
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                type="file"
                accept="video/*"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 rounded-lg bg-[#3a3a3a]">
                  <Video size={24} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-400">
                  {selectedFile
                    ? `Selected: ${selectedFile.name}`
                    : "Click to upload video or drag and drop"}
                </p>
              </div>
            </div>
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
