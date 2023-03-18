import { Button } from "~/components";
import { getAccount } from "~/data";
import { config, formatClasses as cx } from "~/helpers";

type Field = {
  name: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "email"
    | "url"
    | "checkboxes"
    | "colors"
    | "image";
  span?: number;
  helpText?: string;
  placeholder?: string;
  value?: string;
  defaultImage?: React.ReactNode;
};

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
    theme: { name: theme, focusRing, text },
  } = getAccount();

  const textInputCSS =
    "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6";

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
        <form action="#" method="POST">
          <div className="shadow sm:overflow-hidden sm:rounded-md">
            <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
              <div className="grid grid-cols-12 gap-6">
                {fields.map(
                  ({
                    helpText,
                    label,
                    name,
                    placeholder,
                    span,
                    type,
                    value,
                    defaultImage: DefaultImage,
                  }) => (
                    <div
                      className={cx("col-span-12", {
                        "sm:col-span-6": span === 6,
                        "sm:col-span-8": span === 8,
                      })}
                      key={name}
                    >
                      <label
                        htmlFor={name}
                        className="block text-sm font-medium leading-6 mb-1.5 text-gray-900"
                      >
                        {label}
                      </label>
                      {["text", "email", "url"].includes(type) && (
                        <input
                          type={type}
                          name={name}
                          id={name}
                          placeholder={placeholder}
                          className={cx(focusRing, textInputCSS)}
                          defaultValue={value}
                        />
                      )}
                      {type === "textarea" && (
                        <textarea
                          id={name}
                          name={name}
                          rows={3}
                          className={cx(focusRing, textInputCSS)}
                          placeholder={placeholder}
                          defaultValue={value}
                        />
                      )}
                      {type === "colors" && (
                        <div className="grid grid-cols-5 gap-2 items-top">
                          {Object.keys(config.colors).map((color) => {
                            const {
                              background,
                              focusRing,
                              label,
                              text,
                              backgroundHover,
                            } =
                              config.colors[
                                color as keyof typeof config.colors
                              ];
                            return (
                              <input
                                key={color}
                                type="radio"
                                name={name}
                                value={color}
                                defaultChecked={color === theme}
                                className={cx(
                                  "relative h-10 flex cursor-pointer justify-center rounded w-full border-0",
                                  background,
                                  focusRing,
                                  text,
                                  backgroundHover,
                                  {
                                    "ring ring-offset-1": color === theme,
                                  }
                                )}
                                aria-label={label}
                              />
                            );
                          })}
                        </div>
                      )}
                      {type === "checkboxes" && (
                        <div className="flex items-start">
                          <div className="flex h-6 items-center">
                            <input
                              id="aa"
                              name="programs"
                              type="checkbox"
                              className={cx(
                                "h-4 w-4 rounded border-gray-300",
                                focusRing,
                                text
                              )}
                              defaultChecked={true}
                            />
                          </div>
                          <div className="ml-3 text-sm leading-6">
                            <label
                              htmlFor="aa"
                              className="font-medium text-gray-900"
                            >
                              AA
                            </label>
                          </div>
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
                        <p className="mt-2 text-sm text-gray-500">{helpText}</p>
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
        </form>
      </div>
    </div>
  );
}
