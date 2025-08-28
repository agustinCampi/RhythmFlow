"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { getEnrollmentsForUser, getClasses, cancelEnrollment } from "@/lib/data";
import { DanceClass, Enrollment } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Calendar, Clock, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

type EnrolledClass = DanceClass & { enrollmentId: string };

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [enrolledClasses, setEnrolledClasses] = useState<EnrolledClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      const fetchEnrolledClasses = async () => {
        setIsLoading(true);
        try {
          const enrollments = await getEnrollmentsForUser(user.id);
          const allClasses = await getClasses();
          
          const userClasses = enrollments.map(enrollment => {
            const danceClass = allClasses.find(c => c.id === enrollment.classId);
            return danceClass ? { ...danceClass, enrollmentId: enrollment.id } : null;
          }).filter((c): c is EnrolledClass => c !== null);
          
          setEnrolledClasses(userClasses);
        } catch (error) {
          toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch enrolled classes.' });
        } finally {
          setIsLoading(false);
        }
      };
      fetchEnrolledClasses();
    }
  }, [user, toast]);

  const handleCancelEnrollment = async (enrollmentId: string, className: string) => {
    setCancellingId(enrollmentId);
    try {
      await cancelEnrollment(enrollmentId);
      setEnrolledClasses(prev => prev.filter(c => c.enrollmentId !== enrollmentId));
      toast({
        title: "Enrollment Cancelled",
        description: `You have been removed from ${className}.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Cancellation Failed',
        description: 'Could not cancel your enrollment. Please try again.',
      });
    } finally {
      setCancellingId(null);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="container py-12 px-4 md:px-6">
        <div className="space-y-4">
            <Skeleton className="h-10 w-1/4" />
            <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="mt-8 grid gap-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }
  
  if (!user) return null;

  return (
    <div className="container py-12 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline text-primary">Welcome, {user.fullName}</h1>
        <p className="text-muted-foreground">Here are the classes you're enrolled in.</p>
      </div>

      {enrolledClasses.length > 0 ? (
        <div className="grid gap-6">
          {enrolledClasses.map((danceClass) => (
            <Card key={danceClass.enrollmentId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 transition-shadow hover:shadow-md">
              <div className="mb-4 sm:mb-0">
                <h3 className="font-bold text-lg">{danceClass.title}</h3>
                <p className="text-sm text-muted-foreground">with {danceClass.teacher}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{danceClass.startTime.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{danceClass.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={cancellingId === danceClass.enrollmentId}>
                        {cancellingId === danceClass.enrollmentId ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Cancel Enrollment
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently cancel your enrollment for "{danceClass.title}". This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Go Back</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleCancelEnrollment(danceClass.enrollmentId, danceClass.title)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Yes, Cancel
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">No Classes Yet!</h3>
          <p className="text-muted-foreground mt-2">You haven't enrolled in any classes. Time to hit the dance floor!</p>
          <Button asChild className="mt-4" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
            <a href="/">Browse Classes</a>
          </Button>
        </div>
      )}
    </div>
  );
}
