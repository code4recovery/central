import { render } from "@react-email/render";
import { Resend } from "resend";

import { Email } from "~/components";
import { config, formatString } from "~/helpers";
import { strings } from "~/i18n";
import { db } from "./db.server";

export async function sendMail({
  accountID,
  buttonLink,
  buttonText,
  headline,
  instructions,
  request,
  subject,
  to,
}: {
  accountID: string;
  buttonLink: string;
  buttonText: string;
  headline: string;
  instructions: string;
  request: Request;
  subject: string;
  to: string;
}) {
  const { RESEND_API_KEY, RESEND_SENDER } = process.env;

  if (!RESEND_API_KEY || !RESEND_SENDER) {
    throw new Error("Missing Resend API key or sender");
  }

  const resend = new Resend(RESEND_API_KEY);

  const { protocol, host } = new URL(request.url);
  const baseUrl = `${protocol}//${host}`;

  const account = await db.account.findFirst({
    where: { id: accountID },
  });

  const emailProps = {
    accentColor: (account?.theme ??
      config.defaultTheme) as keyof typeof config.themes,
    buttonLink: `${baseUrl}${buttonLink}`,
    buttonText,
    footer: formatString(strings.email.footer, {
      app: strings.app_name,
      accountName: account?.name,
    }),
    headline,
    imageHeight: 48,
    imageSrc:
      "https://code4recovery.org/wp-content/uploads/2023/09/central-logo.png",
    imageWidth: 48.4667,
    instructions,
    subject,
  };

  const { data, error } = await resend.emails.send({
    from: RESEND_SENDER,
    to: [to],
    subject,
    html: render(<Email {...emailProps} />),
  });

  if (error) {
    console.error('Resend error:', error);
    throw new Error(`Failed to send email: ${JSON.stringify(error)}`);
  }

  return data;
}
