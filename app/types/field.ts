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
  options?: { value: string | number; option: string }[];
  helpText?: string;
  placeholder?: string;
  value?: string | number | string[] | number[];
  defaultImage?: React.ReactNode;
};
