// Generates the inner pages from site/index.html (shared header, footer, dialogs, scripts).
// Run after editing index.html, pricing.js or the copy below:  node build.js
const fs = require("node:fs"), path = require("node:path");
const { P, CATS, CAT_MULT, quote, inr } = require("./site/pricing.js");

const SITE = path.join(__dirname, "site");
const SITE_URL = "https://www.ads2realesh.com"; // ponytail: set to the real domain before launch
const src = fs.readFileSync(path.join(SITE, "index.html"), "utf8");
const head = src.slice(0, src.indexOf("<main>")), main = src.slice(src.indexOf("<main>") + 6, src.indexOf("</main>")), tail = src.slice(src.indexOf("</main>") + 7);
const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const CITIES = [...new Set(P.flatMap(p => p.cities))].sort();

// reuse a <section id="..."> from the home page as-is
function sec(id) {
  const a = main.indexOf(`<section id="${id}"`); if (a < 0) throw new Error("missing section " + id);
  let depth = 0, i = a;
  for (const m of main.slice(a).matchAll(/<\/?section\b/g)) { depth += m[0] === "<section" ? 1 : -1; if (!depth) { i = a + m.index; break; } }
  return main.slice(a, i + "</section>".length);
}

// fix relative links for the page's folder depth; anchors missing on this page go back to the home page
function relink(html, up) {
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  return html
    .replace(/(?<!<use )href="#([A-Za-z][\w-]*)"/g, (m, id) => ids.has(id) ? m : `href="index.html#${id}"`)
    .replace(/\b(href|src)="(?!#|https?:|mailto:|tel:|data:|\/|\$\{)([^"]+)"/g, (m, a, v) => `${a}="${up}${v}"`);
}

const written = [];
function page(rel, { title, desc, body }) {
  const up = "../".repeat(rel.split("/").length - 1);
  let h = head
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(desc)}">\n<link rel="canonical" href="${SITE_URL}/${rel}">`);
  const html = relink(h + "<main>\n" + body + "\n</main>" + tail, up);
  const file = path.join(SITE, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  written.push(rel);
}
const hero = (crumbs, h1, lead, ctas) => `<section class="phero"><div class="wrap">
 <nav class="crumbs" aria-label="Breadcrumb">${crumbs.map(([t, u]) => u ? `<a href="${u}">${esc(t)}</a> /` : `<span aria-current="page">${esc(t)}</span>`).join(" ")}</nav>
 <h1>${h1}</h1><p class="lead muted">${lead}</p><div class="ctas">${ctas}</div>
</div></section>`;

/* ---- shared blocks for inner pages ---- */
const trust = () => { const a = main.indexOf('<div class="trust">'); return main.slice(a, main.indexOf("</div></div></div>", a) + 18); };
const faq = (title, qa) => `<section id="faq"><div class="wrap" style="max-width:860px"><h2>${title}</h2>${qa.map(([q, a], i) => `<details ${i ? "" : "open"}><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></section>`;
const steps = (title, list) => `<section style="background:var(--soft)"><div class="wrap"><h2>${title}</h2><div class="grid4" style="grid-template-columns:repeat(${list.length},1fr);margin-top:24px">${list.map(([t, d], i) => `<div class="box"><span class="ico" style="font:700 18px Outfit">${i + 1}</span><h3>${t}</h3><p class="muted sm">${d}</p></div>`).join("")}</div></div></section>`;
const deadline = () => `<section><div class="wrap split" style="align-items:center">
 <div><h2>Book by 5 pm, in print tomorrow</h2><p class="lead muted">For most editions, a text classified that is booked and approved by 5 pm runs in the next morning's paper. Sunday editions and boxed ads need a little more time.</p>
  <div class="units" style="grid-template-columns:repeat(3,1fr)"><div><b>5 pm</b><small>Cutoff for next-day text ads</small></div><div><b>2 days</b><small>Safe lead time for Sunday</small></div><div><b>Same day</b><small>Proof sent to you</small></div></div></div>
 <div class="mock" aria-hidden="true"><div class="mh"><span>CLASSIFIEDS</span><span>TOMORROW</span></div><div class="cols">
  <p><b>TO-LET</b> 2BHK Powai, lake view, Rs 52,000. Call 98xxxxxx31</p><p class="hl"><b>NAME CHANGE</b> I, Arjun Mehra, have changed my name to Arjun Kapoor.</p>
  <p><b>WANTED</b> Cook for family of four, Juhu.</p><p><b>LOST</b> Original sale deed, flat 704, Chembur. Finder please call.</p><p><b>FOR SALE</b> Honda City 2019, single owner.</p><p><b>TUITION</b> Class 10 maths, Andheri E.</p></div></div>
</div></section>`;
const popular = () => `<section><div class="wrap"><h2>Popular searches</h2><div class="split" style="grid-template-columns:repeat(3,1fr);margin-top:20px">
 <div><h3>By category</h3><div class="links" style="columns:1">${["Matrimonial", "Name change", "Property", "Recruitment", "Obituary", "Public notice"].map(c => `<a href="newspaper/city/mumbai/${slug(c)}.html">${c} ads in Mumbai</a>`).join("")}</div></div>
 <div><h3>By city</h3><div class="links" style="columns:1">${["Delhi", "Bengaluru", "Pune", "Kolkata", "Chennai", "Hyderabad"].map(c => `<a href="newspaper/city/${slug(c)}/index.html">Newspaper ads in ${c}</a>`).join("")}</div></div>
 <div><h3>Guides</h3><div class="links" style="columns:1"><a href="newspaper-classified/rates-offer.html">Classified rates and offers</a><a href="newspaper-display-booking.html">Display ad sizes and cost</a><a href="index.html#notices">Legal and public notices</a><a href="index.html#how">How booking works</a></div></div>
</div></div></section>`;
const CL_FAQ = [
  ["How much does a classified ad cost?", "It depends on the newspaper, the city edition and the length of the ad. Most text classifieds cost between a few hundred and a few thousand rupees per insertion, plus 5% GST. You see the exact total before you pay."],
  ["Which newspaper should I choose?", "Pick the paper your audience reads. English dailies reach professionals across a city; regional-language papers reach deeper into local readership. The rate finder ranks papers in your city by price."],
  ["How soon will my ad appear?", "Text classifieds approved by 5 pm usually run the next morning. Sunday editions close earlier, and boxed ads need a day or two for layout."],
  ["What is the difference between text and boxed classifieds?", "A text classified is plain words, charged by line or word. A boxed (classified display) ad adds a border, logo or photo and is charged per sq. cm."],
  ["How do I know my ad was published?", "We email you the e-paper clipping on every publishing date, along with your GST invoice."],
];

/* ---- classified booking ---- */
page("newspaper-classified/ad-booking.html", {
  title: "Book a Classified Ad in Any Newspaper | ads2realesh",
  desc: "Book text and boxed classified ads in 100+ Indian newspapers. Pick a category, write your ad, choose dates and pay online.",
  body: hero([["Home", "index.html"], ["Classified ads"]], "Book a classified ad in any newspaper",
    "Text and boxed classifieds in English and regional papers, at the newspaper's own card rate.",
    `<button class="btn primary" data-book="ct">Book a classified</button><a class="btn" href="newspaper-classified/rates-offer.html">See rates</a>`)
    + sec("categories") + deadline() + trust()
    + steps("Book in three steps", [["Choose the paper", "Pick your category, newspaper and city edition. The rate appears straight away."], ["Write the ad", "Type it yourself, or send us the details and we draft and translate it for free."], ["Pick dates and pay", "Choose publishing dates, approve the proof and pay by UPI, card or netbanking."]])
    + `<section><div class="wrap split">
 <div><h2>A short guide to classified ads</h2>
  <p class="muted">A classified ad is a short notice printed in the classifieds pages, grouped under headings such as Property, Matrimonial or Situations Vacant. Readers go to these pages looking for exactly that kind of notice, which is why short, plain ads work well.</p>
  <p class="muted">Booking online saves the trip to a newspaper office: you choose the paper and dates, see the price as you type, and receive the proof and invoice by email.</p>
  <h3>Booking, start to finish</h3>
  <ol class="muted" style="padding-left:20px;display:grid;gap:6px"><li>Choose a category and the newspapers you want.</li><li>Write the ad, or ask our desk to write it.</li><li>Select publishing dates before the cutoff.</li><li>Pay online and get the clipping on the day it runs.</li></ol>
 </div>
 <div class="tbl box"><h3>At a glance</h3><table><tbody>
  <tr><th>Charged by</th><td>Word or line (text), sq. cm (boxed)</td></tr>
  <tr><th>Typical cost</th><td>₹200 to ₹3,500 per insertion</td></tr>
  <tr><th>Next-day cutoff</th><td>About 5 pm, varies by paper</td></tr>
  <tr><th>Languages</th><td>English and 12 regional languages</td></tr>
  <tr><th>Payment</th><td>UPI, card, netbanking, with GST invoice</td></tr>
  <tr><th>Proof</th><td>E-paper clipping on each date</td></tr>
 </tbody></table></div>
</div></section>`
    + faq("Classified ad questions", CL_FAQ) + popular(),
});

/* ---- rates & offers ---- */
page("newspaper-classified/rates-offer.html", {
  title: "Newspaper Classified Ad Rates and Offers | ads2realesh",
  desc: "Check classified ad rates by newspaper, edition and category. Package discounts for booking several editions together.",
  body: hero([["Home", "index.html"], ["Classified ads", "newspaper-classified/ad-booking.html"], ["Rates and offers"]], "Classified ad rates and offers",
    "Choose a format, category, newspaper and edition to see the rate. Book several editions together for a package price.",
    `<button class="btn primary" data-book="ct">Book a classified</button>`)
    + sec("rate-card") + sec("cost") + sec("rates") + sec("faq"),
});

/* ---- display booking ---- */
const DCATS = [["Appointments", "Job openings and walk-ins on the main or careers pages."], ["Retail and sales", "Store openings, festive sales and offers."], ["Education", "Admissions, results and coaching batches."], ["Property", "Project launches and site-visit drives."], ["Financial results", "Quarterly results and statutory company notices."], ["Court notices", "Summons and notices ordered by a court."], ["Obituary", "Larger tributes with a photo on the news pages."], ["Tenders", "Government and corporate tender notices."]];
page("newspaper-display-booking.html", {
  title: "Book a Display Ad in the Newspaper | ads2realesh",
  desc: "Display ads on the main news pages of Indian newspapers. Compare sizes and estimated costs, then request a quote.",
  body: `<section class="phero"><div class="wrap split" style="align-items:center">
 <div><nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / <span aria-current="page">Display ads</span></nav>
  <h1>Book a display ad on the news pages</h1><p class="lead muted">From a small strip to a full page. Tell us the paper and section and we send your rate within the working day.</p></div>
 <form class="box" id="dqForm"><h3>Get your rate</h3>
  <label class="f" for="dqPaper">Newspaper</label><select id="dqPaper"></select>
  <label class="f" for="dqCity">City edition</label><select id="dqCity"></select>
  <label class="f" for="dqSec">Page or section</label><select id="dqSec"><option>Main news pages</option><option>City pages</option><option>Business pages</option><option>Sports pages</option><option>Weekend supplement</option></select>
  <button class="btn primary" style="width:100%;margin-top:16px">Get my rate</button></form>
</div></section>` + trust()
    + `<section><div class="wrap"><h2>Why book display ads with us</h2><div class="grid4" style="margin-top:24px">
 <div class="box"><span class="ico"><svg class="i"><use href="#i-tag"/></svg></span><h3>Know the rate first</h3><p class="muted sm">See an estimate for every size before you ask for a quote.</p></div>
 <div class="box"><span class="ico"><svg class="i"><use href="#i-shield"/></svg></span><h3>Card-rate pricing</h3><p class="muted sm">You pay the newspaper's rate. Package deals are passed on to you.</p></div>
 <div class="box"><span class="ico"><svg class="i"><use href="#i-layers"/></svg></span><h3>Right page, right day</h3><p class="muted sm">We advise on page, position and day for the readers you want.</p></div>
 <div class="box"><span class="ico"><svg class="i"><use href="#i-pen"/></svg></span><h3>Design included</h3><p class="muted sm">No artwork? Our designers make it to the paper's exact size.</p></div>
</div></div></section>`
    + `<section id="sizes" style="background:var(--soft)"><div class="wrap">
 <h2>Sizes and estimated cost</h2>
 <p class="muted">Charged per sq. cm. Page, position and colour change the rate, so these are estimates before your quote.</p>
 <div class="seg" role="group" aria-label="Ad size" id="dsTabs"><button class="segb" aria-pressed="true" data-fmt="all">All sizes</button><button class="segb" aria-pressed="false" data-fmt="full">Full page</button><button class="segb" aria-pressed="false" data-fmt="half">Half page</button><button class="segb" aria-pressed="false" data-fmt="quarter">Quarter page</button><button class="segb" aria-pressed="false" data-fmt="strip">Strips</button></div>
 <div class="split" style="margin-top:12px">
  <div class="r3" style="grid-template-columns:1fr 1fr auto;align-items:center;align-self:start">
   <div><label class="sr" for="dsPaper">Newspaper</label><select id="dsPaper"></select></div>
   <div><label class="sr" for="dsCity">Edition</label><select id="dsCity"></select></div>
   <div class="checks"><label><input type="checkbox" id="dsColor"> Colour</label></div>
  </div>
  <div class="tbl box"><table><thead><tr><th>Size</th><th>Before GST</th><th>With GST</th><th></th></tr></thead><tbody id="dsTable"></tbody></table></div>
 </div>
</div></section>`
    + `<section><div class="wrap"><h2>What display ads are used for</h2><div class="cats" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr));margin-top:20px">${DCATS.map(([t, d]) => `<div class="box"><h3>${t}</h3><p class="muted sm">${d}</p><button class="btn sm" data-book="da" data-cat="${t === "Appointments" ? "Recruitment" : t === "Retail and sales" ? "Retail" : t === "Financial results" ? "Public notice" : t}">Get a quote</button></div>`).join("")}</div></div></section>`
    + `<section style="background:var(--soft)"><div class="wrap split" style="align-items:center">
 <div><h2>Free design for your ad</h2><p class="lead muted">Send your logo, photos and the message. Our designers lay it out to the newspaper's column sizes and send a proof for your approval. You can ask for changes before it goes to print.</p><button class="btn primary" data-book="da">Get a quote</button></div>
 <div class="mock" aria-hidden="true"><div class="mh"><span>CITY</span><span>PAGE 5</span></div><div class="disp">Monsoon Sale<br><small style="font:14px Outfit">Up to 40% off. This weekend only.</small></div><p style="margin:0">Your ad, laid out to the paper's exact size.</p></div>
</div></section>`
    + steps("How display booking works", [["Share the brief", "Tell us the paper, edition, size and date."], ["Get your quote", "We confirm the rate and position within the working day."], ["Approve the design", "Send artwork or use our free design. Approve the proof."], ["Pay and publish", "Pay online. You get the clipping on the day it runs."]])
    + faq("Display ad questions", [
      ["How much does a display ad cost?", "The newspaper's rate per sq. cm × the size, plus extra for colour, a fixed page or a premium day. Use the size table above for an estimate."],
      ["Why isn't the exact rate shown online?", "Display rates change with page, position and the paper's current offers, so we confirm the final figure in a quote."],
      ["What sizes can I book?", "Anything from about 4 × 5 cm up to a full page. Common sizes are strips, quarter page, half page and full page."],
      ["Is the quoted rate fixed?", "Yes. Once you accept the quote and pay, the price does not change."],
      ["What format should my artwork be?", "A high-resolution PDF or JPG at the exact size. If you don't have one, our designers make it for free."],
      ["Can I choose the page?", "Yes. Front page, page 3, city or business pages are possible on most papers and are priced accordingly."],
      ["How far ahead should I book?", "Allow 2 to 3 working days. Front-page and festive-season slots should be booked a week or more ahead."],
      ["Can I run the ad in several cities?", "Yes. Add multiple editions to one order and pay once. Proof of publication is sent for every edition."],
    ]),
});

/* ---- sign in ---- */
page("my/sign-in.html", {
  title: "Sign In | ads2realesh",
  desc: "Sign in with your mobile number to see your newspaper ad bookings and invoices.",
  body: `<section><div class="wrap auth">
 <div class="box">
  <h1 style="font:700 32px Outfit;margin:0 0 6px">Sign in</h1>
  <p class="muted" id="siNote">Use your mobile number to see your bookings and invoices.</p>
  <form id="siForm" novalidate>
   <label class="f" for="siPhone">Mobile number</label><input id="siPhone" type="tel" inputmode="numeric" maxlength="10" autocomplete="tel-national" placeholder="10-digit mobile">
   <div id="siOtpWrap" hidden><label class="f" for="siOtp">6-digit code</label><input id="siOtp" inputmode="numeric" maxlength="6" autocomplete="one-time-code"></div>
   <p class="err" id="siErr" role="alert"></p>
   <button class="btn primary" id="siBtn" style="width:100%">Send code</button>
  </form>
  <div id="siOut" hidden><h2 style="font:700 22px Outfit">My bookings</h2><div class="plist" id="siList" style="grid-template-columns:1fr"></div></div>
 </div>
 <p class="muted sm" style="text-align:center;margin-top:16px">No account needed to book. Sign-in only shows past orders.</p>
</div></section>`,
});

const GUIDE = {
  _: ["Keep it short and clear: what, where, price and a contact number.", "Book before the cutoff, usually 5 pm the day before.", "Check names, numbers and dates on the proof before you approve it.", "Weekend editions are read more widely but close earlier."],
  "Matrimonial": ["Sunday is the main matrimonial day in most papers, so book by Thursday or Friday.", "Photos are allowed only in boxed (classified display) ads.", "Include age, profession, community preference if any, and a contact.", "Ads are published under the paper's matrimonial headings, such as Brides Wanted or Grooms Wanted."],
  "Name change": ["Most papers need a copy of your affidavit or gazette notification.", "Publish in one English and one regional paper if your purpose (passport, gazette) asks for it.", "Write old and new names exactly as in your affidavit.", "Keep the clipping: you will need it for official records."],
  "Property": ["State locality, size, price and whether it is for rent or sale.", "Sunday property pages get the most readers.", "Avoid exact flat numbers for safety. A phone number is enough.", "Boxed ads with a photo work well for larger properties."],
  "Recruitment": ["Mention the role, experience needed, location and how to apply.", "Walk-in ads should give the date, time and full address.", "Recruitment is charged at a higher rate in most papers.", "Boxed ads with your logo are easier to spot on busy job pages."],
  "Obituary": ["Obituary and remembrance ads can include a photo as a boxed ad.", "Many papers accept same-day bookings for next-day obituaries. Call us if urgent.", "Include the name, date and details of the prayer meeting if any.", "We can write the text in the family's language."],
  "Public notice": ["Legal notices often need publication in both an English and a regional paper.", "Use the exact wording given by your lawyer.", "Notices are charged at a special rate.", "Keep the clipping and invoice as proof of publication."],
  "Lost documents": ["Mention the document type, number if known, and where it was lost.", "Banks and registries often ask for the notice in two papers.", "Attach the police complaint number if you have one.", "Keep the clipping for your application."],
  "Tenders": ["Tender notices are charged at a special rate.", "Check the publication date against the tender's opening date.", "Most departments require both an English and a regional paper.", "Send the exact approved text. We do not edit tender wording."],
};
/* ---- city and city x category pages ---- */
for (const city of CITIES) {
  const papers = P.filter(p => p.cities.includes(city)), cs = slug(city);
  page(`newspaper/city/${cs}/index.html`, {
    title: `Newspaper Ads in ${city}: Rates and Booking | ads2realesh`,
    desc: `Book classified and display ads in ${papers.length} newspapers published in ${city}. Compare rates and book online.`,
    body: hero([["Home", "index.html"], ["Cities", "index.html#cities"], [city]], `Newspaper ads in ${esc(city)}`,
      `${papers.length} newspapers publish a ${esc(city)} edition. Pick what you want to announce to compare rates.`,
      `<button class="btn primary" data-city="${esc(city)}">Book an ad in ${esc(city)}</button>`)
      + `<section><div class="wrap"><h2>Choose a category</h2><div class="cats">${CATS.map(c => `<a class="cat" href="newspaper/city/${cs}/${slug(c)}.html"><span class="cico"><svg class="i"><use href="#i-tag"/></svg></span>${esc(c)}</a>`).join("")}</div></div></section>`
      + `<section style="background:var(--soft)"><div class="wrap"><h2>Newspapers in ${esc(city)}</h2><div class="plist">${papers.map(p => `<div class="pitem"><div><strong>${esc(p.name)}</strong><small>${p.lang} · from ${inr(p.word)}/word</small></div><button class="btn sm" data-paper="${esc(p.name)}" data-city="${esc(city)}">Book</button></div>`).join("")}</div></div></section>`
      + sec("how"),
  });
  for (const cat of CATS) {
    const rows = papers.map(p => ({ p, q: quote({ paper: p.name, cat, type: "ct", text: "w ".repeat(25), enh: [], dates: [1], w: 4, h: 5 }) })).sort((a, b) => a.q.sub - b.q.sub);
    const lc = cat.toLowerCase();
    const g = GUIDE[cat] || GUIDE._;
    page(`newspaper/city/${cs}/${slug(cat)}.html`, {
      title: `${cat} Ads in ${city} Newspapers: Rates and Booking | ads2realesh`,
      desc: `Publish a ${lc} ad in ${city}. Compare ${rows.length} newspapers from ${inr(rows[0].q.sub)} for 25 words, then book and pay online.`,
      body: hero([["Home", "index.html"], [city, `newspaper/city/${cs}/index.html`], [cat]], `${esc(cat)} ads in ${esc(city)} newspapers`,
        `Book a ${esc(lc)} ad in any of ${rows.length} papers with a ${esc(city)} edition. We write it, translate it and email you the published clipping.`,
        `<button class="btn primary" data-cat="${esc(cat)}" data-city="${esc(city)}">Book a ${esc(lc)} ad</button><a class="btn" href="#ccRates">Compare rates</a>`)
        + `<section id="ccRates"><div class="wrap">
 <div class="head"><div><h2>${esc(cat)} ad rates in ${esc(city)}</h2><p class="muted" style="margin:0">Prices for a 25-word text ad per insertion, before GST.${CAT_MULT[cat] ? " This category is charged at a special rate." : ""}</p></div>
  <div class="seg" role="group" aria-label="Sort newspapers"><button class="segb" aria-pressed="true" data-sort="price">Lowest price</button><button class="segb" aria-pressed="false" data-sort="reach">English first</button></div></div>
 <div class="tbl"><table><thead><tr><th>Newspaper</th><th>Language</th><th>Rate</th><th>Min. words</th><th>25-word ad</th><th></th></tr></thead><tbody id="ccTable">${rows.map(({ p, q }) => `<tr data-price="${Math.round(q.sub)}" data-lang="${p.lang}"><td><b>${esc(p.name)}</b></td><td>${p.lang}</td><td class="num">${inr(p.word * (CAT_MULT[cat] || 1))}/word</td><td class="num">${p.min}</td><td class="num"><b>${inr(q.sub)}</b></td><td><button class="btn sm primary" data-paper="${esc(p.name)}" data-city="${esc(city)}" data-cat="${esc(cat)}" data-type="ct">Book</button></td></tr>`).join("")}</tbody></table></div>
 <p class="muted sm" style="margin-top:12px">Indicative rates. You see the exact price for your ad before you pay.</p>
</div></section>`
        + `<section style="background:var(--soft)"><div class="wrap split">
 <div><h2>How the price is worked out</h2><ul class="ticks" style="margin-top:16px">
  <li><svg class="i"><use href="#i-check"/></svg><span><b>Rate per word or line</b> set by the newspaper for its ${esc(city)} edition.</span></li>
  <li><svg class="i"><use href="#i-check"/></svg><span><b>Minimum length:</b> shorter ads are charged at the paper's minimum.</span></li>
  <li><svg class="i"><use href="#i-check"/></svg><span><b>Extras</b> such as bold, a tick mark, background colour or a border add a percentage.</span></li>
  <li><svg class="i"><use href="#i-check"/></svg><span><b>GST at 5%</b> is added. The total is shown before you pay.</span></li></ul></div>
 <div><h2>Offers</h2><div class="fl" style="margin-top:16px">
  <div class="fi"><span class="ico"><svg class="i"><use href="#i-layers"/></svg></span><div><strong>Several papers, one order</strong><p>Run in an English and a regional paper together and pay once.</p></div></div>
  <div class="fi"><span class="ico"><svg class="i"><use href="#i-clock"/></svg></span><div><strong>Repeat dates</strong><p>Some papers offer a lower rate when the same ad runs on several dates. Ask us when you book.</p></div></div>
  <div class="fi"><span class="ico"><svg class="i"><use href="#i-pen"/></svg></span><div><strong>Free writing and translation</strong><p>Our desk drafts your ad in the paper's language at no charge.</p></div></div></div></div>
</div></section>`
        + `<section><div class="wrap split">
 <div><h2>Before you book a ${esc(lc)} ad</h2><ul class="ticks" style="margin-top:16px">${g.map(t => `<li><svg class="i"><use href="#i-check"/></svg><span>${t}</span></li>`).join("")}</ul></div>
 <div class="box"><h3>One booking for every paper</h3><p class="muted">Pick several ${esc(city)} newspapers in the booking form and they share one payment, one invoice and one set of dates. Not sure which to choose? Call us and we'll suggest the best mix for your budget.</p><button class="btn primary" data-cat="${esc(cat)}" data-city="${esc(city)}">Start booking</button></div>
</div></section>`
        + faq(`${esc(cat)} ads in ${esc(city)}: questions`, [
          [`How much does a ${esc(lc)} ad cost in ${esc(city)}?`, `A 25-word ad costs between ${inr(rows[0].q.sub)} and ${inr(rows[rows.length - 1].q.sub)} per insertion before GST, depending on the newspaper.`],
          ["When is the booking deadline?", "Usually 5 pm the day before for text ads. Sunday editions close one or two days earlier, so book ahead for weekend dates."],
          [cat === "Matrimonial" || cat === "Obituary" || cat === "Remembrance" ? "Can I add a photo?" : "Can I make my ad stand out?", cat === "Matrimonial" || cat === "Obituary" || cat === "Remembrance" ? "Yes, as a boxed classified display ad charged per sq. cm. Choose Classified display in the booking form and upload the photo." : "Yes. Add bold text, a tick mark, a background colour or a border, or book a boxed ad with your logo."],
          ["Can you translate my ad?", "Yes. Write it in English and our desk translates it into Hindi, Marathi or the paper's language for free, and shows you the proof first."],
        ])
        + `<section style="background:var(--soft)"><div class="wrap split"><div><h2>Other ads in ${esc(city)}</h2><div class="links" style="columns:2 140px">${CATS.filter(c => c !== cat).map(c => `<a href="newspaper/city/${cs}/${slug(c)}.html">${esc(c)}</a>`).join("")}</div></div>
<div><h2>${esc(cat)} ads in other cities</h2><div class="links" style="columns:2 140px">${CITIES.filter(c => c !== city).map(c => `<a href="newspaper/city/${slug(c)}/${slug(cat)}.html">${esc(c)}</a>`).join("")}</div></div></div></section>`,
    });
  }
}

fs.writeFileSync(path.join(SITE, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${["index.html", ...written].map(r => `<url><loc>${SITE_URL}/${r}</loc></url>`).join("\n")}\n</urlset>\n`);
console.log(`built ${written.length} pages + sitemap.xml`);
