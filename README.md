# Porter Backend Starter

A minimal Express + MongoDB starter API for a Porter/Truck app. Includes JWT auth, simple Request model, and basic driver/customer flows.

## Setup (local)
1. Copy files into a folder
2. `npm install`
3. Create `.env` from `.env.example` and set `MONGODB_URI` and `JWT_SECRET`
4. `npm run dev` (requires nodemon) or `npm start`

## Deploy to Render (quick steps)
1. Push this repo to GitHub
2. Create a new **Web Service** on Render and connect the repo
3. Environment: **Node**
4. Build command: `npm install`
5. Start command: `npm start`
6. Add Environment Variables on Render (Dashboard -> Service -> Environment -> Add):
   - `MONGODB_URI` (use MongoDB Atlas free tier)
   - `JWT_SECRET`
7. Deploy. Your public URL will be shown on the service page.

## Notes & Next Improvements
- Add validation (express-validator)
- Add rate-limiting and CORS whitelist for production
- Add GeoLocation fields and Socket.io for real-time tracking
- Add file upload (driver docs, images) using S3 or Supabase storage
