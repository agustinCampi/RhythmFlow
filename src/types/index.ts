export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'student' | 'admin';
}

export interface DanceClass {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  teacher: string;
  startTime: Date;
  endTime: Date;
  capacity: number;
}

export interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  enrollmentDate: Date;
}
