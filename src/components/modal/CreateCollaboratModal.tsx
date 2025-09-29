/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import { Plus, X, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function CreateCollaboratModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      image: undefined,
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      form.setValue("image", file);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    console.log("Selected image:", selectedImage);

    // Here you would typically send the data to your API
    // For now, we'll just close the modal
    setIsOpen(false);
    form.reset();
    setSelectedImage(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    form.reset();
    setSelectedImage(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Collaboration
        </Button>
      </DialogTrigger>

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
                render={({ field }) => (
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
                        <div className="border-2 border-dashed border-gray-600 rounded-lg py-20 px-8 text-center bg-transparent hover:border-[#7DD3DD] transition-colors">
                          <div className="flex flex-col items-center gap-4">
                            <div className="p-3 rounded-lg">
                              <ImageIcon size={28} className="text-gray-500" />
                            </div>
                            {selectedImage ? (
                              <p className="text-sm text-gray-300">
                                Selected: {selectedImage.name}
                              </p>
                            ) : (
                              <p className="text-sm text-gray-500">
                                Click to upload image or drag and drop
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

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-[#7DD3DD] hover:bg-[#6bc2cc] text-black font-medium py-3 h-auto rounded-md"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Creating..." : "Done"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}