# ads2realesh

Newspaper ad booking site: classified, display and legal notices.

- `site/` static site (home page, 1,400+ city and category pages, booking pop-up)
- `build.js` regenerates the inner pages from `site/index.html`: `node build.js`
- `server.js` local server with Razorpay payments: `node server.js` (demo mode without keys)
- `docs/` architecture decision, SRS, project guide

## Deploy
Vercel serves `site/` as a static site (see `vercel.json`). Payments need the server in `server.js`
(or Vercel functions) and Razorpay keys; the static deploy cannot take payments.
