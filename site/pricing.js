/* Shared by the browser (index.html) and server.js — the server recomputes every price from this file.
   Gujarat newspapers only. Rates are taken from each paper's latest rate card supplied by the business
   (see the `from` field). ponytail: move to a Postgres `rates` table (docs/SRS.md) once rates change often. */
const LANGS = ["Gujarati","English"];
const GUJARAT = ["Ahmedabad","Vadodara","Surat","Rajkot","Bhavnagar","Bhuj","All Gujarat"];
const CITIES_ORDER = [...GUJARAT,"Mumbai","Delhi","Bengaluru","Chennai","Hyderabad","Kolkata","Pune","Jaipur","Lucknow","Chandigarh","Bhopal","Kochi","Nagpur"];

/* Per paper:
   unit  "sqcm" or "colcm" (rates per column-cm are converted with colW, the column width in cm)
   ed    per edition: w = ₹/word (general), c = ₹/word (commercial categories), min = minimum words,
         line = {base, lines, extra, wpl} for papers that charge by line (wpl = words per line, VERIFY),
         cd = classified display rate, da = [B/W, colour] display rate on inside pages,
         pg = explicit page rates {front:[bw,clr], last:[..], third:[..]} when the card lists them,
         ov = category overrides, appt = appointment (recruitment display) rate
   prem  % extra by page when the card gives percentages
   mat   matrimonial classified rate (all editions)
   A missing rate means "on request": the booking is recorded as a quote request, not charged. */

// [centre] = [cd ₹/sq.cm, ₹ per 5 lines, ₹ extra line], general = Services row
const TOI_RATES = {
 "Ahmedabad":[500,850,170], "Mumbai":[1100,4000,800], "Delhi":[750,2800,560], "Bengaluru":[750,1750,350],
 "Chennai":[650,1550,310], "Hyderabad":[550,900,180], "Kolkata":[600,3150,630], "Pune":[300,800,160],
 "Jaipur":[155,470,94], "Lucknow":[410,1400,280], "Chandigarh":[195,580,116], "Bhopal":[175,400,80],
 "Kochi":[115,350,70], "Nagpur":[75,300,60] };
const TOI_CAT = {
 "Property":   {"Bengaluru":[1575,3140,628],"Chennai":[895,2000,400],"Delhi":[1600,6000,1200],"Hyderabad":[650,1000,200],"Mumbai":[1850,5500,1100],"Pune":[525,800,160]},
 "Recruitment":{"Bengaluru":[980,3000,600],"Chennai":[750,1800,360],"Delhi":[1300,4500,900],"Lucknow":[780,1800,360],"Mumbai":[1500,4000,800]},
 "Education":  {"Bengaluru":[980,3000,600],"Chennai":[600,1500,300],"Delhi":[1400,4800,960],"Lucknow":[415,1400,280],"Mumbai":[1200,4500,900]},
 "Business":   {"Bengaluru":[980,3000,600],"Delhi":[1400,5000,1000]},
 "Personal":   {"Ahmedabad":[null,650,130],"Mumbai":[625,1200,240],"Delhi":[500,1250,250],"Kolkata":[325,1599,320],"Bengaluru":[null,850,170],"Bhopal":[175,400,80],"Kochi":[115,350,70]},
};
const TOI_PERSONAL = ["Name change","Personal and greetings","Obituary","Remembrance"];
function TOI_EDITIONS(){
 const L = (r) => r && r[1] ? {line:{base:r[1],lines:5,extra:r[2],cpl:23}} : null;
 const ed = {};
 for (const [c, r] of Object.entries(TOI_RATES)) {
  const ov = {};
  for (const [cat, rows] of Object.entries(TOI_CAT)) if (rows[c]) {
   const cats = cat === "Personal" ? TOI_PERSONAL : [cat];
   for (const k of cats) ov[k] = { ...L(rows[c]), ...(rows[c][0] ? {cd: rows[c][0]} : {}) };
  }
  ed[c] = { line: L(r).line, cd: r[0], ov };
 }
 // Gujarat specifics supplied by the business
 Object.assign(ed["Ahmedabad"], { cdPkg:[{w:3,h:5,price:7500}], da:[740,740], appt:735 });
 ed["Ahmedabad"].ov["Title clear notice"] = { cd: 360 };
 Object.assign(ed, { "Vadodara":{cd:372}, "Surat":{cd:110}, "Rajkot":{cd:165}, "All Gujarat":{cd:300,da:[1134,1143],appt:735} });
 return ed;
}
const P = [
 { name:"Gujarat Samachar", gu:"ગુજરાત સમાચાર", lang:"Gujarati", unit:"colcm", colW:3.9, from:"24 Sep 2023",
   enh:{bg:{pct:50}, web:{words:7}},
   prem:{front:100,last:50,third:25},
   ed:{ "Ahmedabad":{w:40,c:120,min:10,cdPkg:[{w:4,h:3,price:8280}],da:[2760,4320],appt:3400,
          ov:{"Title clear notice":{line:{base:120,lines:1,extra:120,cpl:23}},"Court notice":{cc:480},
              "Obituary":{pkg:{w:9,h:5,price:5100,extra:510,per:"cc",stepCc:2}},
              "Remembrance":{pkg:{w:9,h:5,price:8100,fixed:true}}}},
        "Vadodara":{w:18,min:10,da:[1173,1380]},
        "Surat":{w:21,min:10,da:[1173,1380]},
        "Rajkot":{w:18,min:10,da:[828,999]},
        "Bhavnagar":{w:6,min:10,da:[414,500]},
        "Bhuj":{w:6,min:10,da:[207,300]},
        "All Gujarat":{w:142,min:10,da:[6555,8250],appt:3600} } },
 { name:"Sandesh", gu:"સંદેશ", lang:"Gujarati", unit:"sqcm", colW:3, from:"15 Oct 2023",
   enh:{bg:{pct:50}, web:{words:5}},
   prem:{front:100,last:50,third:25}, mat:{w:30,min:10,note:"Runs in all Gujarat editions, Sunday only"},
   ed:{ "Ahmedabad":{w:25,c:85,min:10,cdPkg:[{w:3,h:4,price:4200}],da:[475,650],appt:325,
          ov:{"Title clear notice":{line:{base:110,lines:1,extra:110,cpl:23}},"Court notice":{cc:360},
              "Obituary":{pkg:{w:9,h:5,price:2900,extra:60,per:"sqcm",stepSq:9}},
              "Remembrance":{pkg:{w:9,h:5,price:4500,extra:100,per:"sqcm",stepSq:9}}}},
        "Vadodara":{w:18,c:20,min:10,cd:150,da:[260,300],appt:150},
        "Surat":{w:20,c:25,min:10,cd:150,da:[260,300],appt:135},
        "Rajkot":{w:18,min:10,cd:95,da:[185,205],appt:90},
        "Bhavnagar":{w:4,min:10,da:[40,55],appt:25},
        "Bhuj":{w:6,min:10,da:[45,65],appt:40},
        "All Gujarat":{w:100,c:160,min:10,cd:465,da:[1060,1460],appt:600} } },
 { name:"Divya Bhaskar", gu:"દિવ્ય ભાસ્કર", lang:"Gujarati", unit:"colcm", colW:3.9, from:"1 Apr 2016",
   enh:{bg:{flat:125}, web:{flat:150}, bold:{flat:50}, tick:{flat:20}},
   prem:{front:100,last:50,third:25}, mat:{w:35,min:10},
   ed:{ "Ahmedabad":{w:40,c:95,min:10,cdPkg:[{w:3,h:5,price:7000}],da:[4320,4320],appt:2050,
          ov:{"Title clear notice":{line:{base:120,lines:1,extra:120,cpl:23}},"Court notice":{cc:350},
              "Obituary":{pkg:{w:9,h:5,price:5000,extra:55,per:"cc",stepCc:2}},
              "Remembrance":{pkg:{w:8,h:5,price:7400,extra:1500,per:"cc",stepCc:2,maxCc:20}}}},
        "Vadodara":{w:18,min:10,cd:375},
        "Surat":{w:22,min:10,cd:330},
        "Rajkot":{w:18,min:10,cd:290},
        "Bhavnagar":{w:6,min:10,cd:160},
        "Bhuj":{w:6,min:10,cd:150},
        "All Gujarat":{w:120,c:165,min:10,cd:1600,da:[8200,8200],appt:2900} } },
/* Times of India. Classified (ROL) is charged per 5 lines + extra line, 23 characters per line.
   Pan-India rows are the main TOI package per centre from TOI "Package Classifieds", effective 1 May 2024;
   Property / Recruitment / Education / Business / Personal use their own rows where TOI lists them. */
 { name:"Times of India", lang:"English", unit:"sqcm", colW:3.17, from:"1 May 2024", prem:{front:100,last:50,third:25},
   ed: TOI_EDITIONS() },
 /* Indian Express Classifieds rate card, effective 1 May 2025: run-on words charged per 20 words + extra word
    (wp), classified display per sq. cm [B/W, colour]. The Gujarat edition is booked as Ahmedabad. */
 { name:"Indian Express", lang:"English", unit:"sqcm", colW:3, from:"1 May 2025",
   enh:{bold:{pct:10}, tick:{flat:50}}, disc:{cats:["Personal and greetings","Obituary","Remembrance"], pct:50},
   mat:{wp:{base:525,words:20,extra:30}},
   ed:{ "Ahmedabad":{wp:{base:105,words:20,extra:10},cd:80,cdClr:90},
        "Mumbai":{wp:{base:410,words:20,extra:30},cd:195,cdClr:205},
        "Chandigarh":{wp:{base:355,words:20,extra:20},cd:160,cdClr:185},
        "Pune":{wp:{base:345,words:20,extra:10},cd:160,cdClr:180},
        "Delhi":{wp:{base:230,words:20,extra:15},cd:130,cdClr:170},
        "Nagpur":{wp:{base:90,words:20,extra:10},cd:55},
        "Lucknow":{wp:{base:45,words:20,extra:10},cd:45,cdClr:70} } },
 { name:"Financial Express", lang:"English", unit:"sqcm", colW:3, from:"1 May 2025",
   enh:{bold:{pct:10}, tick:{flat:50}},
   ed:{ "Mumbai":{wp:{base:265,words:20,extra:10},cd:90},
        "Delhi":{wp:{base:185,words:20,extra:10},cd:50} } },
 { name:"Navgujarat Samay", gu:"નવગુજરાત સમય", lang:"Gujarati", unit:"sqcm", colW:3.17, from:"rate on request", ed:{ "Ahmedabad":{} } },
 { name:"Akila", gu:"અકિલા", lang:"Gujarati", unit:"colcm", colW:3.9, from:"1 Jul 2015",
   ed:{ "Rajkot":{da:[140,null],pg:{front:[260,365],last:[210,295],third:[175,null]},
                  ov:{"Court notice":{cd:110},"Public notice":{cd:110}}} } },
 { name:"Phulchhab", gu:"ફૂલછાબ", lang:"Gujarati", unit:"colcm", colW:3.74, from:"15 Apr 2022",
   ed:{ "Rajkot":{line:{base:30,lines:3,extra:10,wpl:2},cd:400,da:[400,600],pg:{front:[800,1000],last:[600,800],third:[null,700]}} } },
 { name:"Kutchmitra", gu:"કચ્છમિત્ર", lang:"Gujarati", unit:"colcm", colW:3.85, from:"1 Jun 2021",
   prem:{third:25},
   ed:{ "Bhuj":{line:{base:700,lines:3,extra:100,wpl:4},cd:400,da:[400,600],pg:{front:[800,1000],last:[600,850]},appt:360,
                ov:{"Public notice":{cd:220},"Court notice":{cd:220}}} } },
].map(p => ({ ...p, cities: CITIES_ORDER.filter(c => p.ed[c]) }));

const CATS = ["Name change","Matrimonial","Property","Recruitment","Obituary","Remembrance","Public notice","Court notice","Title clear notice","Finance and loans","Medical","Lost and found","Lost documents","Lost share certificate","Business","Personal and greetings","Vehicles","Education","Travel","To let","Tenders","Astrology","Retail","Services","Marriage bureau","Situation wanted","Announcement","Computers","Wedding services"];
// categories the papers bill at their "commercial" word rate where one exists
// business categories: business, tours and travels, astrology, finance, loans, medical, education, hotel for sale
const COMMERCIAL = new Set(["Business","Travel","Astrology","Finance and loans","Medical","Education"]);
const TYPES = {ct:{n:"Classified text",d:"Per word or line, in the classifieds pages",ico:"i-text"},cd:{n:"Classified display",d:"Boxed, with logo or photo, per sq. cm",ico:"i-box"},da:{n:"Display ad",d:"Main news pages, per sq. cm",ico:"i-img"}};
const PAGES = {inside:"Inside page",third:"Third page",last:"Last page",front:"Front page"};
// extras: [id, label, default % on the ad] — papers with their own card override this in p.enh
const ENH = [["bold","Bold text",15],["tick","Star, tick, heart or arrow",10],["bg","Yellow background",25],["web","Website / email ID",0],["border","Border",20]];
const CUTOFF_DAYS = 1, GST = 0.05;

const inr = n => "₹" + Math.round(n).toLocaleString("en-IN");
const wordCount = t => (t.trim().match(/\S+/g)||[]).length;
const edOf = (p, city) => p.ed[city] || null;

/* how a classified text ad is charged for this paper, edition and category: {w,min} or {line} or null */
function clsRule(p, city, cat){
 const e = edOf(p, city); if (!e) return null;
 const ov = e.ov && e.ov[cat];
 if (ov && (ov.w || ov.line)) return ov;
 if (cat === "Matrimonial" && p.mat) return p.mat;
 if (e.wp) return { wp: e.wp };
 if (e.line) return { line: e.line };
 if (e.w) return { w: COMMERCIAL.has(cat) && e.c ? e.c : e.w, min: e.min || 10 };
 return null;
}
// line-charged ads: characters per line (cpl) set the line count; words per line (wpl) kept for older cards
const lineCount = (L, text) => Math.max(L.lines, L.cpl ? Math.ceil(text.trim().length / L.cpl) : Math.ceil(wordCount(text) / L.wpl));
const minWords = (p, city, cat) => { const r = clsRule(p, city, cat); return !r ? 0 : r.line ? 0 : r.wp ? r.wp.words : r.min; };
const perSqcm = (p, rate) => rate == null ? null : p.unit === "colcm" ? rate / p.colW : rate;

/* rate per sq. cm for boxed (cd) or display (da) ads; null = on request */
function boxRate(p, city, type, cat, page = "inside", color = false){
 const e = edOf(p, city); if (!e) return null;
 if (type === "cd") { const ov = e.ov && e.ov[cat];
  if (ov && ov.cc != null) return ov.cc / p.colW;                 // per column-cm override (court notices)
  if (ov && ov.cd != null) return perSqcm(p, ov.cd);
  if (cat === "Recruitment" && e.appt) return perSqcm(p, e.appt);
  if (e.cdPkg) return e.cdPkg[0].price / (e.cdPkg[0].w * e.cdPkg[0].h);
  return perSqcm(p, color && e.cdClr ? e.cdClr : e.cd); }
 const pair = (page !== "inside" && e.pg && e.pg[page]) || e.da; if (!pair) return null;
 const raw = color ? pair[1] : (pair[0] != null ? pair[0] : pair[1]); if (raw == null) return null;
 const mult = page !== "inside" && !(e.pg && e.pg[page]) ? 1 + ((p.prem && p.prem[page]) || 0) / 100 : 1;
 return perSqcm(p, raw * mult);
}

/* short label like "₹40/word", "₹850 for 5 lines", "₹475/sq. cm" or "On request" */
function rateLabel(p, city, type = "ct", cat = ""){
 if (type === "ct") { const r = clsRule(p, city, cat); return !r ? "On request" : r.line ? `${inr(r.line.base)} for ${r.line.lines} lines` : r.wp ? `${inr(r.wp.base)} for ${r.wp.words} words` : `${inr(r.w)}/word`; }
 const r = boxRate(p, city, type, cat); return r == null ? "On request" : `${inr(r)}/sq. cm`;
}
/* cheapest edition's label, for lists ("from ₹6/word") */
function fromLabel(p, type = "ct"){
 const opts = p.cities.map(c => ({ c, v: type === "ct" ? (r => r ? (r.line ? r.line.base : r.wp ? r.wp.base : r.w) : null)(clsRule(p, c, "")) : boxRate(p, c, type, "") })).filter(x => x.v != null);
 if (!opts.length) return "Rate on request";
 const best = opts.reduce((a, b) => a.v <= b.v ? a : b);
 return "from " + rateLabel(p, best.c, type);
}


/* fixed-size packages (obituary, remembrance): base size at a set price, then extra per sq. cm or per column-cm,
   rounded up to the paper's step (e.g. 9 sq. cm rows for Sandesh, 2 column-cm for Gujarat Samachar) */
function pkgPrice(p, k, w, h){
 const A0 = k.w*k.h, a = w*h, size = `${k.w} × ${k.h} cm`;
 if (a <= A0 || k.fixed) return { price: k.price, lbl: k.fixed ? `Fixed size ${size}` : `${size} package` };
 let units, extraLbl;
 if (k.per === "sqcm") { units = Math.ceil((a - A0) / (k.stepSq||1)) * (k.stepSq||1); extraLbl = `${units} sq. cm`; }
 else { units = Math.ceil(((a - A0) / p.colW) / (k.stepCc||1)) * (k.stepCc||1); if (k.maxCc) units = Math.min(units, k.maxCc); extraLbl = `${units} col-cm`; }
 return { price: k.price + units * k.extra, lbl: `${size} + ${extraLbl}` };
}
/* boxed classified sold as minimum sizes: cheapest listed size that covers the ad, else the largest size's rate */
function sizePrice(list, w, h){
 const a = w*h, fit = list.filter(x => x.w*x.h >= a).sort((x,y) => x.price - y.price)[0];
 if (fit) return { price: fit.price, lbl: `${fit.w} × ${fit.h} minimum size` };
 const big = list.reduce((x,y) => x.w*x.h >= y.w*y.h ? x : y), rate = big.price / (big.w*big.h);
 return { price: a*rate, lbl: `${a} sq. cm × ${inr(rate)}` };
}
/* ---------- pricing (single source of truth; server must recompute) ---------- */
// one paper + edition; returns null when this combination is priced on request
function quote(s){
 const p = P.find(x=>x.name===s.paper); if(!p) return null;
 const city = s.city || p.cities[0], n = Math.max(1, (s.dates||[]).length);
 let base, unitLbl;
 if (s.type==="ct"){
  const r = clsRule(p, city, s.cat); if (!r) return null;
  const words = wordCount(s.text||"");
  if (r.line){ const L=r.line, lines=lineCount(L, s.text||""); base=L.base+(lines-L.lines)*L.extra; unitLbl=`${lines} lines`; }
  else if (r.wp){ const W=r.wp, x=Math.max(0,words-W.words); base=W.base+x*W.extra; unitLbl=x?`${W.words} words + ${x} extra`:`${W.words} words`; }
  else { const u=Math.max(words,r.min); base=u*r.w; unitLbl=`${u} words × ${inr(r.w)}`; }
  s._wordRate = r.w || (r.line ? r.line.base / (r.line.lines * (r.line.cpl ? 4 : r.line.wpl)) : 0);
 } else {
  const e = edOf(p, city), ov = e && e.ov && e.ov[s.cat], w = Math.max(1,s.w), h = Math.max(1,s.h), a = w*h;
  const box = s.type==="cd" && (ov && ov.pkg ? pkgPrice(p, ov.pkg, w, h) : !(ov && (ov.cd!=null || ov.cc!=null)) && !(s.cat==="Recruitment" && e && e.appt) && e && e.cdPkg ? sizePrice(e.cdPkg, w, h) : null);
  if (box) { base = box.price; unitLbl = box.lbl; }
  else {
   const rate = boxRate(p, city, s.type, s.cat, s.type==="da" ? (PAGES[s.page] ? s.page : "inside") : "inside", !!s.color); if (rate == null) return null;
   base = a*rate; unitLbl = `${a} sq. cm × ${inr(rate)}`;
  }
 }
 // each extra: flat ₹, % of the ad, or "the price of N words", per the paper's card
 let extra = 0, pct = 0;
 if (s.type==="ct") for (const [id,, def] of ENH) if ((s.enh||[]).includes(id)) {
  const r = (p.enh && p.enh[id]) || { pct: def };
  if (r.flat) extra += r.flat; else if (r.words) extra += r.words * (s._wordRate || 0); else { extra += base * r.pct / 100; pct += r.pct; }
 }
 if (p.disc && p.disc.cats.includes(s.cat)) { base *= 1 - p.disc.pct/100; extra *= 1 - p.disc.pct/100; }
 const per = base + extra, sub = per*n, gst = sub*GST;
 return {base, unitLbl, pct, extra, per, n, sub, gst, total: sub+gst};
}

// every selected edition; req = some editions need a quote, so the order can't be charged online yet
function quoteAll(s){
 if(!s.items || !s.items.length) return null;
 const qs = s.items.map(it=>({...it, q:quote({...s, paper:it.paper, city:it.city})}));
 const priced = qs.filter(x=>x.q), req = priced.length < qs.length;
 const per = priced.reduce((a,x)=>a+x.q.per,0), n=Math.max(1,s.dates.length), sub=per*n, gst=sub*GST;
 return {qs, per, perGst:per*(1+GST), n, sub, gst, total:sub+gst, req};
}


/* ---------- what an ad must and must not say (all Gujarat papers; checked in the form and on the server) ---------- */
const AD_GUIDE = {
 "Recruitment": ["Write REQUIRED and MALE or FEMALE.", "Up to 5 posts, or 15 positions in total."],
 "Property": ["Start with FOR SALE, FOR RENT, REQUIRED ON RENT or REQUIRED ON SALE.", "Give the type: flat, bungalow, tenement, row house, penthouse, shop, office, showroom or plot.", "Name the area (Maninagar, Naroda, Satellite, Vastrapur, Paldi...). Up to 5 areas for REQUIRED ads.", "For a plot, give the plot area (up to 5,000 sq. yards).", "One property per ad. No price. No \"old/new construction\" or \"all facilities\"."],
 "Matrimonial": ["Write MATRIMONIAL or LAGNA VISHAYAK.", "Give the age of the boy or girl and the caste."],
 "Name change": ["Use: I have changed my name from ... to ..., Address: ...", "Leave out \"for all purposes\", \"vide affidavit dated...\" and \"notarized\"."],
};
// sub-categories: the heading the ad is printed under; customers pick one where a category has them
const SUBCATS = {
 "Property": ["For sale","For rent","Required on rent","Required on sale","Commercial property","Plot / land"],
 "To let": ["Residential","Commercial","PG / hostel"],
 "Recruitment": ["Situation vacant","Walk-in interview","Part-time / work from home","Teachers and education jobs","Drivers and security"],
 "Matrimonial": ["Brides wanted","Grooms wanted","Patel","Brahmin","Jain / Vania","Other communities","Second marriage","NRI"],
 "Name change": ["Name change","Name change for passport","Name change (gazette)","Spelling correction","Surname change after marriage"],
 "Obituary": ["Besnu (prayer meeting)","Uthamna","Shraddhanjali","Death notice"],
 "Remembrance": ["First death anniversary","Punyatithi","In memoriam"],
 "Public notice": ["Lost document","General public notice","Disowning notice","Caution notice"],
 "Court notice": ["Summons","Court order notice","Lok adalat notice"],
 "Lost and found": ["Lost documents","Lost certificate","Lost passport","Missing person"],
 "Business": ["Business offers","Franchise","Hotel for sale","Partnership"],
 "Travel": ["Tour packages","Taxi and car rental","Hotels and resorts"],
 "Education": ["Admissions","Coaching and tuition","Results"],
 "Vehicles": ["Cars for sale","Two-wheelers","Commercial vehicles"],
 "Finance and loans": ["Loans","Investment"],
 "Medical": ["Clinics and hospitals","Ayurveda and wellness"],
 "Astrology": ["Astrology","Vastu"],
 "Personal and greetings": ["Birthday","Anniversary","Congratulations"],
};
const REQUIRED_DOCS = {
 "Title clear notice": "Advocate's letterhead with signature and stamp",
 "Court notice": "Court order",
 "Name change": "Affidavit or gazette notification",
 "Public notice": "Advocate's letterhead (signed and stamped), court order, affidavit or gazette, as applicable",
};
const NAME_CHANGE_TEMPLATE = "I have changed my name from [OLD NAME] to [NEW NAME], Address: [FULL ADDRESS]";
const PROP_TYPES = [["flat"],["bungalow","bunglow"],["tenement","tenament"],["row house","rowhouse","raw house","rawhouse"],["penthouse","pent house"],["shop"],["office"],["showroom","show room"],["plot"]];
const CASTES = /caste|patel|patidar|kadva|leuva|brahmin|brahman|jain|vania|vaniya|baniya|lohana|rajput|kshatriya|prajapati|soni|darji|panchal|suthar|mistry|modh|nagar|maheshwari|agarwal|marwadi|sindhi|bhanushali|ahir|koli|thakor|rabari|desai|christian|muslim|parsi|any caste|caste no bar/i;
// Gujarati equivalents so ads typed in Gujarati pass the same checks
const GU = {
 intent: /વેચાણ|વેચવાન|વેચવા|ભાડે|જોઈએ\s*છે|જોઇએ\s*છે/,
 types: [/ફ્લેટ|ફલેટ/,/બંગલો|બંગ્લો/,/ટેનામેન્ટ|ટેનેમેન્ટ/,/રો\s*હાઉસ/,/પેન્ટ\s*હાઉસ/,/દુકાન/,/ઓફિસ|ઑફિસ/,/શો\s*રૂમ/,/પ્લોટ/],
 price: /રૂ\.?\s*[\d૦-૯]|[\d૦-૯]\s*(લાખ|કરોડ)|કિંમત|ભાવ/,
 build: /(જૂનું|નવું)\s*બાંધકામ|તમામ\s*સુવિધા/,
 yard: /([\d૦-૯][\d૦-૯,]*)\s*(ચો\.?\s*વાર|ચોરસ\s*વાર|વાર)/,
 required: /જોઈએ\s*છે|જોઇએ\s*છે|જરૂર\s*છે/,
 gender: /પુરુષ|સ્ત્રી|મહિલા|ભાઈ|બહેન/,
 matri: /લગ્નવિષયક|લગ્ન\s*વિષયક/,
 age: /(ઉંમર|ઉમર)\s*[:\-]?\s*[\d૦-૯]{2}|[\d૦-૯]{2}\s*(વર્ષ)/,
 caste: /જ્ઞાતિ|પટેલ|પાટીદાર|બ્રાહ્મણ|જૈન|વણિક|લોહાણા|રાજપૂત|પ્રજાપતિ|સોની|દરજી|પંચાલ|સુથાર|મોઢ|નાગર|કડવા|લેઉવા|ઠાકોર|કોળી|આહીર|દેસાઈ|ખ્રિસ્તી|મુસ્લિમ|પારસી/,
 nc: /નામ.*બદલ/, addr: /સરનામું\s*:/, ncBad: /સોગંદનામા|સોગંદનામું|નોટરી|તમામ\s*હેતુ/,
};
const guDigits = x => String(x).replace(/[૦-૯]/g, d => "૦૧૨૩૪૫૬૭૮૯".indexOf(d));
function adRules(cat, text){
 const t = " " + String(text||"").toLowerCase().replace(/\s+/g," ") + " ", err = [];
 if (!t.trim()) return err;
 if (cat === "Recruitment") {
  if (!/\brequired\b/.test(t) && !GU.required.test(t)) err.push("Recruitment ads must say REQUIRED.");
  if (!/\b(male|female)\b/.test(t) && !GU.gender.test(t)) err.push("Say MALE or FEMALE (or both).");
 }
 if (cat === "Property" || cat === "To let") {
  if (!/\b(for sale|for rent|required on rent|required on sale)\b/.test(t) && !GU.intent.test(t)) err.push("Start with FOR SALE, FOR RENT, REQUIRED ON RENT or REQUIRED ON SALE.");
  const types = PROP_TYPES.filter((v, i) => v.some(k => new RegExp("\\b" + k + "s?\\b").test(t)) || GU.types[i].test(t));
  if (!types.length) err.push("Mention the property type: flat, bungalow, tenement, row house, penthouse, shop, office, showroom or plot.");
  if (types.length > 1) err.push("One property per ad. Book a separate ad for each property.");
  if (/(₹|\brs\.?\s*\d|\binr\b|\d\s*\/-|\d+\s*(lakh|lakhs|lac|lacs|crore|cr)\b|\bprice\b|\bper month\b|\/month)/.test(t) || GU.price.test(t)) err.push("Property ads can't carry a price. Remove the amount.");
  if (/\b(old|new) construction\b|\ball facilities\b/.test(t) || GU.build.test(t)) err.push("Leave out \"old/new construction\" and \"all facilities\". Papers don't print them.");
  if (types.some(v => v[0] === "plot")) { const m = t.match(/(\d[\d,]*)\s*(sq\.?\s*(yd|yds|yard|yards)|sqyd|sq\.?yd)/) || (x => x && [x[0], guDigits(x[1])])(t.match(GU.yard)); if (!m) err.push("For a plot, give the plot area in sq. yards."); else if (+m[1].replace(/,/g,"") > 5000) err.push("Plot area must be 5,000 sq. yards or less."); }
 }
 if (cat === "Matrimonial") {
  if (!/\b(matrimonial|lagna\s*vishayak|lagnavishayak)\b/.test(t) && !GU.matri.test(t)) err.push("Write MATRIMONIAL or LAGNA VISHAYAK.");
  if (!/\b(age\s*:?\s*\d{2}|\d{2}\s*(yrs|yr|years|year)\b|\d{2}\s*\/\s*\d)/.test(t) && !GU.age.test(t)) err.push("Give the age (for example: age 29 yrs).");
  if (!CASTES.test(t) && !GU.caste.test(t)) err.push("Mention the caste (or write \"caste no bar\").");
 }
 if (cat === "Name change") {
  if (!/i\s+have\s+changed\s+my\s+name\s+from\s+.+\s+to\s+.+/.test(t) && !GU.nc.test(t)) err.push("Use the format: I have changed my name from ... to ...");
  if (!/\baddress\s*:/.test(t) && !GU.addr.test(t)) err.push("Add your address after \"Address:\".");
  if (/all purposes|affidavit|notari[sz]ed/.test(t) || GU.ncBad.test(t)) err.push("Leave out \"for all purposes\", the affidavit date and \"notarized\".");
  if (/\[(old|new) name\]|\[full address\]/.test(t)) err.push("Replace the [brackets] with your details.");
 }
 return err;
}
console.assert(quote({paper:"Divya Bhaskar",city:"Ahmedabad",cat:"Property",type:"ct",text:"w",enh:["bg","bold"],dates:[1]}).per===400+175, "DB yellow ₹125 + bold ₹50");
console.assert(quote({paper:"Sandesh",city:"Ahmedabad",cat:"Property",type:"ct",text:"w",enh:["bg","web"],dates:[1]}).per===250+125+125, "Sandesh yellow 50% + web = 5 words");
console.assert(quote({paper:"Indian Express",city:"Ahmedabad",cat:"Property",type:"ct",text:"w ".repeat(25),dates:[1]}).sub===155, "IE Gujarat 20 words ₹105 + 5 × ₹10");
console.assert(quote({paper:"Indian Express",city:"Mumbai",cat:"Obituary",type:"ct",text:"w",dates:[1]}).sub===205, "IE obituary 50% off");
console.assert(adRules("Property","FOR RENT 2BHK flat in Bopal near BRTS, call 9825041736").length===0, "valid property ad");
console.assert(adRules("Property","For sale flat and shop, Rs 45 lakh, new construction").length===3, "property: two types, price, construction");
console.assert(adRules("Property","ભાડે આપવાનો છે 2BHK ફ્લેટ, સેટેલાઇટ, BRTS પાસે. સંપર્ક 9825041736").length===0, "Gujarati property ad passes");
console.assert(adRules("Property","વેચાણ ફ્લેટ, રૂ. 45 લાખ").length===1, "Gujarati price caught");
console.assert(adRules("Matrimonial","લગ્નવિષયક પટેલ યુવક ઉંમર 29 વર્ષ, એન્જિનિયર").length===0, "Gujarati matrimonial passes");
console.assert(adRules("Name change","I have changed my name from Hetal Patel to Hetal Shah, Address: 12 Satellite, Ahmedabad").length===0, "valid name change");

// self-checks against the rate cards (run in the browser console and by `node server.js --check`)
console.assert(Math.round(quote({paper:"Sandesh",city:"Ahmedabad",cat:"Property",type:"ct",text:"w ".repeat(12),dates:[1]}).total)===315, "Sandesh 12 words × ₹25 + GST");
console.assert(Math.round(quote({paper:"Sandesh",city:"Ahmedabad",cat:"Astrology",type:"ct",text:"w",dates:[1]}).sub)===850, "commercial rate, 10-word minimum");
console.assert(quote({paper:"Times of India",city:"Ahmedabad",cat:"Property",type:"ct",text:"x".repeat(130),dates:[1]}).sub===1020, "TOI 130 chars = 6 lines = 850 + 170");
console.assert(quote({paper:"Sandesh",city:"Ahmedabad",cat:"Obituary",type:"cd",w:9,h:6,dates:[1]}).sub===2900+9*60, "Sandesh besnu 9x5 + one 9 sq. cm row");
console.assert(quote({paper:"Divya Bhaskar",city:"Ahmedabad",cat:"Property",type:"cd",w:3,h:4,dates:[1]}).sub===7000, "DB boxed minimum 3x5 ₹7,000");
console.assert(quote({paper:"Sandesh",city:"Ahmedabad",cat:"Property",type:"cd",w:3,h:4,dates:[1]}).sub===4200, "Sandesh boxed minimum 3x4 ₹4,200");
console.assert(quote({paper:"Divya Bhaskar",city:"Ahmedabad",cat:"Astrology",type:"ct",text:"w",dates:[1]}).sub===950, "DB business rate ₹95");
console.assert(quote({paper:"Times of India",city:"Mumbai",cat:"Property",type:"ct",text:"x",dates:[1]}).sub===5500, "TOI Mumbai property 5 lines");
console.assert(Math.round(quote({paper:"Gujarat Samachar",city:"Ahmedabad",cat:"Business",type:"da",w:3.9,h:10,dates:[1]}).sub)===27600, "GS 10 col-cm × ₹2760");
console.assert(quote({paper:"Navgujarat Samay",city:"Ahmedabad",cat:"Property",type:"ct",text:"w",dates:[1]})===null, "no card = on request");

if (typeof module!=="undefined") module.exports = {SUBCATS,REQUIRED_DOCS,adRules,AD_GUIDE,NAME_CHANGE_TEMPLATE,LANGS,GUJARAT,CITIES_ORDER,P,CATS,TYPES,PAGES,ENH,CUTOFF_DAYS,GST,inr,quote,quoteAll,wordCount,clsRule,minWords,boxRate,rateLabel,fromLabel};
