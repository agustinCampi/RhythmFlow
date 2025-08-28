"use client";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ isOpen, onOpenChange }: LoginModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join the Fun!</DialogTitle>
          <DialogDescription>
            You need to be logged in to enroll in classes. Log in or create an account to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
           <Button asChild className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/register">Create Account</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
