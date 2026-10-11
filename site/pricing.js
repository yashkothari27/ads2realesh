/* Shared by the browser (index.html) and server.js — the server recomputes every price from this file.
   Gujarat newspapers only. Rates are taken from each paper's latest rate card supplied by the business
   (see the `from` field). ponytail: move to a Postgres `rates` table (docs/SRS.md) once rates change often. */
const LANGS = ["Gujarati","English"];
const CITIES_ORDER = ["Ahmedabad","Vadodara","Surat","Rajkot","Bhavnagar","Bhuj","All Gujarat"];

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
const P = [
 { name:"Gujarat Samachar", gu:"ગુજરાત સમાચાર", lang:"Gujarati", unit:"colcm", colW:3.9, from:"24 Sep 2023",
   prem:{front:100,last:50,third:25},
   ed:{ "Ahmedabad":{w:40,c:120,min:10,cd:2760,da:[2760,4320],appt:3400},
        "Vadodara":{w:18,min:10,da:[1173,1380]},
        "Surat":{w:21,min:10,da:[1173,1380]},
        "Rajkot":{w:18,min:10,da:[828,999]},
        "Bhavnagar":{w:6,min:10,da:[414,500]},
        "Bhuj":{w:6,min:10,da:[207,300]},
        "All Gujarat":{w:142,min:10,da:[6555,8250],appt:3600} } },
 { name:"Sandesh", gu:"સંદેશ", lang:"Gujarati", unit:"sqcm", colW:3, from:"15 Oct 2023",
   prem:{front:100,last:50,third:25}, mat:{w:30,min:10,note:"Runs in all Gujarat editions, Sunday only"},
   ed:{ "Ahmedabad":{w:25,c:85,min:10,cd:280,da:[475,650],appt:325},
        "Vadodara":{w:18,c:20,min:10,cd:150,da:[260,300],appt:150},
        "Surat":{w:20,c:25,min:10,cd:150,da:[260,300],appt:135},
        "Rajkot":{w:18,min:10,cd:95,da:[185,205],appt:90},
        "Bhavnagar":{w:4,min:10,da:[40,55],appt:25},
        "Bhuj":{w:6,min:10,da:[45,65],appt:40},
        "All Gujarat":{w:100,c:160,min:10,cd:465,da:[1060,1460],appt:600} } },
 { name:"Divya Bhaskar", gu:"દિવ્ય ભાસ્કર", lang:"Gujarati", unit:"colcm", colW:3.9, from:"1 Apr 2016",
   prem:{front:100,last:50,third:25}, mat:{w:35,min:10},
   ed:{ "Ahmedabad":{w:40,c:85,min:10,cd:1200,da:[4320,4320],appt:2050},
        "Vadodara":{w:18,min:10,cd:375},
        "Surat":{w:22,min:10,cd:330},
        "Rajkot":{w:18,min:10,cd:290},
        "Bhavnagar":{w:6,min:10,cd:160},
        "Bhuj":{w:6,min:10,cd:150},
        "All Gujarat":{w:120,c:165,min:10,cd:1600,da:[8200,8200],appt:2900} } },
 { name:"Times of India", lang:"English", unit:"sqcm", colW:3.17, from:"15 Jan 2021",
   prem:{front:100,last:50,third:25},
   ed:{ "Ahmedabad":{line:{base:850,lines:5,extra:170,wpl:4},cd:500,da:[740,740],appt:735,
                     ov:{"Name change":{line:{base:600,lines:5,extra:120,wpl:4}}}},
        "Vadodara":{cd:372}, "Surat":{cd:110}, "Rajkot":{cd:165},
        "All Gujarat":{cd:300,da:[1134,1143],appt:735} } },
 { name:"Indian Express", lang:"English", unit:"sqcm", colW:3.17, from:"rate on request", ed:{ "Ahmedabad":{} } },
 { name:"Financial Express", lang:"English", unit:"sqcm", colW:3.17, from:"rate on request", ed:{ "Ahmedabad":{} } },
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

const CATS = ["Name change","Matrimonial","Property","Recruitment","Obituary","Remembrance","Public notice","Court notice","Lost and found","Lost documents","Lost share certificate","Business","Personal and greetings","Vehicles","Education","Travel","To let","Tenders","Astrology","Retail","Services","Marriage bureau","Situation wanted","Announcement","Computers","Wedding services"];
// categories the papers bill at their "commercial" word rate where one exists
const COMMERCIAL = new Set(["Astrology","Business","Retail","Services","Education","Computers"]);
const TYPES = {ct:{n:"Classified text",d:"Per word or line, in the classifieds pages",ico:"i-text"},cd:{n:"Classified display",d:"Boxed, with logo or photo, per sq. cm",ico:"i-box"},da:{n:"Display ad",d:"Main news pages, per sq. cm",ico:"i-img"}};
const PAGES = {inside:"Inside page",third:"Third page",last:"Last page",front:"Front page"};
const ENH = [["bold","Bold text",15],["tick","Tick mark",10],["bg","Background colour",25],["border","Border",20]];
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
 if (e.line) return { line: e.line };
 if (e.w) return { w: COMMERCIAL.has(cat) && e.c ? e.c : e.w, min: e.min || 10 };
 return null;
}
const minWords = (p, city, cat) => { const r = clsRule(p, city, cat); return !r ? 0 : r.line ? r.line.lines * r.line.wpl : r.min; };
const perSqcm = (p, rate) => rate == null ? null : p.unit === "colcm" ? rate / p.colW : rate;

/* rate per sq. cm for boxed (cd) or display (da) ads; null = on request */
function boxRate(p, city, type, cat, page = "inside", color = false){
 const e = edOf(p, city); if (!e) return null;
 if (type === "cd") { const ov = e.ov && e.ov[cat]; return perSqcm(p, ov && ov.cd != null ? ov.cd : cat === "Recruitment" && e.appt ? e.appt : e.cd); }
 const pair = (page !== "inside" && e.pg && e.pg[page]) || e.da; if (!pair) return null;
 const raw = color ? pair[1] : (pair[0] != null ? pair[0] : pair[1]); if (raw == null) return null;
 const mult = page !== "inside" && !(e.pg && e.pg[page]) ? 1 + ((p.prem && p.prem[page]) || 0) / 100 : 1;
 return perSqcm(p, raw * mult);
}

/* short label like "₹40/word", "₹850 for 5 lines", "₹475/sq. cm" or "On request" */
function rateLabel(p, city, type = "ct", cat = ""){
 if (type === "ct") { const r = clsRule(p, city, cat); return !r ? "On request" : r.line ? `${inr(r.line.base)} for ${r.line.lines} lines` : `${inr(r.w)}/word`; }
 const r = boxRate(p, city, type, cat); return r == null ? "On request" : `${inr(r)}/sq. cm`;
}
/* cheapest edition's label, for lists ("from ₹6/word") */
function fromLabel(p, type = "ct"){
 const opts = p.cities.map(c => ({ c, v: type === "ct" ? (r => r ? (r.line ? r.line.base : r.w) : null)(clsRule(p, c, "")) : boxRate(p, c, type, "") })).filter(x => x.v != null);
 if (!opts.length) return "Rate on request";
 const best = opts.reduce((a, b) => a.v <= b.v ? a : b);
 return "from " + rateLabel(p, best.c, type);
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
  if (r.line){ const L=r.line, lines=Math.max(L.lines, Math.ceil(words/L.wpl)); base=L.base+(lines-L.lines)*L.extra; unitLbl=`${lines} lines`; }
  else { const u=Math.max(words,r.min); base=u*r.w; unitLbl=`${u} words × ${inr(r.w)}`; }
 } else {
  const rate = boxRate(p, city, s.type, s.cat, s.type==="da" ? (PAGES[s.page] ? s.page : "inside") : "inside", !!s.color); if (rate == null) return null;
  const a = Math.max(1,s.w)*Math.max(1,s.h); base = a*rate; unitLbl = `${a} sq. cm × ${inr(rate)}`;
 }
 const pct = s.type==="ct" ? ENH.filter(e=>(s.enh||[]).includes(e[0])).reduce((a,e)=>a+e[2],0) : 0;
 const per = base*(1+pct/100), sub = per*n, gst = sub*GST;
 return {base, unitLbl, pct, per, n, sub, gst, total: sub+gst};
}

// every selected edition; req = some editions need a quote, so the order can't be charged online yet
function quoteAll(s){
 if(!s.items || !s.items.length) return null;
 const qs = s.items.map(it=>({...it, q:quote({...s, paper:it.paper, city:it.city})}));
 const priced = qs.filter(x=>x.q), req = priced.length < qs.length;
 const per = priced.reduce((a,x)=>a+x.q.per,0), n=Math.max(1,s.dates.length), sub=per*n, gst=sub*GST;
 return {qs, per, perGst:per*(1+GST), n, sub, gst, total:sub+gst, req};
}

// self-checks against the rate cards (run in the browser console and by `node server.js --check`)
console.assert(Math.round(quote({paper:"Sandesh",city:"Ahmedabad",cat:"Property",type:"ct",text:"w ".repeat(12),dates:[1]}).total)===315, "Sandesh 12 words × ₹25 + GST");
console.assert(Math.round(quote({paper:"Sandesh",city:"Ahmedabad",cat:"Astrology",type:"ct",text:"w",dates:[1]}).sub)===850, "commercial rate, 10-word minimum");
console.assert(quote({paper:"Times of India",city:"Ahmedabad",cat:"Property",type:"ct",text:"w ".repeat(24),dates:[1]}).sub===1020, "TOI 6 lines = 850 + 170");
console.assert(Math.round(quote({paper:"Gujarat Samachar",city:"Ahmedabad",cat:"Business",type:"da",w:3.9,h:10,dates:[1]}).sub)===27600, "GS 10 col-cm × ₹2760");
console.assert(quote({paper:"Indian Express",city:"Ahmedabad",cat:"Property",type:"ct",text:"w",dates:[1]})===null, "no card = on request");

if (typeof module!=="undefined") module.exports = {LANGS,CITIES_ORDER,P,CATS,TYPES,PAGES,ENH,CUTOFF_DAYS,GST,inr,quote,quoteAll,wordCount,clsRule,minWords,boxRate,rateLabel,fromLabel};
