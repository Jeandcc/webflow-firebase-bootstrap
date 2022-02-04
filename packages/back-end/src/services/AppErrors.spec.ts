import AppErrors, { TApplicationError } from "./AppErrors";

describe("app Errors", () => {
  const ERROR_LABEL: TApplicationError = "AUTH/UNAUTHORIZED";

  it("successfully constructs error object without details", () => {
    const errorObj = AppErrors(ERROR_LABEL);

    expect(errorObj.message).toBe(ERROR_LABEL);
    expect(errorObj.code).toBe("permission-denied");
    expect(errorObj.httpErrorCode.status).toBe(403);
  });

  it("successfully constructs error object with details", () => {
    const errorObj = AppErrors(ERROR_LABEL, { reason: "TEST" });

    expect(errorObj.message).toBe(ERROR_LABEL);
    expect(errorObj.code).toBe("permission-denied");
    expect(errorObj.httpErrorCode.status).toBe(403);
    expect((errorObj.details as { reason: string }).reason).toBe("TEST");
  });
});
