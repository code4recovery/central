import sgMail from "@sendgrid/mail";

import { strings } from "~/i18n";

sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");

export async function sendMail(to: string) {
  const msg = {
    from: `${process.env.SENDGRID_SENDER}`,
    subject: strings.email_login_subject,
    templateId: process.env.SENDGRID_TEMPLATE ?? "",
    personalizations: [
      {
        to,
        subject: strings.email_login_subject,
        dynamic_template_data: {
          imageSrc: "https://slack.com/x-a4971999464706/img/slack_logo_240.png",
          imageWidth: 120,
          imageHeight: 36,
          subject: strings.email_login_subject,
          headline:
            "Once you’ve confirmed that xxx@xxx.com is your email address, we’ll help you find your Slack workspaces or create a new one.",
          instructions: "Tap the button below to confirm:",
          buttonText: "Confirm Email Address",
          buttonLink: "https://central.code4recovery.org/foo/bar",
          disclaimer:
            "If you didn’t request this email, there’s nothing to worry about — you can safely ignore it.",
          footer:
            "© 2023 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc commodo non metus et porttitor. Duis ultrices ex in posuere faucibus.",
        },
      },
    ],
  };

  return sgMail.send(msg);
}
