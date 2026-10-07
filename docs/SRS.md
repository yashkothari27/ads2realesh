# SRS — Newspaper Ad Booking

## Actors
Advertiser (guest), Ops admin, Newspaper (external).

## Functional requirements
- **FR-1:** Browse newspapers by city and language, then by edition.
- **FR-2:** Choose an ad type: Classified Text, Classified Display, Display, Obituary, Appointment, Matrimonial, Property, Public Notice.
- **FR-3:** Compose the ad. Text ads show a live word/line count; display ads accept an uploaded image or PDF.
- **FR-4:** See a live price breakdown: base + enhancements (bold, tick, colour background) + 5% GST.
- **FR-5:** Pick release dates using the newspaper's publishing days and booking cutoff (e.g. 2 days ahead).
- **FR-6:** Pay through Razorpay (UPI, card, netbanking).
- **FR-7:** Receive a confirmation email with the booking ID and a GST invoice.
- **FR-8:** Admin queue: review → release → mark published, with a proof (e-paper clipping).

## Non-functional requirements
- **NFR-1:** Catalogue pages p95 TTFB under 300 ms (ISR/CDN). Measure in Vercel Analytics.
- **NFR-2:** Zero double-charged bookings. Webhook processing is idempotent (unique `razorpay_payment_id`).
- **NFR-3:** Lighthouse mobile score ≥ 90; meets WCAG 2.1 AA.
- **NFR-4:** 99.5% monthly uptime.

## Domain model
`Newspaper(id, name, language, cities[])` → `Edition(id, newspaper_id, city, publish_days)` → `Rate(edition_id, ad_type, unit[word|line|sqcm], price, min_units, valid_until)`
`Booking(id, edition_id, ad_type, content, units, dates[], amount_paise, status[DRAFT|PAID|RELEASED|PUBLISHED|REFUNDED])`
`Payment(id, booking_id, razorpay_payment_id UNIQUE, amount_paise, raw jsonb)`

## Acceptance
Replaying the same webhook 5 times produces one Payment row and one email.

## Assumptions
India only, INR only, rates entered manually by ops.
