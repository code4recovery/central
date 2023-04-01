import sgMail from "@sendgrid/mail";

import { formatString } from "~/helpers";
import { strings } from "~/i18n";

sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");

export async function sendMail(
  to: string,
  type: "login",
  request: Request,
  buttonLink: string,
  accountName: string
) {
  const { protocol, host } = new URL(request.url);
  const baseUrl = `${protocol}//${host}`;

  const msg = {
    from: `${process.env.SENDGRID_SENDER}`,
    templateId: `${process.env.SENDGRID_TEMPLATE}`,
    personalizations: [
      {
        to,
        subject: strings.email[type].subject,
        dynamic_template_data: {
          accentColor: "#0c4a6e",
          buttonLink: `${baseUrl}${buttonLink}`,
          buttonText: "Confirm Email Address",
          disclaimer: strings.email.disclaimer,
          footer: formatString(strings.email.footer, {
            app: strings.app_name,
            accountName,
          }),
          headline: strings.email[type].headline,
          imageHeight: 48,
          imageSrc: `${baseUrl}/logo.svg`,
          imageWidth: 48.4667,
          instructions: strings.email[type].instructions,
          subject: strings.email[type].subject,
        },
      },
    ],
  };

  return sgMail.send(msg);
}
