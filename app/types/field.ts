import type { ZodEffects, ZodUnion, ZodLiteral } from "zod";

import type { InputType } from "./input-type";
import type { Option } from "./option";

export type Field = {
  adminOnly?: boolean;
  className?: string;
  helpText?: string;
  label?: string;
  options?: Option[];
  placeholder?: string;
  required?: boolean;
  span?: number;
  type:
    | "checkbox"
    | "checkboxes"
    | "colors"
    | "combobox"
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
