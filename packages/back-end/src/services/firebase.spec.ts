import { FireAuth, FireDb } from "./firebase";

describe("firebase", () => {
  const TEST_USER_ID = "kfbQc6OW1dTB6JxWKuThIqqNXrd2";
  const TEST_USER_EMAIL = "jean.adcc@gmail.com";

  it("successfully performs an operation with Firebase Auth", async () => {
    const result = await FireAuth.getUser(TEST_USER_ID);
    expect(result.email).toBe(TEST_USER_EMAIL);
  });

  it("successfully performs an operation with Firebase Firestore", async () => {
    const result = await FireDb.collection("users").doc(TEST_USER_ID).get();
    expect(result.exists).toBe(true);
  });
});
