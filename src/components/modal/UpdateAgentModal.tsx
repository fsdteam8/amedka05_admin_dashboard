"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

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

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(5, { message: "Phone number is too short" }),
  country: z.string().min(2, { message: "Country is required" }),
  designation: z.string().min(2, { message: "Designation is required" }),
  brandName: z.string().min(2, { message: "Brand Name is required" }),
  workingFrom: z.string().min(2, { message: "Working From year is required" }),
  // status: z.string().min(2, { message: "Status is required" }),
  image: z.any().optional(),
});

export function UpdateAgentModal({ agentId }: { agentId: string }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { data: session } = useSession();
  const token = (session?.user as { accessToken: string })?.accessToken;

  // Fetch single agent
  const { data: agentData, isLoading } = useQuery<{ data: Agent }>({
    queryKey: ["singleAgent", agentId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/agent/${agentId}`
      );
      if (!res.ok) throw new Error("Failed to fetch agent data");
      return res.json();
    },
  });

  // Form initialization
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      country: "",
      designation: "",
      brandName: "",
      workingFrom: "",
      // status: "",
      image: null,
    },
  });

  // Reset form when agentData arrives
  useEffect(() => {
    if (agentData?.data) {
      form.reset({
        fullName: agentData.data.fullName,
        email: agentData.data.email,
        phoneNumber: agentData.data.phoneNumber,
        country: agentData.data.country,
        designation: agentData.data.designation,
        brandName: agentData.data.brandName,
        workingFrom: agentData.data.workingFrom,
        // status: agentData.data.status,
        image: null,
      });
      setPreviewImage(agentData.data.image || null);
    }
  }, [agentData, form]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("country", values.country);
      formData.append("designation", values.designation);
      formData.append("brandName", values.brandName);
      formData.append("workingFrom", values.workingFrom);
      // formData.append("status", values.status);

      if (values.image && values.image[0]) {
        formData.append("image", values.image[0]);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/agent/${agentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to update agent");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["agentData"] });
      setOpen(false);
      toast.success(data.message || "Agent updated successfully");
    },
    onError: (err) => {
      toast.error((err as Error).message || "Failed to update agent");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateMutation.mutate(values);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      form.setValue("image", e.target.files);
      const fileReader = new FileReader();
      fileReader.onload = (event) =>
        setPreviewImage(event.target?.result as string);
      fileReader.readAsDataURL(e.target.files[0]);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-auto text-blue-500 hover:text-white hover:bg-gray-600 transition-colors"
        >
          <Edit size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#131313] border-gray-700 text-white max-w-4xl p-6 gap-0 h-[90vh] overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Edit Agent</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Image Upload */}
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-black"
                />
              </FormControl>
              {previewImage && (
                <Image
                  width={300}
                  height={300}
                  src={previewImage}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-md border border-gray-600"
                />
              )}
              <FormMessage />
            </FormItem>

            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Full Name" className="text-black" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Email" className="text-black" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Phone Number" className="text-black" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Country" className="text-black" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Designation */}
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Designation" className="text-black" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Brand Name */}
            <FormField
              control={form.control}
              name="brandName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Brand Name" className="text-black" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Working From */}
            <FormField
              control={form.control}
              name="workingFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Working From</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Year" className="text-black" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-2" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update Agent"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
