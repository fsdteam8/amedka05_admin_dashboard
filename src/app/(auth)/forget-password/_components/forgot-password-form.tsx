"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
;
import { Loader2 } from "lucide-react";
import { useForgetPassword } from "@/hooks/apiCalling";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const ForgotPasswordForm = () => {
  const forgetPasswordMutation = useForgetPassword();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });


  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    forgetPasswordMutation.mutate(values.email);
  }
  return (
    <div>
      <div className="w-full md:w-[547px] p-3 md:p-7 lg:p-8 rounded-[16px] ">
        <h3 className="text-2xl md:text-[28px] lg:text-[40px] font-semibold text-[#7DD3DD]  leading-[120%] ">
          Forgot Password
        </h3>
        <p className="text-base font-normal text-[#787878]  leading-[150%] ">
          Enter your email to recover your password
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pt-5 md:pt-10"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1 text-base font-medium leading-[120%] text-[#C0C3C1] pb-2">
                    Email Address{" "}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-[48px] bg-transparent placeholder:text-[#6C757D] text-base font-medium leading-[120%] text-white rounded-[8px] p-4 border border-[#6C6C6C] "
                      placeholder="Enter your email ...."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button
              disabled={forgetPasswordMutation.isPending}
              className="flex items-center justify-center gap-2 text-base font-medium text-[#131313] leading-[120%] rounded-[8px] w-full h-[48px] bg-[linear-gradient(135deg,#7DD3DD_0%,#89CFF0_50%,#A7C8F7_100%)] "
              type="submit"
            >
              {forgetPasswordMutation.isPending ? (
                <>
                  Send OTP
                  <Loader2 className="h-5 w-5 animate-spin" />
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
            <p className="flex items-center text-white justify-center gap-1 text-sm font-medium leading-[120%] ">
              Back to
              <Link
                href="/login"
                className="text-white pl-1 hover:underline"
              >
                Log In Here Now
              </Link>{" "}
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;