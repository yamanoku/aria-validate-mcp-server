import { type ARIARoleDefinitionKey, roles } from "aria-query";
import { z } from "zod";

export const ValidateRoleInputSchema = z.object({
  role: z.string().describe("The ARIA role to validate"),
});

export type ValidateRoleInput = z.infer<typeof ValidateRoleInputSchema>;

interface ValidateRoleResult {
  isValid: boolean;
  role?: string;
  isAbstract?: boolean;
  requiredProps?: string[];
  supportedProps?: string[];
  error?: string;
}

export function validateRole(input: ValidateRoleInput): ValidateRoleResult {
  const { role } = input;

  const roleData = roles.get(role as ARIARoleDefinitionKey);

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
