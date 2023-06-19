import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";

import { required } from "~/helpers";
import { strings } from "~/i18n";

export function AddRepForm() {
  return (
    <ValidatedForm
      validator={withZod(
        z.object({
          name: required.string,
          email: required.email,
        })
      )}
      subaction="user-add"
      className="flex gap-2 p-2"
    >
      <input
        type="text"
        name="name"
        placeholder={strings.users.name}
        className="rounded w-full"
      />
      <input
        type="email"
        name="email"
        placeholder={strings.users.email}
        className="rounded w-full"
      />
    </ValidatedForm>
  );
}
