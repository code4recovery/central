import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, useIsSubmitting } from "remix-validated-form";
import { z } from "zod";

import { useTranslation } from "~/hooks";
import { Button } from "./Button";

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
  const strings = useTranslation();
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
