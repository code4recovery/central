import { InputType } from "./input-type";

export type Field = {
  className?: string;
  defaultImage?: React.ReactNode;
  helpText?: string;
  label?: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  span?: number;
  type:
    | "checkboxes"
    | "colors"
    | "hidden"
    | "image"
    | "select"
    | "textarea"
    | InputType;
  value?: string | string[];
};
