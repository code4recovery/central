import { config, formatClasses as cx } from "~/helpers";
import { useGeocode, useUser } from "~/hooks";
import type { Option } from "~/types";

export function Select({
  className,
  defaultValue,
  name,
  options = [],
  required,
}: {
  className?: string;
  defaultValue?: string | number;
  name: string;
  options?: Option[];
  required?: boolean;
}) {
  const {
    theme: { focusRing },
  } = useUser();
  const {
    geocode: { timezone },
  } = useGeocode();
  const value = name === "timezone" ? timezone : undefined;

  const groups = [...new Set(options.map(({ group }) => group))];

  return (
    <>
      {value && <input type="hidden" name={name} value={value} />}
      <select
        name={!value ? name : undefined}
        id={name}
        className={cx(config.fieldClassNames, focusRing, className)}
        defaultValue={!value ? defaultValue : undefined}
        value={value}
        disabled={!!value}
      >
        {!required && <option></option>}
        {groups.map((groupName) => {
          return groupName ? (
            <optgroup label={groupName} key={groupName}>
              <Options
                options={options.filter(({ group }) => group === groupName)}
              />
            </optgroup>
          ) : (
            <Options
              options={options.filter(({ group }) => !group)}
              key="ungrouped"
            />
          );
        })}
      </select>
    </>
  );
}

function Options({ options }: { options: Option[] }) {
  return (
    <>
      {options?.map(({ value: optionValue, label }) => (
        <option key={optionValue} value={`${optionValue}`}>
          {label}
        </option>
      ))}
    </>
  );
}
