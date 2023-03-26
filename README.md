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
USER_NAME="Josh R."
USER_EMAIL="josh@joshreisner.com"
```

You may wish to seed your database with an existing Meeting Guide JSON feed. Coming soon.

To run locally, run `npm i` once, then run `npm run dev`. Your site will be running at http://localhost:3000/

## Deploy to the cloud

1. Add this repository (or a clone) to Cloud Run
1. Set your environment variables
