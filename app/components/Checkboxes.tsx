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
                  config.classes.checkbox,
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
            className="text-sm bg-neutral-200 text-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-200 dark:bg-neutral-900 rounded px-2 py-1"
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
