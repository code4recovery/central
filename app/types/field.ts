import type { ZodEffects, ZodUnion, ZodLiteral } from "zod";

import type { InputType } from "./input-type";

export type Field = {
  adminOnly?: boolean;
  className?: string;
  helpText?: string;
  label?: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  span?: number;
  type:
    | "checkbox"
    | "checkboxes"
    | "colors"
    | "hidden"
    | "select"
    | "textarea"
    | InputType;
  validation:
    | ZodEffects<any, any, any>
    | ZodUnion<
        [
          ZodEffects<ZodLiteral<string>, boolean, string>,
          ZodEffects<ZodLiteral<undefined>, boolean, undefined>
        ]
      >;
};
