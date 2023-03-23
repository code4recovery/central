# Unity | Unify | Central

This is a free content management system to help service entities manage their directory of recovery meetings.

## Services needed

This project uses the following third-party services:

- [Google Cloud Run](https://cloud.google.com/run)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [MongoDB](https://www.mongodb.com/) (we use [Atlas](https://www.mongodb.com/atlas/database))
- Google Cloud Storage (coming soon)
- Google Geocoding API (coming soon)
- Google TimeZone API (coming soon)
- SendGrid (coming soon)
- Sentry (coming soon)

## Run locally

Interested in making your own copy of this service, or adapting it to your needs? Get started by cloning this repo locally.

Create a `.env` file that looks like this, and replace

```sh
DATABASE_URL="mongodb+srv://<user>:<password>@cluster0.t0piiqe.mongodb.net/<database>"

GOOGLE_SHEET_API_KEY="<your.google.sheets.api.key>"

SESSION_SECRET="<make.up.a.cryptographic.salt>"
```

You may wish to seed your database with an existing Meeting Guide JSON feed. Coming soon.

To run locally, run `npm i` once, then run `npm run dev`. Your site will be running at http://localhost:3000/

## Deploy to the cloud

1. Add this repository (or a clone) to Cloud Run
1. Set your environment variables
