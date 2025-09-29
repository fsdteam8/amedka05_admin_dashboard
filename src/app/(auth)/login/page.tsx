
import AuthLayoutDesign from "@/components/AuthLayout";
import React from "react";
import LoginForm from "../_components/loginBody";

const Page = () => {
  return (
    <div className="bg-[#131313]">
      <AuthLayoutDesign>
        <LoginForm />
      </AuthLayoutDesign>
    </div>
  );
};

export default Page;