'use client';

import { useState } from 'react';
import { DanceClass } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, BarChart3, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import LoginModal from './login-modal';
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
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { addEnrollment } from '@/lib/data';

interface ClassCardProps {
  danceClass: DanceClass;
  enrollmentCount: number;
  isInitiallyEnrolled: boolean;
}

export default function ClassCard({ danceClass, enrollmentCount, isInitiallyEnrolled }: ClassCardProps) {
  const { user, isAuthenticated } = useAuth();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(isInitiallyEnrolled);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
    }
  };
  
  const handleConfirmEnroll = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await addEnrollment(user.id, danceClass.id);
      toast({
        title: 'Enrollment Successful!',
        description: `You've been enrolled in ${danceClass.title}.`,
      });
      setIsEnrolled(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Enrollment Failed',
        description: (error as Error).message || 'Could not enroll in the class.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const levelColor = {
    Beginner: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
    Intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
    Advanced: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800',
  };

  const isFull = enrollmentCount >= danceClass.capacity;

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold font-headline leading-tight">{danceClass.title}</CardTitle>
            <Badge className={levelColor[danceClass.level]}>{danceClass.level}</Badge>
          </div>
          <CardDescription>by {danceClass.teacher}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{danceClass.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {danceClass.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
           <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>{danceClass.level} Level</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{enrollmentCount} / {danceClass.capacity} spots filled</span>
          </div>
        </CardContent>
        <CardFooter>
          {isAuthenticated ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="w-full"
                  disabled={isEnrolled || isFull}
                  variant={isEnrolled ? "outline" : "default"}
                  style={!isEnrolled && !isFull ? { backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' } : {}}
                >
                  {isEnrolled ? <><CheckCircle2 className="mr-2 h-4 w-4" /> Enrolled</> : isFull ? 'Class Full' : 'Enroll Now'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Enrollment</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to enroll in "{danceClass.title}"?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmEnroll} disabled={isSubmitting}>
                    {isSubmitting ? 'Enrolling...' : 'Confirm'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
             <Button
                className="w-full"
                onClick={handleEnrollClick}
                disabled={isFull}
                style={!isFull ? { backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' } : {}}
              >
                {isFull ? 'Class Full' : 'Enroll Now'}
             </Button>
          )}
        </CardFooter>
      </Card>
      <LoginModal isOpen={isLoginModalOpen} onOpenChange={setLoginModalOpen} />
    </>
  );
}
