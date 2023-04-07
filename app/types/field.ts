import type { ZodEffects } from "zod";

import type { InputType } from "./input-type";

export type Field = {
  className?: string;
  helpText?: string;
  label?: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  span?: number;
  type: "checkboxes" | "colors" | "hidden" | "select" | "textarea" | InputType;
  validation?: ZodEffects<any, string | undefined, string | undefined>;
};
