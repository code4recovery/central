import { getAccount } from "~/data";
import { config } from "~/helpers";
import { formatClasses as cx } from "~/helpers";

export function Input({
  autoComplete,
  autoFocus,
  className,
  name,
  placeholder,
  required,
  type,
  value,
}: {
  autoComplete?: "email";
  autoFocus?: boolean;
  className?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type: "email" | "number" | "text" | "time" | "url";
  value?: string;
}) {
  const {
    theme: { focusRing },
  } = getAccount();

  return (
    <input
      autoComplete={autoComplete}
      className={cx(className, focusRing, config.fieldClassNames)}
      defaultValue={value ? `${value}` : undefined}
      id={name}
      name={name}
      placeholder={placeholder}
      required={required}
      type={type}
      autoFocus={autoFocus}
    />
  );
}
