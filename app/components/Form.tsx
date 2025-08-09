import { useIsSubmitting, ValidatedForm } from "remix-validated-form";

import {
  Button,
  Checkbox,
  Checkboxes,
  Geocode,
  Input,
  Label,
  Select,
  SelectMultiple,
  Textarea,
} from "~/components";
import {
  config,
  formatClasses as cx,
  fields,
  formatValidator,
} from "~/helpers";
import { useGeocode } from "~/hooks";
import { strings } from "~/i18n";

export function Form({
  cancel,
  form,
  optionsInUse,
  values,
  isAdmin,
  onSubmit,
  resetAfterSubmit,
  saveOptions,
  subaction,
  submitLoadingText,
  submitText,
}: {
  cancel?: () => void;
  form: keyof typeof fields;
  onSubmit?: () => void;
  optionsInUse?: { [key: string]: string[] };
  values?: { [key: string]: string | string[] };
  isAdmin?: boolean;
  resetAfterSubmit?: boolean;
  saveOptions?: string[];
  subaction?: string;
  submitLoadingText?: string;
  submitText?: string;
}) {
  const {
    geocode: { location_type },
  } = useGeocode();
  const streetAddress = location_type && location_type !== "APPROXIMATE";
  return (
    <ValidatedForm
      autoComplete="off"
      method="post"
      validator={formatValidator(form)}
      onSubmit={onSubmit}
      resetAfterSubmit={resetAfterSubmit}
      subaction={subaction ?? (form as string)}
    >
      <fieldset>
        <div className="shadow sm:overflow-hidden sm:rounded-md">
          <div className="space-y-6 bg-white px-4 py-5 dark:bg-neutral-950 sm:p-6">
            <div className="grid grid-cols-12 gap-5">
              {Object.keys(fields[form])
                .filter((name) => !fields[form][name].adminOnly || isAdmin)
                .filter(
                  (name) =>
                    !fields[form][name].streetAddressOnly || streetAddress,
                )
                .map((name) => {
                  const {
                    className,
                    defaultValue,
                    disabled,
                    label,
                    options,
                    required,
                    span,
                    type,
                  } = fields[form][name];
                  return type === "hidden" ? (
                    <input
                      type="hidden"
                      name={name}
                      key={name}
                      value={values?.[name]}
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
                      {type === "checkbox" && (
                        <Checkbox
                          {...fields[form][name]}
                          name={name}
                          defaultChecked={values?.[name]}
                        />
                      )}
                      {type === "checkboxes" && (
                        <Checkboxes
                          {...fields[form][name]}
                          name={name}
                          optionsInUse={optionsInUse?.[name]}
                          values={values?.[name] ?? defaultValue}
                        />
                      )}
                      {[
                        "email",
                        "number",
                        "tel",
                        "text",
                        "time",
                        "url",
                      ].includes(type) && (
                        <Input
                          {...fields[form][name]}
                          defaultValue={values?.[name] ?? defaultValue}
                          disabled={disabled}
                          name={name}
                        />
                      )}
                      {type === "colors" && (
                        <div className="items-top grid grid-cols-5 gap-2">
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
                                title={color}
                                defaultChecked={color === values?.[name]}
                                className={cx(
                                  "relative flex h-10 w-full cursor-pointer justify-center rounded border-0 checked:ring-2 checked:ring-offset-1",
                                  background,
                                  backgroundHover,
                                  className,
                                  focusRing,
                                  text,
                                )}
                                aria-label={label}
                              />
                            );
                          })}
                        </div>
                      )}
                      {type === "geocode" && (
                        <Geocode
                          {...fields[form][name]}
                          defaultValue={values?.[name] as string}
                          name={name}
                        />
                      )}
                      {type === "select" && (
                        <Select
                          className={className}
                          defaultValue={
                            (values?.[name] ?? defaultValue) as string | number
                          }
                          name={name}
                          options={options}
                          required={required}
                        />
                      )}
                      {type === "select-multiple" && (
                        <SelectMultiple name={name} options={options} />
                      )}
                      {type === "textarea" && (
                        <Textarea
                          {...fields[form][name]}
                          defaultValue={values?.[name]}
                          name={name}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
          <div
            className={cx(
              "flex items-center bg-neutral-50 px-4 py-3 text-sm dark:border-t dark:border-neutral-900 dark:bg-neutral-950 sm:px-6",
              {
                "justify-end gap-3": !!(cancel || saveOptions?.length),
                "justify-center": !(cancel || saveOptions?.length),
              },
            )}
          >
            {!!saveOptions?.length && (
              <div className="flex items-center gap-3">
                {strings.meetings.apply_changes}
                <select
                  className="rounded-md bg-neutral-50 text-sm dark:bg-neutral-950"
                  name="save-option"
                >
                  <option>{strings.meetings.apply_changes_only_this}</option>
                  {saveOptions.map((option) => (
                    <option key={option} value={option}>
                      {
                        strings.meetings[
                          `apply_changes_${option}` as keyof typeof strings.meetings
                        ]
                      }
                    </option>
                  ))}
                </select>
              </div>
            )}
            {cancel && (
              <Button onClick={cancel} theme="secondary">
                {strings.cancel}
              </Button>
            )}
            <Submit loadingText={submitLoadingText} text={submitText} />
          </div>
        </div>
      </fieldset>
    </ValidatedForm>
  );
}

function Submit({
  loadingText = strings.form.saving,
  text = strings.form.save,
}: {
  loadingText?: string;
  text?: string;
}) {
  const isSubmitting = useIsSubmitting();
  return (
    <Button
      className={cx({
        "bg-neutral-300 text-neutral-500 dark:bg-neutral-700": isSubmitting,
      })}
      icon={isSubmitting ? "spinner" : undefined}
      theme="primary"
    >
      {isSubmitting ? loadingText : text}
    </Button>
  );
}
