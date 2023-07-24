import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";

import { Email } from "~/components";
import { config, formatString } from "~/helpers";
import { strings } from "~/i18n";
import { db } from "./db.server";

export async function sendMail(
  to: string,
  type: "login" | "invite",
  request: Request,
  buttonLink: string,
  currentAccountID: string
) {
  const { SENDGRID_API_KEY, SENDGRID_SENDER } = process.env;

  if (!SENDGRID_API_KEY || !SENDGRID_SENDER) {
    throw new Error("Missing SendGrid API key or sender");
  }

  sendgrid.setApiKey(SENDGRID_API_KEY);

  const { protocol, host } = new URL(request.url);
  const baseUrl = `${protocol}//${host}`;

  const account = await db.account.findFirst({
    where: { id: currentAccountID },
  });

  const stringParams = {
    app: strings.app_name,
    accountName: account?.name,
    accountUrl: account?.url,
    email: to,
  };

  const emailProps = {
    accentColor: (account?.theme ??
      config.defaultTheme) as keyof typeof config.themes,
    buttonLink: `${baseUrl}${buttonLink}`,
    buttonText: strings.email[type].buttonText,
    footer: formatString(strings.email.footer, stringParams),
    headline: formatString(strings.email[type].headline, stringParams),
    imageHeight: 48,
    imageSrc: `${baseUrl}/logo.svg`,
    imageWidth: 48.4667,
    instructions: strings.email[type].instructions,
    subject: formatString(strings.email[type].subject, stringParams),
  };

  sendgrid.send({
    from: SENDGRID_SENDER,
    html: render(<Email {...emailProps} />),
    subject: formatString(strings.email[type].subject, stringParams),
    to,
  });
}
