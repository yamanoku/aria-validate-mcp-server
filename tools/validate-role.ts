import { type ARIARoleDefinitionKey, roles } from "aria-query";
import { z } from "zod";

const availableRoles = Array.from(roles.keys()) as ARIARoleDefinitionKey[];
export const ValidateRoleInputSchema = {
  role: z.enum(
    availableRoles as [ARIARoleDefinitionKey, ...ARIARoleDefinitionKey[]],
  )
    .describe(
      "The ARIA role to validate - must be one of the valid ARIA roles",
    ),
};
const ValidateRoleInputSchemaObject = z.object(ValidateRoleInputSchema);

interface ValidateRoleResult {
  isValid: boolean;
  role?: string;
  isAbstract?: boolean;
  requiredProps?: string[];
  supportedProps?: string[];
  error?: string;
}

export function validateRole(
  input: z.infer<typeof ValidateRoleInputSchemaObject>,
): ValidateRoleResult {
  const { role } = input;

  const roleData = roles.get(role);

  if (!roleData) {
    return {
      isValid: false,
      error: `Role "${role}" is not a valid ARIA role`,
    };
  }

  const requiredProps = Object.keys(roleData.requiredProps);
  const supportedProps = Object.keys(roleData.props);
  const isAbstract = roleData.abstract || false;

  return {
    isValid: true,
    role,
    isAbstract,
    requiredProps,
    supportedProps,
  };
}
