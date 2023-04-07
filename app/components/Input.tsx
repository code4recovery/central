import { useField } from "remix-validated-form";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

import { config, formatClasses as cx } from "~/helpers";
import { useUser } from "~/hooks";
import type { Field } from "~/types";
import { HelpText } from "./HelpText";

export function Input({
  autoFocus,
  className,
  defaultValue,
  helpText,
  name,
  placeholder,
  required,
  type,
}: Partial<Field> & {
  autoFocus?: boolean;
  defaultValue?: string | string[];
  name: string;
}) {
  const {
    theme: { focusRing },
  } = useUser();
  const { error, getInputProps } = useField(name);
  return (
    <>
      <div className="relative">
        <input
          {...getInputProps()}
          autoFocus={autoFocus || undefined}
          className={cx(config.fieldClassNames, focusRing, className, {
            "ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500":
              !!error,
          })}
          defaultValue={defaultValue}
          id={name}
          name={name}
          placeholder={placeholder}
          required={required}
          type={type}
        />
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-label={error}
            />
          </div>
        )}
      </div>
      <HelpText helpText={helpText} error={error} />
    </>
  );
}
