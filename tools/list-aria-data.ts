import { aria, roles } from "aria-query";
import { z } from "zod";

export const ListAriaDataInputSchema = {
  type: z.enum(["roles", "attributes", "both"]).describe(
    "Type of ARIA data to list",
  ),
};

const ListAriaDataInputSchemaObject = z.object(ListAriaDataInputSchema);

interface AriaAttributeInfo {
  name: string;
  type: string;
  values?: (string | boolean)[];
  isAllowUndefined?: boolean;
}

interface AriaRoleInfo {
  name: string;
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

export function listAriaData(
  input: z.infer<typeof ListAriaDataInputSchemaObject>,
): ListAriaDataResult {
  const { type } = input;
  const result: ListAriaDataResult = {};

  // List roles
  if (type === "roles" || type === "both") {
    const rolesList: AriaRoleInfo[] = [];

    for (const [roleName, roleData] of roles.entries()) {
      rolesList.push({
        name: roleName,
        requiredProps: Object.keys(roleData.requiredProps),
        supportedProps: Object.keys(roleData.props),
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
        isAllowUndefined: attrData.allowundefined,
      };

      if (attrData.values) {
        attrInfo.values = attrData.values;
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
