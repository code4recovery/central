import { z } from "zod";
import { zfd } from "zod-form-data";

import {
  validConferenceProvider,
  validConferenceUrl,
  validPayPal,
  validPhone,
} from "./format-valid";

import { strings } from "~/i18n";

export const optional = {
  array: zfd.repeatable(),
  boolean: zfd.checkbox(),
  conference_url: zfd.text(
    z
      .string()
      .url(strings.form.invalidUrl)
      .superRefine((val, ctx) => {
        if (!validConferenceProvider(val))
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: strings.form.invalidConferenceProvider,
          });
        if (!validConferenceUrl(val))
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: strings.form.invalidConferenceUrl,
          });
      })
      .optional()
  ),
  email: zfd.text(
    z.string().email({ message: strings.form.invalidEmail }).optional()
  ),
  number: zfd.numeric(z.number().optional()),
  paypal: zfd.text(
    z
      .string()
      .refine((val) => validPayPal(val), {
        message: strings.form.invalidPayPal,
      })
      .optional()
  ),
  phone: zfd.text(
    z
      .string()
      .refine((val) => validPhone(val), {
        message: strings.form.invalidPhone,
      })
      .optional()
  ),
  square: zfd.text(
    z.string().startsWith("$", strings.form.invalidSquare).optional()
  ),
  string: zfd.text(z.string().optional()),
  venmo: zfd.text(
    z.string().startsWith("@", strings.form.invalidVenmo).optional()
  ),
  url: zfd.text(z.string().url().optional()),
};

export const required = {
  array: zfd.repeatable(z.array(zfd.text()).min(1)),
  email: zfd.text(
    z
      .string({ required_error: strings.form.required })
      .email({ message: strings.form.invalidEmail })
  ),
  string: zfd.text(),
  url: zfd.text(z.string().url()),
};
