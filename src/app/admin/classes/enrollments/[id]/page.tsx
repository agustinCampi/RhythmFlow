import { getClassById, getEnrollmentsForClass, getUsersByIds } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/types";

interface EnrollmentsPageProps {
  params: {
    id: string;
  };
}

export default async function EnrollmentsPage({ params }: EnrollmentsPageProps) {
  const danceClass = await getClassById(params.id);
  if (!danceClass) {
    notFound();
  }

  const enrollments = await getEnrollmentsForClass(params.id);
  const studentIds = enrollments.map(e => e.studentId);
  const enrolledStudents: User[] = await getUsersByIds(studentIds);

  const studentMap = new Map(enrolledStudents.map(s => [s.id, s]));

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name.substring(0, 2);
  };

  return (
    <div className="container mx-auto py-10">
      <Link href="/admin/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Enrollments for "{danceClass.title}"</CardTitle>
          <CardDescription>
            {enrollments.length} of {danceClass.capacity} spots filled.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {enrollments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Avatar</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Enrolled On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((enrollment) => {
                  const student = studentMap.get(enrollment.studentId);
                  if (!student) return null;

                  return (
                    <TableRow key={enrollment.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${student.id}`} />
                          <AvatarFallback>{getInitials(student.fullName)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{student.fullName}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{enrollment.enrollmentDate.toLocaleDateString()}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No students are currently enrolled in this class.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
