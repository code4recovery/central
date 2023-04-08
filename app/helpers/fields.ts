import { z } from "zod";
import { zfd } from "zod-form-data";

import { strings } from "~/i18n";
import { Field } from "~/types";

import { config } from "./config";

const optional = {
  array: zfd.repeatable(),
  boolean: zfd.checkbox(),
  email: zfd.text(
    z.string().email({ message: strings.form.invalidEmail }).optional()
  ),
  number: zfd.numeric(z.number().optional()),
  string: zfd.text(z.string().optional()),
  url: zfd.text(z.string().url().optional()),
};

const required = {
  array: zfd.repeatable(z.array(zfd.text()).min(1)),
  //boolean: zfd.checkbox().refine((val) => val, "Please check this box"),
  email: zfd.text(
    z
      .string({ required_error: strings.form.required })
      .email({ message: strings.form.invalidEmail })
  ),
  number: zfd.numeric(),
  string: zfd.text(),
  url: zfd.text(z.string().url()),
};

export const fields: { [index: string]: { [index: string]: Field } } = {
  account: {
    name: {
      label: strings.account.entity,
      type: "text",
      validation: required.string,
    },
    url: {
      label: strings.account.url,
      placeholder: strings.account.url_placeholder,
      span: 8,
      type: "url",
      validation: required.url,
    },
    theme: {
      label: strings.account.theme,
      type: "colors",
      validation: required.string,
    },
  },
  login: {
    email: {
      type: "email",
      validation: required.email,
    },
    go: {
      type: "hidden",
      validation: optional.string,
    },
  },
  meeting: {
    name: {
      className: "text-xl font-semibold py-2",
      label: strings.meetings.name,
      type: "text",
      validation: required.string,
    },
    day: {
      label: strings.meetings.day,
      options: config.days.map((day, index) => ({
        value: `${index}`,
        label: strings.days[day as keyof typeof strings.days],
      })),
      span: 3,
      type: "select",
      validation: optional.number,
    },
    time: {
      label: strings.meetings.time,
      span: 3,
      type: "time",
      validation: optional.string,
    },
    timezone: {
      label: strings.meetings.timezone,
      options: config.timezones.map((tz) => ({ value: tz, label: tz })),
      span: 3,
      type: "select",
      validation: optional.string,
    },
    duration: {
      label: strings.meetings.duration,
      span: 3,
      type: "number",
      validation: optional.number,
    },
    conference_url: {
      label: strings.meetings.conference_url,
      type: "url",
      span: 6,
      validation: optional.url,
    },
    conference_url_notes: {
      label: strings.meetings.conference_url_notes,
      type: "text",
      span: 6,
      validation: optional.string,
    },
    conference_phone: {
      label: strings.meetings.conference_phone,
      type: "tel",
      span: 6,
      validation: optional.string,
    },
    conference_phone_notes: {
      label: strings.meetings.conference_phone_notes,
      type: "text",
      span: 6,
      validation: optional.string,
    },
    notes: {
      label: "Notes",
      type: "textarea",
      validation: optional.string,
    },
    languages: {
      label: strings.meetings.languages,
      options: Object.keys(strings.languages)
        .sort((a, b) =>
          strings.languages[a as keyof typeof strings.languages].localeCompare(
            strings.languages[b as keyof typeof strings.languages]
          )
        )
        .map((type) => ({
          value: type,
          label: strings.languages[type as keyof typeof strings.languages],
        })),
      type: "checkboxes",
      validation: required.array,
    },
    types: {
      label: strings.meetings.types,
      options: Object.keys(strings.types)
        .sort((a, b) =>
          strings.types[a as keyof typeof strings.types].localeCompare(
            strings.types[b as keyof typeof strings.types]
          )
        )
        .map((type) => ({
          value: type,
          label: strings.types[type as keyof typeof strings.types],
        })),
      type: "checkboxes",
      validation: optional.array,
    },
  },
  user: {
    name: {
      helpText: strings.users.name_description,
      label: strings.users.name,
      placeholder: strings.users.name_placeholder,
      span: 6,
      type: "text",
      validation: required.string,
    },
    email: {
      helpText: strings.users.email_description,
      label: strings.users.email,
      span: 6,
      type: "email",
      validation: required.email,
    },
    admin: {
      adminOnly: true,
      type: "checkbox",
      label: strings.users.admin,
      helpText: strings.users.admin_description,
      validation: optional.boolean,
    },
  },
};
