import { ValidatedForm, useIsSubmitting } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

import { Button } from "./Button";

export function DeleteButton({ userID }: { userID: string }) {
  return (
    <ValidatedForm
      method="post"
      validator={withZod(z.object({}))}
      subaction="user-remove"
      className="flex items-center"
    >
      <input type="hidden" name="userID" value={userID} />
      <Submit />
    </ValidatedForm>
  );
}

function Submit() {
  return useIsSubmitting() ? (
    <Button icon="spinner" />
  ) : (
    <Button icon="delete" className="opacity-50 hover:opacity-100" />
  );
}
