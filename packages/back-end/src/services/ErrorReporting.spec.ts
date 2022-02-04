import ErrorReporting from "./ErrorReporting";

describe("error reporting", () => {
  const initialNodeEnv = process.env.NODE_ENV;

  beforeAll(() => {
    process.env.NODE_ENV = "production";
  });

  afterAll(() => {
    process.env.NODE_ENV = initialNodeEnv;
  });

  it("successfully reports an error without details", async () => {
    await ErrorReporting.report("TEST - Error report 1");
    expect(true).toBeTruthy(); // If we reach this line, the test has passed
  });

  it("successfully reports an error with details", async () => {
    await ErrorReporting.report("TEST - Error report 2", {
      message: "TEST",
    });
    expect(true).toBeTruthy(); // If we reach this line, the test has passed
  });
});
