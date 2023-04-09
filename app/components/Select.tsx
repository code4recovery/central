import { config, formatClasses as cx } from "~/helpers";
import { useUser } from "~/hooks";
import { Option } from "~/types";

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

  const groups = [...new Set(options.map(({ group }) => group))];

  return (
    <select
      name={name}
      id={name}
      className={cx(config.fieldClassNames, focusRing, className)}
      defaultValue={defaultValue}
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
