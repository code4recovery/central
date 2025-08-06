# Central

Central is a free content management system to help service entities manage their directory of recovery meetings. It is currently in active development. Once it's ready, it will be deployed and usable by service entities for free with minimal configuration.

## Developer info

Central is developed on the MERN stack (MongoDB, Express, React, Node.js). It uses these frameworks:

- [Remix](https://remix.run/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)

You can set up and run Central yourself. It requires these third-party services:

- Google [Geocoding](https://developers.google.com/maps/documentation/geocoding/overview), [Sheets](https://developers.google.com/sheets/api), and [Time Zone](https://developers.google.com/maps/documentation/timezone/overview) APIs
- [MongoDB](https://www.mongodb.com/)
- [Resend](https://resend.com/)

## Run locally

Start by creating a `.env` file in your project root with the following content, then continue to the next steps to configure services.

```bash
# Base URL (to populate edit URLs)
BASE_URL="http://localhost:3000"

# Random security salt (to protect sessions)
SESSION_SECRET="<make.up.a.cryptographic.salt>"

# MongoDB connection URL (to store data)
DATABASE_URL="mongodb+srv://<user>:<password>@cluster0.<cluster>.mongodb.net/<database>"

# Google Geocoding, Sheets, and Time Zone APIs
GOOGLE_API_KEY="<your.google.api.key>"

# Resend (to send email)
RESEND_API_KEY="<your.resend.api.key>"
RESEND_SENDER="<your.sender@address.com>"
```

### Set a base URL

This will be the base for the `edit_url`s in your JSON which link back to meeting entries. Use your Central URL without the trailing slash.

### Create a session secret

You can type any string of random characters here, or use a random string generator.

### Set up MongoDB

1. Install MongoDB (requires a replica set) or sign up for [Atlas](https://www.mongodb.com/atlas/database)
1. Create a database
1. Copy the connection string to your `.env`

### Set up Google Geocoding and Time Zone APIs

1. In Cloud Console, enable the Geocoding and Time Zone APIs
1. Go to Credentials > Create Credentials
1. Restrict to these two APIs (if you can figure out how to restrict it to the proper IP addresses for Cloud Run, let us know!)
1. Copy the API key and add it to your `.env`

### Set up Resend

1. Set up an account at Resend
1. Get API key and sender email, add them to `.env`

### Run locally

1. Run `npm i` (you don't need to do this every time but should do it when you pull changes)
1. Now run `npm run dev`. Your site should be running at [http://localhost:3000/](http://localhost:3000/)

### Deploy

We are evaluating options for the best method of deploying Central. Currently we have this working on Google [Cloud Run](https://cloud.google.com/run) and a VPS using [Laravel Forge](https://forge.laravel.com/).
