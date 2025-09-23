"use client";

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

type PageHeaderProps = {
  title?: string;
  breadcrumb?: string;
  btnText?: string;
  btnLink?: string;
  icon?: React.ElementType;
};

export default function PageHeader({
  title = "Categories",
  breadcrumb = "Dashboard > Categories",
  btnText,
  btnLink,
  icon: Icon,
}: PageHeaderProps) {
  return (
    <header className="w-full text-gray-800 flex items-center justify-between">
      <div className="space-y-3">
        <p className="text-[24px] font-semibold leading-[120%] text-[#FFFFFF]">{title}</p>
        <p className="text-[16px] font-normal leading-[120%] text-[#E7E7E7] ">{breadcrumb}</p>
      </div>

      {btnLink && btnText && (
        <Link href={btnLink}>
          <Button className="flex items-center gap-x-2 bg-red-600 text-base leading-[120%] font-medium hover:bg-red-700 text-white px-8 h-[52px] rounded-md">
            {Icon && <Icon className="w-5 h-5" />}
            {btnText}
          </Button>
        </Link>
      )}
    </header>
  );
}
