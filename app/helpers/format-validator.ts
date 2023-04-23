import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import type { ZodAny, ZodEffects } from "zod";

import { fields } from "./fields";

export const formatValidator = (
  model: keyof typeof fields,
  serverValidation?: {
    validator: (data: { [id: string]: any }) => Promise<boolean>;
    params: {
      message: string;
      path: string[];
    };
  }
) => {
  const schema = z.object(
    Object.fromEntries(
      Object.keys(fields[model])
        .filter((name) => fields[model][name].validation)
        .map((name) => [
          name,
          fields[model][name].validation as ZodEffects<ZodAny, any, any>,
        ])
    )
  );
  return serverValidation
    ? withZod(
        schema.refine(serverValidation.validator, serverValidation.params)
      )
    : withZod(schema);
};
