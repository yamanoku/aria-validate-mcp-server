import { assertEquals, assertExists } from "@std/assert";
import { validateRole } from "./validate-role.ts";

Deno.test("validateRole - 既存のARIAロールを検証できる", () => {
  const result = validateRole({ role: "button" });

  assertEquals(result.isValid, true);
  assertEquals(result.role, "button");
  assertExists(result.isAbstract);
  assertExists(result.requiredProps);
  assertExists(result.supportedProps);
  assertEquals(result.error, undefined);
});

Deno.test("validateRole - 存在しないARIAロールを拒否する", () => {
  const result = validateRole({ role: "invalid-role" });

  assertEquals(result.isValid, false);
  assertExists(result.error);
  assertEquals(result.error, 'Role "invalid-role" is not a valid ARIA role');
  assertEquals(result.role, undefined);
  assertEquals(result.isAbstract, undefined);
  assertEquals(result.requiredProps, undefined);
  assertEquals(result.supportedProps, undefined);
});

Deno.test("validateRole - 具体的なロールに対してisAbstractがfalseを返す", () => {
  const result = validateRole({ role: "button" });

  assertEquals(result.isValid, true);
  assertEquals(result.isAbstract, false);
});

Deno.test("validateRole - 抽象ロールに対してisAbstractがtrueを返す", () => {
  const result = validateRole({ role: "command" });

  assertEquals(result.isValid, true);
  assertEquals(result.isAbstract, true);
});

Deno.test("validateRole - requiredPropsを配列として返す", () => {
  const result = validateRole({ role: "button" });

  assertEquals(result.isValid, true);
  assertExists(result.requiredProps);
  assertEquals(Array.isArray(result.requiredProps), true);
});

Deno.test("validateRole - supportedPropsを配列として返す", () => {
  const result = validateRole({ role: "button" });

  assertEquals(result.isValid, true);
  assertExists(result.supportedProps);
  assertEquals(Array.isArray(result.supportedProps), true);
});

Deno.test("validateRole - 様々な一般的なロールを検証できる", () => {
  const commonRoles = [
    "button",
    "navigation",
    "main",
    "banner",
    "contentinfo",
    "complementary",
    "form",
    "search",
    "article",
    "region",
  ];

  for (const role of commonRoles) {
    const result = validateRole({ role });

    assertEquals(result.isValid, true, `Role "${role}" should be valid`);
    assertEquals(result.role, role);
    assertExists(result.requiredProps);
    assertExists(result.supportedProps);
  }
});

Deno.test("validateRole - dialogロールとそのプロパティを検証できる", () => {
  const result = validateRole({ role: "dialog" });

  assertEquals(result.isValid, true);
  assertEquals(result.role, "dialog");
  assertExists(result.supportedProps);

  // Dialog should support aria-modal
  assertEquals(result.supportedProps?.includes("aria-modal"), true);
});

Deno.test("validateRole - checkboxロールとその必須プロパティを検証できる", () => {
  const result = validateRole({ role: "checkbox" });

  assertEquals(result.isValid, true);
  assertEquals(result.role, "checkbox");
  assertExists(result.requiredProps);

  // Checkbox requires aria-checked
  assertEquals(result.requiredProps?.includes("aria-checked"), true);
});

Deno.test("validateRole - headingロールとその必須プロパティを検証できる", () => {
  const result = validateRole({ role: "heading" });

  assertEquals(result.isValid, true);
  assertEquals(result.role, "heading");
  assertExists(result.requiredProps);

  // Heading requires aria-level
  assertEquals(result.requiredProps?.includes("aria-level"), true);
});

Deno.test("validateRole - 必須プロパティのないロールを処理できる", () => {
  const result = validateRole({ role: "button" });

  assertEquals(result.isValid, true);
  assertExists(result.requiredProps);
  assertEquals(Array.isArray(result.requiredProps), true);
  // Button has no required props, so array should be empty
  assertEquals(result.requiredProps?.length, 0);
});

Deno.test("validateRole - 抽象ロールを検証できる", () => {
  const abstractRoles = [
    "command",
    "composite",
    "input",
    "landmark",
    "range",
    "roletype",
    "section",
    "sectionhead",
    "select",
    "structure",
    "widget",
    "window",
  ];

  for (const role of abstractRoles) {
    const result = validateRole({ role });

    assertEquals(result.isValid, true, `Abstract role "${role}" should be valid`);
    assertEquals(result.isAbstract, true, `Role "${role}" should be abstract`);
  }
});

Deno.test("validateRole - 大文字小文字を区別するロール名を処理できる", () => {
  // ARIA roles are case-sensitive and should be lowercase
  const resultLower = validateRole({ role: "button" });
  const resultUpper = validateRole({ role: "BUTTON" });

  assertEquals(resultLower.isValid, true);
  assertEquals(resultUpper.isValid, false);
});

Deno.test("validateRole - 複数のサポートされるプロパティを持つロールを検証できる", () => {
  const result = validateRole({ role: "combobox" });

  assertEquals(result.isValid, true);
  assertExists(result.supportedProps);
  assertEquals(result.supportedProps!.length > 0, true);

  // Combobox should support various aria properties
  const props = result.supportedProps!;
  assertEquals(props.includes("aria-expanded"), true);
  assertEquals(props.includes("aria-controls"), true);
});

Deno.test("validateRole - 同じロールに対して一貫した結果を返す", () => {
  const result1 = validateRole({ role: "navigation" });
  const result2 = validateRole({ role: "navigation" });

  assertEquals(result1.isValid, result2.isValid);
  assertEquals(result1.role, result2.role);
  assertEquals(result1.isAbstract, result2.isAbstract);
  assertEquals(result1.requiredProps?.length, result2.requiredProps?.length);
  assertEquals(
    result1.supportedProps?.length,
    result2.supportedProps?.length,
  );
});

Deno.test("validateRole - 空文字列のロールを処理できる", () => {
  const result = validateRole({ role: "" });

  assertEquals(result.isValid, false);
  assertExists(result.error);
});

Deno.test("validateRole - ロール名の空白文字を処理できる", () => {
  const result = validateRole({ role: " button " });

  // Whitespace should not be trimmed automatically
  assertEquals(result.isValid, false);
  assertExists(result.error);
});
