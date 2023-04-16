import { config, formatClasses as cx } from "~/helpers";
import type { Field } from "~/types";

export function Checkbox({
  className,
  helpText,
  name,
  defaultChecked,
}: Partial<Field> & { name: string; defaultChecked?: string | string[] }) {
  return (
    <label className="flex gap-2 text-sm text-neutral-500">
      <input
        type="checkbox"
        className={cx(className, config.checkboxClassNames)}
        name={name}
        defaultChecked={!!defaultChecked}
      />
      {helpText}
    </label>
  );
}
