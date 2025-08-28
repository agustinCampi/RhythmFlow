import ClassList from '@/components/class-list';
import { getClasses, getUsers, getEnrollments } from '@/lib/data';
import { Music2 } from 'lucide-react';

export default async function Home() {
  // Fetching data on the server to provide as initial data to the client component
  const initialClasses = await getClasses();
  const allUsers = await getUsers();
  const initialEnrollments = await getEnrollments();

  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-card border-b">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
             <div className="p-4 bg-primary/10 rounded-full">
                <Music2 className="h-10 w-10 text-primary" />
              </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none font-headline text-primary">
              Find Your Rhythm
            </h1>
            <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
              Discover and enroll in dance classes that match your style and skill level. Let's dance!
            </p>
          </div>
        </div>
      </section>
      <ClassList initialClasses={initialClasses} allUsers={allUsers} initialEnrollments={initialEnrollments} />
    </>
  );
}
