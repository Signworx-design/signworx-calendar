# Signworx Calendar

Private internal shared calendar for Signworx operations. The React app reads and writes all calendar data through a PHP API backed by SQLite.

This is not Firebase, not a login/account app, and not localStorage calendar storage. Browser storage is used only for the session token, session expiry, and display name.

## Stack

- React, Vite, Tailwind CSS, Framer Motion
- FullCalendar React with month, week, and list views
- Lucide React icons
- PWA manifest for home screen install
- PHP API for normal cPanel/shared hosting
- SQLite database at `api/database/signworx_calendar.sqlite`

## Local Install

```bash
cd signworx-calendar/client
npm install
npm run dev
```

The frontend defaults to:

```text
http://127.0.0.1:5173
```

## Install PHP On Windows

Option 1: Install XAMPP, then add the XAMPP PHP folder to PATH:

```text
C:\xampp\php
```

Option 2: Install PHP manually from windows.php.net, then add the folder containing `php.exe` to PATH.

Confirm PHP is available:

```bash
php -v
```

## Run The PHP API

PHP must be installed locally.

```bash
cd C:\Users\User\OneDrive\Desktop\signworx-appointments\signworx-calendar
php api/init-db.php
php -S 127.0.0.1:8000 -t api
```

In another terminal:

```bash
cd C:\Users\User\OneDrive\Desktop\signworx-appointments\signworx-calendar\client
npm run dev
```

The frontend calls:

```text
http://127.0.0.1:8000/routes/
```

Change this for production in `client/src/config/api.js` or with:

```bash
VITE_API_BASE_URL=https://yourdomain.co.za/path-to-api/routes npm run build
```

## API Smoke Tests

Browser smoke test:

```text
http://127.0.0.1:8000/test-api.php
```

Create event:

```bat
curl -X POST http://127.0.0.1:8000/routes/events-create.php ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Test Job\",\"type\":\"installation\",\"clientName\":\"Test Client\",\"siteLocation\":\"Mossel Bay\",\"startDate\":\"2026-05-25\",\"endDate\":\"2026-05-25\",\"startTime\":\"08:00\",\"endTime\":\"10:00\",\"allDay\":false,\"assignedTo\":\"Team\",\"status\":\"planned\",\"priority\":\"normal\",\"notes\":\"Testing save\",\"createdByName\":\"Wade\",\"updatedByName\":\"Wade\",\"changedByName\":\"Wade\"}"
```

List events:

```bat
curl http://127.0.0.1:8000/routes/events-list.php
```

Delete event:

```bat
curl -X POST http://127.0.0.1:8000/routes/events-delete.php ^
  -H "Content-Type: application/json" ^
  -d "{\"id\":1,\"changedByName\":\"Wade\"}"
```

## Optional Password Setup

The current internal build opens without the password screen. The old password routes are still present if password access is re-enabled later.

Generate a bcrypt hash:

```bash
php -r "echo password_hash('YOUR_PRIVATE_PASSWORD', PASSWORD_BCRYPT), PHP_EOL;"
```

Set it either as an environment variable:

```text
SIGNWORX_APP_PASSWORD_HASH=your_generated_hash
SIGNWORX_SESSION_SECRET=long_random_secret_string
```

Or replace the fallback values in `api/config.php`.

Development fallback password is `password`. Change it before deploying if `AUTH_REQUIRED` is set back to `true` in `api/config.php`.

## Database Tables

`api/schema.sql` creates:

- `events`
- `comments`
- `activity_logs`
- `sessions`

Every event create, update, status change, delete, and comment writes an activity log entry.

## API Routes

- `POST /routes/unlock.php`
- `GET /routes/verify-session.php`
- `POST /routes/logout.php`
- `GET /routes/events-list.php`
- `POST /routes/events-create.php`
- `POST /routes/events-update.php`
- `POST /routes/events-delete.php`
- `GET /routes/comments-list.php?eventId=1`
- `POST /routes/comments-create.php`
- `GET /routes/activity-list.php`

Current development access has `AUTH_REQUIRED = false` in `api/config.php`, so the event routes do not require an authorization token.

## cPanel Deployment

1. Run `npm run build` inside `client`.
2. Upload the contents of `client/dist` to the public web folder for the app.
3. Upload the `api` folder to hosting, preferably outside the public frontend folder if your host allows it.
4. Ensure `api/database` is writable by PHP.
5. Run `api/init-db.php` once from terminal, cPanel cron, or a temporary browser request if protected.
6. Set `SIGNWORX_APP_PASSWORD_HASH` and `SIGNWORX_SESSION_SECRET`, or edit `api/config.php`.
7. Set `VITE_API_BASE_URL` before building so the frontend points to the uploaded API route folder.

## Home Screen Install

The app includes `manifest.json`, theme color, standalone display mode, and an icon. Open the deployed app on the boss's phone and use the browser option to add it to the home screen.

## Capacitor APK Later

This project is PWA-ready and mobile-clean, so it can later be wrapped with Capacitor as a simple Android shell pointing at the deployed web app. Native Android is intentionally not included here.

## Folder Structure

```text
signworx-calendar/
  client/
    src/
      components/
      context/
      pages/
      services/
      styles/
      utils/
  api/
    helpers/
    middleware/
    routes/
    database/
    schema.sql
```
