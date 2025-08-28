import ClassForm from "@/components/admin/class-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewClassPage() {
  return (
    <div className="container mx-auto py-10">
        <Link href="/admin/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
        </Link>
        <ClassForm />
    </div>
  );
}
