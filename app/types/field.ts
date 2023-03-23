export type Field = {
  className?: string;
  defaultImage?: React.ReactNode;
  helpText?: string;
  label?: string;
  name: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  span?: number;
  type?:
    | "checkboxes"
    | "colors"
    | "email"
    | "hidden"
    | "image"
    | "number"
    | "select"
    | "text"
    | "textarea"
    | "time"
    | "url";
  value?: string | string[];
};
