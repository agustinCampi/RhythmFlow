"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { DanceClass } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { addClass, updateClass } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  teacher: z.string().min(2, "Teacher name is required."),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid start time."),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid end time."),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1."),
});

interface ClassFormProps {
  initialData?: DanceClass;
}

// Helper to format Date to 'YYYY-MM-DDTHH:mm'
const toDateTimeLocal = (date: Date): string => {
    const ten = (i: number) => (i < 10 ? '0' : '') + i;
    return `${date.getFullYear()}-${ten(date.getMonth() + 1)}-${ten(date.getDate())}T${ten(date.getHours())}:${ten(date.getMinutes())}`;
}

export default function ClassForm({ initialData }: ClassFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditMode = !!initialData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      level: initialData?.level || "Beginner",
      teacher: initialData?.teacher || "",
      startTime: initialData ? toDateTimeLocal(initialData.startTime) : "",
      endTime: initialData ? toDateTimeLocal(initialData.endTime) : "",
      capacity: initialData?.capacity || 10,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const classData = {
        ...values,
        startTime: new Date(values.startTime),
        endTime: new Date(values.endTime),
    };

    try {
      if (isEditMode) {
        await updateClass(initialData.id, classData);
        toast({ title: "Class Updated", description: `${values.title} has been successfully updated.` });
      } else {
        await addClass(classData);
        toast({ title: "Class Created", description: `${values.title} has been successfully added.` });
      }
      router.push("/admin/dashboard");
      router.refresh(); // To update the table on dashboard
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: `Could not save the class. Please try again.`,
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Class" : "Create New Class"}</CardTitle>
        <CardDescription>Fill in the details for the dance class.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Hip Hop Fundamentals" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teacher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teacher</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                        <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                        <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem className="max-w-xs">
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Class')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
