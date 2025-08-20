import { withZod } from "@remix-validated-form/with-zod";
import type { ZodAny, ZodEffects } from "zod";
import { z } from "zod";

import { en as strings } from "~/i18n";
import { getFields, type Model } from "./get-fields";

export const formatValidator = (
  model: Model,
  serverValidation?: {
    validator: (data: { [id: string]: any }) => Promise<boolean>;
    params: {
      message: string;
      path: string[];
    };
  },
) => {
  const fields = getFields(model, strings);
  const schema = z.object(
    Object.fromEntries(
      Object.keys(fields)
        .filter((name) => fields[name].validation)
        .map((name) => [
          name,
          fields[name].validation as ZodEffects<ZodAny, any, any>,
        ]),
    ),
  );
  return serverValidation
    ? withZod(
        schema.refine(serverValidation.validator, serverValidation.params),
      )
    : withZod(schema);
};
