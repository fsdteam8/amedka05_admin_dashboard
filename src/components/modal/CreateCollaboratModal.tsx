/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useCreatetPartnership,
  useSingelGetPartnership,
  useUpdatePartnership,
} from "@/hooks/apiCalling";
import { useSession } from "next-auth/react";
import Image from "next/image";

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function CreateCollaboratModal({
  isOpen,
  setIsOpen,
  id,
  add
}: {
  id: string;
  isOpen: boolean;
  add: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { data: session } = useSession();
  const token = (session?.user as { accessToken: string })?.accessToken;
  const createPartnership = useCreatetPartnership(token, setIsOpen);
  const singelPartnership = useSingelGetPartnership(token, id);
  const updatePartnership = useUpdatePartnership(token, id, setIsOpen);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      image: undefined,
    },
  });

  // useEffect(() => {
  //   if (singelPartnership?.data?.data) {
  //     const existing = singelPartnership.data.data;
  //     form.reset({
  //       title: existing.title,
  //       description: existing.description,
  //       image: existing.image,
  //     });
  //     // set preview to existing image if present
  //     if (existing.image) {
  //       setPreviewUrl(existing.image);
  //     }
  //   }
  // }, [singelPartnership.data, form]);

  useEffect(() => {
  if (!isOpen) {
    // reset when modal closes
    form.reset({
      title: "",
      description: "",
      image: undefined,
    });
    setPreviewUrl(null);
    return;
  }

  // when modal opens
  if (!add && id && singelPartnership?.data?.data) {
    // Edit mode
    const existing = singelPartnership.data.data;
    form.reset({
      title: existing.title,
      description: existing.description,
      image: undefined, // file uploads should always reset
    });
    setPreviewUrl(existing.image || null);
  }

  if (add) {
    // Add mode
    form.reset({
      title: "",
      description: "",
      image: undefined,
    });
    setPreviewUrl(null);
  }
}, [isOpen, add, id, singelPartnership?.data, form]);


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file)); // show preview immediately
      form.setValue("image", file);
    }
  };

  const onSubmit = (data: FormData) => {
    if (id) {
      updatePartnership.mutate(data);
      console.log("Update partnership", data);
    } else {
      createPartnership.mutate(data);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#1a1a1a] border-[#404040] text-white max-w-lg p-0 gap-0 rounded-lg">
        {/* Form Content */}
        <div className="px-6 pb-6 mt-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-sm font-normal">
                      Title :
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Write Name..."
                        {...field}
                        className="bg-[#2a2a2a] border-[#404040] text-white placeholder:text-gray-500 focus:border-[#7DD3DD] focus:ring-[#7DD3DD] h-11 rounded-md"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-sm font-normal">
                      Description :
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write Here..."
                        {...field}
                        className="bg-[#2a2a2a] border-[#404040] text-white placeholder:text-gray-500 focus:border-[#7DD3DD] focus:ring-[#7DD3DD] min-h-[80px] resize-none rounded-md"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-white text-sm font-normal">
                      Image:
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          id="image-upload"
                        />
                        <div className="border-2 border-dashed border-gray-600 rounded-lg py-6 px-4 text-center bg-transparent hover:border-[#7DD3DD] transition-colors">
                          <div className="flex flex-col items-center gap-4">
                            {previewUrl ? (
                              <Image
                                src={previewUrl}
                                alt="Preview"
                                width={200}
                                height={200}
                                className="rounded-md object-cover max-h-48"
                              />
                            ) : (
                              <>
                                <ImageIcon
                                  size={28}
                                  className="text-gray-500"
                                />
                                <p className="text-sm text-gray-500">
                                  Click to upload image or drag and drop
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-[#7DD3DD] hover:bg-[#6bc2cc] text-black font-medium py-3 h-auto rounded-md"
                  disabled={createPartnership.isPending || updatePartnership.isPending}
                >
                  Done{" "}
                  {createPartnership.isPending || updatePartnership.isPending && (
                    <Loader2 className="animate-spin ml-2" />
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
