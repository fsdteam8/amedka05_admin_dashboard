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
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { useSession } from "next-auth/react";

// ✅ Validation Schema
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

type UpdateTripModalProps = {
  trip: string; // just ID
};

export function UpdateTripModal({ trip }: UpdateTripModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = (session?.user as { accessToken: string })?.accessToken;

  // ✅ Fetch single trip
  const { data: singleTrip, isLoading } = useQuery({
    queryKey: ["trip", trip],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/trip/${trip}`
      );
      if (!res.ok) throw new Error("Failed to fetch trip");
      return res.json();
    },
  });

  // ✅ Setup form
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

  // ✅ Reset form after fetch
  useEffect(() => {
    if (singleTrip?.data && isOpen) {
      form.reset({
        countryName: singleTrip.data.country ?? "",
        location: singleTrip.data.location ?? "",
        startDate: singleTrip.data.startDate
          ? singleTrip.data.startDate.split("T")[0]
          : "",
        endDate: singleTrip.data.endDate
          ? singleTrip.data.endDate.split("T")[0]
          : "",
        availableSeats: singleTrip.data.participants?.toString() ?? "",
        image: undefined,
      });
    }
  }, [singleTrip, isOpen, form]);

  // ✅ Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      form.setValue("image", file);
    }
  };

  // ✅ Update mutation
  const updateTripMutation = useMutation({
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

      if (values.image) formData.append("image", values.image);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/trip/${trip}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Failed to update trip");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Trip updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      setIsOpen(false);
      form.reset();
      setSelectedImage(null);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update trip");
    },
  });

  const onSubmit = (data: FormData) => {
    updateTripMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-auto text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
        >
          <Edit size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#131313] border-gray-600 text-white max-w-xl py-7 px-3 gap-0">
        <div className="px-6 pb-6">
          {isLoading ? (
            <p className="text-gray-400">Loading trip details...</p>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                            min={new Date().toISOString().split("T")[0]}
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
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">
                        Image:
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
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
                              ) : singleTrip?.data?.image ? (
                                <>
                                  <Image
                                    width={400}
                                    height={400}
                                    src={singleTrip.data.image}
                                    alt="Current"
                                    className="w-32 h-32 object-cover rounded-lg border border-gray-600"
                                  />
                                  <p className="text-sm text-gray-300">
                                    Current image
                                  </p>
                                </>
                              ) : (
                                <p className="text-gray-400">
                                  Click to upload image
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

                {/* Submit */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-[#7DD3DD] hover:bg-cyan-600 text-white font-medium py-2"
                    disabled={updateTripMutation.isPending}
                  >
                    {updateTripMutation.isPending
                      ? "Updating..."
                      : "Update Trip"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
