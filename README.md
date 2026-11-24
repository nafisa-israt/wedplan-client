# WedPlan — Wedding Planning Platform (Client)

WedPlan is a role-based wedding planning platform where customers discover wedding services and request bookings, vendors publish services and manage requests (with an optional Premium subscription), and admins moderate users, services and transactions.

## Live Links

- **Live Website:** https://wedplan-client-omega-beryl.vercel.app/
- **Client Repository:** https://github.com/nafisa-israt/wedplan-client
- **Server Repository:** https://github.com/nafisa-israt/wedplan-server
- **Backend API:** https://wedplan-server-kr5y.onrender.com

## Important Features

**Customer**
- Browse, search, filter (category, location) and sort (price asc/desc) approved services
- View service details and submit booking requests
- Track booking status and cancel pending requests
- Customer dashboard with booking statistics

**Vendor**
- Create, update, delete services with image upload (ImgBB)
- Free plan: up to 3 active services; Premium: unlimited
- Accept or reject booking requests
- Upgrade to Premium through Stripe Checkout (test mode)
- Vendor dashboard with overview statistics

**Admin**
- Manage users (search, filter by role, block/unblock)
- Approve, reject, change status or delete services
- View platform transactions
- Admin dashboard with platform statistics

**General**
- Email/password and Google authentication (Better Auth)
- Role-based protected routes on client and server
- JWT verification on the Express API
- Premium activated only through verified Stripe webhook events
- Fully responsive UI, toast notifications, loading and empty states
- Framer Motion animations on the home page

## Technology Stack

- Next.js, JavaScript
- Tailwind CSS, ShadCN UI
- Better Auth (email/password + Google OAuth) with the JWT plugin
- MongoDB
- Framer Motion
- Sonner (toasts), Lucide React (icons)
- ImgBB (image hosting)
- Stripe Checkout (via the server)

## Installation

```bash
git clone https://github.com/nafisa-israt/wedplan-client.git
cd wedplan-client
npm install
```

## Environment Variables

Create a `.env.local` file in the project root (never commit it):

```env
# Better Auth
BETTER_AUTH_SECRET=your_long_random_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# MongoDB
MONGODB_URI=your_mongodb_connection_string        
DB_NAME=your_database_name            

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ImgBB
IMGBB_API_KEY=your_imgbb_api_key

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000         
```

## Required Application URLs

- Google OAuth authorized JavaScript origin: `http://localhost:3000` (local), your Vercel URL (production)
- Google OAuth redirect URI: `{BETTER_AUTH_URL}/api/auth/callback/google`

## Run Locally

```bash
npm run dev
```

Open http://localhost:3000. The server repository must be running as well (see the server README).

## Build for Production

```bash
npm run build
npm start
```

## Admin Access

Admin accounts cannot be created through public sign up. Admin credentials for evaluation are provided in the submission form.

## Author

Nafisa Israt