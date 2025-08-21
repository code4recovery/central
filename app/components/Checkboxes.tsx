import { useState } from "react";

import { config, formatClasses as cx } from "~/helpers";
import { useTranslation, useUser } from "~/hooks";
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
  values?: number | string | string[];
  optionsInUse?: string[];
  className?: string;
}) {
  const {
    theme: { focusRing, text },
  } = useUser();
  const [showAll, setShowAll] = useState(false);
  const strings = useTranslation();

  if (!options) return null;
  return (
    <>
      <div className="grid grid-cols-3 items-start gap-x-5 gap-y-3 lg:grid-cols-4">
        {options
          .filter(
            ({ value }) =>
              showAll || !optionsInUse?.length || optionsInUse?.includes(value),
          )
          .map(({ value: optionValue, label }) => (
            <div className="items-top m-0 flex gap-2" key={optionValue}>
              <input
                className={cx(
                  config.classes.checkbox,
                  focusRing,
                  text,
                  className,
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
                className="truncate text-sm"
                htmlFor={optionValue}
                title={label}
              >
                {label}
              </label>
            </div>
          ))}
      </div>
      {!!optionsInUse?.length && optionsInUse.length !== options.length && (
        <div className="mt-3 flex justify-end">
          <button
            className="rounded bg-neutral-200 px-2 py-1 text-sm text-neutral-500 hover:bg-neutral-300 hover:text-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            onClick={() => setShowAll(!showAll)}
            type="button"
          >
            {showAll
              ? strings.meetings.hide_not_in_use
              : strings.meetings.show_all}
          </button>
        </div>
      )}
    </>
  );
}
