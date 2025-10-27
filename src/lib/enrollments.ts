
'use client';

import { 
  doc,
  setDoc,
  serverTimestamp,
  type Firestore,
  arrayUnion,
  FieldValue,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export type EnrollmentData = {
  userId: string;
  courseId: string;
};

/**
 * Enrolls a user in a course by updating an array of course IDs
 * on the user's document in Firestore.
 * This operation is non-blocking and uses `setDoc` with `{ merge: true }`
 * to avoid overwriting the user document.
 *
 * @param firestore - The Firestore database instance.
 * @param enrollmentData - An object containing the userId and courseId.
 * @returns A promise that resolves when the document is successfully written.
 */
export function enrollInCourse(firestore: Firestore, enrollmentData: EnrollmentData): Promise<void> {
  return new Promise((resolve, reject) => {
    // Reference to the user's document
    const userDocRef = doc(firestore, 'users', enrollmentData.userId);

    const userUpdatePayload = {
      // Use arrayUnion to add the new courseId without creating duplicates
      enrolledCourseIds: arrayUnion(enrollmentData.courseId),
      // Use a server timestamp to track the last enrollment activity
      lastEnrolledAt: serverTimestamp(),
    };

    // Use setDoc with merge:true to create the doc if it doesn't exist
    // or update it if it does, without overwriting other fields.
    setDoc(userDocRef, userUpdatePayload, { merge: true })
      .then(() => {
        resolve(); // Resolve the promise on successful write
      })
      .catch((serverError) => {
        // Create a contextual error to be surfaced to the developer
        const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'update', // This is effectively an update operation
          requestResourceData: userUpdatePayload,
        });

        // Emit the error globally so it can be caught by the development overlay
        errorEmitter.emit('permission-error', permissionError);
        
        reject(permissionError); // Reject the promise with the detailed error
      });
  });
}
