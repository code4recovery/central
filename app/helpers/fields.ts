import { strings } from "~/i18n";
import type { Field } from "~/types";

import { config } from "./config";
import { required, optional } from "./validators";

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
  "account-create": {
    name: {
      type: "text",
      validation: required.string,
      label: strings.request.group_select.your_name,
    },
    email: {
      type: "text",
      validation: required.string,
      label: strings.users.email,
    },
    account_name: {
      type: "text",
      validation: required.string,
      label: strings.account.name,
    },
    url: {
      type: "url",
      validation: required.string,
      label: strings.account.url,
    },
  },
  group: {
    name: {
      className: "text-xl font-semibold py-2",
      label: strings.group.name,
      type: "text",
      validation: required.string,
      span: 9,
    },
    recordID: {
      label: strings.group.recordID,
      type: "text",
      validation: optional.string,
      span: 3,
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
      validation: optional.phone,
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
      validation: optional.venmo,
      span: 4,
    },
    paypal: {
      label: strings.group.paypal,
      type: "text",
      validation: optional.paypal,
      span: 4,
    },
    square: {
      label: strings.group.square,
      type: "text",
      validation: optional.square,
      span: 4,
    },
  },
  "group-rep-add": {
    name: {
      label: strings.users.name,
      placeholder: strings.users.name_placeholder,
      span: 6,
      type: "text",
      validation: required.string,
    },
    email: {
      label: strings.users.email,
      span: 6,
      type: "email",
      validation: required.email,
    },
  },
  "group-rep-edit": {
    id: {
      type: "hidden",
      validation: required.string,
    },
    name: {
      label: strings.users.name,
      placeholder: strings.users.name_placeholder,
      span: 6,
      type: "text",
      validation: required.string,
    },
    email: {
      disabled: true,
      label: strings.users.email,
      span: 6,
      type: "email",
      validation: required.email,
    },
  },
  "group-rep-request": {
    groupID: {
      type: "hidden",
      validation: required.string,
    },
    your_name: {
      label: strings.users.name,
      placeholder: strings.users.name_placeholder,
      type: "text",
      validation: required.string,
    },
  },
  "group-request": {
    name: {
      label: strings.request.group_info.name,
      type: "text",
      validation: required.string,
    },
    notes: {
      helpText: strings.request.group_info.notes_help,
      label: strings.request.group_info.notes,
      type: "textarea",
      validation: optional.string,
    },
    website: {
      helpText: strings.request.group_info.website_help,
      label: strings.request.group_info.website,
      placeholder: "https://",
      type: "url",
      validation: optional.url,
    },
    email: {
      helpText: strings.request.group_info.email_help,
      label: strings.request.group_info.email,
      placeholder: strings.request.group_info.email_placeholder,
      type: "email",
      validation: optional.email,
    },
    phone: {
      helpText: strings.request.group_info.phone_help,
      label: strings.request.group_info.phone,
      placeholder: "+1 212 555 1212",
      type: "tel",
      validation: optional.phone,
    },
  },
  "group-search": {
    search: {
      type: "text",
    },
  },
  login: {
    email: {
      type: "email",
      validation: required.email,
      label: strings.users.email,
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
      validation: optional.conference_url,
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
      validation: optional.phone,
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
      defaultValue: config.defaultDuration,
      label: strings.meetings.duration,
      span: 4,
      type: "number",
      validation: optional.number,
    },
    languages: {
      defaultValue: config.defaultLanguages,
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
      label: strings.meetings.notes,
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
