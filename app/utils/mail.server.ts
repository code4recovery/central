import sgMail from "@sendgrid/mail";

import { config, formatString } from "~/helpers";
import { strings } from "~/i18n";
import { db } from "./db.server";

sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");

export async function sendMail(
  to: string,
  type: "login" | "invite",
  request: Request,
  buttonLink: string,
  currentAccountID: string
) {
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

  const accentColor = account?.theme
    ? config.themes[account.theme as keyof typeof config.themes].accentColor
    : "#0c4a6e";

  const msg = {
    from: `${process.env.SENDGRID_SENDER}`,
    templateId: `${process.env.SENDGRID_TEMPLATE}`,
    personalizations: [
      {
        to,
        subject: strings.email[type].subject,
        dynamic_template_data: {
          accentColor,
          buttonLink: `${baseUrl}${buttonLink}`,
          buttonText: strings.email[type].buttonText,
          disclaimer: strings.email.disclaimer,
          footer: formatString(strings.email.footer, stringParams),
          headline: formatString(strings.email[type].headline, stringParams),
          imageHeight: 48,
          imageSrc: `${baseUrl}/logo.svg`,
          imageWidth: 48.4667,
          instructions: strings.email[type].instructions,
          subject: formatString(strings.email[type].subject, stringParams),
        },
      },
    ],
  };

  return sgMail.send(msg);
}
