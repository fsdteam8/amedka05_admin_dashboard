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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";

// ✅ Updated formSchema: email now ignores spaces
const formSchema = z.object({
  email: z
    .string()
    .email({
      message: "Please enter a valid email address.",
    })
    .transform((val) => val.trim()), // 🔹 Removes leading/trailing spaces
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
  rememberMe: z.boolean(),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const res = await signIn("credentials", {
        email: values?.email,
        password: values?.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Login successful!");
      document.location.href = "/";
    } catch (error) {
      console.error("Login failed:", error);
      toast.error((error as Error).message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="w-full md:w-[547px] p-3 md:p-7 lg:p-8 rounded-[16px]">
        <h3 className="text-2xl md:text-[28px] lg:text-[40px] font-semibold text-[#7DD3DD]  leading-[120%] ">
          Welcome Back
        </h3>
        <p className="text-[16px] font-normal text-[#6C757D] leading-[120%] pt-2 mb-6 ">
          Sign in to oversee accounts, listings, and updates
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pt-5 md:pt-6"
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
                      className="w-full h-[48px] text-base font-normal leading-[120%] text-white rounded-[8px] p-4 border bg-transparent border-[#C0C3C1] placeholder:text-[#6C757D]"
                      placeholder="Enter your email ...."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1 text-base font-medium leading-[120%] text-[#C0C3C1] pb-2">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="w-full h-[48px] text-base font-normal leading-[120%] text-white rounded-[8px] p-4 border bg-transparent border-[#C0C3C1] placeholder:text-[#6C757D]"
                        placeholder="Enter Password ...."
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute top-3 right-3.5 "
                      >
                        {showPassword ? (
                          <Eye className=" " onClick={() => setShowPassword(!showPassword)} />
                        ) : (
                          <EyeOff
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <div className="w-full flex items-center justify-between">
                  <FormItem className="flex items-center gap-[10px]">
                    <FormControl className="mt-2">
                      <Checkbox
                        id="rememberMe"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-primary data-[state=checked]:text-white border-[#B6B6B6]"
                      />
                    </FormControl>
                    <Label
                      className="text-sm font-medium text-[#B6B6B6] leading-[120%] font-manrope"
                      htmlFor="rememberMe"
                    >
                      Remember Me
                    </Label>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                </div>
              )}
            />

            <div>
              <Link
                href="/forget-password"
                className="text-[#7DD3DD] text-base font-medium leading-[120%]"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              disabled={isLoading || !form.watch("rememberMe")}
              className="flex items-center justify-center gap-2 text-base font-medium text-[#F8FAF9] leading-[120%] rounded-[8px] w-full h-[48px] bg-[linear-gradient(135deg,#7DD3DD_0%,#89CFF0_50%,#A7C8F7_100%)] "
              type="submit"
            >
              {isLoading ? (
                <>
                  Login
                  <Loader2 className="h-5 w-5 animate-spin" />
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
