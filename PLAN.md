# FreshMart — Next.js + PostgreSQL Migration Plan

## Overview

Migrating the FreshMart e-commerce store from **ASP.NET Core MVC + SQLite** to
**Next.js 14 (App Router) + PostgreSQL (Prisma)**. The goal is a deployable,
always-on stack using Vercel + Supabase (both free tiers, no sleep).

Working directory: `/Users/muhammadhannanhafeez/freshmart`  
Original project: `/Users/muhammadhannanhafeez/E-Comm`

---

## Tech Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Framework      | Next.js 14 — App Router, TypeScript |
| Styling        | Tailwind CSS                        |
| ORM            | Prisma                              |
| Database       | PostgreSQL (Supabase free tier)     |
| Auth           | NextAuth.js v5 (beta) — credentials |
| Password hash  | bcryptjs                            |
| File upload    | Cloudinary (free tier)              |
| Deployment     | Vercel (frontend + API routes)      |

---

## Environment Variables (needed before Phase 2)

Create/fill in `freshmart/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME"
NEXTAUTH_SECRET="any-random-32-char-string"
NEXTAUTH_URL="http://localhost:3000"
```

Get `DATABASE_URL` from:
- **Supabase**: Project → Settings → Database → Connection string (URI mode)
- **Neon**: Project dashboard → Connection string

---

## Data Models (translated from C# → Prisma)

### User
- id (String, cuid)
- email (String, unique)
- fullName (String?)
- address (String?)
- passwordHash (String)
- role (Enum: CUSTOMER | ADMIN)
- registeredAt (DateTime)
- orders (Order[])
- cartItems (CartItem[])
- reviews (Review[])

### Category
- id (Int)
- name (String, unique)
- description (String?)
- imageUrl (String?)
- products (Product[])

### Product
- id (Int)
- name (String)
- description (String?)
- price (Decimal)
- imageUrl (String?)
- stock (Int)
- isActive (Boolean, default true)
- unit (String?) — e.g. kg, litre, piece
- createdAt (DateTime)
- categoryId (Int) → Category
- orderItems (OrderItem[])
- cartItems (CartItem[])
- reviews (Review[])

### Order
- id (Int)
- userId (String) → User
- orderDate (DateTime)
- status (Enum: PENDING | PAID | PROCESSING | SHIPPED | DELIVERED | CANCELLED)
- totalAmount (Decimal)
- shippingAddress (String)
- stripePaymentIntentId (String?)
- orderItems (OrderItem[])

### OrderItem
- id (Int)
- orderId (Int) → Order
- productId (Int) → Product
- quantity (Int)
- unitPrice (Decimal)

### CartItem
- id (Int)
- userId (String) → User
- productId (Int) → Product
- quantity (Int)
- addedAt (DateTime)

### Review
- id (Int)
- rating (Int, 1–5)
- comment (String?)
- createdAt (DateTime)
- productId (Int) → Product
- userId (String) → User

---

## Features to Migrate (from original ASP.NET app)

### Storefront
- Homepage: hero, featured products (6), category grid
- Products listing: search, filter by category, sort (name/price/newest), pagination (12/page)
- Product detail: images, reviews (avg rating, add review), related products (4)
- Cart: add/update quantity/remove/clear — **DB-backed, persists across devices**
- Checkout: shipping address form, place order, confirmation page
- Auth: register, login, logout
- My Orders: list + detail view per order

### Admin Panel (`/admin/*`, role=ADMIN only)
- Dashboard: KPI tiles, 30-day revenue bar chart, orders-by-status bars, low-stock widget with restock, recent orders
- Products: search + category filter + pagination (25/page), bulk activate/deactivate, create/edit/delete, image upload
- Orders: status filter, update order status, export CSV
- Users: search, list with order stats + role badge
- Categories: create/edit/delete (guarded if has products)

---

## File Structure (target)

```
freshmart/
├── app/
│   ├── layout.tsx                  ← root layout (fonts, providers)
│   ├── page.tsx                    ← homepage
│   ├── (storefront)/
│   │   ├── products/
│   │   │   ├── page.tsx            ← product listing
│   │   │   └── [id]/page.tsx       ← product detail
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── checkout/confirmation/[id]/page.tsx
│   │   └── orders/
│   │       ├── page.tsx            ← my orders
│   │       └── [id]/page.tsx       ← order detail
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── admin/
│   │   ├── layout.tsx              ← admin sidebar layout
│   │   ├── page.tsx                ← dashboard
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── users/page.tsx
│   │   └── categories/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── products/route.ts
│       ├── products/[id]/route.ts
│       ├── cart/route.ts
│       ├── cart/[id]/route.ts
│       ├── orders/route.ts
│       ├── orders/[id]/route.ts
│       ├── orders/export/route.ts
│       ├── reviews/route.ts
│       ├── admin/products/route.ts
│       ├── admin/products/[id]/route.ts
│       ├── admin/products/bulk/route.ts
│       ├── admin/products/restock/route.ts
│       ├── admin/categories/route.ts
│       ├── admin/categories/[id]/route.ts
│       ├── admin/orders/[id]/status/route.ts
│       └── admin/dashboard/route.ts
├── components/
│   ├── ui/                         ← reusable: Button, Badge, Input, Modal
│   ├── layout/                     ← Navbar, Footer, AdminSidebar
│   ├── product/                    ← ProductCard, ProductGrid, ReviewForm
│   ├── cart/                       ← CartItem, CartSummary
│   └── admin/                      ← KpiTile, RevenueChart, StatusBar
├── lib/
│   ├── prisma.ts                   ← Prisma client singleton
│   ├── auth.ts                     ← NextAuth config
│   ├── session.ts                  ← session helpers (getSession, requireAdmin)
│   └── utils.ts                    ← formatPrice, formatDate, cn()
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                     ← categories + products + admin user
├── middleware.ts                   ← protect /admin/* and /checkout, /orders
├── .env                            ← DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
└── PLAN.md                         ← this file
```

---

## Phases

### ✅ Phase 1 — Project Setup (DONE)
- [x] `create-next-app` with TypeScript, Tailwind, App Router
- [x] Installed: `prisma`, `@prisma/client`, `next-auth@beta`, `bcryptjs`, `@types/bcryptjs`
- [x] `prisma init --datasource-provider postgresql`
- [ ] **YOU NEED TO DO**: Add `DATABASE_URL` to `.env`

---

### Phase 2 — Prisma Schema + Database
**Goal:** Define all models, run migration, connect to PostgreSQL.

Steps:
1. Write `prisma/schema.prisma` with all 7 models
2. Run `npx prisma migrate dev --name init`
3. Verify tables created in Supabase dashboard

Files touched:
- `prisma/schema.prisma`

---

### Phase 3 — Auth (NextAuth.js)
**Goal:** Login/register with email+password. Admin role protection.

Steps:
1. Write `lib/prisma.ts` — Prisma client singleton
2. Write `lib/auth.ts` — NextAuth credentials provider (bcrypt verify)
3. Write `app/api/auth/[...nextauth]/route.ts`
4. Write `middleware.ts` — protect `/admin/*`, `/cart`, `/checkout`, `/orders`
5. Write `app/(auth)/login/page.tsx` and `register/page.tsx`
6. Write `app/api/auth/register/route.ts` — POST to create user

Files touched:
- `lib/prisma.ts`, `lib/auth.ts`, `lib/session.ts`
- `middleware.ts`
- `app/api/auth/[...nextauth]/route.ts`
- `app/api/auth/register/route.ts`
- `app/(auth)/login/page.tsx`
- `app/(auth)/register/page.tsx`

---

### Phase 4 — Seed Script
**Goal:** Populate DB with categories, products (same as original), admin user.

Steps:
1. Write `prisma/seed.ts`
2. Add `"seed"` script to `package.json`
3. Run `npx prisma db seed`

Admin credentials (same as original):
- Email: `admin@freshmart.com`
- Password: `Admin123!`

---

### Phase 5 — Storefront Pages
**Goal:** Full customer-facing site.

Pages & logic:
- `app/page.tsx` — hero + featured 6 products + category grid
- `app/(storefront)/products/page.tsx` — listing, search, filter, sort, pagination
- `app/(storefront)/products/[id]/page.tsx` — detail, reviews, related products
- `app/(storefront)/cart/page.tsx` — cart table, qty update, remove, subtotal
- `app/(storefront)/checkout/page.tsx` — form + place order
- `app/(storefront)/checkout/confirmation/[id]/page.tsx`
- `app/(storefront)/orders/page.tsx` — my orders list
- `app/(storefront)/orders/[id]/page.tsx` — order detail

API routes needed:
- `GET/POST /api/cart`
- `PATCH/DELETE /api/cart/[id]`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/[id]`
- `POST /api/reviews`

---

### Phase 6 — Admin Panel
**Goal:** Full admin dashboard, same as the ASP.NET version.

Pages:
- `app/admin/page.tsx` — KPIs, revenue chart, low stock, recent orders
- `app/admin/products/page.tsx` — table, search/filter, bulk actions, pagination
- `app/admin/products/new/page.tsx` — create form
- `app/admin/products/[id]/edit/page.tsx` — edit form
- `app/admin/orders/page.tsx` — status filter, export CSV link
- `app/admin/orders/[id]/page.tsx` — order detail + status update
- `app/admin/users/page.tsx` — user list with stats
- `app/admin/categories/page.tsx` — CRUD

API routes needed:
- `GET /api/admin/dashboard`
- `GET/POST /api/admin/products`
- `PATCH/DELETE /api/admin/products/[id]`
- `POST /api/admin/products/bulk`
- `POST /api/admin/products/restock`
- `GET/POST /api/admin/categories`
- `PATCH/DELETE /api/admin/categories/[id]`
- `PATCH /api/admin/orders/[id]/status`
- `GET /api/orders/export`

---

### Phase 7 — Deploy
**Goal:** Live on Vercel + Supabase.

Steps:
1. Push `freshmart/` to GitHub (new repo or subfolder)
2. Connect repo to Vercel
3. Add env vars in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your Vercel URL)
4. Run `npx prisma migrate deploy` on first deploy (via `postinstall` script)
5. Run seed once manually via Vercel CLI or Supabase SQL editor

---

## Current Status

| Phase | Status |
| ----- | ------ |
| 1 — Project Setup | ✅ Done |
| 2 — Prisma Schema | ⏳ Waiting for DATABASE_URL |
| 3 — Auth | 🔲 Not started |
| 4 — Seed Script | 🔲 Not started |
| 5 — Storefront | 🔲 Not started |
| 6 — Admin Panel | 🔲 Not started |
| 7 — Deploy | 🔲 Not started |

---

## Notes

- Cart is **DB-backed** (persists across devices/sessions), not localStorage
- Visual redesign is **deferred** — keep same layout/colors as original for now, redesign later
- No Stripe for now — orders are placed without payment (same as original dev mode)
- Image upload: use Cloudinary in Phase 6, or keep Pexels URLs from seed data for now
- `npx prisma studio` — GUI to browse the PostgreSQL database locally (like SQLite Viewer)
