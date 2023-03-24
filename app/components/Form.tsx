import { Form as RemixForm } from "@remix-run/react";

import { Button, Input, Label } from "~/components";
import { config, formatClasses as cx } from "~/helpers";
import { useUser } from "~/hooks";
import type { Field } from "~/types";

export function Form({
  title,
  description,
  fields,
}: {
  title?: string;
  description?: string;
  fields: Field[];
}) {
  const {
    theme: { label: theme, focusRing, text },
  } = useUser();

  return (
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <div className="md:col-span-1">
        <div className="px-4 sm:px-0">
          {title && (
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
      </div>
      <div className="mt-5 md:col-span-2 md:mt-0">
        <RemixForm method="post">
          <div className="shadow sm:overflow-hidden sm:rounded-md">
            <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
              <div className="grid grid-cols-12 gap-5">
                {fields.map(
                  ({
                    className,
                    defaultImage: DefaultImage,
                    helpText,
                    label,
                    name,
                    options,
                    placeholder,
                    required,
                    span,
                    type = "hidden",
                    value,
                  }) =>
                    type === "hidden" ? (
                      <input
                        type="hidden"
                        name={name}
                        key={name}
                        value={value}
                      />
                    ) : (
                      <div
                        className={cx("col-span-12", {
                          "sm:col-span-1": span === 1,
                          "sm:col-span-2": span === 2,
                          "sm:col-span-3": span === 3,
                          "sm:col-span-4": span === 4,
                          "sm:col-span-5": span === 5,
                          "sm:col-span-6": span === 6,
                          "sm:col-span-7": span === 7,
                          "sm:col-span-8": span === 8,
                          "sm:col-span-9": span === 9,
                          "sm:col-span-10": span === 10,
                          "sm:col-span-11": span === 11,
                        })}
                        key={name}
                      >
                        <Label htmlFor={name}>{label}</Label>
                        {["email", "number", "text", "time", "url"].includes(
                          type
                        ) && (
                          <Input
                            className={className}
                            name={name}
                            placeholder={placeholder}
                            required={required}
                            type={
                              type as
                                | "email"
                                | "number"
                                | "text"
                                | "time"
                                | "url"
                            }
                            value={value as string}
                          />
                        )}
                        {type === "textarea" && (
                          <textarea
                            className={cx(
                              focusRing,
                              config.fieldClassNames,
                              className
                            )}
                            defaultValue={value ? `${value}` : undefined}
                            id={name}
                            name={name}
                            placeholder={placeholder}
                            required={required}
                            rows={3}
                          />
                        )}
                        {type === "colors" && (
                          <div className="grid grid-cols-5 gap-2 items-top">
                            {Object.keys(config.themes).map((color) => {
                              const {
                                background,
                                backgroundHover,
                                focusRing,
                                label,
                                text,
                              } =
                                config.themes[
                                  color as keyof typeof config.themes
                                ];
                              return (
                                <input
                                  key={color}
                                  type="radio"
                                  name={name}
                                  value={color}
                                  defaultChecked={color === value}
                                  className={cx(
                                    "relative h-10 flex cursor-pointer justify-center rounded w-full border-0 checked:ring-2 checked:ring-offset-1",
                                    background,
                                    backgroundHover,
                                    className,
                                    focusRing,
                                    text
                                  )}
                                  aria-label={label}
                                />
                              );
                            })}
                          </div>
                        )}
                        {type === "select" && (
                          <select
                            name={name}
                            id={name}
                            className={cx(config.fieldClassNames, className)}
                            defaultValue={value ? `${value}` : undefined}
                          >
                            {!required && <option></option>}
                            {options?.map(({ value: optionValue, label }) => (
                              <option
                                key={optionValue}
                                value={`${optionValue}`}
                              >
                                {label}
                              </option>
                            ))}
                          </select>
                        )}
                        {type === "checkboxes" && (
                          <div className="items-start gap-x-5 gap-y-3 grid grid-cols-4">
                            {options?.map(({ value: optionValue, label }) => (
                              <div
                                className="flex items-top gap-2 m-0"
                                key={optionValue}
                              >
                                <input
                                  id={`${optionValue}`}
                                  name={name}
                                  type="checkbox"
                                  className={cx(
                                    "h-4 w-4 rounded border-gray-300 m-0 mt-0.5",
                                    focusRing,
                                    text,
                                    className
                                  )}
                                  defaultChecked={
                                    Array.isArray(value) &&
                                    value?.includes(optionValue)
                                  }
                                />
                                <label
                                  className="text-sm truncate"
                                  htmlFor={`${optionValue}`}
                                  title={label}
                                >
                                  {label}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                        {type === "image" && (
                          <div className="mt-2 flex items-center">
                            {DefaultImage}
                            <button
                              type="button"
                              className="ml-5 rounded-md border border-gray-300 bg-white py-1.5 px-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
                            >
                              Change
                            </button>
                          </div>
                        )}
                        {helpText && (
                          <p className="mt-2 text-sm text-gray-500">
                            {helpText}
                          </p>
                        )}
                      </div>
                    )
                )}
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 flex justify-end sm:px-6">
              <Button label="Save" />
            </div>
          </div>
        </RemixForm>
      </div>
    </div>
  );
}
