import { assertEquals, assertExists } from "@std/assert";
import { validateAriaAttribute } from "./validate-aria.ts";

Deno.test("validateAriaAttribute - 値なしで既存のARIA属性を検証できる", () => {
  const result = validateAriaAttribute({ attribute: "aria-label" });

  assertEquals(result.isValid, true);
  assertEquals(result.attribute, "aria-label");
  assertEquals(result.type, "string");
  assertEquals(result.error, undefined);
  assertEquals(result.valueValid, undefined);
});

Deno.test("validateAriaAttribute - 存在しないARIA属性を拒否する", () => {
  const result = validateAriaAttribute({ attribute: "aria-invalid-attr" });

  assertEquals(result.isValid, false);
  assertExists(result.error);
  assertEquals(
    result.error,
    'ARIA attribute "aria-invalid-attr" does not exist',
  );
});

Deno.test("validateAriaAttribute - 有効な値を持つboolean型を検証できる", () => {
  const resultTrue = validateAriaAttribute({
    attribute: "aria-hidden",
    value: "true",
  });
  const resultFalse = validateAriaAttribute({
    attribute: "aria-hidden",
    value: "false",
  });

  assertEquals(resultTrue.isValid, true);
  assertEquals(resultTrue.valueValid, true);
  assertEquals(resultTrue.type, "boolean");

  assertEquals(resultFalse.isValid, true);
  assertEquals(resultFalse.valueValid, true);
});

Deno.test("validateAriaAttribute - 無効な値を持つboolean型を拒否する", () => {
  const result = validateAriaAttribute({
    attribute: "aria-hidden",
    value: "yes",
  });

  assertEquals(result.isValid, false);
  assertEquals(result.valueValid, false);
  assertExists(result.error);
});

Deno.test("validateAriaAttribute - tristate型を検証できる", () => {
  const validValues = ["true", "false", "mixed"];

  for (const value of validValues) {
    const result = validateAriaAttribute({
      attribute: "aria-pressed",
      value,
    });

    assertEquals(result.isValid, true, `Value "${value}" should be valid`);
    assertEquals(result.valueValid, true);
    assertEquals(result.type, "tristate");
  }
});

Deno.test("validateAriaAttribute - 無効なtristate値を拒否する", () => {
  const result = validateAriaAttribute({
    attribute: "aria-pressed",
    value: "invalid",
  });

  assertEquals(result.isValid, false);
  assertEquals(result.valueValid, false);
  assertExists(result.error);
});

Deno.test("validateAriaAttribute - 定義済みの値を持つtoken型を検証できる", () => {
  const result = validateAriaAttribute({
    attribute: "aria-current",
    value: "page",
  });

  assertEquals(result.isValid, true);
  assertEquals(result.valueValid, true);
  assertEquals(result.type, "token");
  assertExists(result.values);
});

Deno.test("validateAriaAttribute - 無効なtoken値を拒否する", () => {
  const result = validateAriaAttribute({
    attribute: "aria-current",
    value: "invalid-token",
  });

  assertEquals(result.isValid, false);
  assertEquals(result.valueValid, false);
});

Deno.test("validateAriaAttribute - 単一トークンのtokenlist型を検証できる", () => {
  const result = validateAriaAttribute({
    attribute: "aria-relevant",
    value: "additions",
  });

  assertEquals(result.isValid, true);
  assertEquals(result.valueValid, true);
  assertEquals(result.type, "tokenlist");
});

Deno.test("validateAriaAttribute - 複数トークンのtokenlist型を検証できる", () => {
  const result = validateAriaAttribute({
    attribute: "aria-relevant",
    value: "additions text",
  });

  assertEquals(result.isValid, true);
  assertEquals(result.valueValid, true);
});

Deno.test("validateAriaAttribute - 無効なtokenlist値を拒否する", () => {
  const result = validateAriaAttribute({
    attribute: "aria-relevant",
    value: "invalid-token",
  });

  assertEquals(result.isValid, false);
  assertEquals(result.valueValid, false);
});

Deno.test("validateAriaAttribute - integer型を検証できる", () => {
  const validIntegers = ["0", "1", "-1", "100"];

  for (const value of validIntegers) {
    const result = validateAriaAttribute({
      attribute: "aria-level",
      value,
    });

    assertEquals(result.isValid, true, `Integer "${value}" should be valid`);
    assertEquals(result.valueValid, true);
  }
});

Deno.test("validateAriaAttribute - 無効なinteger値を拒否する", () => {
  const invalidIntegers = ["1.5", "abc", "1.0"];

  for (const value of invalidIntegers) {
    const result = validateAriaAttribute({
      attribute: "aria-level",
      value,
    });

    assertEquals(
      result.isValid,
      false,
      `Integer "${value}" should be invalid`,
    );
    assertEquals(result.valueValid, false);
  }
});

Deno.test("validateAriaAttribute - number型を検証できる", () => {
  const validNumbers = ["0", "1", "1.5", "-1.5", "100.25"];

  for (const value of validNumbers) {
    const result = validateAriaAttribute({
      attribute: "aria-valuemax",
      value,
    });

    assertEquals(result.isValid, true, `Number "${value}" should be valid`);
    assertEquals(result.valueValid, true);
  }
});

Deno.test("validateAriaAttribute - 無効なnumber値を拒否する", () => {
  const result = validateAriaAttribute({
    attribute: "aria-valuemax",
    value: "not-a-number",
  });

  assertEquals(result.isValid, false);
  assertEquals(result.valueValid, false);
});

Deno.test("validateAriaAttribute - string型を検証できる", () => {
  const result = validateAriaAttribute({
    attribute: "aria-label",
    value: "This is a label",
  });

  assertEquals(result.isValid, true);
  assertEquals(result.valueValid, true);
  assertEquals(result.type, "string");
});

Deno.test("validateAriaAttribute - idlist型を検証できる", () => {
  const validIdLists = ["id1", "id1 id2", "id1 id2 id3"];

  for (const value of validIdLists) {
    const result = validateAriaAttribute({
      attribute: "aria-labelledby",
      value,
    });

    assertEquals(result.isValid, true, `ID list "${value}" should be valid`);
    assertEquals(result.valueValid, true);
  }
});

Deno.test("validateAriaAttribute - 無効なidlist値を拒否する", () => {
  const invalidIdLists = ["", " ", " id1"];

  for (const value of invalidIdLists) {
    const result = validateAriaAttribute({
      attribute: "aria-labelledby",
      value,
    });

    assertEquals(
      result.isValid,
      false,
      `ID list "${value}" should be invalid`,
    );
    assertEquals(result.valueValid, false);
  }
});

Deno.test("validateAriaAttribute - 定義されている場合はallowundefinedプロパティを含む", () => {
  const result = validateAriaAttribute({ attribute: "aria-label" });

  // isAllowUndefined may or may not be defined depending on the attribute
  // If it exists, it should be a boolean
  if (result.isAllowUndefined !== undefined) {
    assertEquals(typeof result.isAllowUndefined, "boolean");
  }
});

Deno.test("validateAriaAttribute - 空文字列の値を処理できる", () => {
  const result = validateAriaAttribute({
    attribute: "aria-label",
    value: "",
  });

  // Empty string is a valid string
  assertEquals(result.isValid, true);
  assertEquals(result.valueValid, true);
});

Deno.test("validateAriaAttribute - エラーメッセージに属性名と期待される型を含む", () => {
  const result = validateAriaAttribute({
    attribute: "aria-hidden",
    value: "invalid",
  });

  assertEquals(result.isValid, false);
  assertExists(result.error);
  assertEquals(result.error?.includes("aria-hidden"), true);
  assertEquals(result.error?.includes("boolean"), true);
});
