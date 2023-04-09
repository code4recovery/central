import { useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";

import type { Option } from "~/types";
import { config, formatClasses as cx } from "~/helpers";
import { useUser } from "~/hooks";

export function ComboBox({
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
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState();
  const {
    theme: { focusRing },
  } = useUser();

  const filtered =
    query === ""
      ? options
      : options.filter((option) =>
          option.label.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Combobox as="div" value={selected} onChange={setSelected}>
      <div className="relative">
        <Combobox.Input
          className={cx(config.fieldClassNames, focusRing, className)}
          name={name}
          onChange={(event) => setQuery(event.target.value)}
          displayValue={({ label }: Option) => label}
          required={required}
        />
        {filtered.length > 0 && (
          <>
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>

            <Combobox.Options
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              defaultValue={defaultValue}
            >
              {filtered.map((option) => (
                <Combobox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    cx(
                      "relative cursor-default select-none py-2 pl-3 pr-9",
                      active ? "bg-indigo-600 text-white" : "text-gray-900"
                    )
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <span
                        className={cx("block truncate", {
                          "font-semibold": selected,
                        })}
                      >
                        {option.label}
                      </span>

                      {selected && (
                        <span
                          className={cx(
                            "absolute inset-y-0 right-0 flex items-center pr-4",
                            active ? "text-white" : "text-indigo-600"
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </>
        )}
      </div>
    </Combobox>
  );
}
