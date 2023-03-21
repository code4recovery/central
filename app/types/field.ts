export type Field = {
  name: string;
  label: string;
  type:
    | "checkboxes"
    | "colors"
    | "email"
    | "image"
    | "number"
    | "select"
    | "text"
    | "textarea"
    | "time"
    | "url";
  span?: number;
  options?: { value: string; label: string }[];
  helpText?: string;
  placeholder?: string;
  value?: string | string[];
  defaultImage?: React.ReactNode;
};
