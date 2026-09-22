# THY

Bespoke Indian wear marketplace — customer + tailor apps, chat, orders, payments, and an admin console.

## Stack

- **Frontend:** Next.js 15 (App Router) on port `3000`
- **API:** Express + Socket.IO on port `4000`
- **Data:** MongoDB (primary). Optional Postgres for payments migrations.
- **Payments:** Razorpay Checkout + webhooks

## Local setup

```bash
# 1) Frontend env
cp .env.example .env.local

# 2) API env
cp server/.env.example server/.env
# fill MongoDB, JWT secrets, Razorpay, Google OAuth

# 3) Install + seed admin (optional)
cd server
npm install
npm run seed:mongo
npm run dev

# 4) Frontend (second terminal, repo root)
cd ..
npm install
npm run dev
```

- Site: http://localhost:3000  
- API health: http://localhost:4000/api/v1/health  
- Admin dashboard: http://localhost:3000/admin (sign in via `/login` with an admin account)  
  Seeded admin (after `npm run seed:mongo`): `admin@thy.local` / `admin123` — change in production.

## Production deploy checklist

### 1. Frontend (e.g. Vercel)

Set environment variables:

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_AUTH_API_URL` | `https://api.yourdomain.com/api/v1` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | your OAuth web client ID |
| `GOOGLE_CLOUD_PROJECT` | optional, for studio AI |
| `GOOGLE_CLOUD_LOCATION` | `global` |

Build command: `npm run build`  
Output: Next.js default (`next start` or Vercel).

Point Google OAuth authorized origins / redirect URIs at your production frontend URL.

### 2. API (e.g. Render, Railway, Fly, VM)

Set environment from `server/.env.example`, especially:

| Variable | Notes |
|----------|--------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Atlas connection string |
| `FRONTEND_ORIGIN` | exact frontend URL, e.g. `https://thy.vercel.app` |
| `FRONTEND_ORIGINS` | optional comma-separated extras |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | long random values |
| `EXPOSE_MOCK_OTP` | **must be `false`** |
| `RAZORPAY_*` | live or test keys |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | OAuth |

Start command:

```bash
cd server && npm install && npm start
```

Health check path: `/api/v1/health`

Razorpay webhook URL:

`https://<api-host>/api/v1/payments/webhook`

Subscribe to `payment.captured`, `payment.failed`, and `order.paid`. Use the same `RAZORPAY_WEBHOOK_SECRET`.

### 3. After first deploy

1. Confirm `GET /api/v1/health` returns Mongo connected.
2. Run `npm run seed:mongo` once on the API host (or locally against Atlas) to create the admin user if needed.
3. Sign in at `/login` with the admin account, open `/admin`, change the admin password, approve tailor documents.
4. Smoke-test customer signup → preferences → login (should not re-ask preferences).
5. Smoke-test tailor signup → document upload → admin approve.

## Scripts

| Location | Command | Purpose |
|----------|---------|---------|
| root | `npm run dev` | Next.js dev |
| root | `npm run build` / `npm start` | Next.js production |
| `server/` | `npm run dev` | API + Socket.IO watch |
| `server/` | `npm start` | API production |
| `server/` | `npm run seed:mongo` | seed demo users + admin |
| `server/` | `npm test` | payment util tests |

## Security notes

- Never commit `.env`, ADC JSON, or service-account keys (ignored by git).
- Keep Razorpay and JWT secrets only in the host secret store.
- Tailor verification documents are stored for admin review — treat Mongo access as sensitive.
