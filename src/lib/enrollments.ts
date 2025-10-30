
'use client';

import { 
  doc,
  setDoc,
  serverTimestamp,
  type Firestore,
  arrayUnion,
  writeBatch,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export type EnrollmentData = {
  userId: string;
  courseId: string;
};

export type MembershipData = {
  userId: string;
  tier: 'monthly' | 'yearly';
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


/**
 * Enrolls a user in a membership plan.
 * This function performs two writes in a single atomic batch:
 * 1. Creates a new membership document in the user's 'memberships' subcollection.
 * 2. Updates the 'membershipStatus' on the user's main profile document.
 *
 * @param firestore - The Firestore database instance.
 * @param membershipData - An object containing the userId and the membership tier.
 * @returns A promise that resolves when the batch write is successful.
 */
export function enrollInMembership(firestore: Firestore, membershipData: MembershipData): Promise<void> {
  return new Promise((resolve, reject) => {
    const { userId, tier } = membershipData;

    // 1. Reference to the user's main profile document
    const userDocRef = doc(firestore, 'users', userId);

    // 2. Reference to a new document in the 'memberships' subcollection
    // Using doc() without an ID will generate a unique ID for the new membership record.
    const membershipDocRef = doc(firestore, 'users', userId, 'memberships', new Date().getTime().toString());

    // Get a new write batch
    const batch = writeBatch(firestore);

    // -- Define the data for the new membership document --
    const membershipPayload = {
      userId: userId,
      tier: tier,
      status: 'active',
      startDate: serverTimestamp(), // Sets the start date to the server's time
      // endDate can be calculated based on the tier (e.g., +1 year for 'yearly')
    };

    // -- Define the data for updating the user's profile --
    const userUpdatePayload = {
      membershipStatus: 'active',
    };

    // -- Add operations to the batch --
    // Operation 1: Create the new membership document
    batch.set(membershipDocRef, membershipPayload);
    // Operation 2: Update the user's main profile
    batch.update(userDocRef, userUpdatePayload);

    // -- Commit the batch --
    batch.commit()
      .then(() => {
        resolve(); // Resolve the promise on successful batch write
      })
      .catch((serverError) => {
        // Create a contextual error. We'll use the userDocRef path for the error context
        // as it's the most likely point of failure if rules are based on user ownership.
        const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'update', // The batch includes an update operation
          requestResourceData: userUpdatePayload, // Show the attempted change to the user profile
        });

        // Emit the error globally
        errorEmitter.emit('permission-error', permissionError);

        reject(permissionError); // Reject the promise with the detailed error
      });
  });
}
