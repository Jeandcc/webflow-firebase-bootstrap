import * as admin from "firebase-admin";

export const FireAuth = admin.auth();
export const FireDb = admin.firestore();

// eslint-disable-next-line jest/unbound-method
export const { increment, arrayRemove, arrayUnion, serverTimestamp } =
  admin.firestore.FieldValue;
