import { roles } from "aria-query";
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
  accessibleNameRequired?: boolean;
  error?: string;
}

export function validateRole(input: ValidateRoleInput): ValidateRoleResult {
  const { role } = input;

  const roleData = roles.get(role);

  if (!roleData) {
    return {
      isValid: false,
      error: `Role "${role}" is not a valid ARIA role`,
    };
  }

  const requiredProps = Array.from(roleData.requiredProps || []) as string[];
  const supportedProps = Array.from(roleData.props || []) as string[];
  const isAbstract = roleData.abstract || false;
  const accessibleNameRequired = roleData.accessibleNameRequired || false;

  return {
    isValid: true,
    role,
    isAbstract,
    requiredProps,
    supportedProps,
    accessibleNameRequired,
  };
}
