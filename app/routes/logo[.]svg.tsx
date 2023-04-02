import { renderToString } from "react-dom/server";

import { DefaultAccountLogo } from "~/icons";

// used as favicon and in email

export const loader = () =>
  new Response(renderToString(<DefaultAccountLogo />), {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
    },
  });
