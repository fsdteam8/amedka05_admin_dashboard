"use client"

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
  PasswordInput
} from "@/components/ui/password-input"
import { useChnagePassword } from "@/hooks/apiCalling"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"

const formSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function PasswordForm() {
  const { data: session } = useSession()
  const token = (session?.user as { accessToken: string })?.accessToken
  const changePasswordMutation = useChnagePassword(token);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });



  function onSubmit(values: z.infer<typeof formSchema>) {
    changePasswordMutation.mutate({
      oldPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  }

  return (
    <div className="border py-7 px-[30px] border-[#1F2937] rounded-lg bg-[#1A1A1A]">
      <p className="text  font-bold text-[19px]">Changes Password</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mx-auto py-10">

          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <PasswordInput className="py-3 bg-[#252525] border-[#252525]" placeholder="Current Password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <PasswordInput className="py-3 bg-[#252525] border-[#252525]" placeholder="New Password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New  Password</FormLabel>
                <FormControl>
                  <PasswordInput className="py-3 bg-[#252525] border-[#252525]" placeholder="Confirm New  Password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-[linear-gradient(135deg,#7DD3DD_0%,#89CFF0_50%,#A7C8F7_100%)] text-[#131313]" >Save Changes {changePasswordMutation.isPending && <Loader2 className="animate-spin ml-2" />}</Button>
        </form>
      </Form>
    </div>
  )
}