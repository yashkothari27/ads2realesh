# Project Guide

## Stack
| Layer | Pick | Why |
|---|---|---|
| App | Next.js (App Router) | SSR/ISR for SEO-heavy catalogue pages (C3) |
| DB | Postgres (Neon/Supabase) | Relational rates, unique constraints for idempotency (C1) |
| Payments | Razorpay | UPI-first India (`VERIFY` fees) |
| Email | Resend | Simple API |
| Hosting | Vercel | Zero ops (C5) |

The prototype UI is in `site/index.html`. Port it to Next.js pages.

## Layout
```
app/(public)/[paper]/[edition]/book/page.tsx
app/api/razorpay/webhook/route.ts
lib/pricing.ts   lib/db.ts   app/admin/
```

## Key interface
```ts
export type Unit = 'word' | 'line' | 'sqcm';
export interface Rate { unit: Unit; price: number; minUnits: number; }
export function quote(rate: Rate, units: number, dates: number, extrasPct = 0) {
  const base = Math.max(units, rate.minUnits) * rate.price * dates;
  const sub = base * (1 + extrasPct / 100);
  return { base, sub, gst: Math.round(sub * 0.05), total: Math.round(sub * 1.05) };
}
```

## Build order
1. **Week 1:** Walking skeleton for one paper, one ad type → Razorpay test payment → webhook → email. **On track** = a real test-mode payment flips a booking to PAID.
2. **Week 2:** Pricing engine for all units, plus the webhook replay test (NFR-2).
3. **Week 3:** A second newspaper with a different unit (sq. cm display), to prove that `Rate` generalises.
4. **Week 4:** Admin queue, refunds, booking cutoff enforcement.
5. **Week 5+:** Catalogue breadth, SEO pages, invoices.

## Non-negotiables
The server recomputes the price, and a booking becomes PAID only through the webhook. Get publisher agreements (C7) before launch.
