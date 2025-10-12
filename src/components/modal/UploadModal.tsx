/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { X, Video, Download } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// ✅ Validation: either video file OR URL, not both
const formSchema = z
  .object({
    videoUrl: z.string().optional(),
    video: z.any().optional(),
  })
  .refine(
    (data) => (data.video && !data.videoUrl) || (!data.video && data.videoUrl),
    {
      message: "Provide either a video file or a URL, not both",
      path: ["videoUrl"],
    }
  );

type FormData = z.infer<typeof formSchema>;

export function UploadModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const { data: session } = useSession();
  const token = (session?.user as { accessToken: string })?.accessToken;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: "",
      video: undefined,
    },
  });

  const queryClient = useQueryClient();

  // ✅ TanStack Query Mutation
  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();
      if (data.video) formData.append("video", data.video);
      if (data.videoUrl) formData.append("videoUrl", data.videoUrl);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/event/create`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    onSuccess: () => {
      // Invalidate media query to refetch updated data
      queryClient.invalidateQueries({queryKey: ['media']});
      setIsOpen(false);
      form.reset();
      setSelectedVideo(null);
    },
    onError: (error) => {
      console.error("Upload error:", error);
    },
  });

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedVideo(file);
      form.setValue("video", file);
      // Clear URL if file is selected
      form.setValue("videoUrl", "");
    }
  };

  const onSubmit = (data: FormData) => {
    uploadMutation.mutate(data);
  };

  const handleClose = () => {
    setIsOpen(false);
    form.reset();
    setSelectedVideo(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 !bg-[#90CFF2] text-[#131313] font-medium text-base h-[48px]">
          <Download className="w-4 h-4" />
          Upload Video 
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#131313] border-gray-700 text-white max-w-md p-0 gap-0">
        <div className="flex justify-end p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-6 pb-6 -mt-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Video URL */}
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-sm font-normal">
                      Video URL:
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="URL..."
                        {...field}
                        disabled={!!selectedVideo}
                        className="bg-[#2a2a2a] border-[#404040] text-white placeholder:text-gray-500 focus:border-[#7DD3DD] focus:ring-[#7DD3DD] h-10"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Video Upload */}
              <FormField
                control={form.control}
                name="video"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-white text-sm font-normal">
                      Video:
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          id="video-upload"
                        />
                        <div className="border-2 border-dashed border-gray-600 rounded-lg py-16 px-8 text-center  hover:border-[#7DD3DD] transition-colors">
                          <div className="flex flex-col items-center gap-4">
                            <div className="p-3 rounded-lg bg-[#3a3a3a]">
                              <Video size={24} className="text-gray-400" />
                            </div>
                            {selectedVideo ? (
                              <p className="text-sm text-gray-300">
                                Selected: {selectedVideo.name}
                              </p>
                            ) : (
                              <p className="text-sm text-gray-400">
                                Click to upload video or drag and drop
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-[#7DD3DD] hover:bg-[#6bc2cc] text-black font-medium py-2.5 h-auto rounded-md"
                  disabled={form.formState.isSubmitting || uploadMutation.isPending}
                >
                  {form.formState.isSubmitting || uploadMutation.isPending
                    ? "Uploading..."
                    : "Done"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
