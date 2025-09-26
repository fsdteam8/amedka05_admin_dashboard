"use client"
import {
    toast
} from "sonner"
import {
    useForm
} from "react-hook-form"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import {
    z
} from "zod"

import {
    Button
} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Input
} from "@/components/ui/input"
import {
    Textarea
} from "@/components/ui/textarea"
import { useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil } from "lucide-react"

const formSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string(),
    jobTtile: z.string().min(1),
    bio: z.string(),
    phoneNumber: z.string().min(1),
    location: z.string().min(1)
});

export default function ProfileForm() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
        }
    }

    // handle upload button
    const handleUpload = () => {
        if (imageFile) {
            console.log("Uploading file:", imageFile)
        }
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);
            toast(
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(values, null, 2)}</code>
                </pre>
            );
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    return (
        <div className="border py-7 px-[30px] border-[#1F2937] rounded-lg bg-[#1A1A1A]">
            <p className="text  font-bold text-[19px]">Profile Settings</p>
            <div className="flex gap-10 py-10 ">
                <div className="my-5 flex  flex-col items-center gap-4 ">
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
                        <div  onClick={() => fileInputRef.current?.click()} className="absolute bottom-2 border-2 border-white right-0 bg-[#7DD3DD] h-8 w-8 rounded-full flex items-center justify-center cursor-pointer">
                            <Pencil  size={20} className="text-[#F8F9FA]  " />
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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full   mx-auto py-5">

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
                                                    className="py-3 bg-[#252525] border-[#252525]"
                                                    placeholder="First Name"
                                                    type=""
                                                    {...field} />
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
                                                    type=""
                                                    {...field} />
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
                                            placeholder="Email Address"
                                            className="py-3 bg-[#252525] border-[#252525]"
                                            type="email"
                                            {...field} />
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
                                            type=""
                                            {...field} />
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
                                                    type=""
                                                    {...field} />
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
                                                    type=""
                                                    {...field} />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" className="bg-[linear-gradient(135deg,#7DD3DD_0%,#89CFF0_50%,#A7C8F7_100%)] text-[#131313]" >Save Changes</Button>
                        </div>
                    </form>
                </Form>
            </div>

        </div>
    )
}