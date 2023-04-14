import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import type { ZodAny, ZodEffects } from "zod";

import { fields } from "./fields";

export const formatValidator = (form: keyof typeof fields) =>
  withZod(
    z.object(
      Object.fromEntries(
        Object.keys(fields[form])
          .filter((name) => fields[form][name].validation)
          .map((name) => [
            name,
            fields[form][name].validation as ZodEffects<ZodAny, any, any>,
          ])
      )
    )
  );
