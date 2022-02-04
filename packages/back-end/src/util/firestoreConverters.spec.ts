import {
  collectionConverter,
  collectionGroupConverter,
} from "./firestoreConverters";

interface ITestInterface {
  field1: string;
  field2: number;
}

describe("firestore Converters", () => {
  describe("collection References", () => {
    const testCollectionPath = "users/user1234/notifications";
    const collectionRef =
      collectionConverter<ITestInterface>(testCollectionPath);

    it("has the expected properties inside collection object", () => {
      // There are more methods that could be checked, but if the test
      // passes these ones, it should be enough.

      expect(collectionRef.get).toBeDefined();
      expect(collectionRef.add).toBeDefined();
      expect(collectionRef.where).toBeDefined();
      expect(collectionRef.doc).toBeDefined();
      expect(collectionRef.path).toBe(testCollectionPath);
    });

    it("has the expected properties inside document object", () => {
      const testCommentId = "comment1213";
      const docRef = collectionRef.doc(testCommentId);

      expect(docRef.set).toBeDefined();
      expect(docRef.update).toBeDefined();
      expect(docRef.get).toBeDefined();
      expect(docRef.id).toBe(testCommentId);
    });
  });

  describe("collection Group References", () => {
    const collectionPath = "users";
    const groupRef = collectionGroupConverter<ITestInterface>(collectionPath);

    it("has the expected properties inside col. group object", () => {
      // There are more methods that could be checked, but if the test
      // passes these ones, it should be enough.

      expect(groupRef.get).toBeDefined();
      expect(groupRef.where).toBeDefined();
    });
  });
});
