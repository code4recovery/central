import type { MetaFunction } from "@remix-run/node";

import { Template } from "~/components";
import { strings } from "~/i18n";

export const meta: MetaFunction = () => ({
  title: strings.requests.title,
});

export default function Reports() {
  return <Template title={strings.requests.title}>hi </Template>;
}
