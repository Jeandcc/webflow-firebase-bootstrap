import { firebase, FireDb } from '@/services/firebase';

import {
  TCustomCollectionGroupRef,
  TCustomCollectionRef,
} from '@/common/types/Firestore';

const converter = <T>() => ({
  toFirestore: (data: Partial<T>) => data,
  fromFirestore: (snap: firebase.firestore.QueryDocumentSnapshot) =>
    <T & { id: string; path: string }>{
      ...snap.data(),
      id: snap.id,
      path: snap.ref.path,
    },
});

export const collectionConverter = <T>(collectionPath: string) =>
  <TCustomCollectionRef<T>>(
    FireDb.collection(collectionPath).withConverter(converter<T>())
  );

export const collectionGroupConverter = <T>(collectionPath: string) =>
  <TCustomCollectionGroupRef<T>>(
    FireDb.collectionGroup(collectionPath).withConverter(converter<T>())
  );
