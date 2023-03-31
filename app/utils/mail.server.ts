import sgMail from "@sendgrid/mail";

import { strings } from "~/i18n";

sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");

export async function sendMail(to: string, type: "login", buttonLink: string) {
  const msg = {
    from: `${process.env.SENDGRID_SENDER}`,
    templateId: `${process.env.SENDGRID_TEMPLATE}`,
    personalizations: [
      {
        to,
        subject: strings.email[type].subject,
        dynamic_template_data: {
          accentColor: "#0c4a6e",
          buttonLink,
          buttonText: "Confirm Email Address",
          disclaimer: strings.email.disclaimer,
          footer: strings.email.footer,
          headline: strings.email[type].headline,
          imageHeight: 36,
          imageSrc: "https://slack.com/x-a4971999464706/img/slack_logo_240.png",
          imageWidth: 120,
          instructions: strings.email[type].instructions,
          subject: strings.email[type].subject,
        },
      },
    ],
  };

  return sgMail.send(msg);
}