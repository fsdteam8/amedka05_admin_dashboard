import AuthLayoutDesign from "@/components/AuthLayout";
import React from "react";
import ForgotPasswordForm from "./_components/forgot-password-form";

const Page = () => {
  return (
    <div className="bg-[#131313]">
      <AuthLayoutDesign>
        <ForgotPasswordForm />
      </AuthLayoutDesign>
    </div>
  );
};

export default Page;