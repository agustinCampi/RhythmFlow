import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getClasses, getEnrollments } from "@/lib/data";
import { MoreHorizontal, PlusCircle, Edit, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboard() {
  const classes = await getClasses();
  const allEnrollments = await getEnrollments();

  const enrollmentCounts = allEnrollments.reduce((acc, enrollment) => {
    acc[enrollment.classId] = (acc[enrollment.classId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your dance classes and enrollments.</p>
        </div>
        <Button asChild>
          <Link href="/admin/classes/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Class
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Classes</CardTitle>
          <CardDescription>A list of all scheduled classes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Title</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Enrollments</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((danceClass) => {
                const count = enrollmentCounts[danceClass.id] || 0;
                const isFull = count >= danceClass.capacity;
                return (
                  <TableRow key={danceClass.id}>
                    <TableCell className="font-medium">{danceClass.title}</TableCell>
                    <TableCell>{danceClass.teacher}</TableCell>
                    <TableCell>
                      {danceClass.startTime.toLocaleDateString()} @ {danceClass.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{count} / {danceClass.capacity}</span>
                        {isFull && <Badge variant="destructive">Full</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                             <Link href={`/admin/classes/edit/${danceClass.id}`}>
                               <Edit className="mr-2 h-4 w-4" />
                               <span>Edit</span>
                             </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/classes/enrollments/${danceClass.id}`}>
                              <Users className="mr-2 h-4 w-4" />
                              <span>View Enrollments</span>
                            </Link>
                          </DropdownMenuItem>
                           <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/40">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
