// ads2realesh server: static site + Razorpay payments. Node 18+, no dependencies.
// Run:  RAZORPAY_KEY_ID=rzp_test_xxx RAZORPAY_KEY_SECRET=xxx RAZORPAY_WEBHOOK_SECRET=xxx node server.js
// Without keys it runs in demo mode (bookings are saved, no money is taken).
const http = require("node:http"), fs = require("node:fs"), path = require("node:path"), crypto = require("node:crypto");
const { P, CATS, TYPES, CUTOFF_DAYS, quoteAll, wordCount } = require("./site/pricing.js");

const PORT = +process.env.PORT || 3000;
const KEY_ID = process.env.RAZORPAY_KEY_ID || "", KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "", HOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";
const LIVE = !!(KEY_ID && KEY_SECRET);
const SITE = path.join(__dirname, "site"), DB = path.join(__dirname, "data", "bookings.json");

/* ponytail: JSON file + single process; move to Postgres with UNIQUE(razorpay_payment_id) (docs/SRS.md) before running more than one instance */
const load = () => { try { return JSON.parse(fs.readFileSync(DB, "utf8")); } catch { return {}; } };
const save = db => { fs.mkdirSync(path.dirname(DB), { recursive: true }); fs.writeFileSync(DB + ".tmp", JSON.stringify(db, null, 1)); fs.renameSync(DB + ".tmp", DB); };

const hmac = (secret, data) => crypto.createHmac("sha256", secret).update(data).digest("hex");
const safeEq = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };

// Re-validate everything the browser sent; never trust its price.
function checkBooking(b) {
  const err = m => { throw Object.assign(new Error(m), { status: 400 }); };
  if (!b || typeof b !== "object") err("Invalid booking.");
  if (!TYPES[b.type]) err("Unknown ad format.");
  if (!CATS.includes(b.cat)) err("Unknown category.");
  if (!Array.isArray(b.items) || !b.items.length || b.items.length > 50) err("Choose at least one edition.");
  for (const it of b.items) { const p = P.find(x => x.name === it?.paper); if (!p || !p.cities.includes(it.city)) err("Unknown newspaper or edition."); }
  const min = new Date(); min.setHours(0, 0, 0, 0); min.setDate(min.getDate() + CUTOFF_DAYS + (new Date().getHours() >= 17 ? 1 : 0));
  if (!Array.isArray(b.dates) || !b.dates.length || b.dates.length > 60) err("Pick at least one date.");
  for (const d of b.dates) if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || new Date(d + "T00:00") < min) err("A selected date is past the booking cutoff.");
  const text = String(b.text || "").slice(0, 1200);
  if (b.type === "ct" && wordCount(text) < 3) err("Ad text is too short.");
  const w = +b.w, h = +b.h;
  if (b.type !== "ct" && !(w >= 2 && w <= 33 && h >= 2 && h <= 52)) err("Invalid ad size.");
  if (String(b.name || "").trim().length < 2) err("Name is required.");
  if (!/^[6-9]\d{9}$/.test(b.phone)) err("Invalid mobile number.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) err("Invalid email.");
  const clean = { type: b.type, cat: b.cat, items: b.items.map(({ paper, city }) => ({ paper, city })), dates: [...new Set(b.dates)].sort(), text,
    enh: (Array.isArray(b.enh) ? b.enh : []).filter(x => ["bold", "tick", "bg", "border"].includes(x)), w, h, color: !!b.color, file: String(b.file || "").slice(0, 200),
    name: String(b.name).trim().slice(0, 100), phone: b.phone, email: String(b.email).slice(0, 200), gstin: String(b.gstin || "").slice(0, 15) };
  const q = quoteAll(clean);
  return { ...clean, amount_paise: Math.round(q.total * 100) };
}

async function rzp(pathname, body) {
  const r = await fetch("https://api.razorpay.com/v1" + pathname, {
    method: "POST", headers: { "content-type": "application/json", authorization: "Basic " + Buffer.from(KEY_ID + ":" + KEY_SECRET).toString("base64") },
    body: JSON.stringify(body),
  });
  const j = await r.json();
  if (!r.ok) throw Object.assign(new Error(j?.error?.description || "Payment gateway error."), { status: 502 });
  return j;
}

const newId = db => { let id; do id = "A2R-" + crypto.randomInt(10000, 99999); while (db[id]); return id; };
function markPaid(db, id, paymentId, via) {
  const b = db[id]; if (!b) return false;
  if (b.status === "PAID") return true; // idempotent: replayed webhooks / double verify do nothing
  Object.assign(b, { status: "PAID", razorpay_payment_id: paymentId, paid_at: new Date().toISOString(), paid_via: via });
  return true;
}

const routes = {
  "POST /api/order": async body => {
    const booking = checkBooking(body), db = load(), id = newId(db);
    db[id] = { ...booking, id, status: "CREATED", created_at: new Date().toISOString() };
    if (!LIVE) { markPaid(db, id, "demo", "demo"); save(db); return { demo: true, booking_id: id, amount: booking.amount_paise }; }
    const order = await rzp("/orders", { amount: booking.amount_paise, currency: "INR", receipt: id, notes: { booking_id: id } });
    db[id].razorpay_order_id = order.id; save(db);
    return { key_id: KEY_ID, order_id: order.id, amount: order.amount, booking_id: id, prefill: { name: booking.name, email: booking.email, contact: booking.phone } };
  },
  "POST /api/verify": async ({ booking_id, razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    const db = load(), b = db[booking_id];
    if (!b || b.razorpay_order_id !== razorpay_order_id) throw Object.assign(new Error("Booking not found."), { status: 404 });
    if (!safeEq(hmac(KEY_SECRET, razorpay_order_id + "|" + razorpay_payment_id), razorpay_signature)) throw Object.assign(new Error("Payment signature mismatch."), { status: 400 });
    markPaid(db, booking_id, razorpay_payment_id, "checkout"); save(db);
    return { ok: true, booking_id };
  },
};

async function webhook(raw, sig) {
  if (!HOOK_SECRET || !safeEq(hmac(HOOK_SECRET, raw), sig || "")) return 400;
  const ev = JSON.parse(raw), pay = ev?.payload?.payment?.entity;
  if (ev.event === "payment.captured" || ev.event === "order.paid") {
    const db = load(), id = pay?.notes?.booking_id || Object.keys(db).find(k => db[k].razorpay_order_id === pay?.order_id);
    if (id && markPaid(db, id, pay.id, "webhook")) save(db);
  }
  return 200;
}

const TYPES_MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon" };
const send = (res, code, obj) => { res.writeHead(code, { "content-type": "application/json" }); res.end(JSON.stringify(obj)); };

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (req.method === "GET" && url.pathname.startsWith("/api/booking/")) {
    const b = load()[decodeURIComponent(url.pathname.slice(13)).toUpperCase()];
    return b ? send(res, 200, { id: b.id, status: b.status, items: b.items, dates: b.dates, total: b.amount_paise / 100 }) : send(res, 404, { error: "Not found" });
  }
  if (req.method === "POST") {
    let raw = ""; for await (const c of req) { raw += c; if (raw.length > 1e6) return send(res, 413, { error: "Too large" }); }
    if (url.pathname === "/api/razorpay/webhook") { res.writeHead(await webhook(raw, req.headers["x-razorpay-signature"])); return res.end(); }
    const fn = routes["POST " + url.pathname]; if (!fn) return send(res, 404, { error: "Not found" });
    try { return send(res, 200, await fn(JSON.parse(raw || "{}"))); }
    catch (e) { return send(res, e.status || 500, { error: e.status ? e.message : "Server error." }); }
  }
  // static files, confined to /site
  const file = path.normalize(path.join(SITE, url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname)));
  if (!file.startsWith(SITE + path.sep)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "content-type": TYPES_MIME[path.extname(file)] || "application/octet-stream" }); res.end(buf);
  });
});

if (process.argv[2] === "--check") {
  const assert = require("node:assert");
  const d = new Date(); d.setDate(d.getDate() + 5); const day = d.toISOString().slice(0, 10);
  const b = checkBooking({ type: "ct", cat: "Property", items: [{ paper: "Times of India", city: "Mumbai" }], dates: [day], text: "w ".repeat(25), name: "Test User", phone: "9876543210", email: "a@b.in" });
  assert.equal(b.amount_paise, 73500, "server price must match the page");
  assert.throws(() => checkBooking({ ...b, items: [{ paper: "Times of India", city: "Nowhere" }] }), /edition/);
  assert.ok(safeEq(hmac("s", "o|p"), hmac("s", "o|p")) && !safeEq(hmac("s", "o|p"), hmac("s", "o|x")));
  const db = { X: { status: "CREATED" } }; markPaid(db, "X", "pay_1", "webhook"); markPaid(db, "X", "pay_2", "webhook");
  assert.equal(db.X.razorpay_payment_id, "pay_1", "replayed payment must not overwrite");
  console.log("checks ok");
} else {
  server.listen(PORT, () => console.log(`ads2realesh on http://localhost:${PORT} (${LIVE ? "Razorpay LIVE/TEST keys" : "DEMO mode: no keys set"})`));
}
