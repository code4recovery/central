import { useField } from "remix-validated-form";

import { HelpText } from "./HelpText";
import { config, formatClasses as cx } from "~/helpers";
import { useUser } from "~/hooks";
import type { Field } from "~/types";

export function Textarea({
  className,
  defaultValue,
  helpText,
  name,
  placeholder,
  required,
}: Partial<Field> & { defaultValue?: string | string[]; name: string }) {
  const { error, getInputProps } = useField(name);
  const {
    theme: { focusRing },
  } = useUser();
  return (
    <>
      <textarea
        {...getInputProps}
        className={cx(focusRing, config.fieldClassNames, className)}
        defaultValue={defaultValue}
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        rows={5}
      />
      <HelpText error={error} helpText={helpText} />
    </>
  );
}
