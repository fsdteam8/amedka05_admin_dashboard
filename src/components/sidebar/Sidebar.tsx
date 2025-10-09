"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  DollarSign,
  LogOut,
  ShoppingCart,
  Grip,
  ShoppingBasket,
  Scissors,
  MessageSquare,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { LogoutModal } from "../LogoutModal";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Creators Management", href: "/dashboard/creators_management", icon: LayoutDashboard },
  { name: "Creators List Page", href: "/dashboard/creators_list", icon: Grip },
  { name: "Request From Agents", href: "/dashboard/request_from_agents", icon: ShoppingBasket },
  // { name: "Agents Management", href: "/dashboard/agents_lists", icon: ShoppingCart },
  { name: "Trips Management", href: "/dashboard/trips_management", icon: ShoppingCart },
  { name: "Media Management", href: "/dashboard/media_management", icon: MessageSquare },
  { name: "Contacts Management", href: "/dashboard/contacts_management", icon: Scissors },
  {
    name: "Partnerships & Collaborations",
    href: "/dashboard/partnerships",
    icon: DollarSign,
  },
  { name: "Settings", href: "/dashboard/setting", icon: Settings },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen sticky bottom-0 top-0 w-[350px] flex-col bg-[#131313] z-50 border-r border-[#424242]">
      {/* Logo */}
      <div className="my-7">
        <h1 className="text-[#89CFF0] text-center text-[40px] font-normal">
          Next Level
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4 flex flex-col items-center justify-start overflow-y-auto mt-3">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/dashboard");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex mx-auto items-center justify-start w-full gap-2 px-3 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[#89CFF033] text-[#7DD3DD]"
                  : "text-slate-300 hover:bg-slate-600/50 hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "h-6 w-6 transition-colors duration-200",
                  isActive ? "text-[#7DD3DD]" : ""
                )}
              />
              <span
                className={cn(
                  "font-normal text-base leading-[120%] transition-colors duration-200",
                  isActive ? "text-[#7DD3DD] font-medium" : ""
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout fixed at bottom */}
      <div className="p-3" onClick={() => setOpen(true)}>
        <div className="flex items-center justify-start space-y-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-slate-600/50 hover:text-white cursor-pointer">
          <LogOut className="h-5 w-5" />
          <span className="font-normal text-base leading-[120%]">Log Out</span>
        </div>
      </div>
      <LogoutModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
