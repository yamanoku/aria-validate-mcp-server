import { assertEquals, assertExists } from "@std/assert";
import { listAriaData } from "./list-aria-data.ts";

Deno.test("listAriaData - typeが'roles'の場合、ロールのみをリストする", () => {
  const result = listAriaData({ type: "roles" });

  assertExists(result.roles);
  assertExists(result.totalRoles);
  assertEquals(result.attributes, undefined);
  assertEquals(result.totalAttributes, undefined);
  assertEquals(result.roles.length, result.totalRoles);

  // Check that roles are sorted alphabetically
  const roleNames = result.roles.map((r) => r.name);
  const sortedNames = [...roleNames].sort();
  assertEquals(roleNames, sortedNames);

  // Check structure of first role
  if (result.roles.length > 0) {
    const firstRole = result.roles[0];
    assertExists(firstRole.name);
    assertExists(firstRole.requiredProps);
    assertExists(firstRole.supportedProps);
    assertEquals(typeof firstRole.isAbstract, "boolean");
  }
});

Deno.test("listAriaData - typeが'attributes'の場合、属性のみをリストする", () => {
  const result = listAriaData({ type: "attributes" });

  assertExists(result.attributes);
  assertExists(result.totalAttributes);
  assertEquals(result.roles, undefined);
  assertEquals(result.totalRoles, undefined);
  assertEquals(result.attributes.length, result.totalAttributes);

  // Check that attributes are sorted alphabetically
  const attrNames = result.attributes.map((a) => a.name);
  const sortedNames = [...attrNames].sort();
  assertEquals(attrNames, sortedNames);

  // Check structure of first attribute
  if (result.attributes.length > 0) {
    const firstAttr = result.attributes[0];
    assertExists(firstAttr.name);
    assertExists(firstAttr.type);
    // values and isAllowUndefined are optional
  }
});

Deno.test("listAriaData - typeが'both'の場合、ロールと属性の両方をリストする", () => {
  const result = listAriaData({ type: "both" });

  assertExists(result.roles);
  assertExists(result.attributes);
  assertExists(result.totalRoles);
  assertExists(result.totalAttributes);

  assertEquals(result.roles.length, result.totalRoles);
  assertEquals(result.attributes.length, result.totalAttributes);

  // Verify both lists are sorted
  const roleNames = result.roles.map((r) => r.name);
  const sortedRoleNames = [...roleNames].sort();
  assertEquals(roleNames, sortedRoleNames);

  const attrNames = result.attributes.map((a) => a.name);
  const sortedAttrNames = [...attrNames].sort();
  assertEquals(attrNames, sortedAttrNames);
});

Deno.test("listAriaData - ロールは期待されるプロパティを持つ", () => {
  const result = listAriaData({ type: "roles" });

  assertExists(result.roles);
  if (result.roles.length > 0) {
    const role = result.roles[0];

    // Required properties
    assertEquals(typeof role.name, "string");
    assertEquals(Array.isArray(role.requiredProps), true);
    assertEquals(Array.isArray(role.supportedProps), true);

    // Optional properties
    if (role.isAbstract !== undefined) {
      assertEquals(typeof role.isAbstract, "boolean");
    }

    if (role.relatedConcepts !== undefined) {
      assertEquals(Array.isArray(role.relatedConcepts), true);
      // Should be limited to first 3
      assertEquals(role.relatedConcepts.length <= 3, true);
    }
  }
});

Deno.test("listAriaData - 属性は期待されるプロパティを持つ", () => {
  const result = listAriaData({ type: "attributes" });

  assertExists(result.attributes);
  if (result.attributes.length > 0) {
    const attr = result.attributes[0];

    // Required properties
    assertEquals(typeof attr.name, "string");
    assertEquals(typeof attr.type, "string");

    // Optional properties
    if (attr.values !== undefined) {
      assertEquals(Array.isArray(attr.values), true);
    }

    if (attr.isAllowUndefined !== undefined) {
      assertEquals(typeof attr.isAllowUndefined, "boolean");
    }
  }
});

Deno.test("listAriaData - 複数回の呼び出しで一貫したデータを返す", () => {
  const result1 = listAriaData({ type: "both" });
  const result2 = listAriaData({ type: "both" });

  assertEquals(result1.totalRoles, result2.totalRoles);
  assertEquals(result1.totalAttributes, result2.totalAttributes);
  assertEquals(result1.roles?.length, result2.roles?.length);
  assertEquals(result1.attributes?.length, result2.attributes?.length);
});

Deno.test("listAriaData - 既知のARIA属性を含む", () => {
  const result = listAriaData({ type: "attributes" });

  assertExists(result.attributes);

  // Check for some well-known ARIA attributes
  const attrNames = result.attributes.map((a) => a.name);
  assertEquals(attrNames.includes("aria-label"), true);
  assertEquals(attrNames.includes("aria-hidden"), true);
  assertEquals(attrNames.includes("aria-expanded"), true);
});

Deno.test("listAriaData - 既知のARIAロールを含む", () => {
  const result = listAriaData({ type: "roles" });

  assertExists(result.roles);

  // Check for some well-known ARIA roles
  const roleNames = result.roles.map((r) => r.name);
  assertEquals(roleNames.includes("button"), true);
  assertEquals(roleNames.includes("navigation"), true);
  assertEquals(roleNames.includes("main"), true);
});
