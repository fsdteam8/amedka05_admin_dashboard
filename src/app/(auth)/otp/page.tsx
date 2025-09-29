import AuthLayoutDesign from "@/components/AuthLayout";
import React, { Suspense } from "react";
import OtpForm from "./_components/otp-form";


const Page = () => {
    return (
        <div className="bg-[#131313]">
            <AuthLayoutDesign>
                <Suspense fallback={<div>Loading...</div>}>
                    <OtpForm />
                </Suspense>
            </AuthLayoutDesign>
        </div>
    );
};

export default Page;