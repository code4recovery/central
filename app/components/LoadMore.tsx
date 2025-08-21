import { Form, useNavigation } from "@remix-run/react";

import { config, formatString } from "~/helpers";
import { useTranslation } from "~/hooks";
import { Button } from "./Button";

export function LoadMore({
  loadedCount,
  totalCount,
}: {
  loadedCount: number;
  totalCount: number;
}) {
  const { state } = useNavigation();
  const idle = state === "idle";
  const strings = useTranslation();

  return (
    <Form method="post" className="flex justify-center">
      <fieldset disabled={!idle}>
        <input type="hidden" name="skip" value={loadedCount} />
        <Button theme="primary">
          {idle
            ? formatString(strings.load_more, {
                count: Math.min(config.batchSize, totalCount - loadedCount),
              })
            : strings.loading}
        </Button>
      </fieldset>
    </Form>
  );
}
