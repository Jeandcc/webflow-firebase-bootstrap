import * as yup from "yup";

import PayloadValidator from "./Payload";

describe("payload validator", () => {
  const REQUIRED_SHAPE = yup.object().shape({
    field1: yup.string().required(),
    field2: yup.string().required(),
  });

  it("allows valid object", async () => {
    const validInput = {
      field1: "This is the field 1 value",
      field2: "This is the field 2 value",
    };

    await PayloadValidator.validate(REQUIRED_SHAPE, validInput);
    expect(true).toBeTruthy(); // If we reach this line, the test has passed
  });

  it("throws error on invalid object", async () => {
    const invalidInput = { field1: "This is the field 1 value" };

    await expect(
      PayloadValidator.validate(REQUIRED_SHAPE, invalidInput)
    ).rejects.toThrow("ValidationError");
  });
});
