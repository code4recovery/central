import { strings } from "~/i18n";
import type { Field } from "~/types";
import { timezones } from "./timezones";

const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const meetingFields: Field[] = [
  {
    className: "text-xl font-semibold py-2",
    label: strings.meeting_name,
    name: "name",
    type: "text",
  },
  {
    label: strings.meeting_day,
    name: "day",
    options: days.map((day, index) => ({
      value: `${index}`,
      label: strings.days[day as keyof typeof strings.days],
    })),
    span: 3,
    type: "select",
  },
  {
    label: strings.meeting_time,
    name: "time",
    span: 3,
    type: "time",
  },
  {
    label: strings.meeting_timezone,
    name: "timezone",
    options: timezones.map((tz) => ({ value: tz, label: tz })),
    span: 3,
    type: "select",
  },
  {
    label: strings.meeting_duration,
    name: "duration",
    span: 3,
    type: "number",
  },
  {
    label: "Notes",
    name: "notes",
    type: "textarea",
  },
  {
    label: strings.meeting_languages,
    name: "languages",
    options: Object.keys(strings.language_types)
      .sort((a, b) =>
        strings.language_types[
          a as keyof typeof strings.language_types
        ].localeCompare(
          strings.language_types[b as keyof typeof strings.language_types]
        )
      )
      .map((type) => ({
        value: type,
        label:
          strings.language_types[type as keyof typeof strings.language_types],
      })),
    type: "checkboxes",
  },
  {
    label: strings.meeting_types,
    name: "types",
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
];

export const config = {
  aboutUrl: "https://code4recovery.org",
  batchSize: 25,
  colors: {
    slate: {
      label: "Slate",
      background: "bg-slate-600",
      backgroundHover: "hover:bg-slate-500",
      border: "border-slate-500",
      focusOutline: "focus-visible:outline-slate-600",
      focusRing: "focus:ring-slate-500",
      text: "text-slate-600",
    },
    gray: {
      label: "Gray",
      background: "bg-gray-600",
      backgroundHover: "hover:bg-gray-500",
      border: "border-gray-500",
      focusOutline: "focus-visible:outline-gray-600",
      focusRing: "focus:ring-gray-500",
      text: "text-gray-600",
    },
    neutral: {
      label: "Neutral",
      background: "bg-neutral-600",
      backgroundHover: "hover:bg-neutral-500",
      border: "border-neutral-500",
      focusOutline: "focus-visible:outline-neutral-600",
      focusRing: "focus:ring-neutral-500",
      text: "text-neutral-600",
    },
    stone: {
      label: "Stone",
      background: "bg-stone-600",
      backgroundHover: "hover:bg-stone-500",
      border: "border-stone-500",
      focusOutline: "focus-visible:outline-stone-600",
      focusRing: "focus:ring-stone-500",
      text: "text-stone-600",
    },
    red: {
      label: "Red",
      background: "bg-red-600",
      backgroundHover: "hover:bg-red-500",
      border: "border-red-500",
      focusOutline: "focus-visible:outline-red-600",
      focusRing: "focus:ring-red-500",
      text: "text-red-600",
    },
    orange: {
      label: "Orange",
      background: "bg-orange-600",
      backgroundHover: "hover:bg-orange-500",
      border: "border-orange-500",
      focusOutline: "focus-visible:outline-orange-600",
      focusRing: "focus:ring-orange-500",
      text: "text-orange-600",
    },
    amber: {
      label: "Amber",
      background: "bg-amber-600",
      backgroundHover: "hover:bg-amber-500",
      border: "border-amber-500",
      focusOutline: "focus-visible:outline-amber-600",
      focusRing: "focus:ring-amber-500",
      text: "text-amber-600",
    },
    yellow: {
      label: "Yellow",
      background: "bg-yellow-600",
      backgroundHover: "hover:bg-yellow-500",
      border: "border-yellow-500",
      focusOutline: "focus-visible:outline-yellow-600",
      focusRing: "focus:ring-yellow-500",
      text: "text-yellow-600",
    },
    lime: {
      label: "Lime",
      background: "bg-lime-600",
      backgroundHover: "hover:bg-lime-500",
      border: "border-lime-500",
      focusOutline: "focus-visible:outline-lime-600",
      focusRing: "focus:ring-lime-500",
      text: "text-lime-600",
    },
    green: {
      label: "Green",
      background: "bg-green-600",
      backgroundHover: "hover:bg-green-500",
      border: "border-green-500",
      focusOutline: "focus-visible:outline-green-600",
      focusRing: "focus:ring-green-500",
      text: "text-green-600",
    },
    emerald: {
      label: "Emerald",
      background: "bg-emerald-600",
      backgroundHover: "hover:bg-emerald-500",
      border: "border-emerald-500",
      focusOutline: "focus-visible:outline-emerald-600",
      focusRing: "focus:ring-emerald-500",
      text: "text-emerald-600",
    },
    teal: {
      label: "Teal",
      background: "bg-teal-600",
      backgroundHover: "hover:bg-teal-500",
      border: "border-teal-500",
      focusOutline: "focus-visible:outline-teal-600",
      focusRing: "focus:ring-teal-500",
      text: "text-teal-600",
    },
    cyan: {
      label: "Cyan",
      background: "bg-cyan-600",
      backgroundHover: "hover:bg-cyan-500",
      border: "border-cyan-500",
      focusOutline: "focus-visible:outline-cyan-600",
      focusRing: "focus:ring-cyan-500",
      text: "text-cyan-600",
    },
    sky: {
      label: "Sky",
      background: "bg-sky-600",
      backgroundHover: "hover:bg-sky-500",
      border: "border-sky-500",
      focusOutline: "focus-visible:outline-sky-600",
      focusRing: "focus:ring-sky-500",
      text: "text-sky-600",
    },
    blue: {
      label: "Blue",
      background: "bg-blue-600",
      backgroundHover: "hover:bg-blue-500",
      border: "border-blue-500",
      focusOutline: "focus-visible:outline-blue-600",
      focusRing: "focus:ring-blue-500",
      text: "text-blue-600",
    },
    indigo: {
      label: "Indigo",
      background: "bg-indigo-600",
      backgroundHover: "hover:bg-indigo-500",
      border: "border-indigo-500",
      focusOutline: "focus-visible:outline-indigo-600",
      focusRing: "focus:ring-indigo-500",
      text: "text-indigo-600",
    },
    violet: {
      label: "Violet",
      background: "bg-violet-600",
      backgroundHover: "hover:bg-violet-500",
      border: "border-violet-500",
      focusOutline: "focus-visible:outline-violet-600",
      focusRing: "focus:ring-violet-500",
      text: "text-violet-600",
    },
    purple: {
      label: "Purple",
      background: "bg-purple-600",
      backgroundHover: "hover:bg-purple-500",
      border: "border-purple-500",
      focusOutline: "focus-visible:outline-purple-600",
      focusRing: "focus:ring-purple-500",
      text: "text-purple-600",
    },
    fuchsia: {
      label: "Fuchsia",
      background: "bg-fuchsia-600",
      backgroundHover: "hover:bg-fuchsia-500",
      border: "border-fuchsia-500",
      focusOutline: "focus-visible:outline-fuchsia-600",
      focusRing: "focus:ring-fuchsia-500",
      text: "text-fuchsia-600",
    },
    pink: {
      label: "Pink",
      background: "bg-pink-600",
      backgroundHover: "hover:bg-pink-500",
      border: "border-pink-500",
      focusOutline: "focus-visible:outline-pink-600",
      focusRing: "focus:ring-pink-500",
      text: "text-pink-600",
    },
    rose: {
      label: "Rose",
      background: "bg-rose-600",
      backgroundHover: "hover:bg-rose-500",
      border: "border-rose-500",
      focusOutline: "focus-visible:outline-rose-600",
      focusRing: "focus:ring-rose-500",
      text: "text-rose-600",
    },
  },
  days,
  fieldClassNames:
    "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset text-sm leading-6",
  home: "/meetings",
  insecureRoutes: ["/"],
  meetingFields,
};
