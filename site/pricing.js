/* Shared by the browser (index.html) and server.js — the server recomputes every price from this file. */
/* ponytail: catalogue + rates are indicative placeholders in-page; move to Postgres `rates` (docs/SRS.md) before launch */
const LANGS = ["English","Hindi","Marathi","Gujarati","Bengali","Tamil","Telugu","Kannada","Malayalam","Odia","Punjabi","Assamese","Urdu"];
// [name, language, cities, ₹/word classified, min words, ₹/sqcm display]
const P = [
 ["Times of India","English",["Mumbai","Delhi","Bengaluru","Pune","Kolkata","Chennai","Hyderabad","Ahmedabad","Lucknow","Jaipur"],28,20,320],
 ["Hindustan Times","English",["Delhi","Mumbai","Lucknow","Patna","Chandigarh"],24,20,260],
 ["The Hindu","English",["Chennai","Hyderabad","Bengaluru","Kochi","Coimbatore","Delhi"],22,20,240],
 ["Indian Express","English",["Mumbai","Delhi","Pune","Chandigarh","Ahmedabad"],18,20,190],
 ["The Telegraph","English",["Kolkata","Guwahati","Ranchi"],20,20,210],
 ["Deccan Chronicle","English",["Hyderabad","Chennai","Bengaluru","Vijayawada"],14,20,150],
 ["Deccan Herald","English",["Bengaluru","Mysuru"],16,20,170],
 ["The Tribune","English",["Chandigarh","Ludhiana","Amritsar","Delhi"],15,20,160],
 ["Economic Times","English",["Mumbai","Delhi","Bengaluru","Kolkata"],36,20,380],
 ["Dainik Jagran","Hindi",["Delhi","Lucknow","Kanpur","Patna","Varanasi","Agra","Dehradun"],16,15,170],
 ["Dainik Bhaskar","Hindi",["Bhopal","Indore","Jaipur","Chandigarh","Raipur","Ahmedabad"],14,15,150],
 ["Amar Ujala","Hindi",["Lucknow","Kanpur","Agra","Dehradun","Chandigarh"],13,15,140],
 ["Hindustan","Hindi",["Delhi","Patna","Lucknow","Ranchi"],13,15,140],
 ["Rajasthan Patrika","Hindi",["Jaipur","Jodhpur","Udaipur","Bhopal"],12,15,130],
 ["Navbharat Times","Hindi",["Delhi","Mumbai"],15,15,160],
 ["Lokmat","Marathi",["Mumbai","Pune","Nagpur","Aurangabad","Kolhapur","Nashik"],10,15,110],
 ["Sakal","Marathi",["Pune","Mumbai","Kolhapur","Nashik"],10,15,110],
 ["Maharashtra Times","Marathi",["Mumbai","Pune"],11,15,120],
 ["Pudhari","Marathi",["Kolhapur","Pune","Sangli"],8,15,90],
 ["Gujarat Samachar","Gujarati",["Ahmedabad","Surat","Vadodara","Rajkot"],9,15,100],
 ["Sandesh","Gujarati",["Ahmedabad","Surat","Vadodara","Rajkot"],9,15,100],
 ["Divya Bhaskar","Gujarati",["Ahmedabad","Surat","Rajkot"],9,15,100],
 ["Anandabazar Patrika","Bengali",["Kolkata","Siliguri"],18,15,190],
 ["Bartaman","Bengali",["Kolkata"],10,15,110],
 ["Sangbad Pratidin","Bengali",["Kolkata"],9,15,100],
 ["Daily Thanthi","Tamil",["Chennai","Coimbatore","Madurai","Tiruchirappalli"],12,15,130],
 ["Dinakaran","Tamil",["Chennai","Coimbatore","Madurai"],10,15,110],
 ["Dinamalar","Tamil",["Chennai","Coimbatore","Madurai"],10,15,110],
 ["Eenadu","Telugu",["Hyderabad","Vijayawada","Visakhapatnam","Tirupati","Warangal"],14,15,150],
 ["Sakshi","Telugu",["Hyderabad","Vijayawada","Visakhapatnam"],12,15,130],
 ["Andhra Jyothy","Telugu",["Hyderabad","Vijayawada"],10,15,110],
 ["Vijay Karnataka","Kannada",["Bengaluru","Mysuru","Hubballi","Mangaluru"],10,15,110],
 ["Prajavani","Kannada",["Bengaluru","Mysuru","Hubballi"],10,15,110],
 ["Vijayavani","Kannada",["Bengaluru","Hubballi"],9,15,100],
 ["Malayala Manorama","Malayalam",["Kochi","Kottayam","Thiruvananthapuram","Kozhikode","Thrissur"],15,15,160],
 ["Mathrubhumi","Malayalam",["Kochi","Kozhikode","Thiruvananthapuram","Thrissur"],13,15,140],
 ["Sambad","Odia",["Bhubaneswar","Cuttack"],8,15,90],
 ["Dharitri","Odia",["Bhubaneswar","Cuttack"],7,15,80],
 ["Ajit","Punjabi",["Jalandhar","Ludhiana","Amritsar"],8,15,90],
 ["Asomiya Pratidin","Assamese",["Guwahati","Dibrugarh"],8,15,90],
 ["Inquilab","Urdu",["Mumbai","Delhi","Lucknow"],7,15,80],
].map(([name,lang,cities,word,min,sqcm])=>({name,lang,cities,word,min,sqcm}));

const CATS = ["Name change","Matrimonial","Property","Recruitment","Obituary","Remembrance","Public notice","Court notice","Lost and found","Lost documents","Lost share certificate","Business","Personal and greetings","Vehicles","Education","Travel","To let","Tenders","Astrology","Retail","Services","Marriage bureau","Situation wanted","Announcement","Computers","Wedding services"];
const CAT_MULT = {"Recruitment":1.2,"Public notice":1.4,"Court notice":1.4,"Lost share certificate":1.4,"Tenders":1.4,"Obituary":1.1,"Business":1.15,"Retail":1.15};
const TYPES = {ct:{n:"Classified text",d:"Per word, in the classifieds pages",ico:"i-text"},cd:{n:"Classified display",d:"Boxed, with logo or photo, per sq. cm",ico:"i-box"},da:{n:"Display ad",d:"Main news pages, per sq. cm",ico:"i-img"}};
const ENH = [["bold","Bold text",15],["tick","Tick mark",10],["bg","Background colour",25],["border","Border",20]];
const DA_MULT = 2.2, CUTOFF_DAYS = 1, GST = 0.05;

const inr = n => "₹" + Math.round(n).toLocaleString("en-IN");

/* ---------- pricing (single source of truth; server must recompute) ---------- */
function quote(s){
 const p = P.find(x=>x.name===s.paper); if(!p) return null;
 const n = Math.max(1, s.dates.length), cm = CAT_MULT[s.cat]||1;
 let base, unitLbl;
 if (s.type==="ct"){ const w = wordCount(s.text); const u = Math.max(w,p.min); base = u*p.word*cm; unitLbl = `${u} words × ${inr(p.word*cm)}`; }
 else { const a = Math.max(1,s.w)*Math.max(1,s.h); const rate = p.sqcm*(s.type==="da"?DA_MULT:1)*cm; base = a*rate; unitLbl = `${a} sq. cm × ${inr(rate)}`; }
 const pct = s.type==="ct" ? ENH.filter(e=>s.enh.includes(e[0])).reduce((a,e)=>a+e[2],0) : (s.color?30:0);
 const per = base*(1+pct/100), sub = per*n, gst = sub*GST;
 return {base, unitLbl, pct, per, n, sub, gst, total: sub+gst};
}
const wordCount = t => (t.trim().match(/\S+/g)||[]).length;
// self-check (console): 25 words in TOI Property, 1 date, no extras = 25*28 *1.05
console.assert(Math.round(quote({paper:"Times of India",cat:"Property",type:"ct",text:"w ".repeat(25),enh:[],dates:[1],w:0,h:0}).total)===735,"pricing check failed");

// sum of every selected edition; quote() stays the per-paper source of truth
function quoteAll(s){
 if(!s.items.length) return null;
 const qs = s.items.map(it=>({...it, q:quote({...s, paper:it.paper})}));
 const per = qs.reduce((a,x)=>a+x.q.per,0), n=Math.max(1,s.dates.length), sub=per*n, gst=sub*GST;
 return {qs, per, perGst:per*(1+GST), n, sub, gst, total:sub+gst};
}

if (typeof module!=="undefined") module.exports = {LANGS,P,CATS,CAT_MULT,TYPES,ENH,DA_MULT,CUTOFF_DAYS,GST,inr,quote,quoteAll,wordCount};
