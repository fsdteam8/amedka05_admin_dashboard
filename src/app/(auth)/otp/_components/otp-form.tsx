"use client";

import {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useForgetPassword, useVerifyOtp } from "@/hooks/apiCalling";
import { Loader2 } from "lucide-react";

export default function OtpForm() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const veryfyOtpMutation = useVerifyOtp();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const forgetPasswordMutation = useForgetPassword();
  const decodedEmail = decodeURIComponent(email || "");

  // Focus the first input on component mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {

    if (!/^\d*$/.test(value)) return;


    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);

    setOtp(newOtp);

    // Auto-focus next input if value is entered
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle arrow keys for navigation
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };



  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Check if pasted content is a valid 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);

      // Focus the last input
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  // handle resend otp
  const handleResendOtp = async () => {
    forgetPasswordMutation.mutate(decodedEmail);
  };

  // handle verify otp
  const handleVerify = async () => {
    const payload = {
      email: decodedEmail,
      otp: otp.join(""),
    };
    veryfyOtpMutation.mutate(payload);
  };

  return (
    <div className="w-full md:w-[547px] p-3 md:p-7 lg:p-8 rounded-[16px] ">
      <h3 className="text-2xl md:text-[28px] lg:text-[32px] font-bold text-[#7DD3DD]  leading-[120%] pb-2">
        Enter OTP
      </h3>
      <p className="text-base font-normal text-[#787878] leading-[150%] ">
        Enter OTP to verify your email address
      </p>
      <div className="pt-5 md:pt-6">
        {/* OTP Input Fields */}
        <div className="flex gap-[14px] md:gap-[18px] w-full justify-center">
          {otp.map((digit, index) => (
            <Input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              className={`font-poppins w-[47px] md:w-[52px] h-[58px] bg-transparent text-primary placeholder:text-[#999999] text-center text-2xl font-medium leading-[120%] border-[1px] rounded-md focus:outline-none ${digit ? "border-[#7DD3DD]" : "border-[#595959]"
                }`}
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        {/* Resend OTP */}
        <div className="text-center my-6">
          <span className="text-base font-medium leading-[120%] text-[#B6B6B6] tracking-[0%]">
            Didn&apos;t Receive OTP?{" "}
          </span>
          <button
            onClick={handleResendOtp}
            disabled={forgetPasswordMutation.isPending}
            className="text-base font-medium leading-[120%] text-[#7DD3DD] tracking-[0%] hover:underline"
          >
            {forgetPasswordMutation.isPending ? "Resending..." : "Resend  code"}
          </button>
        </div>

        {/* Verify Button */}
        <Button
          disabled={veryfyOtpMutation.isPending}
          onClick={handleVerify}
          className="flex items-center justify-center gap-2 text-base font-medium text-[#131313] leading-[120%] rounded-[8px] w-full h-[48px] bg-[linear-gradient(135deg,#7DD3DD_0%,#89CFF0_50%,#A7C8F7_100%)] "

          type="submit"
        >
          Verify {veryfyOtpMutation.isPending && <Loader2 className="animate-spin" />}
        </Button>
      </div>
    </div>
  );
}