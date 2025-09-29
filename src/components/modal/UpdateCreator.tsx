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

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(5, { message: "Phone number is too short" }),
  bio: z.string().optional(),
  description: z.string().optional(),
  image: z.any().optional(), // New field for image
});

export function UpdateCreator({ creatorId }: { creatorId: string }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { data: session } = useSession();
  const token = (session?.user as { accessToken: string })?.accessToken;

  // Fetch single creator
  const { data: creatorData, isLoading } = useQuery<{ data: Creator }>({
    queryKey: ["singleCreator", creatorId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/creator/${creatorId}`
      );
      if (!res.ok) throw new Error("Failed to fetch creator data");
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
      bio: "",
      description: "",
      image: null,
    },
  });

  // Reset form when creatorData arrives
  useEffect(() => {
    if (creatorData?.data) {
      form.reset({
        fullName: creatorData.data.fullName,
        email: creatorData.data.email,
        phoneNumber: creatorData.data.phoneNumber,
        bio: creatorData.data.bio,
        description: creatorData.data.description,
        image: null,
      });
      setPreviewImage(creatorData.data.image?.[0] || null);
    }
  }, [creatorData, form]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("bio", values.bio || "");
      formData.append("description", values.description || "");
      if (values.image && values.image[0]) {
        formData.append("image", values.image[0]);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/creator/${creatorId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to update creator");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["creatorsData"] });
      setOpen(false);
      toast.success(data.message || "Creator updated successfully");
    },
    onError: (err) => {
      toast.error((err as Error).message || "Failed to update creator");
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

      <DialogContent className="bg-[#131313] border-gray-700 text-white max-w-4xl p-6 gap-0">
        <h2 className="text-xl font-semibold mb-4">Edit Creator</h2>

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

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Full Name"
                      className="text-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Email"
                      className="text-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Phone Number"
                      className="text-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Bio"
                      className="text-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Description"
                      className="text-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="mt-2"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Updating..." : "Update Creator"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
