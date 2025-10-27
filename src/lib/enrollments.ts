
'use client';

import { 
  addDoc,
  collection,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export type EnrollmentData = {
  userId: string;
  courseId: string;
};

/**
 * Enrolls a user in a course by creating an enrollment document in a sub-collection
 * under the user's document in Firestore.
 * This operation is designed to be non-blocking from the UI perspective,
 * but it returns a promise that resolves upon completion or rejects on error.
 *
 * @param firestore - The Firestore database instance.
 * @param enrollmentData - An object containing the userId and courseId.
 * @returns A promise that resolves when the document is successfully written.
 */
export function enrollInCourse(firestore: Firestore, enrollmentData: EnrollmentData): Promise<void> {
  return new Promise((resolve, reject) => {
    // New Path: /users/{userId}/enrollments
    const enrollmentsCollection = collection(firestore, `users/${enrollmentData.userId}/enrollments`);

    const enrollmentRecord = {
      courseId: enrollmentData.courseId, // Only store the courseId
      enrolledAt: serverTimestamp(),
    };

    addDoc(enrollmentsCollection, enrollmentRecord)
      .then(() => {
        resolve(); // Resolve the promise on successful write
      })
      .catch((serverError) => {
        // Create a contextual error to be surfaced to the developer
        const permissionError = new FirestorePermissionError({
          path: enrollmentsCollection.path,
          operation: 'create',
          requestResourceData: enrollmentRecord,
        });

        // Emit the error globally so it can be caught by the development overlay
        errorEmitter.emit('permission-error', permissionError);
        
        reject(permissionError); // Reject the promise with the detailed error
      });
  });
}
