'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DanceClass, Enrollment } from '@/types';
import ClassCard from './class-card';
import { Search } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { getEnrollmentsForUser, getAllEnrollments } from '@/lib/data';

interface ClassListProps {
  initialClasses: DanceClass[];
}

export default function ClassList({ initialClasses }: ClassListProps) {
  const { user } = useAuth();
  const [levelFilter, setLevelFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [userEnrollments, setUserEnrollments] = useState<Enrollment[]>([]);
  const [allEnrollments, setAllEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    // Fetch all enrollments to calculate counts
    async function fetchAllEnrollments() {
      const enrollments = await getAllEnrollments();
      setAllEnrollments(enrollments);
    }
    fetchAllEnrollments();
  }, []);

  useEffect(() => {
    // Fetch enrollments specific to the logged-in user
    async function fetchUserEnrollments() {
      if (user) {
        const enrollments = await getEnrollmentsForUser(user.id);
        setUserEnrollments(enrollments);
      } else {
        setUserEnrollments([]);
      }
    }
    fetchUserEnrollments();
  }, [user]);

  const enrollmentsByClass = useMemo(() => {
    return allEnrollments.reduce((acc, enrollment) => {
      acc[enrollment.classId] = (acc[enrollment.classId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [allEnrollments]);
  
  const filteredClasses = useMemo(() => {
    return initialClasses.filter((danceClass) => {
      const levelMatch = levelFilter === 'All' || danceClass.level === levelFilter;
      const searchMatch = danceClass.title.toLowerCase().includes(searchQuery.toLowerCase());
      return levelMatch && searchMatch;
    });
  }, [initialClasses, levelFilter, searchQuery]);

  return (
    <div className="container py-12 px-4 md:px-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by class title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Filter by level:</span>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClasses.map((danceClass) => {
            const isEnrolled = userEnrollments.some(e => e.classId === danceClass.id);
            return (
              <ClassCard
                key={danceClass.id}
                danceClass={danceClass}
                enrollmentCount={enrollmentsByClass[danceClass.id] || 0}
                isInitiallyEnrolled={isEnrolled}
                // We need a way to update the enrollments in the UI after a change
                // This is a more complex state management problem. For now, a page refresh would be needed
                // A better solution would involve a shared state/context for enrollments
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">No classes match your criteria. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
