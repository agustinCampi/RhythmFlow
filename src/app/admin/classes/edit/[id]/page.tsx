import ClassForm from "@/components/admin/class-form";
import { getClassById } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface EditClassPageProps {
  params: {
    id: string;
  };
}

export default async function EditClassPage({ params }: EditClassPageProps) {
  const danceClass = await getClassById(params.id);

  if (!danceClass) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
        <Link href="/admin/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
        </Link>
        <ClassForm initialData={danceClass} />
    </div>
  );
}
