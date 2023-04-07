import { z } from "zod";
import { zfd } from "zod-form-data";

import { strings } from "~/i18n";
import { Field } from "~/types";

import { days } from "./days";
import { timezones } from "./timezones";

export const fields: { [index: string]: { [index: string]: Field } } = {
  account: {
    name: {
      label: strings.account.entity,
      type: "text",
      validation: zfd.text(),
    },
    url: {
      label: strings.account.url,
      placeholder: strings.account.url_placeholder,
      span: 8,
      type: "url",
      validation: zfd.text(z.string().url()),
    },
    theme: {
      label: strings.account.theme,
      type: "colors",
      validation: zfd.text(),
    },
  },
  login: {
    email: {
      type: "email",
      validation: zfd.text(
        z
          .string({ required_error: strings.form.required })
          .email({ message: strings.form.invalidEmail })
      ),
    },
    go: {
      type: "hidden",
      validation: zfd.text(z.string().optional()),
    },
  },
  meeting: {
    name: {
      className: "text-xl font-semibold py-2",
      label: strings.meetings.name,
      type: "text",
    },
    day: {
      label: strings.meetings.day,
      options: days.map((day, index) => ({
        value: `${index}`,
        label: strings.days[day as keyof typeof strings.days],
      })),
      span: 3,
      type: "select",
    },
    time: {
      label: strings.meetings.time,
      span: 3,
      type: "time",
    },
    timezone: {
      label: strings.meetings.timezone,
      options: timezones.map((tz) => ({ value: tz, label: tz })),
      span: 3,
      type: "select",
    },
    duration: {
      label: strings.meetings.duration,
      span: 3,
      type: "number",
    },
    conference_url: {
      label: strings.meetings.conference_url,
      type: "url",
      span: 6,
    },
    conference_url_notes: {
      label: strings.meetings.conference_url_notes,
      type: "text",
      span: 6,
    },
    conference_phone: {
      label: strings.meetings.conference_phone,
      type: "tel",
      span: 6,
    },
    conference_phone_notes: {
      label: strings.meetings.conference_phone_notes,
      type: "text",
      span: 6,
    },
    notes: {
      label: "Notes",
      type: "textarea",
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
    },
  },
  user: {
    currentAccountID: {
      type: "hidden",
      validation: zfd.text(),
    },
    name: {
      helpText: strings.users.name_description,
      label: strings.users.name,
      placeholder: strings.users.name_placeholder,
      span: 6,
      type: "text",
      validation: zfd.text(z.string({ required_error: strings.form.required })),
    },
    email: {
      helpText: strings.users.email_description,
      label: strings.users.email,
      span: 6,
      type: "email",
      validation: zfd.text(
        z
          .string({ required_error: strings.form.required })
          .email({ message: strings.form.invalidEmail })
      ),
    },
  },
};
