# 🏠 HomeRent — Housing Rental Platform (Frontend)

A full-stack **housing rental** web application frontend where tenants can browse rental
properties and send rental requests, and admins can manage properties, requests, and users.

This repository contains the **React frontend**. It talks to a REST API backend
(FastAPI) that serves properties, users, and rental requests.

**🌐 Live Demo:** [https://housing-rental-frontend.vercel.app/](https://housing-rental-frontend.vercel.app/)

---

## ✨ Features

**Public (Guest)**
- Browse the home page with featured properties
- Search, filter, sort, and paginate the property list
- View detailed property pages
- Register (Sign up) and log in

**Registered User (Tenant)**
- Personal dashboard
- Send a rental request for a property
- Track the status of their own requests (`pending` → `approved` / `rejected`)
- Automatic session restore (JWT access + refresh token)

**Admin**
- Admin dashboard
- Create, edit, and delete properties
- Approve or reject rental requests
- View all users, search/filter them, and activate/deactivate accounts
- Protected admin-only routes (`role === "admin"`)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| UI library | React 19 |
| Build tool | Vite 8 |
| Routing | React Router v7 (`react-router-dom`) |
| Styling | Tailwind CSS 4 + daisyUI 5 |
| Icons | react-icons |
| Toasts | react-hot-toast |
| Linting | ESLint (flat config) |
| Deployment | Vercel (SPA rewrite) |
| Backend | Separate REST API (FastAPI, JWT auth) |

---

## 📁 Project Structure

```
housing-rental-finalproject/
├── public/                    # Static assets (favicon, icons)
├── src/
│   ├── main.jsx               # App entry: Router + AuthProvider + Toaster
│   ├── App.jsx                # All route definitions & layout
│   ├── index.css              # Global styles (Tailwind)
│   ├── components/            # Reusable UI
│   │   ├── Navbar.jsx         # Responsive nav, auth-aware links, logout
│   │   ├── Footer.jsx
│   │   ├── PropertyCard.jsx   # Card used in property grids
│   │   ├── EmptyState.jsx
│   │   └── Loading.jsx / ErrorMessage.jsx / ConfirmModel.jsx (stubs)
│   ├── context/
│   │   └── AuthContext.jsx    # Global auth state (user, token, login/logout)
│   ├── routes/
│   │   ├── ProtectedRoute.jsx # Requires login
│   │   └── AdminRoute.jsx     # Requires login + role === "admin"
│   ├── services/
│   │   ├── api.js             # apiRequest() wrapper: base URL, Bearer token,
│   │   │                      #   401 → refresh token → retry request
│   │   ├── propertyStorage.js     # ⚠ legacy localStorage layer (unused)
│   │   ├── rentalRequests.js      # ⚠ legacy localStorage layer (unused)
│   │   └── rentalRequestStorage.js# ⚠ legacy localStorage layer (unused)
│   ├── pages/
│   │   ├── Home.jsx           # Landing page + featured properties
│   │   ├── Properties.jsx     # List with client-side filter/sort/pagination
│   │   ├── PropertyDetails.jsx# Detail page + "already requested" check
│   │   ├── About.jsx
│   │   ├── Login.jsx / Signup.jsx / ForgotPassword.jsx (stub)
│   │   ├── dashboard/
│   │   │   ├── UserDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── user/
│   │   │   ├── RentalRequest.jsx # Send a request for a property
│   │   │   └── MyRequests.jsx    # Track own requests
│   │   └── admin/
│   │       ├── RentalRequests.jsx  # Approve / reject requests
│   │       ├── ManageProperties.jsx# List + delete
│   │       ├── AddProperty.jsx
│   │       ├── EditProperty.jsx
│   │       └── AdminUsers.jsx      # User list + activate/deactivate
│   └── data/
│       └── properties.js      # ⚠ 6 sample properties (legacy, unused)
├── .env                       # VITE_API_URL (git-ignored)
├── vercel.json                # SPA rewrite → /index.html
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ (20+ recommended)
- A running backend API (local or deployed)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/housing-rental-finalproject.git
cd housing-rental-finalproject
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

> ⚠️ **Important:** `src/services/api.js` reads **`VITE_API_BASE_URL`**.
> The provided `.env` currently defines `VITE_API_URL`, which is **not** read by the app —
> so the app silently falls back to `http://127.0.0.1:8000`.
> Rename the variable to `VITE_API_BASE_URL` (or add it) to point at your backend,
> e.g. your deployed Render URL. Restart the dev server after changing `.env`.

### 4. Run the development server

```bash
npm run dev
```

The app starts at **http://localhost:5173** (Vite default).

### 5. Other commands

```bash
npm run build      # Production build → dist/
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint
```

---

## ⚙️ How the Project Works — Step by Step

### 1. Application bootstrapping
1. `index.html` loads `/src/main.jsx`.
2. `main.jsx` wraps `<App />` in `StrictMode` → `BrowserRouter` (client-side routing)
   → `AuthProvider` (global auth state) and mounts a `Toaster` for notifications.
3. `App.jsx` renders the persistent layout: `<Navbar />` + `<Routes>` + `<Footer />`.

### 2. Session restore on refresh
1. On mount, `AuthProvider` reads `token` from `localStorage`.
2. If a token exists, it calls `GET /auth/me` through `apiRequest()`.
3. On success → `authUser` is set and `isAuthenticated` becomes `true`.
4. On failure → tokens are cleared and the user stays logged out.
5. While restoring, `ProtectedRoute` / `AdminRoute` show a spinner instead of flashing
   the login page.

### 3. Registration (Sign up)
1. User fills `/signup`: full name, email, phone, family members, district,
   NID **or** passport (at least one), password (min 8 chars) + confirmation.
2. The form POSTs to `/auth/register`.
3. On success → toast + redirect to `/login`.

### 4. Login and role-based redirection
1. User submits `/login` → `POST /auth/login` with `{ email, password }`.
2. The response returns `access_token` and `refresh_token`.
3. Tokens are stored in `localStorage`, then `GET /auth/me` fetches the profile.
4. `AuthContext.login(user, access, refresh)` updates global state.
5. Redirect logic:
   - back to the originally requested page (e.g. after clicking "Request to Rent" while logged out), else
   - `/admin` if `role === "admin"`, otherwise `/dashboard`.

### 5. Protected routing
- `ProtectedRoute` — waits for session restore; redirects to `/login` (saving the
  current location) when not authenticated.
- `AdminRoute` — additionally checks `authUser.role === "admin"`; non-admins are
  redirected to `/dashboard`, so admin pages are never rendered for tenants.

### 6. Every API call (`services/api.js`)
1. `apiRequest(endpoint, options)` adds:
   - `Content-Type: application/json` when a body exists,
   - `Authorization: Bearer <token>` from `localStorage`.
2. On `2xx` → returns the parsed JSON.
3. On **401** → automatically calls `POST /auth/refresh` with the stored refresh token,
   saves the new access token, **retries the original request**, and returns the result.
4. If refreshing fails → tokens are cleared and the user is sent to `/login`.
5. Any other error → throws `Error(data.detail || "Request failed (status)")`,
   which pages surface via toast or an inline alert.

### 7. Browsing properties (public)
1. `Home.jsx` fetches `GET /properties/?page=1&page_size=3&is_available=true`
   and renders the first 3 as `PropertyCard`s.
2. `Properties.jsx` fetches `GET /properties/?page=1&page_size=100&is_available=true`,
   then applies **client-side** search (title/location), max price, min bedrooms,
   sorting (price), and 6-items-per-page pagination.
3. `PropertyDetails.jsx` fetches `GET /properties/{id}` — with a fallback query
   (`?property_id={id}&is_available=false`) so unavailable properties still render.
4. If the visitor is logged in, it also calls `GET /rental-requests/my?property_id={id}`
   to detect an existing request → shows the status badge and disables
   **"Request to Rent"** when already requested or the property is unavailable.

### 8. Sending a rental request (tenant)
1. Route `/properties/:id/request` (login required) loads the property.
2. The form is prefilled from the authenticated user's profile.
3. On submit → `POST /rental-requests/` with `{ property_id, message }`.
   Since the API only accepts a `message`, name/email/phone/move-in date are packed
   into a multi-line string (documented workaround in the code).
4. Success → toast + redirect to `/my-requests`.

### 9. Tracking requests (tenant)
1. `/my-requests` calls `GET /rental-requests/my?page=1&page_size=100`.
2. Each card shows `property_id`, `status` badge (`pending`/`approved`/`rejected`),
   `created_at`, and the message, plus a link back to the property.

### 10. Admin — managing requests
1. `/admin/requests` calls `GET /rental-requests/?page=1&page_size=100`.
2. Stat cards + a client-side status filter (pending/approved/rejected).
3. **Approve/Reject** → `PATCH /rental-requests/{id}/status` with
   `{ status: "approved" | "rejected" }`, then the list is reloaded.

### 11. Admin — managing properties
1. `/admin/properties` lists all properties via `GET /properties/?page=1&page_size=100`.
2. **Add** → `/admin/properties/add` → `POST /properties/`
   (`title, description, location, monthly_rent, bedrooms, bathrooms, image_url, is_available`).
3. **Edit** → `/admin/properties/edit/:id` → loads `GET /properties/{id}`,
   submits `PUT /properties/{id}` (local field names `price`/`image` are mapped
   back to `monthly_rent`/`image_url`).
4. **Delete** → `DELETE /properties/{id}` with a browser confirmation. If the backend
   reports the property has rental requests, a friendly toast suggests marking it
   *Not Available* instead.

### 12. Admin — managing users
1. `/admin/users` uses **server-side** pagination/search/filter:
   `GET /users/?page&page_size&search&role&is_active&sort_by` (10 per page).
2. **Activate/Deactivate** → `PATCH /users/{id}/status` with `{ is_active }`.
3. The admin cannot deactivate their own account.

### 13. Logout
- `AuthContext.logout()` clears `token`, `refreshToken`, and `authUser` from
  `localStorage` and resets state; the Navbar then navigates to `/`.

---

## 🗺 Route Map

| Route | Access | Page |
|---|---|---|
| `/` | Public | Home |
| `/properties` | Public | Property list (filter/sort) |
| `/properties/:id` | Public | Property details |
| `/about` | Public | About |
| `/login` | Public | Login |
| `/signup` | Public | Register |
| `/forgot-password` | Public | Password reset (UI stub) |
| `/dashboard` | Logged in | User dashboard |
| `/my-requests` | Logged in | My rental requests |
| `/properties/:id/request` | Logged in | Send rental request |
| `/admin` | Admin | Admin dashboard |
| `/admin/requests` | Admin | Approve/reject requests |
| `/admin/properties` | Admin | Manage properties |
| `/admin/properties/add` | Admin | Add property |
| `/admin/properties/edit/:id` | Admin | Edit property |
| `/admin/users` | Admin | Manage users |

---

## 🔌 API Endpoints Used

| Method | Endpoint | Used by |
|---|---|---|
| POST | `/auth/register` | Signup |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | `apiRequest()` on 401 |
| GET | `/auth/me` | Session restore, after login |
| GET | `/properties/?page&page_size&is_available` | Home, Properties, ManageProperties |
| GET | `/properties/{id}` | PropertyDetails, RentalRequest, EditProperty |
| POST | `/properties/` | AddProperty |
| PUT | `/properties/{id}` | EditProperty |
| DELETE | `/properties/{id}` | ManageProperties |
| GET | `/rental-requests/my?...` | PropertyDetails, MyRequests |
| POST | `/rental-requests/` | RentalRequest (send) |
| GET | `/rental-requests/?...` | Admin RentalRequests |
| PATCH | `/rental-requests/{id}/status` | Admin approve/reject |
| GET | `/users/?...` | AdminUsers |
| PATCH | `/users/{id}/status` | AdminUsers activate/deactivate |

---

## 🔐 Authentication Flow

```
Login ──► POST /auth/login ──► { access_token, refresh_token }
                │
                ▼
        localStorage: "token", "refreshToken"
                │
                ▼
        GET /auth/me ──► authUser (role, name, email)
                │
                ▼
      AuthContext: isAuthenticated = true
                │
   later API call returns 401 (access token expired)
                │
                ▼
   POST /auth/refresh { refresh_token } ──► new access_token
                │                                │
                │ success ──► retry original request with new token
                │ failure ──► clear storage ──► redirect /login
```

---

## 🗄 Data Sources — Note for Contributors

The app currently reads/writes **only through the backend API** (`services/api.js`).

Three older services are **legacy and not imported by any page** — they persist data in
`localStorage` and are kept only for reference:

- `services/propertyStorage.js` (key `homeRentProperties`)
- `services/rentalRequests.js` (key `rentalRequests`)
- `services/rentalRequestStorage.js` (key `homeRentRentalRequests`)

Similarly, `src/data/properties.js` (6 mock properties with a `price/image/status`
shape that differs from the API's `monthly_rent/image_url/is_available`) is unused.

The only `localStorage` keys actively used are `token` and `refreshToken`.

---

## 🌐 Deployment

- **Live frontend:** [https://housing-rental-frontend.vercel.app/](https://housing-rental-frontend.vercel.app/)
- **Vercel:** `vercel.json` rewrites every path to `/index.html` so client-side
  routing works on refresh/deep links. Set the environment variable
  `VITE_API_BASE_URL` in the Vercel project settings, then deploy (`npm run build`
  output → `dist/`).
- **Backend:** the API must allow CORS for your frontend origin.

---

## 🐛 Known Limitations / TODO

- `.env` variable name mismatch (`VITE_API_URL` vs `VITE_API_BASE_URL`) — see *Getting Started*.
- `ForgotPassword` is a UI-only stub (no API call yet).
- Home page hero search box is decorative; real filtering lives on `/properties`.
- Mixed pagination styles (server-side for users, `page_size=100` + client-side elsewhere).
- Empty stub components: `Loading.jsx`, `ErrorMessage.jsx`, `ConfirmModel.jsx`
  (loading/error/confirm UI is currently duplicated inline per page).
- Debug `console.log` statements left in a few pages.
- `index.html` title is `housing-rental-frontend` instead of the HomeRent branding.
- Backend repository is separate from this frontend repository.

---

## 📄 License

This project is part of a final-year academic project. Add a license of your choice
(e.g. MIT) before publishing.
