# Unity | Unify | Central

This is a free content management system to help service entities manage their directory of recovery meetings.

## Services needed

This project uses the following third-party services:

- [Google Cloud Run](https://cloud.google.com/run)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [MongoDB](https://www.mongodb.com/) (we use [Atlas](https://www.mongodb.com/atlas/database))
- [Google Cloud Storage](https://cloud.google.com/storage)
- Google Geocoding API (coming soon)
- Google TimeZone API (coming soon)
- SendGrid (coming soon)
- Sentry (coming soon)

## Run locally

Interested in making your own copy of this service, or adapting it to your needs? Get started by cloning this repo locally.

Create a `.env` file that looks like this, and replace

```sh
# MongoDB connection URL
DATABASE_URL="mongodb+srv://<user>:<password>@cluster0.t0piiqe.mongodb.net/<database>"

# Google Sheets API
GOOGLE_SHEET_API_KEY="<your.google.sheets.api.key>"

# Google Cloud Storage
GOOGLE_CLOUD_BUCKET="<your.bucket>"
GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n<private.key.goes.here>==\n-----END PRIVATE KEY-----\n"

# Random salt
SESSION_SECRET="<make.up.a.cryptographic.salt>"

# Initial account seed
USER_NAME="<your.name>"
USER_EMAIL="<your.email@address.com>"

# Email
SENDGRID_API_KEY="<your.sendgrid.api.key>"
SENDGRID_SENDER="<your.email@address.com>"
SENDGRID_TEMPLATE="<your.sendgrid.template.id>"
```

You may wish to seed your database with an existing Meeting Guide JSON feed. Coming soon.

To run locally, run `npm i` once, then run `npm run dev`. Your site will be running at [http://localhost:3000/](http://localhost:3000/)

## Set up Cloud Run

1. Add this repository (or a clone of it) to Cloud Run
1. Set your environment variables

## Set up Cloud Storage

1. Set up a bucket, add the name to your `.env`
1. Get the private key from the JSON file and add it to your `.env`
1. Grant user Storage Admin permissions
1. Grant `anyUser` Storage Viewer permissions
1. Go to cloud shell and add your CORS policy

```
printf '[{"origin": ["*"],"responseHeader": ["*"],"method":
["GET"],"maxAgeSeconds": 3600}]' > cors.json

gsutil cors set cors.json gs://<bucket_name>
```

## Set up SendGrid

1. Set up an account at sendgrid
1. Get API key and sender email, add to `.env` or environment variables
1. Create email template (see below), add template to `.env` or environment variables

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ subject }}</title>
    <style type="text/css">
      /* Global Resets */
      body,
      .background_main,
      p,
      table,
      td,
      div {
        font-family: Helvetica, Arial, sans-serif;
      }

      img {
        border: none;
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
      }

      p {
        padding-bottom: 2px;
      }

      body {
        background: #fff;
        font-size: 17px;
        line-height: 24px;
        margin: 0;
        padding: 0;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }

      table {
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        width: 100%;
      }

      td {
        font-size: 17px;
        line-height: 24px;
        vertical-align: top;
      }

      /* Footer */
      .email_footer td,
      .email_footer p,
      .email_footer span {
        font-size: 15px;
        text-align: center;
        color: #1d1c1d;
      }

      .email_footer a {
        text-decoration: underline;
      }

      .email_footer td {
        padding-top: 20px;
      }

      .footer_logo {
        width: 40px;
        height: 40px;
        padding-bottom: 20px;
      }

      .footer_title {
        font-weight: 900;
      }

      .preheader {
        display: none;
        mso-hide: all;
      }

      /* Typography */
      h1,
      h2,
      h3,
      h4 {
        color: #1d1c1d;
        font-weight: 700;
        margin: 0;
        margin-bottom: 12px;
      }

      h1 {
        font-size: 36px;
        line-height: 42px;
        letter-spacing: -0.25px;
        margin-bottom: 28px;
        text-align: left;
        word-break: break-word;
      }

      h2 {
        font-size: 24px;
        line-height: 32px;
        letter-spacing: -0.75px;
        margin-bottom: 28px;
        text-align: left;
      }

      h3 {
        font-size: 18px;
        line-height: 24px;
        letter-spacing: 0px;
        margin-bottom: 0px;
      }

      p,
      ul,
      ol {
        font-size: 17px;
        line-height: 24px;
        font-weight: normal;
        margin: 0;
        margin-bottom: 15px;
      }

      ul,
      ol {
        padding-left: 40px;
      }

      p li,
      ul li,
      ol li {
        list-style-position: outside;
        margin-left: 5px;
      }

      p {
        font-size: 16px;
        letter-spacing: -0.2px;
      }

      a {
        color: #1264a3;
        text-decoration: underline !important;
      }

      a:hover {
        text-decoration: underline;
      }

      .button_link::after {
        position: absolute;
        content: "";
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        border-radius: 4px;
      }

      .button_link:hover::after {
        box-shadow: inset 0 -2px #237c4a;
      }

      .button_link.is_secondary:hover::after {
        box-shadow: none;
      }

      .button_link:hover {
        background-color: {{ accentColor }} !important;
        border-color: {{ accentColor }} !important;
      }

      .button_link_wrapper:hover {
        background-color: {{ accentColor }} !important;
      }

      .button_link:hover::after {
        box-shadow: none;
      }

      .preview_text {
        color: transparent;
        display: none;
        height: 0;
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
        mso-hide: all;
        visibility: hidden;
        width: 0;
        font-size: 1px;
        line-height: 1px;
      }

      .preview_text a {
        color: #3aa3e3 !important;
        font-weight: bold;
      }

      .sm_visible {
        display: none;
      }

      /* Responsive and Mobile Friendly Styles */
      /* Yahoo Mail has a history of rendering all media query styles with class selectors unless class is used as an attribute */
      @media only screen and (max-width: 600px) {
        table[class="background_main"] .sm_full_width {
          width: 100% !important;
        }

        table[class="background_main"] .sm_90_percent_width {
          width: 90% !important;
          padding: 16px !important;
          text-align: center !important;
          float: none !important;
        }

        table[class="background_main"] .sm_side_padding {
          padding-right: 8px !important;
          padding-left: 8px !important;
          float: none !important;
        }

        table[class="background_main"] .sm_small_top_padding {
          padding-top: 8px !important;
        }

        table[class="background_main"] .sm_top_padding {
          padding-top: 16px !important;
        }

        table[class="background_main"] .sm_auto_width {
          width: auto !important;
        }

        table[class="background_main"] .sm_auto_height {
          height: auto !important;
        }

        table[class="background_main"] .sm_border_box {
          box-sizing: border-box !important;
        }

        table[class="background_main"] .sm_block {
          display: block !important;
        }

        table[class="background_main"] .sm_inline_block {
          display: inline-block !important;
        }

        table[class="background_main"] .sm_table {
          display: table !important;
        }

        table[class="background_main"] .sm_no_side_padding {
          padding-right: 0 !important;
          padding-left: 0 !important;
        }

        table[class="background_main"] .sm_no_border_radius {
          border-radius: 0 !important;
        }

        table[class="background_main"] .sm_no_padding {
          padding-right: 0 !important;
          padding-left: 0 !important;
        }

        table[class="background_main"] .sm_os_icons_height {
          /* this is to make the parent element the same height as the inline-block img inside */
          height: 44px;
        }

        table[class="background_main"] .small_icon {
          width: 20px !important;
          height: 20px !important;
        }

        table[class="background_main"] .small_margin {
          margin-left: 20px !important;
        }

        .social_img_bottom_margin {
          /*this class is for social_user_outreach email only*/
          margin-bottom: 20px !important;
        }

        .social_p_bottom_margin {
          /*this class is for social_user_outreach email only*/
          margin-bottom: 40px !important;
        }

        /* Common responsive styles for new email design templates #feat-activation-email-audit */
        .sm_hidden {
          display: none !important;
        }

        .sm_visible {
          display: inline-block !important;
        }
        h1 {
          font-size: 24px !important;
          line-height: 30px !important;
          margin-bottom: 20px !important;
          word-break: break-word;
        }
        h2 {
          font-size: 16px !important;
          line-height: 23px !important;
          margin-bottom: 10px !important;
        }
        h3 {
          font-size: 14px !important;
          line-height: 20px !important;
        }

        .hero_paragraph,
        .bulleted_list {
          font-size: 14px !important;
          line-height: 19px !important;
          margin-bottom: 20px !important;
          word-break: break-word;
        }

        .status_paragraph {
          font-size: 14px !important;
          line-height: 19px !important;
          word-break: break-word;
        }
        .content_paragraph {
          font-size: 12px !important;
          line-height: 18px !important;
          margin-bottom: 10px !important;
        }
        .list_paragraph {
          font-size: 12px !important;
          line-height: 18px !important;
        }

        .restyle_button {
          font-size: 12px !important;
          border-top: 10px solid !important;
          border-bottom: 10px solid !important;
          border-color: #611f69 !important;
          line-height: 12px !important;
        }

        .margin_top {
          margin-top: 20px !important;
        }

        .lg_margin_left_right {
          margin-left: 26px !important;
          margin-right: 26px !important;
        }

        .xl_margin_bottom {
          margin-bottom: 30px !important;
        }

        .xl_margin_top {
          margin-top: 30px !important;
        }
        .hero_block_container {
          margin-left: 26px !important;
        }

        .hero_block_left {
          width: 50% !important;
        }

        .logo_style {
          margin-top: -6px !important;
          margin-bottom: -12px !important;
        }

        .larger_bottom_margin {
          margin-bottom: 30px !important;
        }

        .list_header {
          font-size: 16px !important;
        }

        .list_icon_wrapper {
          width: 55px !important;
        }

        .list_icon_style {
          width: 40px !important;
          height: 40px !important;
        }

        .list_icon_style_large {
          width: auto !important;
          height: 50px !important;
        }

        .line_height_24 {
          line-height: 24px !important;
        }

        .brand_logo_wrapper {
          width: 78px !important;
        }

        .brand_logo_style {
          width: 68px !important;
          height: 68px !important;
        }

        .brand_heading {
          font-size: 14px !important;
          line-height: 20px !important;
        }

        .brand_link {
          font-size: 13px !important;
          line-height: 18px !important;
        }

        .grey_box_container {
          padding: 20px 9px !important;
        }

        .account_info_wrapper {
          margin-bottom: 18px !important;
        }

        .account_info_item {
          padding: 0px 5px !important;
        }

        .account_info_avatar {
          width: 55px !important;
          height: 55px !important;
          margin-bottom: 5px !important;
        }
        table[class="background_main"] .sm_padding {
          padding: 0 26px !important;
        }
        .small_font {
          font-size: 14px !important;
        }
      }

      /* More client-specific styles */
      @media all {
        .ExternalClass {
          width: 100%;
        }

        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
          line-height: 100%;
        }

        .footer_link {
          color: #1d1c1d !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
        }
      }
      a:hover {
        text-decoration: underline !important;
      }

      pre,
      code {
        --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
        border: 1px solid var(--saf-0);
        background: rgba(var(--sk_foreground_min, 29, 28, 29), 0.04);
        font-family: "Monaco", "Menlo", "Consolas", "Courier New", monospace !important;
        font-size: 12px;
        line-height: 1.50001;
        font-variant-ligatures: none;
        white-space: pre;
        white-space: pre-wrap;
        word-wrap: break-word;
        word-break: normal;
        -webkit-tab-size: 4;
        -moz-tab-size: 4;
        -o-tab-size: 4;
        tab-size: 4;
      }

      code {
        color: #e01e5a;
        padding: 2px 3px 1px;
        border-radius: 3px;
      }

      pre {
        margin-bottom: 16px;
        padding: 8px;
        border-radius: 4px;
      }

      blockquote {
        position: relative;
        margin-bottom: 16px;
        padding-left: 16px;
        border-left: rgba(var(--sk_foreground_low_solid, 221, 221, 221), 1);
        border-left-width: 4px;
        border-left-style: solid;
      }
    </style>
  </head>
  <body>
    <!--[if mso
      ]><style type="text/css">
        .background_main,
        table,
        table td,
        p,
        div,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: Arial, sans-serif !important;
        }
      </style><!
    [endif]-->
    <table
      style="
        background-color: #ffffff;
        padding-top: 20px;
        color: #434245;
        width: 100%;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        border: 0;
        text-align: center;
        border-collapse: collapse;
      "
      class="background_main"
    >
      <tr>
        <td style="vertical-align: top; padding: 0">
          <center>
            <table
              id="body"
              class="card"
              style="
                border: 0;
                border-collapse: collapse;
                margin: 0 auto;
                background: white;
                border-radius: 8px;
                margin-bottom: 16px;
              "
            >
              <tr>
                <td
                  style="width: 546px; vertical-align: top; padding-top: 32px"
                >
                  <div style="max-width: 600px; margin: 0 auto">
                    <!--[if mso]>
<table cellpadding="0" cellspacing="0" border="0" style="padding: 0; margin: 0; width: 100%;">
    <tr>
        <td colspan="3" style="padding: 0; margin: 0; font-size: 20px; height: 20px;" height="20">&nbsp;</td>
    </tr>
    <tr>
        <td style="padding: 0; margin: 0;">&nbsp;</td>
        <td style="padding: 0; margin: 0;" width="540">
<![endif]-->
                    <div
                      style="
                        margin-left: 50px;
                        margin-right: 50px;
                        margin-bottom: 72px;
                      "
                      class="lg_margin_left_right xl_margin_bottom"
                    >
                      <div style="margin-top: 18px" class="logo_style">
                        <img
                          width="{{ imageWidth }}"
                          height="{{ imageHeight }}"
                          style="
                            margin-top: 0;
                            margin-right: 0;
                            margin-bottom: 32px;
                            margin-left: 0px;
                          "
                          src="{{ imageSrc }}"
                          alt="logo"
                        />
                      </div>
                      <h1>{{ subject }}</h1>
                      <p
                        style="
                          font-size: 20px;
                          line-height: 28px;
                          letter-spacing: -0.2px;
                          margin-bottom: 28px;
                          word-break: break-word;
                        "
                        class="hero_paragraph"
                      >
                        {{ headline }}
                      </p>
                      <p
                        style="
                          font-size: 16px;
                          line-height: 24px;
                          letter-spacing: -0.2px;
                          margin-bottom: 28px;
                        "
                        class="content_paragraph"
                      >
                        {{ instructions }}
                      </p>
                      <table style="width: 100%" class="sm_table">
                        <tr style="width: 100%">
                          <td style="width: 100%">
                            <span
                              style="
                                display: inline-block;
                                position: relative;
                                border-radius: 4px;
                                background-color: {{ accentColor }};
                                width: 100%;
                                text-align: center;
                              "
                              class="button_link_wrapper"
                              ><a
                                class="button_link sm_full_width sm_border_box restyle_button"
                                href="{{ buttonLink }}"
                                style="
                                  border-top: 13px solid;
                                  border-bottom: 13px solid;
                                  border-right: 24px solid;
                                  border-left: 24px solid;
                                  border-color: {{ accentColor }};
                                  border-radius: 4px;
                                  background-color: {{ accentColor }};
                                  color: #ffffff;
                                  font-size: 16px;
                                  line-height: 18px;
                                  word-break: break-word;
                                  font-weight: bold;
                                  font-size: 14px;
                                  border-top: 20px solid;
                                  border-bottom: 20px solid;
                                  border-color: {{ accentColor }} !important;
                                  line-height: 14px;
                                  letter-spacing: 0.8px;
                                  text-transform: uppercase;
                                  box-sizing: border-box;
                                  width: 100%;
                                  text-align: center;
                                  display: inline-block;
                                  text-align: center;
                                  font-weight: 900;
                                  text-decoration: none !important;
                                "
                                >{{ buttonText }}</a
                              ></span
                            >
                          </td>
                        </tr>
                      </table>
                      <p
                        style="
                          font-size: 16px;
                          line-height: 24px;
                          letter-spacing: -0.2px;
                          margin-bottom: 28px;
                          margin-top: 40px;
                        "
                        class="content_paragraph"
                      >
                        {{ disclaimer }}
                      </p>
                    </div>
                    <!--[if mso]>
		</td>
		<td style="padding: 0; margin: 0; font-size: 20px; height: 20px;">&nbsp;</td>
	</tr>
	<tr>
		<td colspan="3" style="padding: 0; margin: 0; font-size: 20px; height: 20px; height: 20px;">&nbsp;</td>
	</tr>
</table>
<![endif]-->
                  </div>
                </td>
              </tr>
            </table>
          </center>
        </td>
      </tr>
      <tr>
        <td
          class="email_footer"
          style="
            font-size: 15px;
            color: #717274;
            text-align: center;
            width: 100%;
          "
        >
          <!--[if mso]>
<table cellpadding="0" cellspacing="0" border="0" style="padding: 0; margin: 0; width: 100%;">
    <tr>
        <td colspan="3" style="padding: 0; margin: 0; font-size: 20px; height: 20px;" height="20">&nbsp;</td>
    </tr>
    <tr>
        <td style="padding: 0; margin: 0;">&nbsp;</td>
        <td style="padding: 0; margin: 0;" width="540">
<![endif]-->
          <center>
            <table
              style="
                margin: 20px auto 0;
                background-color: white;
                border: 0;
                text-align: center;
                border-collapse: collapse;
              "
            >
              <tr>
                <td style="width: 546px; vertical-align: top; padding: 0px">
                  <div style="max-width: 600px; margin: 0 auto">
                    <div style="padding: 0 50px" class="sm_padding">
                      <div
                        style="
                          font-size: 12px;
                          opacity: 0.5;
                          color: #696969;
                          text-align: left;
                          line-height: 15px;
                          margin-bottom: 50px;
                          text-align: left;
                        "
                      >
                        <div>{{ footer }}</div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </center>
          <!--[if mso]>
		</td>
		<td style="padding: 0; margin: 0; font-size: 20px; height: 20px;">&nbsp;</td>
	</tr>
	<tr>
		<td colspan="3" style="padding: 0; margin: 0; font-size: 20px; height: 20px; height: 20px;">&nbsp;</td>
	</tr>
</table>
<![endif]-->
        </td>
      </tr>
    </table>
  </body>
</html>
```
