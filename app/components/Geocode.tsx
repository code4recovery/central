import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";

import type { Field } from "~/types";
import { config, formatClasses as cx } from "~/helpers";
import { useGeocode, useUser } from "~/hooks";
import { HelpText } from "./HelpText";
import { Spinner } from "~/icons";

type Address = {
  id: string;
  formatted_address: string;
  timezone: string;
};

export function Geocode({
  className,
  defaultValue,
  helpText,
  name,
}: Partial<Field> & {
  defaultValue?: string;
  name: string;
}) {
  const geocoder = useFetcher();
  const addresses = useFetcher();
  const [query, setQuery] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>();
  const {
    theme: { background, focusRing },
  } = useUser();
  const { setGeocode } = useGeocode();

  useEffect(() => {
    if (addresses.state === "idle" && addresses.data == null) {
      addresses.load("/geocode");
    }
    if (addresses.state === "idle" && addresses.data && defaultValue) {
      const foundAddress = addresses.data.filter(
        ({ id }: Address) => id === defaultValue
      )[0];
      setSelectedAddress(foundAddress);
      setGeocode(foundAddress);
    }
  }, [addresses, defaultValue, setGeocode]);

  const filtered = useMemo(
    () =>
      addresses.data
        ? query === ""
          ? addresses.data
          : addresses.data?.filter((address: Address) =>
              address.formatted_address
                .toLowerCase()
                .includes(query.toLowerCase())
            )
        : [],
    [addresses.data, query]
  );

  useEffect(() => {
    if (geocoder.state === "idle" && geocoder.data) {
      const address = geocoder.data;
      filtered.push(address);
      setSelectedAddress(address);
      setGeocode({
        timezone: address.timezone,
        location_type: address.location_type,
      });
    }
  }, [addresses, filtered, geocoder, setGeocode]);

  return (
    <>
      <Combobox
        as="div"
        className="group relative"
        disabled={geocoder.state === "submitting"}
        name={name}
        nullable
        value={selectedAddress ?? null}
        onChange={setSelectedAddress}
        onBlur={() => {
          if (
            !selectedAddress?.formatted_address
              .toLowerCase()
              .includes(query.toLowerCase())
          ) {
            if (query) {
              geocoder.submit(
                { query },
                { method: "post", action: "/geocode" }
              );
            }
          }
        }}
      >
        <Combobox.Input
          className={cx(
            config.fieldClassNames,
            focusRing,
            "pr-7 relative",
            className
          )}
          displayValue={(address: Address) => address?.formatted_address}
          onChange={({ target }) => setQuery(target.value)}
        />
        {geocoder.state === "submitting" ? (
          <Spinner className="absolute right-3 top-2.5 h-4 w-4 text-neutral-700 dark:text-neutral-300 fill-neutral-500" />
        ) : (
          !!filtered?.length && (
            <>
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-neutral-400"
                  aria-hidden="true"
                />
              </Combobox.Button>

              <Combobox.Options
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 shadow-lg bg-white dark:bg-neutral-800 border dark:border-white border-opacity-5 dark:border-opacity-5 focus:outline-none sm:text-sm divide-y divide-dashed divide-neutral-300 dark:divide-neutral-700"
                defaultValue={defaultValue}
              >
                {filtered?.map((address: Address) => (
                  <Combobox.Option
                    key={address.id}
                    value={address}
                    className={({ active }) =>
                      cx(
                        "relative cursor-default select-none py-2 pl-3 pr-9",
                        active
                          ? `${background} text-white`
                          : "text-neutral-900 dark:text-white"
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
                          {address.formatted_address}
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
          )
        )}
      </Combobox>
      <HelpText helpText={helpText} />
    </>
  );
}
