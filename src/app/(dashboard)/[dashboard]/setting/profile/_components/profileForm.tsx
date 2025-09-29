"use client"

import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Pencil } from "lucide-react"
import { useAvatarMutation } from "@/hooks/apiCalling"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const formSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    jobTtile: z.string().min(1, "Job title is required"),
    bio: z.string(),
    phoneNumber: z.string().min(1, "Phone number is required"),
    location: z.string().min(1, "Location is required"),
})

export default function ProfileForm() {
    const { data: session } = useSession()
    const token = (session?.user as { accessToken: string })?.accessToken

    const [imageFile, setImageFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const avatarMutation = useAvatarMutation(token, setImageFile)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            jobTtile: "",
            bio: "",
            phoneNumber: "",
            location: "",
        },
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
        }
    }

    const handleUpload = () => {
        if (imageFile) {
            avatarMutation.mutate(imageFile)
        } else {
            toast.error("Please select an image first")
        }
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values)
            toast(
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(values, null, 2)}</code>
                </pre>
            )
        } catch (error) {
            console.error("Form submission error", error)
            toast.error("Failed to submit the form. Please try again.")
        }
    }

    return (
        <div className="border py-7 px-[30px] border-[#1F2937] rounded-lg bg-[#1A1A1A]">
            <p className="font-bold text-[19px]">Profile Settings</p>

            <div className="flex gap-10 py-10">
                {/* Avatar Upload Section */}
                <div className="my-5 flex flex-col items-center gap-4">
                    <div className="relative">
                        <Avatar
                            className="h-32 w-32 text-black cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imageFile ? (
                                <AvatarImage src={URL.createObjectURL(imageFile)} alt="Preview" />
                            ) : (
                                <AvatarFallback>PR</AvatarFallback>
                            )}
                        </Avatar>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-2 right-0 h-8 w-8 rounded-full border-2 border-white bg-[#7DD3DD] flex items-center justify-center cursor-pointer"
                        >
                            <Pencil size={20} className="text-[#F8F9FA]" />
                        </div>
                    </div>

                    <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    {imageFile && (
                        <Button type="button" onClick={handleUpload}>
                            Upload
                        </Button>
                    )}
                </div>

                {/* Profile Info Form */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 w-full mx-auto py-5"
                    >
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-6">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="First Name"
                                                    className="py-3 bg-[#252525] border-[#252525]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-6">
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Last Name"
                                                    className="py-3 bg-[#252525] border-[#252525]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Email Address"
                                            className="py-3 bg-[#252525] border-[#252525]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="jobTtile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Job Title"
                                            className="py-3 bg-[#252525] border-[#252525]"
                                            {...field}
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
                                        <Textarea
                                            rows={5}
                                            placeholder="Administrator at Next Level MCN, managing creator partnerships and brand deals."
                                            className="py-3 bg-[#252525] border-[#252525]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-6">
                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Phone Number"
                                                    className="py-3 bg-[#252525] border-[#252525]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-6">
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Location"
                                                    className="py-3 bg-[#252525] border-[#252525]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="bg-[linear-gradient(135deg,#7DD3DD_0%,#89CFF0_50%,#A7C8F7_100%)] text-[#131313]"
                        >
                            Save Changes
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
