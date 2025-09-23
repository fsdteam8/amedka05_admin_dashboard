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
import { Eye } from "lucide-react";
import Image from "next/image";

export function AgentModal() {
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

      <DialogContent className="bg-[#131313] border-gray-700 text-white max-w-2xl p-0 gap-0">

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
                <label className="text-white text-base mr-2">Country :</label>
                <span className="text-[#929292] text-sm">USA</span>
              </div>
              <div>
                <label className="text-white text-base mr-2">Designation :</label>
                <span className="text-[#929292] text-sm">CEO</span>
              </div>
              <div>
                <label className="text-white text-base mr-2">Brand name :</label>
                <span className="text-[#929292] text-sm">PUMA</span>
              </div>
              <div>
                <label className="text-white text-base mr-2">Working From :</label>
                <span className="text-[#929292] text-sm">2024-2025</span>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
