import { useState } from "react";

import { Listbox } from "@headlessui/react";

import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { config, formatClasses as cx } from "~/helpers";
import { useUser } from "~/hooks";
import type { Option } from "~/types";

export const SelectMultiple = ({
  name,
  options,
}: {
  name: string;
  options?: Option[];
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const {
    theme: { background, focusRing },
  } = useUser();

  return (
    <div className="relative">
      <Listbox
        name={name}
        multiple
        value={selectedValues}
        onChange={setSelectedValues}
      >
        <Listbox.Button
          className={cx(
            config.classes.field,
            focusRing,
            "focus:outline-none relative  h-9"
          )}
        >
          <span className="block truncate text-left">
            {selectedValues
              .sort((a, b) => {
                const aIndex = options?.findIndex((o) => o.value === a) ?? 0;
                const bIndex = options?.findIndex((o) => o.value === b) ?? 0;
                return aIndex - bIndex;
              })
              .map((option) => options?.find((o) => o.value === option)?.label)
              .join(", ")}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-neutral-100 dark:bg-neutral-900 py-1 text-lg shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
          {options?.map((option) => (
            <Listbox.Option
              key={option.value}
              value={option.value}
              className={({ active }) =>
                cx("relative select-none py-1.5 pl-10 pr-4", {
                  [background]: active,
                })
              }
            >
              {({ selected }) => (
                <>
                  <span
                    className={cx("block truncate", {
                      "font-bold": selected,
                      "font-normal": !selected,
                    })}
                  >
                    {option.label}
                  </span>
                  {selected ? (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
};
