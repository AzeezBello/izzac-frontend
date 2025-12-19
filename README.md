# Izzac Frontend

Next.js 15 app for the Izzac car sharing platform. It consumes the Django API (`NEXT_PUBLIC_API_URL`) to handle authentication, browsing cars, booking trips, and managing host listings.

## Getting started
1) Install deps: `npm install`
2) Add `.env.local`:
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```
3) Run dev server: `npm run dev` (http://localhost:3000)

## Routes
- `/` – landing + featured cars
- `/cars`, `/cars/[id]` – catalogue and detail with booking form
- `/login`, `/signup` – auth flows (JWT stored client-side)
- `/dashboard` – host garage (cars you own)
- `/dashboard/add-car` – create a listing (photo upload required)
- `/dashboard/bookings` – your bookings, with a host/rider toggle

## Auth notes
- Tokens are stored in `localStorage` and attached via Axios interceptors.
- `/api/me/` is used to fetch the signed-in user on load.

For full-stack details (API endpoints, backend setup), see the root `README.md`.
