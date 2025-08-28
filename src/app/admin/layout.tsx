"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthenticated && user?.role !== 'admin') {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-8rem)] text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground max-w-sm mt-2">
            You do not have the necessary permissions to view this page. This area is for administrators only.
        </p>
        <Button onClick={() => router.push('/')} className="mt-6">
            Go to Homepage
        </Button>
      </div>
    );
  }

  if (isAuthenticated && user?.role === 'admin') {
    return <>{children}</>;
  }

  return null;
}
