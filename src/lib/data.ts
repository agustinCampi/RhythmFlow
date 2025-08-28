import type { DanceClass, Enrollment, User } from '@/types';

// Mock Data
let users: User[] = [
  { id: '1', fullName: 'Alice Johnson', email: 'alice@example.com', role: 'student' },
  { id: '2', fullName: 'Bob Williams', email: 'bob@example.com', role: 'student' },
  { id: '3', fullName: 'Charlie Brown', email: 'charlie@example.com', role: 'admin' },
  { id: '4', fullName: 'Diana Prince', email: 'diana@example.com', role: 'student' },
];

let classes: DanceClass[] = [
  { id: 'c1', title: 'Hip Hop Fundamentals', level: 'Beginner', teacher: 'Mike Ross', startTime: new Date('2024-08-10T18:00:00'), endTime: new Date('2024-08-10T19:00:00'), capacity: 20 },
  { id: 'c2', title: 'Contemporary Flow', level: 'Intermediate', teacher: 'Jessica Pearson', startTime: new Date('2024-08-10T19:00:00'), endTime: new Date('2024-08-10T20:30:00'), capacity: 15 },
  { id: 'c3', title: 'Advanced Ballet Techniques', level: 'Advanced', teacher: 'Louis Litt', startTime: new Date('2024-08-11T17:00:00'), endTime: new Date('2024-08-11T18:30:00'), capacity: 10 },
  { id: 'c4', title: 'Salsa for Beginners', level: 'Beginner', teacher: 'Donna Paulsen', startTime: new Date('2024-08-11T20:00:00'), endTime: new Date('2024-08-11T21:00:00'), capacity: 25 },
  { id: 'c5', title: 'Jazz Fusion', level: 'Intermediate', teacher: 'Harvey Specter', startTime: new Date('2024-08-12T18:00:00'), endTime: new Date('2024-08-12T19:30:00'), capacity: 18 },
  { id: 'c6', title: 'Pro-level Locking & Popping', level: 'Advanced', teacher: 'Katrina Bennett', startTime: new Date('2024-08-12T20:00:00'), endTime: new Date('2024-08-12T21:30:00'), capacity: 12 },
];

let enrollments: Enrollment[] = [
  { id: 'e1', studentId: '1', classId: 'c2', enrollmentDate: new Date() },
  { id: 'e2', studentId: '2', classId: 'c2', enrollmentDate: new Date() },
  { id: 'e3', studentId: '1', classId: 'c4', enrollmentDate: new Date() },
];

// Mock API functions
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getUsers = async (): Promise<User[]> => {
  await delay(100);
  return users;
};

export const getClasses = async (): Promise<DanceClass[]> => {
  await delay(100);
  return classes.filter(c => c.startTime > new Date()).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
};

export const getClassById = async (id: string): Promise<DanceClass | undefined> => {
    await delay(100);
    return classes.find(c => c.id === id);
}

export const getEnrollments = async (): Promise<Enrollment[]> => {
    await delay(100);
    return enrollments;
}

export const getEnrollmentsForClass = async (classId: string): Promise<Enrollment[]> => {
  await delay(100);
  return enrollments.filter(e => e.classId === classId);
};

export const getEnrollmentsForUser = async (userId: string): Promise<Enrollment[]> => {
    await delay(100);
    return enrollments.filter(e => e.studentId === userId);
}

export const addEnrollment = async (studentId: string, classId: string): Promise<Enrollment> => {
    await delay(200);
    if (enrollments.some(e => e.studentId === studentId && e.classId === classId)) {
        throw new Error("Already enrolled");
    }
    const newEnrollment: Enrollment = {
        id: `e${Date.now()}`,
        studentId,
        classId,
        enrollmentDate: new Date(),
    };
    enrollments.push(newEnrollment);
    return newEnrollment;
}

export const cancelEnrollment = async (enrollmentId: string): Promise<void> => {
    await delay(200);
    const index = enrollments.findIndex(e => e.id === enrollmentId);
    if (index > -1) {
        enrollments.splice(index, 1);
    } else {
        throw new Error("Enrollment not found");
    }
}

export const addClass = async (newClassData: Omit<DanceClass, 'id'>): Promise<DanceClass> => {
    await delay(200);
    const newClass: DanceClass = {
        id: `c${Date.now()}`,
        ...newClassData,
    };
    classes.push(newClass);
    return newClass;
}

export const updateClass = async (classId: string, updates: Partial<DanceClass>): Promise<DanceClass> => {
    await delay(200);
    const classIndex = classes.findIndex(c => c.id === classId);
    if (classIndex === -1) {
        throw new Error("Class not found");
    }
    classes[classIndex] = { ...classes[classIndex], ...updates };
    // Placeholder for sending notifications to enrolled students
    console.log(`Class ${classId} updated. Triggering notifications for enrolled students.`);
    return classes[classIndex];
}

export const deleteClass = async (classId: string): Promise<void> => {
    await delay(200);
    const index = classes.findIndex(c => c.id === classId);
    if (index > -1) {
        classes.splice(index, 1);
        // Also remove associated enrollments
        enrollments = enrollments.filter(e => e.classId !== classId);
    } else {
        throw new Error("Class not found");
    }
}
