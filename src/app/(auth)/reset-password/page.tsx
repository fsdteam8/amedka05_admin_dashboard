import AuthLayoutDesign from "@/components/AuthLayout";
import React, { Suspense } from "react";
import ResetPasswordForm from "./_components/reset-password-form";


const Page = () => {
    return (
        <div className="bg-[#131313]">
            <AuthLayoutDesign>
                <Suspense fallback={<div>Loading...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </AuthLayoutDesign>
        </div>
    );
};

export default Page;