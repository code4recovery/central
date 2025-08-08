import type { ZodEffects, ZodLiteral, ZodUnion } from "zod";

import type { InputType } from "./input-type";
import type { Option } from "./option";

export type Field = {
  adminOnly?: boolean;
  className?: string;
  defaultValue?: number | string | string[];
  disabled?: boolean;
  helpText?: string;
  label?: string;
  options?: Option[];
  placeholder?: string;
  required?: boolean;
  span?: number;
  streetAddressOnly?: boolean;
  type:
    | "checkbox"
    | "checkboxes"
    | "colors"
    | "geocode"
    | "hidden"
    | "select"
    | "select-multiple"
    | "textarea"
    | InputType;
  validation?:
    | ZodEffects<any, any, any>
    | ZodUnion<
        [
          ZodEffects<ZodLiteral<string>, boolean, string>,
          ZodEffects<ZodLiteral<undefined>, boolean, undefined>,
        ]
      >;
};
