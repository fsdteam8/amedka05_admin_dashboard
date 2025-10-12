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
import { Plus, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { useSession } from "next-auth/react";

// ✅ Validation Schema with refinements
const formSchema = z
  .object({
    countryName: z.string().min(1, "Country name is required"),
    location: z.string().min(1, "Location is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    availableSeats: z
      .string()
      .min(1, "Available seats is required")
      .regex(/^\d+$/, "Must be a number"),
    image: z.any().optional(),
  })
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // normalize
      const start = new Date(data.startDate);
      return start >= today;
    },
    {
      message: "Start date cannot be in the past",
      path: ["startDate"],
    }
  )
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

type FormData = z.infer<typeof formSchema>;

export function CreateTripModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = (session?.user as { accessToken: string })?.accessToken;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      countryName: "",
      location: "",
      startDate: "",
      endDate: "",
      availableSeats: "",
      image: undefined,
    },
  });

  const addTripMutation = useMutation({
    mutationFn: async (values: FormData) => {
      const formData = new FormData();

      const dataPayload = {
        country: values.countryName,
        location: values.location,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        participants: Number(values.availableSeats),
      };

      formData.append("data", JSON.stringify(dataPayload));

      if (values.image) {
        formData.append("image", values.image);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/trip/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to create trip");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Trip created successfully!");
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      setIsOpen(false);
      form.reset();
      if (selectedImage) {
        URL.revokeObjectURL(URL.createObjectURL(selectedImage)); // cleanup
      }
      setSelectedImage(null);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create trip");
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
    addTripMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 !bg-[#90CFF2] text-[#131313] font-medium text-base h-[48px]">
          <Plus className="w-4 h-4" />
          Create New Trip 
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#131313] border-gray-600 text-white max-w-xl py-7 px-3 gap-0">
        <div className="px-6 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Country Name */}
              <FormField
                control={form.control}
                name="countryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-sm">
                      Country Name :
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Write Name..."
                        {...field}
                        className="bg-[#3A3A3A] border-[#4A4A4A] text-white placeholder:text-gray-400 focus:border-[#7DD3DD] focus:ring-[#7DD3DD]"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-sm">Location:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Write Here..."
                        {...field}
                        className="bg-[#3A3A3A] border-[#4A4A4A] text-white placeholder:text-gray-400 focus:border-[#7DD3DD] focus:ring-[#7DD3DD]"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">
                        Start Date:
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          min={new Date().toISOString().split("T")[0]} // block past days
                          className="bg-[#3A3A3A] border-[#4A4A4A] text-white focus:border-[#7DD3DD] focus:ring-[#7DD3DD] [&::-webkit-calendar-picker-indicator]:invert"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">
                        End Date:
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="bg-[#3A3A3A] border-[#4A4A4A] text-white focus:border-[#7DD3DD] focus:ring-[#7DD3DD] [&::-webkit-calendar-picker-indicator]:invert"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Available Seats */}
              <FormField
                control={form.control}
                name="availableSeats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-sm">Available Seats:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Write Here..."
                        {...field}
                        className="bg-[#3A3A3A] border-[#4A4A4A] text-white placeholder:text-gray-400 focus:border-[#7DD3DD] focus:ring-[#7DD3DD]"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Image Upload with Preview */}
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-white text-sm">Image:</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          id="image-upload"
                        />
                        <div className="border-2 border-dashed border-gray-500 rounded-lg p-12 text-center bg-[#3A3A3A] hover:border-[#7DD3DD] transition-colors">
                          <div className="flex flex-col items-center gap-3">
                            {selectedImage ? (
                              <>
                                <Image
                                  width={400}
                                  height={400}
                                  src={URL.createObjectURL(selectedImage)}
                                  alt="Preview"
                                  className="w-32 h-32 object-cover rounded-lg border border-gray-600"
                                />
                                <p className="text-sm text-gray-300">
                                  Selected: {selectedImage.name}
                                </p>
                              </>
                            ) : (
                              <>
                                <ImageIcon size={40} className="text-gray-400" />
                                <p className="text-sm text-gray-400">
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
                  className="w-full bg-[#7DD3DD] hover:bg-cyan-600 text-white font-medium py-2"
                  disabled={addTripMutation.isPending}
                >
                  {addTripMutation.isPending ? "Creating..." : "Done"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
