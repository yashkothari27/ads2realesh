# ad2release

Newspaper ad booking site: classified, display and legal notices.

- `site/` static site (home page, 1,400+ city and category pages, booking pop-up)
- `build.js` regenerates the inner pages from `site/index.html`: `node build.js`
- `server.js` local server with Razorpay payments: `node server.js` (demo mode without keys)
- `docs/` architecture decision, SRS, project guide

## Deploy
Vercel serves `site/` as a static site (see `vercel.json`). Payments need the server in `server.js`
(or Vercel functions) and Razorpay keys; the static deploy cannot take payments.

## Uploads (documents and artwork) on Google Cloud Storage
Customers' files go straight from the browser to your bucket through a 15-minute signed upload link.
The server only signs the link (PDF, JPG or PNG, up to 10 MB) and stores the file's location with the booking.

1. Create a bucket, e.g. `ad2release-uploads` (region asia-south1, **not public**, uniform access).
2. Create a service account with the role **Storage Object Creator** on that bucket, and download its JSON key.
   Never commit the key; keep it outside this folder.
3. Allow the browser to upload (CORS), with your real domain:
   ```
   echo '[{"origin":["https://www.ad2release.com"],"method":["PUT"],"responseHeader":["Content-Type"],"maxAgeSeconds":3600}]' > cors.json
   gcloud storage buckets update gs://ad2release-uploads --cors-file=cors.json
   ```
4. Start the server with:
   ```
   GCS_BUCKET=ad2release-uploads GOOGLE_APPLICATION_CREDENTIALS=/secure/path/key.json node server.js
   ```
   (or set `GCS_CLIENT_EMAIL` and `GCS_PRIVATE_KEY` instead of the JSON file, e.g. on Vercel.)

Without these settings, uploads are saved to `data/uploads/` (fine for testing on your own computer).
Booking desk: each booking in `data/bookings.json` has `docKey` / `fileKey` = the object path in the bucket.

## Gujarati typing and translation
- **Typing (ગુજરાતી mode):** each word typed in English letters is replaced with Google's Gujarati spelling
  (Google Input Tools, no key needed), with up to 5 alternative spellings to tap. Falls back to the built-in
  converter if Google can't be reached.
- **"Translate English text to Gujarati":** uses Google Cloud Translation on your Google Cloud project.
  1. In Google Cloud console, enable **Cloud Translation API**.
  2. APIs & Services → Credentials → Create credentials → **API key**; restrict it to *Cloud Translation API*.
  3. Start the server with `GOOGLE_TRANSLATE_API_KEY=... node server.js`.
  The key stays on the server; the browser only talks to `/api/translate`.
