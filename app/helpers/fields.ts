import { z } from "zod";
import { zfd } from "zod-form-data";

import { strings } from "~/i18n";
import type { Field } from "~/types";

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
      helpText: strings.account.name_description,
      label: strings.account.name,
      type: "text",
      validation: required.string,
    },
    url: {
      helpText: strings.account.url_description,
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
  group: {
    name: {
      className: "text-xl font-semibold py-2",
      label: strings.group.name,
      type: "text",
      validation: required.string,
      span: 10,
    },
    recordID: {
      label: strings.group.recordID,
      type: "text",
      validation: optional.string,
      span: 2,
    },
    notes: {
      label: strings.group.notes,
      type: "textarea",
      validation: optional.string,
    },
    email: {
      label: strings.group.email,
      type: "text",
      validation: optional.email,
      span: 4,
    },
    phone: {
      label: strings.group.phone,
      type: "text",
      validation: optional.string, // todo phone validator
      span: 4,
    },
    website: {
      label: strings.group.website,
      type: "text",
      validation: optional.url,
      span: 4,
    },
    venmo: {
      label: strings.group.venmo,
      type: "text",
      validation: optional.string, // todo venmo validator
      span: 4,
    },
    paypal: {
      label: strings.group.paypal,
      type: "text",
      validation: optional.string, // todo paypal validator
      span: 4,
    },
    square: {
      label: strings.group.square,
      type: "text",
      validation: optional.string, // todo square validator
      span: 4,
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
    conference_url: {
      label: strings.meetings.conference_url,
      type: "url",
      span: 6,
      validation: optional.url,
      helpText: strings.meetings.conference_url_help,
    },
    conference_url_notes: {
      label: strings.meetings.conference_url_notes,
      type: "text",
      span: 6,
      validation: optional.string,
      helpText: strings.meetings.conference_url_notes_help,
    },
    conference_phone: {
      label: strings.meetings.conference_phone,
      type: "tel",
      span: 6,
      validation: optional.string, // todo phone validator
      helpText: strings.meetings.conference_phone_help,
    },
    conference_phone_notes: {
      label: strings.meetings.conference_phone_notes,
      type: "text",
      span: 6,
      validation: optional.string,
      helpText: strings.meetings.conference_phone_notes_help,
    },
    geocodeID: {
      label: strings.meetings.geocode,
      type: "geocode",
      span: 9,
      helpText: strings.meetings.geocode_help,
    },
    timezone: {
      label: strings.meetings.timezone,
      options: config.timezones.map((value) => {
        const [group, ...rest] = value.split("/");
        const label = rest.join(" • ").split("_").join(" ");
        return { value, label, group };
      }),
      span: 3,
      type: "select",
      validation: optional.string,
    },
    location: {
      label: strings.meetings.location,
      type: "text",
      span: 6,
      validation: optional.string,
      helpText: strings.meetings.location_help,
      streetAddressOnly: true,
    },
    location_notes: {
      label: strings.meetings.location_notes,
      type: "text",
      span: 6,
      validation: optional.string,
      helpText: strings.meetings.location_notes_help,
      streetAddressOnly: true,
    },
    day: {
      label: strings.meetings.day,
      options: config.days.map((day, index) => ({
        value: `${index}`,
        label: strings.days[day as keyof typeof strings.days],
      })),
      span: 4,
      type: "select",
      validation: optional.number,
    },
    time: {
      label: strings.meetings.time,
      span: 4,
      type: "time",
      validation: optional.string,
    },
    duration: {
      label: strings.meetings.duration,
      span: 4,
      type: "number",
      validation: optional.number,
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
    notes: {
      helpText: strings.meetings.notes_notes,
      label: "Notes",
      type: "textarea",
      validation: optional.string,
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
