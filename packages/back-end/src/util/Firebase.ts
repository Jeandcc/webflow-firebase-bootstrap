/* eslint-disable no-underscore-dangle */

import { auth } from "firebase-functions/v1";

import { FireAuth, FireDb } from "@services/firebase";

import { dbCollections } from "@models/db";

import { TCustomCollectionRef, TCustomDocRef } from "@common/types/Firestore";

export default class FireUtil {
  private static _fireBatches = [FireDb.batch()];

  private static _batchSizes = [0];

  private static _batchIdxToUse = 0;

  public static get batchSizes() {
    return [...this._batchSizes];
  }

  public static get batchesQty() {
    return this._fireBatches.length;
  }

  static async pingFireStore(): Promise<void> {
    const userId = "60107299d5209b74e0e55841";
    await dbCollections.users().doc(userId).get();
  }

  static async deleteCollection(collectionRef: TCustomCollectionRef<unknown>) {
    return FireDb.recursiveDelete(collectionRef);
  }

  static addBatchOperation<T>(
    operation: "create",
    ref: TCustomDocRef<T>,
    data: T
  ): void;
  static addBatchOperation<T>(
    operation: "update",
    ref: TCustomDocRef<T>,
    data: Partial<T>,
    precondition?: FirebaseFirestore.Precondition
  ): void;
  static addBatchOperation<T>(
    operation: "set",
    ref: TCustomDocRef<T>,
    data: T
  ): void;
  static addBatchOperation<T>(
    operation: "set",
    ref: TCustomDocRef<T>,
    data: Partial<T>,
    setOpts?: FirebaseFirestore.SetOptions
  ): void;
  static addBatchOperation<T>(
    operation: "create" | "update" | "set",
    ref: TCustomDocRef<T>,
    data: Partial<T> | T,
    opts?: FirebaseFirestore.Precondition | FirebaseFirestore.SetOptions
  ): void {
    // Lines below make sure we stay below the limit of 500 writes per
    // batch
    if (this._batchSizes[this._batchIdxToUse] === 500) {
      this._fireBatches.push(FireDb.batch());
      this._batchSizes.push(0);
      this._batchIdxToUse += 1;
    }
    this._batchSizes[this._batchIdxToUse] += 1;

    const batchArgs: [TCustomDocRef<unknown>, Partial<T> | T] = [ref, data];
    if (opts) batchArgs.push(opts as any);

    switch (operation) {
      // Specific case for "set" is required because of some weird TS
      // glitch that doesn't allow me to use the arg "operation" to
      // call the function
      case "set":
        this._fireBatches[this._batchIdxToUse].set(...batchArgs);
        break;
      default:
        this._fireBatches[this._batchIdxToUse][operation](...batchArgs);
        break;
    }
  }

  public static async runBatchOperations() {
    // The lines below clear the globally available batches so we
    // don't run them twice if we call this function more than once
    const currentBatches = [...this._fireBatches];

    this._fireBatches = [FireDb.batch()];
    this._batchSizes = [0];
    this._batchIdxToUse = 0;

    await Promise.all(currentBatches.map((batch) => batch.commit()));
  }

  public static cancelBatchOperations() {
    this._fireBatches = [FireDb.batch()];
    this._batchSizes = [0];
    this._batchIdxToUse = 0;
  }

  public static async getUsersFromArray(userIds: string[]) {
    const matchObj: { [key: string]: auth.UserRecord } = {};

    await Promise.all(
      userIds.map(async (id) => {
        matchObj[id] = await FireAuth.getUser(id);
      })
    );

    return matchObj;
  }
}
