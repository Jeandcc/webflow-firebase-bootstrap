import StringUtils from "./Strings";

describe("string Utils", () => {
  it("removes substring if it exists", () => {
    const input = "Hello World";
    const expectedOutput = "World";
    const output = StringUtils.removeSubString(input, 0, 6);

    expect(output).toBe(expectedOutput);
  });

  it("adds substring correctly", () => {
    const input = "Hello";
    const stringToAdd = " World";
    const expectedOutput = "Hello World";

    const output = StringUtils.addSubString(input, 5, stringToAdd);
    expect(output).toBe(expectedOutput);
  });

  it("unslugifies string correctly", () => {
    const input = "hello-world";
    const expectedOutput = "Hello World";

    expect(StringUtils.unslugify(input)).toBe(expectedOutput);
  });

  it("correctly generates a map of object keys", async () => {
    // Third field commented out because test doesn't work when
    // user-input is needed

    const keysMap = await StringUtils.generateMappingOfFields(
      [
        { name: "Test Name", slug: "test-name", type: "Text" },
        { name: "Test Field", slug: "test-field", type: "Text" },
        // { name: "Third Field", slug: "third-field" },
      ],
      [
        { name: "Test Name", slug: "test-name", type: "Text" },
        { name: "Test Field", slug: "test-field-2", type: "Text" },
        // { name: "3rd-field", slug: "field-3" },
      ]
    );

    expect(keysMap).toStrictEqual({
      "test-name": "test-name",
      "test-field": "test-field-2",
      // "third-field": "field-3",
    });
  });
});
