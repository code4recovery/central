import { useState } from "react";

import { config, formatClasses as cx } from "~/helpers";
import { useUser } from "~/hooks";
import type { Option } from "~/types";

export function Checkboxes({
  name,
  options,
  values,
  optionsInUse,
  className,
}: {
  name: string;
  options?: Option[];
  values?: string | string[];
  optionsInUse?: string[];
  className?: string;
}) {
  const {
    theme: { focusRing, text },
  } = useUser();
  const [showAll, setShowAll] = useState(false);

  if (!options) return null;
  return (
    <>
      <div className="items-start gap-x-5 gap-y-3 grid grid-cols-3 lg:grid-cols-4">
        {options
          .filter(({ value }) => showAll || optionsInUse?.includes(value))
          .map(({ value: optionValue, label }) => (
            <div className="flex items-top gap-2 m-0" key={optionValue}>
              <input
                className={cx(
                  config.checkboxClassNames,
                  focusRing,
                  text,
                  className
                )}
                defaultChecked={
                  Array.isArray(values) && values?.includes(optionValue)
                }
                id={optionValue}
                name={name}
                type="checkbox"
                value={optionValue}
              />
              <label
                className="text-sm truncate"
                htmlFor={optionValue}
                title={label}
              >
                {label}
              </label>
            </div>
          ))}
      </div>
      {optionsInUse && optionsInUse.length !== options.length && (
        <div className="flex justify-end mt-3">
          <button
            className={cx(text, "text-sm text-left")}
            onClick={() => setShowAll(!showAll)}
            type="button"
          >
            {showAll ? "Hide not in use" : "Show all"}
          </button>
        </div>
      )}
    </>
  );
}
