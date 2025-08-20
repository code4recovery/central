import {
  ArchiveBoxIcon,
  ArrowDownOnSquareStackIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { Template } from "~/components";
import { useTranslation } from "~/hooks";
import { en } from "~/i18n";

export const meta: MetaFunction = () => ({
  title: en.reports.title,
});

export default function Reports() {
  const iconClass = "h-10 w-10 mx-auto";
  const strings = useTranslation();
  const reports = {
    "new-groups": {
      icon: <SparklesIcon className={iconClass} />,
      title: strings.reports.new_groups.title,
    },
    "new-meetings": {
      icon: <SparklesIcon className={iconClass} />,
      title: strings.reports.new_meetings.title,
    },
    archived: {
      icon: <ArchiveBoxIcon className={iconClass} />,
      title: strings.reports.archived.title,
    },
    "download-contacts": {
      icon: <ArrowDownOnSquareStackIcon className={iconClass} />,
      title: strings.reports.downloadContacts.title,
    },
  };

  return (
    <Template title={strings.reports.title}>
      <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-3 md:gap-8 md:px-0">
        {Object.keys(reports).map((report) => (
          <Link
            className="space-y-2 rounded bg-white px-5 py-10 text-center shadow hover:bg-neutral-100 dark:bg-black dark:hover:bg-neutral-950"
            key={report}
            reloadDocument={report.startsWith("download-")}
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
