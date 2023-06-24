import { ValidatedForm, useIsSubmitting } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

import { Button } from "./Button";
import { strings } from "~/i18n";

export function ArchiveForm({ archived }: { archived: boolean }) {
  return (
    <ValidatedForm
      method="post"
      validator={withZod(z.object({}))}
      subaction={archived ? "unarchive" : "archive"}
    >
      <Submit archived={archived} />
    </ValidatedForm>
  );
}

function Submit({ archived }: { archived: boolean }) {
  return useIsSubmitting() ? (
    <Button icon="spinner" theme="secondary">
      {archived ? strings.meetings.unarchiving : strings.meetings.archiving}
    </Button>
  ) : (
    <Button icon="archive" theme="secondary">
      {archived ? strings.meetings.unarchive : strings.meetings.archive}
    </Button>
  );
}
