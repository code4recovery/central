import type { MetaFunction } from "@remix-run/node";

import { strings } from "~/i18n";
import { Template } from "~/components";

export const meta: MetaFunction = () => ({
  title: strings.reports_title,
});

export default function Reports() {
  return (
    <Template
      title={strings.reports_title}
      description={strings.reports_description}
    ></Template>
  );
}
