import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import type { ZodAny, ZodEffects } from "zod";

import { fields } from "./fields";

export const formatValidator = (model: keyof typeof fields) =>
  withZod(
    z.object(
      Object.fromEntries(
        Object.keys(fields[model])
          .filter((name) => fields[model][name].validation)
          .map((name) => [
            name,
            fields[model][name].validation as ZodEffects<ZodAny, any, any>,
          ])
      )
    )
  );
