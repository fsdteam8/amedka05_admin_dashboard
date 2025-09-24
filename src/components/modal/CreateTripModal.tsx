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
import { Plus, X, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Form validation schema
const formSchema = z.object({
  countryName: z.string().min(1, "Country name is required"),
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  availableSeats: z
    .string()
    .min(1, "Available seats is required")
    .regex(/^\d+$/, "Must be a number"),
  image: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function CreateTripModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

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
          Create New Trip
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#131313] border-gray-600 text-white max-w-xl py-7 px-3 gap-0">
        {/* Form Content */}
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
                    <FormLabel className="text-white text-sm">
                      Location:
                    </FormLabel>
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
                          className="bg-[#3A3A3A] border-[#4A4A4A] text-white placeholder:text-gray-400 focus:border-[#7DD3DD] focus:ring-[#7DD3DD] [&::-webkit-calendar-picker-indicator]:invert"
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
                          className="bg-[#3A3A3A] border-[#4A4A4A] text-white placeholder:text-gray-400 focus:border-[#7DD3DD] focus:ring-[#7DD3DD] [&::-webkit-calendar-picker-indicator]:invert"
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
                    <FormLabel className="text-white text-sm">
                      Available Seats:
                    </FormLabel>
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

              {/* Image Upload */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
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
                            <ImageIcon size={40} className="text-gray-400" />
                            {selectedImage ? (
                              <p className="text-sm text-gray-300">
                                Selected: {selectedImage.name}
                              </p>
                            ) : (
                              <p className="text-sm text-gray-400">
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
                  className="w-full bg-[#7DD3DD] hover:bg-cyan-600 text-white font-medium py-2"
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
