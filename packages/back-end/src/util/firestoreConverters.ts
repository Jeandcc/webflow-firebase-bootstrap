import { FireDb } from "@services/firebase";

import {
  TCustomCollectionGroupRef,
  TCustomCollectionRef,
} from "@common/types/Firestore";

const converter = <T>() => ({
  toFirestore: (data: Partial<T>) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    <T & { id: string }>{ ...snap.data(), id: snap.id },
});

export const collectionConverter = <T>(collectionPath: string) =>
  <TCustomCollectionRef<T>>(
    FireDb.collection(collectionPath).withConverter(converter<T>())
  );

export const collectionGroupConverter = <T>(collectionPath: string) =>
  <TCustomCollectionGroupRef<T>>(
    FireDb.collectionGroup(collectionPath).withConverter(converter<T>())
  );
