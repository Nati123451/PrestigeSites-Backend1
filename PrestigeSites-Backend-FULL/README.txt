PrestigeSites Backend – FULL
Includes: Prisma (SQLite), Leads API, Thank-you email (SMTP), Invoice PDF (VAT 18%).

Render settings:
  Root Directory: (leave empty if package.json is at repo root)
  Build Command: npm i && npx prisma generate && npx prisma db push
  Start Command: npm run start

Env:
  JWT_SECRET=<random>
  DATABASE_URL="file:./prestigesites.db"
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_SECURE=false
  SMTP_USER=<gmail>
  SMTP_PASS=<app password>
  MAIL_FROM="PrestigeSites <gmail>"
