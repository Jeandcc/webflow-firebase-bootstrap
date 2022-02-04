import AppSecrets from "./AppSecrets";

describe("app Secrets", () => {
  const initialNodeEnv = process.env.NODE_ENV;

  afterAll(() => {
    process.env.NODE_ENV = initialNodeEnv;
  });

  it("successfully gets secret from 'prod' environment", async () => {
    process.env.NODE_ENV = "production";
    await expect(AppSecrets.get("WF_API-KEY")).resolves.toBeTruthy();
  });

  it("successfully gets secret from 'dev' environment", async () => {
    process.env.NODE_ENV = "development";

    const secretName = "TEST_SECRET";
    const expectedValue = "TEST_SECRET_VALUE";

    await expect(AppSecrets.get(secretName)).resolves.toBe(expectedValue);
  });
});
