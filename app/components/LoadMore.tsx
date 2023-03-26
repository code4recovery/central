import { Form, useNavigation } from "@remix-run/react";

import { Button } from "./Button";
import { config, formatString } from "~/helpers";
import { strings } from "~/i18n";

export function LoadMore({
  loadedCount,
  totalCount,
}: {
  loadedCount: number;
  totalCount: number;
}) {
  const { state } = useNavigation();
  const submitting = state === "submitting";

  return (
    <Form method="post" className="flex justify-center">
      <fieldset disabled={submitting}>
        <input type="hidden" name="skip" value={loadedCount} />
        <Button
          label={
            submitting
              ? strings.loading
              : formatString(strings.load_more, {
                  count: Math.min(config.batchSize, totalCount - loadedCount),
                })
          }
        />
      </fieldset>
    </Form>
  );
}
