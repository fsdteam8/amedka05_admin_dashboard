"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

interface LogoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogout?: () => void;
  title?: string;
}

export function LogoutModal({ open, onOpenChange, onLogout, title }: LogoutModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent className="sm:max-w-lg bg-black border-gray-800">
                <DialogHeader>
                    <DialogTitle className="text-[#7DD3DD] font-medium">{title || "Are you sure you want to log out?"}</DialogTitle>
                </DialogHeader>

        <DialogFooter>
          <div className="w-full flex justify-center items-center gap-4 mt-4">
            <Button
              variant="outline"
              className="border-[#7DD3DD]/50 text-[#7DD3DD] hover:bg-[#7DD3DD]/10"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white font-medium"
              onClick={() => {
                signOut({ callbackUrl: "/" });
                if (onLogout) onLogout();
                onOpenChange(false);
              }}
            >
              Log Out
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
