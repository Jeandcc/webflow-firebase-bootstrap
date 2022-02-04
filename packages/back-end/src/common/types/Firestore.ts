import firebase from "firebase-admin";

// TODO: Improve. The deep nesting is causing TS errors, preventing us
// from using this on some locations, such as the 'update' variation of
// the addDbOperation method in FireUtils
type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? T[K] extends ArrayLike<any>
      ? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof any[]>>}`
      : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
    : K
  : never;

type Path<T> = PathImpl<T, keyof T> | keyof T;

export type PathValue<
  T,
  P extends Path<T>
> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends Path<T[K]>
      ? PathValue<T[K], Rest>
      : never
    : never
  : P extends keyof T
  ? T[P]
  : never;

export type TFieldsInDotNotation<T> = Path<T>;

export type TUpdateData<T> = Partial<{
  [TKey in TFieldsInDotNotation<T>]:
    | PathValue<T, TKey>
    | firebase.firestore.FieldValue;
}>;

type WhereFilterOp =
  | "<"
  | "<="
  | "=="
  | "!="
  | ">="
  | ">"
  | "array-contains"
  | "in"
  | "not-in"
  | "array-contains-any";

type TFirestoreQuery<T> = Omit<firebase.firestore.Query<T>, "where">;

// TODO: Improve "where" for accessing optional fields
export interface TCustomQuery<T> extends TFirestoreQuery<T> {
  where(
    fieldPath: TFieldsInDotNotation<T>,
    opStr: WhereFilterOp,
    value: any
  ): TCustomQuery<T>;
}

type TFirestoreDocRef<T> = Omit<
  firebase.firestore.DocumentReference<T>,
  "update"
>;

type TFirestoreCollectionRef<T> = Omit<
  firebase.firestore.CollectionReference<T>,
  "doc" | "where"
> &
  TCustomQuery<T>;

type TFirestoreCollectionGroupRef<T> = Omit<
  firebase.firestore.CollectionGroup<T>,
  "where"
> &
  TCustomQuery<T>;

export interface TCustomDocRef<T> extends TFirestoreDocRef<T> {
  update(data: TUpdateData<T>): Promise<firebase.firestore.WriteResult>;
}

export interface TCustomCollectionRef<T> extends TFirestoreCollectionRef<T> {
  doc(documentPath: string): TCustomDocRef<T>;
  doc(): TCustomDocRef<T>;
}

export interface TCustomCollectionGroupRef<T>
  extends TFirestoreCollectionGroupRef<T> {
  doc(documentPath: string): TCustomDocRef<T>;
}
