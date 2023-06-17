import { ValidatedForm, useIsSubmitting } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

import { Button } from "./Button";

export function DeleteUserForm({ userID }: { userID: string }) {
  return (
    <ValidatedForm
      method="post"
      validator={withZod(z.object({}))}
      subaction="user-delete"
    >
      <input type="hidden" name="userID" value={userID} />
      <Submit />
    </ValidatedForm>
  );
}

function Submit() {
  return useIsSubmitting() ? (
    <Button icon="spinner" secondary />
  ) : (
    <Button icon="delete" secondary />
  );
}
