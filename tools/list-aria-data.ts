import { aria, roles } from "aria-query";
import { z } from "zod";

export const LIST_AREA_ROLES_DATA_TOOL_NAME = "list_arias_roles_data";
export const LIST_AREA_ROLES_DATA_TOOL_TITLE = "ARIA・Role属性のリスト一覧";
export const LIST_AREA_ROLES_DATA_TOOL_DESCRIPTION =
  "aria-queryから利用可能なすべてのARIAロールおよび属性をリスト表示します。フィルタリングも可能です";

export const ListAriaDataInputSchema = z.object({
  type: z.enum(["roles", "attributes", "both"]).describe(
    "Type of ARIA data to list",
  ),
});

export type ListAriaDataInput = z.infer<typeof ListAriaDataInputSchema>;

interface AriaAttributeInfo {
  name: string;
  type: string;
  values?: string[];
  allowUndefined?: boolean;
}

interface AriaRoleInfo {
  name: string;
  description: string;
  requiredProps: string[];
  supportedProps: string[];
  isAbstract?: boolean;
  relatedConcepts?: Array<{
    module?: string;
    concept?: {
      name?: string;
    };
  }>;
}

interface ListAriaDataResult {
  roles?: AriaRoleInfo[];
  attributes?: AriaAttributeInfo[];
  totalRoles?: number;
  totalAttributes?: number;
}

export function listAriaData(input: ListAriaDataInput): ListAriaDataResult {
  const { type } = input;
  const result: ListAriaDataResult = {};

  // List roles
  if (type === "roles" || type === "both") {
    const rolesList: AriaRoleInfo[] = [];

    for (const [roleName, roleData] of roles.entries()) {
      rolesList.push({
        name: roleName,
        description: roleData.name || "No description",
        requiredProps: Array.from(roleData.requiredProps || []),
        supportedProps: Array.from(roleData.props || []),
        isAbstract: roleData.abstract,
        relatedConcepts: roleData.relatedConcepts?.slice(0, 3), // Limit to first 3 for brevity
      });
    }

    // Sort by name
    rolesList.sort((a, b) => a.name.localeCompare(b.name));

    result.roles = rolesList;
    result.totalRoles = rolesList.length;
  }

  // List attributes
  if (type === "attributes" || type === "both") {
    const attributesList: AriaAttributeInfo[] = [];

    for (const [attrName, attrData] of aria.entries()) {
      const attrInfo: AriaAttributeInfo = {
        name: attrName,
        type: attrData.type,
        allowUndefined: attrData.allowUndefined,
      };

      if (attrData.values) {
        attrInfo.values = Array.from(attrData.values);
      }

      attributesList.push(attrInfo);
    }

    // Sort by name
    attributesList.sort((a, b) => a.name.localeCompare(b.name));

    result.attributes = attributesList;
    result.totalAttributes = attributesList.length;
  }

  return result;
}
