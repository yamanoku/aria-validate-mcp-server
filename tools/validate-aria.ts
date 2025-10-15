import { aria } from "aria-query";
import type { ARIAPropertyDefinition } from "aria-query";
import { z } from "zod";

export const validateAriaInputSchema = z.object({
  attribute: z.string().describe(
    "The ARIA attribute to validate (e.g., 'aria-label')",
  ),
  value: z.string().optional().describe(
    "The value to validate for the attribute",
  )
});

type ValidateAriaInput = z.infer<typeof validateAriaInputSchema>;

interface ValidateAriaResult {
  isValid: boolean;
  attribute?: string;
  type?: string;
  values?: string[];
  isAllowUndefined?: boolean;
  valueValid?: boolean;
  error?: string;
}

export function validateAriaAttribute(
  input: ValidateAriaInput,
): ValidateAriaResult {
  const { attribute, value } = input;

  // Check if attribute exists in aria-query
  const ariaData = aria.get(attribute);

  if (!ariaData) {
    return {
      isValid: false,
      error: `ARIA attribute "${attribute}" does not exist`,
    };
  }

  const result: ValidateAriaResult = {
    isValid: true,
    attribute,
    type: ariaData.type,
    isAllowUndefined: ariaData.allowundefined,
  };

  // Add values if it's a token or tokenlist type
  if (ariaData.values) {
    result.values = Array.from(ariaData.values);
  }

  // Validate value if provided
  if (value !== undefined) {
    result.valueValid = validateAriaValue(ariaData, value);
    if (!result.valueValid) {
      result.error =
        `Value "${value}" is not valid for attribute "${attribute}" (expected type: ${ariaData.type})`;
      result.isValid = false;
    }
  }

  return result;
}

function validateAriaValue(
  ariaData: ARIAPropertyDefinition,
  value: string,
): boolean {
  const { type, values } = ariaData;

  switch (type) {
    case "boolean":
      return value === "true" || value === "false";

    case "tristate":
      return value === "true" || value === "false" || value === "mixed";

    case "token":
      return values ? Array.from(values).includes(value) : true;

    case "tokenlist": {
      if (!values) return true;
      const valueList = value.split(/\s+/);
      return valueList.every((v) => Array.from(values).includes(v));
    }

    case "integer":
      return /^-?\d+$/.test(value);

    case "number":
      return !isNaN(Number(value));

    case "string":
      return typeof value === "string";

    case "idlist":
      // Basic validation for ID references
      return /^[^\s]+(\s+[^\s]+)*$/.test(value);

    default:
      return true;
  }
}
