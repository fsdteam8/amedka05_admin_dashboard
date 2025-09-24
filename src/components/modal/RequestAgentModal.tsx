// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Eye } from "lucide-react";

// export function CreatorModal() {
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button
//           variant="ghost"
//           size="sm"
//           className="p-1 h-auto text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
//         >
//           <Eye size={16} />
//         </Button>
//       </DialogTrigger>

//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Order Info</DialogTitle>
//         </DialogHeader>
//         <p>This is the first text.</p>
//         <p>This is the second text.</p>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Facebook, Instagram } from "lucide-react";
import Image from "next/image";

export function RequestAgentModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-auto text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
        >
          <Eye size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#131313] border-gray-700 text-white max-w-4xl p-0 gap-0">

        {/* Content */}
        <div className="p-7 space-y-4">
          {/* Profile Section */}
          <div className="flex gap-10">
            <div className="space-y-2">
              <div>
                <label className="text-white text-base mr-2">Name:</label>
                <span className="text-[#929292] text-sm">John Smith</span>
              </div>
              <div>
                <label className="text-white text-base mr-2">Email:</label>
                <span className="text-[#929292] text-sm">john123@gmail.com</span>
              </div>
              <div>
                <label className="text-white text-base mr-2">Phone Number:</label>
                <span className="text-[#929292] text-sm">01XXXXXXXXX</span>
              </div>
              <div>
                <label className="text-white text-base mr-2">Services Given:</label>
                <span className="text-[#929292] text-sm">5</span>
              </div>
            </div>
            <div className="w-[138px] h-[89px]">
              <Image
                width={400}
                height={400}
                src="/images/creatorImage.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Social Media Section */}
          <div className="space-y-3">
            <label className="text-white text-base">Social Media:</label>

            {/* Facebook */}
            <div className="flex items-center gap-2">
              <Facebook size={16} className="text-blue-500" />
              <span className="text-gray-400 text-base">Facebook</span>
            </div>
            <input
              type="text"
              value="http://www.facebook.com"
              readOnly
              className="w-full bg-[#2A2A2A] border border-gray-600 rounded px-3 py-2 text-sm text-blue-400 focus:outline-none focus:border-gray-500"
            />

            {/* Instagram */}
            <div className="flex items-center gap-2 mt-3">
              <Instagram size={16} className="text-pink-500" />
              <span className="text-gray-400 text-base">Instagram</span>
            </div>
            <input
              type="text"
              value="https://www.instagram.com"
              readOnly
              className="w-full bg-[#2A2A2A] border border-gray-600 rounded px-3 py-2 text-sm text-blue-400 focus:outline-none focus:border-gray-500"
            />
          </div>

          {/* Bio Section */}
          <div className="space-y-2">
            <label className="text-gray-400 text-base">Bio:</label>
            <div className="bg-[#2A2A2A] border border-gray-600 rounded p-3">
              <p className="text-gray-300 text-[18px] leading-[150%]">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry&apos;s standard
                dummy text ever since the 1500s, when an unknown printer took a
                galley of type and scrambled it to make a type specimen book. It
                has survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged
              </p>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <label className="text-gray-400 text-base">Description:</label>
            <div className="bg-[#2A2A2A] border border-gray-600 rounded p-3">
              <p className="text-gray-300 text-[18px] leading-[150%]">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry&apos;s standard
                dummy text ever since the 1500s, when an unknown printer took a
                galley of type and scrambled it to make a type specimen book. It
                has survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
