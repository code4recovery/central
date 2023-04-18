import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import {
  ArchiveBoxIcon,
  ClockIcon,
  ComputerDesktopIcon,
  GlobeAsiaAustraliaIcon,
  LanguageIcon,
  TagIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import { Template } from "~/components";
import { strings } from "~/i18n";

export const meta: MetaFunction = () => ({
  title: strings.reports.title,
});

export default function Reports() {
  const iconClass = "h-10 w-10 mx-auto";
  const reports = {
    types: {
      icon: <TagIcon className={iconClass} />,
      title: "Types",
    },
    formats: {
      icon: <ComputerDesktopIcon className={iconClass} />,
      title: "Formats",
    },
    languages: {
      icon: <LanguageIcon className={iconClass} />,
      title: "Languages",
    },
    timezones: {
      icon: <GlobeAsiaAustraliaIcon className={iconClass} />,
      title: "Timezones",
    },
    unrepresented: {
      icon: <UserCircleIcon className={iconClass} />,
      title: "Unrepresented",
    },
    stale: {
      icon: <ClockIcon className={iconClass} />,
      title: "Stale",
    },
    archive: {
      icon: <ArchiveBoxIcon className={iconClass} />,
      title: "Archive",
    },
  };

  return (
    <Template
      title={strings.reports.title}
      description={strings.reports.description}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 px-4 md:px-0">
        {Object.keys(reports).map((report) => (
          <Link
            className="bg-white dark:bg-black hover:bg-neutral-100 dark:hover:bg-neutral-950 shadow rounded text-center px-5 py-10 space-y-2"
            key={report}
            to={`/reports/${report}`}
          >
            {reports[report as keyof typeof reports].icon}
            <div>{reports[report as keyof typeof reports].title}</div>
          </Link>
        ))}
      </div>
    </Template>
  );
}
