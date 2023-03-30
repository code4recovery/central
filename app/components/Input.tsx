import { config } from "~/helpers";
import { useUser } from "~/hooks";
import { formatClasses as cx } from "~/helpers";
import { InputType } from "~/types";

export function Input({
  autoFocus,
  className,
  name,
  placeholder,
  required,
  type,
  value,
}: {
  autoFocus?: boolean;
  className?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type: InputType;
  value?: string;
}) {
  const {
    theme: { focusRing },
  } = useUser();
  return (
    <input
      autoComplete="off"
      autoFocus={autoFocus}
      className={cx(config.fieldClassNames, focusRing, className)}
      defaultValue={value ? `${value}` : undefined}
      id={name}
      name={name}
      placeholder={placeholder}
      required={required}
      type={type}
    />
  );
}
