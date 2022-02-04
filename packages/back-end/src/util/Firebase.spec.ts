import { dbCollections } from "@models/db";

import FirebaseUtil from "./Firebase";
import { collectionConverter } from "./firestoreConverters";

interface ITestDoc {
  field1: string;
}

describe("firebase Utils", () => {
  it("successfully deletes a collection", async () => {
    const collectionRef = collectionConverter<ITestDoc>("testDocs");

    await Promise.all(
      new Array(5)
        .fill(0)
        .map(() => collectionRef.add({ field1: Math.random().toString() }))
    );

    const collectionSnapBeforeDelete = await collectionRef.get();
    expect(collectionSnapBeforeDelete.docs).toHaveLength(5);

    await FirebaseUtil.deleteCollection(collectionRef);

    const collectionSnapAfterDelete = await collectionRef.get();
    expect(collectionSnapAfterDelete.empty).toBe(true);
  }, 10000);

  it("successfully pings Firestore", async () => {
    await FirebaseUtil.pingFireStore();
    expect(true).toBeTruthy(); // If we reach this line, the test has passed
  });

  it("successfully gets data of users from array of IDs", async () => {
    const usersIds = [
      "pVRUMRjvafgAmDDCWHg28A6l5Ry1",
      "kfbQc6OW1dTB6JxWKuThIqqNXrd2",
    ];

    const usersData = await FirebaseUtil.getUsersFromArray(usersIds);

    expect(usersData[usersIds[0]].email).toBeDefined();
    expect(usersData[usersIds[1]].email).toBeDefined();
  });

  describe("batch Operations", () => {
    const TEST_DOC_REF = dbCollections.users().doc("testUserId");

    const addDummyBatchOperations = (qty = 750) => {
      for (let i = 0; i < qty; i += 1) {
        FirebaseUtil.addBatchOperation("update", TEST_DOC_REF, {
          [`f${i.toString()}`]: Math.random().toString().substring(2, 7),
        });
      }
    };

    it("successfully divides batches operations in groups of 500", () => {
      addDummyBatchOperations();

      expect(FirebaseUtil.batchesQty).toBeGreaterThan(1);
      expect(FirebaseUtil.batchSizes.every((size) => size <= 500)).toBe(true);

      FirebaseUtil.cancelBatchOperations();
    });

    it("successfully clears batches operations", () => {
      addDummyBatchOperations();

      FirebaseUtil.cancelBatchOperations();

      expect(FirebaseUtil.batchesQty).toBe(1);
      expect(FirebaseUtil.batchSizes.every((size) => size === 0)).toBe(true);
    });

    it("successfully runs divided batch operations", async () => {
      addDummyBatchOperations();

      await FirebaseUtil.runBatchOperations();
      expect(true).toBeTruthy(); // If we reach this line, the test has passed
    }, 10000);
  });
});
