import { db } from '@/lib/firebase';
import type { DanceClass, Enrollment } from '@/types';
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch,
  documentId
} from 'firebase/firestore';

// Helper to convert Firestore timestamp to Date
const fromFirestore = (doc: any): any => {
  const data = doc.data();
  return {
    ...data,
    id: doc.id,
    startTime: data.startTime instanceof Timestamp ? data.startTime.toDate() : data.startTime,
    endTime: data.endTime instanceof Timestamp ? data.endTime.toDate() : data.endTime,
    enrollmentDate: data.enrollmentDate instanceof Timestamp ? data.enrollmentDate.toDate() : data.enrollmentDate,
  };
};

export const getClasses = async (): Promise<DanceClass[]> => {
  const classesRef = collection(db, 'classes');
  // Query to get upcoming classes, ordered by start time
  const q = query(classesRef, where('startTime', '>', new Date()), orderBy('startTime'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => fromFirestore(doc) as DanceClass);
};

export const getClassById = async (id: string): Promise<DanceClass | undefined> => {
  const classDocRef = doc(db, 'classes', id);
  const docSnap = await getDoc(classDocRef);
  if (docSnap.exists()) {
    return fromFirestore(docSnap) as DanceClass;
  }
  return undefined;
};

export const getAllEnrollments = async (): Promise<Enrollment[]> => {
  const enrollmentsRef = collection(db, 'enrollments');
  const querySnapshot = await getDocs(enrollmentsRef);
  return querySnapshot.docs.map(doc => fromFirestore(doc) as Enrollment);
};

export const getUsersByIds = async (ids: string[]): Promise<User[]> => {
  if (ids.length === 0) {
    return [];
  }
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where(documentId(), 'in', ids));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

export const addClass = async (newClassData: Omit<DanceClass, 'id'>): Promise<DanceClass> => {
  const classesRef = collection(db, 'classes');
  const docRef = await addDoc(classesRef, {
    ...newClassData,
    startTime: Timestamp.fromDate(newClassData.startTime),
    endTime: Timestamp.fromDate(newClassData.endTime),
  });
  return { id: docRef.id, ...newClassData };
};

export const updateClass = async (classId: string, updates: Partial<Omit<DanceClass, 'id'>>): Promise<DanceClass> => {
  const classDocRef = doc(db, 'classes', classId);

  // Convert Date objects to Timestamps for Firestore
  const firestoreUpdates: { [key: string]: any } = { ...updates };
  if (updates.startTime) {
    firestoreUpdates.startTime = Timestamp.fromDate(updates.startTime);
  }
  if (updates.endTime) {
    firestoreUpdates.endTime = Timestamp.fromDate(updates.endTime);
  }

  await updateDoc(classDocRef, firestoreUpdates);
  const updatedDoc = await getClassById(classId);
  if (!updatedDoc) {
    throw new Error("Failed to fetch updated class");
  }
  return updatedDoc;
};

export const deleteClass = async (classId: string): Promise<void> => {
  const classDocRef = doc(db, 'classes', classId);

  // Also delete associated enrollments in a batch write
  const enrollmentsRef = collection(db, 'enrollments');
  const q = query(enrollmentsRef, where('classId', '==', classId));
  const enrollmentsSnapshot = await getDocs(q);

  const batch = writeBatch(db);
  enrollmentsSnapshot.forEach(doc => {
    batch.delete(doc.ref);
  });

  batch.delete(classDocRef);

  await batch.commit();
};

export const getEnrollmentsForClass = async (classId: string): Promise<Enrollment[]> => {
  const enrollmentsRef = collection(db, 'enrollments');
  const q = query(enrollmentsRef, where('classId', '==', classId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => fromFirestore(doc) as Enrollment);
};

export const getEnrollmentsForUser = async (userId: string): Promise<Enrollment[]> => {
  const enrollmentsRef = collection(db, 'enrollments');
  const q = query(enrollmentsRef, where('studentId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => fromFirestore(doc) as Enrollment);
};

export const addEnrollment = async (studentId: string, classId: string): Promise<Enrollment> => {
  // Check for existing enrollment first
  const enrollmentsRef = collection(db, 'enrollments');
  const q = query(enrollmentsRef, where('studentId', '==', studentId), where('classId', '==', classId));
  const existingEnrollment = await getDocs(q);
  if (!existingEnrollment.empty) {
    throw new Error("Already enrolled in this class");
  }

  const newEnrollmentData = {
    studentId,
    classId,
    enrollmentDate: Timestamp.now(),
  };
  const docRef = await addDoc(enrollmentsRef, newEnrollmentData);

  return {
    id: docRef.id,
    studentId,
    classId,
    enrollmentDate: (newEnrollmentData.enrollmentDate as Timestamp).toDate(),
  };
};

export const cancelEnrollment = async (enrollmentId: string): Promise<void> => {
  const enrollmentDocRef = doc(db, 'enrollments', enrollmentId);
  await deleteDoc(enrollmentDocRef);
};
