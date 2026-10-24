const CAT_ICON = {"Name change": "c-0", "Matrimonial": "c-1", "Property": "c-2", "Recruitment": "c-3", "Obituary": "c-4", "Remembrance": "c-5", "Public notice": "c-6", "Court notice": "c-7", "Lost and found": "c-8", "Lost documents": "c-9", "Lost share certificate": "c-10", "Business": "c-11", "Personal and greetings": "c-12", "Vehicles": "c-13", "Education": "c-14", "Travel": "c-15", "To let": "c-16", "Tenders": "c-17", "Astrology": "c-18", "Retail": "c-19", "Services": "c-20", "Marriage bureau": "c-21", "Situation wanted": "c-22", "Announcement": "c-23", "Computers": "c-24", "Wedding services": "c-25"};
// ponytail: shared by every page; a missing section resolves to a detached dummy so its init is a no-op
const NIL = ()=>document.createElement("div");
const $ = (s,r=document)=>r.querySelector(s)||NIL(), $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const CITIES = CITIES_ORDER.filter(c=>P.some(p=>p.cities.includes(c)));
const CITY_PAGES = GUJARAT.filter(c=>c!=="All Gujarat");
$("#fCities").innerHTML = CITY_PAGES.map(c=>`<a href="${new URL(".", document.currentScript.src).href}newspaper/city/${c.toLowerCase().replace(/[^a-z0-9]+/g,"-")}/index.html">${esc(c)}</a>`).join("");
const store = { get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}}, set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}} };

/* ---------- page render ---------- */
$("#yr").textContent = new Date().getFullYear();
const opt = (v,t=v)=>new Option(t,v);
$("#strip").innerHTML = P.slice(0,14).map(p=>`<a href="#" data-paper="${esc(p.name)}">${esc(p.name)}</a>`).join("");
// 12 most-booked Gujarat categories first; the rest open with "All categories"
const POPULAR = ["Matrimonial","Name change","Property","Recruitment","Obituary","Public notice","Lost documents","To let","Business","Education","Vehicles","Announcement"];
const CAT_SORTED = [...POPULAR, ...CATS.filter(c=>!POPULAR.includes(c))];
$("#cats").innerHTML = CAT_SORTED.map((c,i)=>`<button class="cat" data-cat="${esc(c)}" ${i>=12?"data-extra hidden":""}><span class="cico"><svg class="i" aria-hidden="true"><use href="#${CAT_ICON[c]||"i-tag"}"/></svg></span>${esc(c)}</button>`).join("");
$("#catMore").textContent=`All ${CATS.length} categories`;
$("#catMore").addEventListener("click",e=>{ const open=e.currentTarget.getAttribute("aria-expanded")!=="true"; $$("#cats [data-extra]").forEach(b=>b.hidden=!open); e.currentTarget.setAttribute("aria-expanded",open); e.currentTarget.textContent=open?"Show fewer":`All ${CATS.length} categories`; });
$("#fCats").innerHTML = CATS.slice(0,7).map(c=>`<a href="#" data-cat="${esc(c)}">${esc(c)}</a>`).join("");
$("#fPapers").innerHTML = P.slice(0,7).map(p=>`<a href="#" data-paper="${esc(p.name)}">${esc(p.name)}</a>`).join("");
const ROOT = new URL(".", document.currentScript.src).href;
const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
$("#clist").innerHTML = CITY_PAGES.map(c=>`<a href="${ROOT}newspaper/city/${slug(c)}/index.html">${esc(c)}</a>`).join("");
$("#hsPaper").append(opt("","Any newspaper"),...P.map(p=>opt(p.name)));
$("#hsCity").append(opt("","Any city"),...CITIES.map(c=>opt(c)));
$("#fCat").append(...CATS.map(c=>opt(c)));
$("#fCity").append(...CITIES.map(c=>opt(c)));
$("#fCity").value = "Ahmedabad";

let lang = "All";
function renderPapers(){
 const list = P.filter(p=>lang==="All"||p.lang===lang);
 $("#langs").innerHTML = ["All",...LANGS].map(l=>`<button class="chip" aria-pressed="${l===lang}" data-lang="${l}">${l}</button>`).join("");
 const card=p=>`<div class="pitem"><div><strong>${esc(p.name)}</strong><small>${p.lang} · ${p.cities.length} edition${p.cities.length>1?"s":""} · ${fromLabel(p)}</small></div><button class="btn sm" data-paper="${esc(p.name)}">Book</button></div>`;
 if (lang!=="All") $("#plist").innerHTML = list.map(card).join("");
 else $("#plist").innerHTML = LANGS.filter(l=>list.some(p=>p.lang===l)).map(l=>`<h3 class="pgrp">${l==="English"?"English dailies":l+" papers"}</h3>`+list.filter(p=>p.lang===l).map(card).join("")).join("");
 $("#pcount").textContent = `${P.length} Gujarat newspapers in Gujarati and English`;
}
renderPapers();
$("#langs").addEventListener("click",e=>{const b=e.target.closest("[data-lang]"); if(b){lang=b.dataset.lang; renderPapers();}});

function runFinder(){
 const cat=$("#fCat").value, city=$("#fCity").value, t=$("#fType").value;
 const rows = P.filter(p=>p.cities.includes(city)).map(p=>({p, q:quote({paper:p.name,city,cat,type:t,text:"w ".repeat(25),enh:[],dates:[1],w:4,h:5,color:false})})).sort((a,b)=>(a.q?a.q.sub:1e12)-(b.q?b.q.sub:1e12));
 $("#fRes").innerHTML = rows.length ? rows.map(({p,q})=>`<tr><td>${esc(p.name)}</td><td>${p.lang}</td><td class="num">${q?q.unitLbl:"On request"}</td><td class="num"><b>${q?inr(q.sub):"On request"}</b></td><td><button class="btn sm primary" data-paper="${esc(p.name)}" data-city="${esc(city)}" data-cat="${esc(cat)}" data-type="${t}">${q?"Book":"Get a quote"}</button></td></tr>`).join("")
  : `<tr><td colspan="5" class="muted">No newspapers in our list publish in ${esc(city)} yet. Call us and we'll check regional papers.</td></tr>`;
}
$("#finder").addEventListener("submit",e=>{e.preventDefault();runFinder();});
$("#finder").addEventListener("change",runFinder); runFinder();

/* FAQ */
const FAQ = {
 "Basics":[["Why advertise in a newspaper?","Print reaches readers who trust the paper and keep it for the day. Local editions are especially good for property, jobs and notices, where readers search the classifieds on purpose."],["Which newspaper should I choose?","Use the rate finder above. As a rule, choose an English paper for city-wide professional reach and a regional-language paper for deeper local reach. We're happy to advise for free."],["Can I publish in many cities at once?","Yes. Add several editions or newspapers to one order and pay once."]],
 "Classified ads":[["How are classified text ads charged?","By word or by line, with a minimum length set by each paper. Enhancements like bold text or a background colour add a percentage on top."],["What is a classified display ad?","A boxed ad in the classifieds pages that can include a logo, photo or custom layout. It is charged per sq. cm."],["Can you write the ad for me?","Yes. Drafting and translation are free. Send us the details and approve the proof before you pay."]],
 "Display ads":[["What sizes are available?","From about 4 × 5 cm up to a full page. Size is column width × height in cm."],["Who designs the artwork?","Upload your own JPG or PDF, or our desk can design it for a small fee."],["Can I choose the page?","Page and position requests are possible on most papers and change the rate. Mention them at booking."]],
 "Booking and payment":[["How early must I book?","Text classifieds: usually by 5 pm the day before. Display ads: 2 to 3 working days. Sunday editions close earlier."],["How do I pay?","UPI, debit or credit card, and netbanking through a secure payment gateway. You receive a GST invoice."],["Can I cancel?","Yes, for a full refund before the newspaper's cutoff. After the cutoff, the ad has been sent to the paper and can't be withdrawn."],["Will I get proof of publication?","Yes. We email you the e-paper clipping on the day the ad appears."]],
};
let ftab = Object.keys(FAQ)[0];
function renderFaq(){
 $("#faqnav").innerHTML = Object.keys(FAQ).map(k=>`<button aria-pressed="${k===ftab}" data-f="${k}">${k}</button>`).join("");
 $("#faqlist").innerHTML = FAQ[ftab].map(([q,a],i)=>`<details ${i?"":"open"}><summary>${q}</summary><p>${a}</p></details>`).join("");
}
renderFaq(); $("#faqnav").addEventListener("click",e=>{const b=e.target.closest("[data-f]"); if(b){ftab=b.dataset.f;renderFaq();}});

/* ---------- print + cut-out animation ---------- */
const scene=$("#scene"), sheet=$("#sheet"), clip=$("#clip");
$("#sDate").textContent = new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"});
// placeholder column text: heading bars + body bars of varied lengths
{let i=0; $("#scols").innerHTML=[0,1,2].map(c=>"<div>"+Array.from({length:30},(_,k)=>{const h=k%7===0; return `<span class="ln${h?" h":""}" style="--i:${i++};width:${h?60+((k*37+c*11)%35):70+((k*53+c*29)%30)}%"></span>`}).join("")+"</div>").join("");}
// hand-cut edge: slight random jitter on each side (not a perfect rectangle)
function cutPath(){const pts=[],J=()=>(Math.random()*1.6).toFixed(2),n=9;
 for(let k=0;k<=n;k++)pts.push(`${(k*100/n).toFixed(1)}% ${J()}%`);
 for(let k=1;k<=n;k++)pts.push(`${100-J()}% ${(k*100/n).toFixed(1)}%`);
 for(let k=n-1;k>=0;k--)pts.push(`${(k*100/n).toFixed(1)}% ${100-J()}%`);
 for(let k=n-1;k>0;k--)pts.push(`${J()}% ${(k*100/n).toFixed(1)}%`);
 return `polygon(${pts.join(",")})`;}
$$(".mock").forEach(m=>m.style.setProperty("--cut",cutPath()));
const ADS=[
 ["PROPERTY","2BHK on rent, Bopal","Semi-furnished, 1,050 sq ft, 6th floor, covered parking. Near BRTS. Rs 18,000/month, family preferred. Owner: 98250 41736."],
 ["NAME CHANGE","Public notice","I, Kavita Ramesh Joshi, resident of Maninagar, Ahmedabad, have changed my name to Kavita Anand Desai for all purposes, as per affidavit dated 14 Sep."],
 ["RECRUITMENT","Site supervisors wanted","Civil diploma, 3 to 6 years on residential projects. Walk-in Saturday 10 am to 2 pm, GIDC Vatva, Ahmedabad. Carry original documents."],
 ["MATRIMONIAL","Alliance invited","For an Ahmedabad-based software engineer, 29, 5'9\", vegetarian family. Seeking an educated, working match. Biodata with photo: 99702 18564."],
];
const words = s => s.split(" ").map((w,i)=>`<span class="w" style="--i:${i}">${esc(w)}</span>`).join(" ");
const wait = ms => new Promise(r=>setTimeout(r,ms));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
async function printLoop(){
 let n=0;
 for(;;){
  const [k,h,b]=ADS[n++%ADS.length];
  scene.style.setProperty("--cut",cutPath());
  scene.className="scene"; clip.className="clip"; sheet.classList.remove("inked"); void clip.offsetWidth;
  $("#clipIn").innerHTML=`<span class="ck">${k}</span><h4>${words(h)}</h4><p>${words(b)}</p>`;
  const r=clip.getBoundingClientRect(); scene.style.setProperty("--W",r.width); scene.style.setProperty("--H",r.height);
  if(reduce){sheet.classList.add("inked"); clip.classList.add("typeset"); scene.classList.add("lift"); return;}
  sheet.classList.add("inked"); await wait(500);
  clip.classList.add("typeset"); await wait(1700);
  scene.classList.add("mark"); await wait(350);
  scene.classList.add("cut"); await wait(2150);
  scene.classList.add("lift"); await wait(3400);
  if(document.hidden) await new Promise(r=>document.addEventListener("visibilitychange",r,{once:true}));
 }
}
if (document.getElementById("scene")) printLoop();


/* ---------- rate card ---------- */
$("#rcCat").append(...CATS.map(c=>opt(c)));
$("#rcPaper").append(...P.map(p=>opt(p.name)));
const rcFill = ()=>{ const p=P.find(x=>x.name===$("#rcPaper").value); $("#rcCity").replaceChildren(...p.cities.map(c=>opt(c))); };
function rcRender(){
 const t=$("[name=rct]:checked").value, cat=$("#rcCat").value, p=P.find(x=>x.name===$("#rcPaper").value), city=$("#rcCity").value;
 const sample = {paper:p.name,cat,type:t,text:"w ".repeat(25),dates:[1],w:4,h:5};
 const rows = p.cities.map(c=>({c, q:quote({...sample,city:c})}));
 const lbl = rateLabel(p,city,t,cat), mw = minWords(p,city,cat), r = clsRule(p,city,cat);
 $("#rcOut").innerHTML = `<div class="muted sm">${esc(p.name)} · ${esc(city)} · ${esc(cat)}</div>
  <div class="big">${lbl}</div>
  <div class="muted sm">${t==="ct" ? (r ? (r.line?`${r.line.lines} lines minimum, ${inr(r.line.extra)} per extra line`:`Minimum ${mw} words`) : "Our desk confirms this rate") : "Minimum about 4 × 5 cm"} · + 5% GST · Rate card ${esc(p.from)}</div>
  <table><thead><tr><th>Edition</th><th>${t==="ct"?"25-word ad":"4 × 5 cm"}</th><th>With GST</th></tr></thead><tbody>
   ${rows.map(({c,q})=>`<tr${c===city?' style="font-weight:600"':""}><td>${esc(c)}</td><td class="num">${q?inr(q.sub):"On request"}</td><td class="num">${q?inr(q.total):"-"}</td></tr>`).join("")}
  </tbody></table>
  <button class="btn primary" style="width:100%;margin-top:18px" data-paper="${esc(p.name)}" data-city="${esc(city)}" data-cat="${esc(cat)}" data-type="${t}">${lbl==="On request"?"Get a quote":"Book this ad"} <svg class="i"><use href="#i-arrow"/></svg></button>
  <p class="muted sm" style="margin:10px 0 0">From the newspaper's rate card. The final rate is confirmed at checkout.</p>`;
}
$("#rcPaper").addEventListener("change",()=>{rcFill();rcRender();});
["#rcCat","#rcCity"].forEach(id=>$(id).addEventListener("change",rcRender));
$("#rcType").addEventListener("change",rcRender);
if (document.getElementById("rcPaper")) { rcFill(); rcRender(); }


/* ---------- scroll reveal: one IntersectionObserver, no scroll listeners ---------- */
const REVEAL = ".head,.fmt-head,.fc,.cat,.fi,.units,.box,.steps7 div,.pitem,.links a,.faqgrid,.finder,.rc,.trust";
const io = "IntersectionObserver" in window ? new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }),{rootMargin:"0px 0px -8% 0px"}) : null;
function reveal(root=document){
 if(!io || reduce) return;
 $$(REVEAL,root).forEach(el=>{ if(el.classList.contains("rv")||el.closest("dialog")) return;
  const sib=[...el.parentElement.children].filter(c=>c.matches(REVEAL)); el.style.setProperty("--d",Math.min(sib.indexOf(el),12));
  el.classList.add("rv"); io.observe(el); });
}
reveal();
// lists rebuilt by filters reveal again
new MutationObserver(ms=>ms.forEach(m=>m.target.id!=="fRes"&&reveal(m.target))).observe($("#plist"),{childList:true});
// stagger result rows whenever the finder re-renders
new MutationObserver(()=>$$("#fRes tr").forEach((r,i)=>r.style.setProperty("--d",i))).observe($("#fRes"),{childList:true});
// price feedback: bump the total when it changes
let lastTot="";
new MutationObserver(()=>{ const b=$("#selbar b:last-of-type"); if(!b) return; if(lastTot&&b.textContent!==lastTot){ b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); } lastTot=b.textContent; }).observe($("#selbar"),{childList:true,subtree:true});

/* theme toggle */
const syncTheme=()=>$("#theme").setAttribute("aria-label",`Switch to ${document.documentElement.dataset.theme==="dark"?"light":"dark"} theme`);
$("#theme").onclick=()=>{const t=document.documentElement.dataset.theme==="dark"?"light":"dark"; document.documentElement.dataset.theme=t; try{localStorage.setItem("a2r_theme",t)}catch{} syncTheme();};
syncTheme();

/* mobile menu */
$("#burger").onclick = ()=>{const o=$("#menu").classList.toggle("open"); $("#burger").setAttribute("aria-expanded",o);};
$("#menu").addEventListener("click",()=>$("#menu").classList.remove("open"));

/* ---------- booking flow: Newspaper -> Compose -> Dates -> Pay ---------- */
const STEPS = ["Category","Newspaper","Compose","Dates","Details & pay"];
let S, step = 0, viewMonth;
function fresh(pre={}){ return Object.assign({type:"ct",cat:"",items:[],dates:[],text:"",enh:[],w:4,h:5,color:false,page:"inside",file:"",doc:"",fileKey:"",docKey:"",sub:"",child:"",kb:"en",name:"",phone:"",email:"",gstin:"",terms:false,id:"",_lang:"",_cityF:"",_open:""}, pre); }
const minDate = ()=>{const d=new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()+CUTOFF_DAYS+(new Date().getHours()>=17?1:0)); return d;};
const iso = d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const fmt = s=>new Date(s+"T00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",weekday:"short"});
const key = it=>it.paper+"|"+it.city;
const saveDraft = ()=>{ if(step<5) store.set("a2r_draft",{S:{...S,file:""},step}); };

function validate(){
 const e = {};
 if (step===0){ if(!S.cat) e.cat="Choose a category."; else if(SUBCATS[S.cat] && !S.sub) e.cat="Choose a sub-category."; else if(CHILDCATS[S.cat+"|"+S.sub] && !S.child) e.cat="Choose a sub-child category."; }
 if (step===1 && !S.items.length) e.items="Pick a newspaper, then tick at least one edition.";
 if (step===2){
  if (S.type==="ct"){ if(wordCount(S.text)<3) e.text="Write your ad. It needs at least a few words."; else { const r=adRules(S.cat,S.text); if(r.length) e.text=r.join(" "); } }
  else { if(!(S.w>=2&&S.w<=33)) e.w="Width must be 2 to 33 cm."; if(!(S.h>=2&&S.h<=52)) e.h="Height must be 2 to 52 cm."; if(!S.file&&wordCount(S.text)<3) e.file="Upload your artwork, or describe the ad so our desk can design it."; }
 }
 if (step===2 && S._uploading) e.doc = e.file = "Please wait for the upload to finish.";
 if (step===2 && REQUIRED_DOCS[S.cat] && !S.docKey) e.doc = `Upload the ${REQUIRED_DOCS[S.cat].toLowerCase()}. The newspaper won't print this notice without it.`;
 if (step===3 && !S.dates.length) e.dates="Pick at least one publishing date.";
 if (step===4){
  if (S.name.trim().length<2) e.name="Enter your full name.";
  if (!/^[6-9]\d{9}$/.test(S.phone)) e.phone="Enter a 10-digit Indian mobile number.";
  if (!/^[^\s]+[^\s]+\.[^\s]+$/.test(S.email)) e.email="Enter a valid email address.";
  if (S.gstin && !/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(S.gstin)) e.gstin="This GSTIN format looks wrong (15 characters).";
  if (!S.terms) e.terms="Please accept the terms to continue.";
 }
 return e;
}
const F = (id,label,html,hint="")=>`<div class="fld"><label class="f" for="${id}">${label}</label>${html}${hint?`<p class="hint">${hint}</p>`:""}<p class="err" id="e-${id}"></p></div>`;
const rateOf = x => fromLabel(x, S.type);
// what an extra costs for the paper(s) picked
function enhLabel(id, def){
 const ps = [...new Set(S.items.map(i=>i.paper))].map(n=>P.find(x=>x.name===n));
 const one = r => !r ? `+${def}%` : r.flat ? `+${inr(r.flat)}` : r.words ? `+${r.words} words` : `+${r.pct}%`;
 const labels = [...new Set(ps.map(p=>one(p.enh&&p.enh[id])))];
 if (id==="web" && !ps.some(p=>p.enh&&p.enh.web)) return "No extra charge";
 return labels.length===1 ? labels[0] : "Varies by paper";
}

function stepHTML(){
 switch(step){
 case 0: {
  const q = (S._q||"").trim().toLowerCase();
  const subs = S.cat && SUBCATS[S.cat] ? SUBCATS[S.cat] : [];
  const kids = S.cat && S.sub ? (CHILDCATS[S.cat+"|"+S.sub]||[]) : [];
  // panel: search results across everything, else the chosen category's sub / sub-child list
  let panel;
  if (q) {
   const hits = [];
   for (const c of CATS) { if (c.toLowerCase().includes(q)) hits.push([c,"",""]);
    for (const sb of SUBCATS[c]||[]) { if ((c+" "+sb).toLowerCase().includes(q)) hits.push([c,sb,""]);
     for (const k of CHILDCATS[c+"|"+sb]||[]) if ((sb+" "+k).toLowerCase().includes(q) || k.toLowerCase().includes(q)) hits.push([c,sb,k]); } }
   panel = hits.length ? `<ul class="plist2">${hits.slice(0,40).map(([c,sb,k])=>`<li><button data-path="${esc(c)}|${esc(sb)}|${esc(k)}"><span><b>${esc(k||sb||c)}</b><small>${esc([c,sb].filter(Boolean).filter(x=>x!==(k||sb||c)).join(" › "))}</small></span><svg class="i" aria-hidden="true"><use href="#i-chev"/></svg></button></li>`).join("")}</ul>`
    : `<div class="pempty"><svg class="i" aria-hidden="true"><use href="#i-search"/></svg><p>No match for "${esc(S._q)}". Try another word, or pick a category.</p></div>`;
  } else if (S.cat && kids.length) {
   panel = `<div class="phead"><button class="btn sm ghost" data-back-sub aria-label="Back to ${esc(S.cat)} sub-categories"><svg class="i" aria-hidden="true"><use href="#i-chevl"/></svg></button><span>${esc(S.sub)}: choose one</span></div>
    <ul class="plist2">${kids.map(k=>`<li><button data-child="${esc(k)}" aria-pressed="${S.child===k}"><span><b>${esc(k)}</b></span><svg class="i" aria-hidden="true"><use href="#i-chev"/></svg></button></li>`).join("")}</ul>`;
  } else if (S.cat && subs.length) {
   panel = `<div class="phead"><span>${esc(S.cat)} sub-categories</span><button class="btn sm ghost" data-clear-cat aria-label="Clear category"><svg class="i" aria-hidden="true"><use href="#i-x"/></svg></button></div>
    <ul class="plist2">${subs.map(sb=>`<li><button data-subpick="${esc(sb)}" aria-pressed="${S.sub===sb}"><span><b>${esc(sb)}</b></span><svg class="i" aria-hidden="true"><use href="#i-chev"/></svg></button></li>`).join("")}</ul>`;
  } else if (S.cat) {
   panel = `<div class="pempty"><svg class="i" aria-hidden="true"><use href="#i-check"/></svg><p><b>${esc(S.cat)}</b> selected. Continue to choose newspapers.</p></div>`;
  } else {
   panel = `<div class="pempty"><svg class="i" aria-hidden="true"><use href="#i-search"/></svg><p>Pick a category, or search for what you want to announce.</p></div>`;
  }
  return `<h3>What do you want to announce?</h3>
  <p class="err" id="e-cat" role="alert"></p>
  <div class="catstep">
   <div class="ctiles" role="group" aria-label="Categories">${CAT_SORTED.map(c=>`<button class="ctile" data-pickcat="${esc(c)}" aria-pressed="${S.cat===c}"><span class="cico"><svg class="i" aria-hidden="true"><use href="#${CAT_ICON[c]||"i-tag"}"/></svg></span>${esc(c)}</button>`).join("")}</div>
   <div class="cpanel${S.cat||q?" active":""}">
    <label class="sr" for="catQ">Search sub-categories</label>
    <div class="csearch"><svg class="i" aria-hidden="true"><use href="#i-search"/></svg><input id="catQ" type="search" placeholder="Search: flat, driver, besnu, name change..." value="${esc(S._q||"")}" autocomplete="off"></div>
    <div id="cpanelBody">${panel}</div>
   </div>
  </div>`; }
 case 1: { const open = P.find(x=>x.name===S._open);
  const list = P.filter(x=>(!S._lang||x.lang===S._lang)&&(!S._cityF||x.cities.includes(S._cityF)));
  return `<h3>Choose newspapers and editions</h3>
  <div class="seg" role="group" aria-label="Ad format">${Object.entries(TYPES).map(([k,t])=>`<button class="segb" aria-pressed="${S.type===k}" data-set="type" data-v="${k}"><svg class="i"><use href="#${t.ico}"/></svg>${t.n}</button>`).join("")}</div>
  <div class="r3" style="margin-top:4px">
   <div class="catpath" style="grid-column:1/-1"><span class="cico"><svg class="i" aria-hidden="true"><use href="#${CAT_ICON[S.cat]||"i-tag"}"/></svg></span><span><b>${esc(S.cat)}</b>${S.sub?` › ${esc(S.sub)}`:""}${S.child?` › ${esc(S.child)}`:""}</span><button class="btn sm ghost" data-go="0">Change</button></div>
   <div>${F("wLang","Language",`<select id="wLang"><option value="">All languages</option>${LANGS.map(l=>`<option ${S._lang===l?"selected":""}>${l}</option>`).join("")}</select>`)}</div>
   <div>${F("wCityF","City",`<select id="wCityF"><option value="">All cities</option>${CITIES.map(c=>`<option ${S._cityF===c?"selected":""}>${c}</option>`).join("")}</select>`)}</div>
  </div>
  ${S.items.length?`<div class="selchips">${S.items.map(it=>`<span class="selchip">${esc(it.paper)} · ${esc(it.city)}<button data-rm="${esc(key(it))}" aria-label="Remove ${esc(it.paper)} ${esc(it.city)}"><svg class="i"><use href="#i-x"/></svg></button></span>`).join("")}</div>`:""}
  <p class="err" id="e-items"></p>
  <div class="pick">${list.map(x=>{const c=S.items.filter(i=>i.paper===x.name).length; return `<button class="opt" aria-pressed="${S._open===x.name}" aria-expanded="${S._open===x.name}" data-open-paper="${esc(x.name)}"><strong>${esc(x.name)}</strong><small>${x.lang} · ${x.cities.length} edition${x.cities.length>1?"s":""} · ${rateOf(x)}</small>${c?`<small style="color:var(--accent);font-weight:600">${c} selected</small>`:""}</button>`}).join("")||`<p class="muted">No newspapers match these filters. Clear a filter to see more.</p>`}</div>
  ${open?`<div class="eds"><strong>${esc(open.name)}: tick the editions to publish in</strong><div class="checks" style="margin-top:10px">${open.cities.map(c=>`<label><input type="checkbox" data-ed="${esc(c)}" ${S.items.some(i=>i.paper===open.name&&i.city===c)?"checked":""}> ${esc(c)} <span class="muted">${rateLabel(open,c,S.type,S.cat)}</span></label>`).join("")}</div>
   <div style="margin-top:10px;display:flex;gap:8px"><button class="btn sm" data-all="1">All editions</button><button class="btn sm ghost" data-all="0">Clear</button></div></div>`:""}`; }
 case 2: { const mn = Math.max(0,...S.items.map(it=>minWords(P.find(x=>x.name===it.paper),it.city,S.cat)));
  const guide = AD_GUIDE[S.cat==="To let"?"Property":S.cat];
  const help = guide ? `<div class="rules"><strong>${esc(S.cat)} ads must follow the newspaper's format</strong><ul>${guide.map(g=>`<li>${esc(g)}</li>`).join("")}</ul>${S.cat==="Name change"?`<button class="btn sm" data-tpl>Use name-change format</button>`:""}</div>` : "";
  const docF = REQUIRED_DOCS[S.cat] ? F("doc",`Required document: ${esc(REQUIRED_DOCS[S.cat])}`,`<label class="drop" style="display:block;cursor:pointer"><svg class="i"><use href="#i-upload"/></svg><br><span id="dn">${S.doc?esc(S.doc):"Upload PDF or photo (up to 10 MB)"}</span><input id="doc" type="file" accept=".pdf,.jpg,.jpeg,.png" class="sr"></label>`,"Our desk checks it before sending the notice to the newspaper.") : "";
  const kb = `<div class="seg kbsw" role="group" aria-label="Typing language"><button class="segb" data-kb="en" aria-pressed="${S.kb!=="gu"}">English</button><button class="segb" data-kb="gu" aria-pressed="${S.kb==="gu"}" lang="gu">ગુજરાતી</button></div><button class="btn sm ghost" data-translate type="button">Translate English text to Gujarati</button><span class="hint" id="trMsg" role="status"></span>
  ${S.kb==="gu"?`<div class="sugg" id="sugg" aria-label="Spelling suggestions"></div><p class="hint">Type in English letters and each word changes to Gujarati, the way Google's Gujarati keyboard does: makan → મકાન, lagna → લગ્ન, sampark → સંપર્ક. Tap a suggestion to pick another spelling. You can also paste Gujarati from your phone keyboard.</p>`:""}`;
  if (S.type==="ct") return `<h3>Write your ad</h3>${help}${docF}${kb}
  ${F("text","Ad text",`<textarea id="text" maxlength="800" placeholder="e.g. FOR RENT 2BHK flat, Satellite, near BRTS, semi-furnished. Call 98xxxxxxxx">${esc(S.text)}</textarea>`,`<span id="wc">${wordCount(S.text)}</span> words. Your papers charge a minimum of ${mn} words. Phone numbers count as one word. Need help writing it? Our desk drafts and translates for free.`)}
  <label class="f">Enhancements</label><div class="checks">${ENH.map(([k,n,pc])=>`<label><input type="checkbox" data-enh="${k}" ${S.enh.includes(k)?"checked":""}> ${n} <span class="muted">${enhLabel(k,pc)}</span></label>`).join("")}</div>
  <label class="f">Preview</label><div class="preview ${S.text?"":"empty"}" id="pv" style="color:#1c1917;${S.enh.includes("bold")?"font-weight:700;":""}${S.enh.includes("bg")?"background:#fde8e6;":""}${S.enh.includes("border")?"border:2px solid #1c1917;":""}">${S.enh.includes("tick")?"&#10003; ":""}${esc(S.text)||"Start typing to see your ad as it will print."}</div>`;
  return `<h3>Size and artwork</h3>
  <div class="row2">${F("w","Width (cm)",`<input id="w" type="number" min="2" max="33" step="1" value="${S.w}">`,"A standard column is about 4 cm")}${F("h","Height (cm)",`<input id="h" type="number" min="2" max="52" step="1" value="${S.h}">`)}</div>
  <div class="row2">${S.type==="da"?F("page","Page",`<select id="page">${Object.entries(PAGES).map(([k,v])=>`<option value="${k}" ${S.page===k?"selected":""}>${v}</option>`).join("")}</select>`,"Front +100%, last +50%, third +25% on most papers"):"<div></div>"}<div class="checks" style="align-self:center"><label><input type="checkbox" id="color" ${S.color?"checked":""}> Colour ad</label></div></div>
  ${F("file","Artwork (JPG, PNG or PDF, up to 10 MB)",`<label class="drop" style="display:block;cursor:pointer"><svg class="i"><use href="#i-upload"/></svg><br><span id="fn">${S.file?esc(S.file):"Click to upload your artwork"}</span><input id="file" type="file" accept=".jpg,.jpeg,.png,.pdf" class="sr"></label>`)}
  ${help}${docF}${kb}${F("text","Or describe the ad and our desk designs it",`<textarea id="text" maxlength="1200" placeholder="Headline, details, contact, and any logo or colours you want">${esc(S.text)}</textarea>`)}`; }
 case 3: { const m=viewMonth, md=minDate(); const days=new Date(m.getFullYear(),m.getMonth()+1,0).getDate(); const lead=(m.getDay()+6)%7;
  let cells=["Mo","Tu","We","Th","Fr","Sa","Su"].map(d=>`<span class="dh">${d}</span>`).join("")+"<span></span>".repeat(lead);
  for(let d=1;d<=days;d++){const dt=new Date(m.getFullYear(),m.getMonth(),d), k=iso(dt); cells+=`<button data-date="${k}" ${dt<md?"disabled":""} aria-pressed="${S.dates.includes(k)}" aria-label="${fmt(k)}">${d}</button>`;}
  const canPrev = m > new Date(md.getFullYear(),md.getMonth(),1);
  return `<h3>Pick publishing dates</h3><p class="muted sm">Earliest date: ${fmt(iso(md))}. Every date you pick runs in all ${S.items.length} selected edition${S.items.length>1?"s":""}.</p>
  <div class="calhd"><button class="btn sm" data-mon="-1" ${canPrev?"":"disabled"} aria-label="Previous month"><svg class="i"><use href="#i-chevl"/></svg></button><strong>${m.toLocaleDateString("en-IN",{month:"long",year:"numeric"})}</strong><button class="btn sm" data-mon="1" aria-label="Next month"><svg class="i"><use href="#i-chev"/></svg></button></div>
  <div class="cal">${cells}</div><p class="err" id="e-dates"></p>
  ${S.dates.length?`<p class="sm"><b>Selected:</b> ${[...S.dates].sort().map(fmt).join(", ")}</p>`:""}`; }
 case 4: { const q=quoteAll(S); return `<h3>Review and pay</h3>
  <div class="tbl"><table><tbody>
  <tr><th>Format</th><td>${TYPES[S.type].n} · ${esc(S.cat)}${S.sub?" · "+esc(S.sub):""}${S.child?" · "+esc(S.child):""}</td><td><button class="btn sm" data-go="0">Edit</button></td></tr>
  <tr><th>Editions</th><td>${S.items.map(it=>`${esc(it.paper)}, ${esc(it.city)}`).join("<br>")}</td><td><button class="btn sm" data-go="1">Edit</button></td></tr>
  <tr><th>${S.type==="ct"?"Ad text":"Size"}</th><td>${S.type==="ct"?esc(S.text):`${S.w} × ${S.h} cm${S.color?", colour":""}${S.file?"<br>"+esc(S.file):""}`}</td><td><button class="btn sm" data-go="2">Edit</button></td></tr>
  ${S.doc?`<tr><th>Document</th><td>${esc(S.doc)}</td><td><button class="btn sm" data-go="2">Edit</button></td></tr>`:""}
  <tr><th>Dates</th><td>${[...S.dates].sort().map(fmt).join(", ")}</td><td><button class="btn sm" data-go="3">Edit</button></td></tr>
  </tbody></table></div>
  <div class="row2">${F("name","Full name",`<input id="name" autocomplete="name" value="${esc(S.name)}">`)}${F("phone","Mobile",`<input id="phone" type="tel" inputmode="numeric" maxlength="10" autocomplete="tel-national" value="${esc(S.phone)}" placeholder="10-digit mobile">`)}</div>
  ${F("email","Email for invoice and proof",`<input id="email" type="email" autocomplete="email" value="${esc(S.email)}">`)}
  ${F("gstin","GSTIN (optional, for business invoice)",`<input id="gstin" maxlength="15" style="text-transform:uppercase" value="${esc(S.gstin)}">`)}
  <label style="display:flex;gap:10px;align-items:start;margin-top:12px;font-size:14px"><input type="checkbox" id="terms" style="width:auto;min-height:auto;margin-top:4px" ${S.terms?"checked":""}> I confirm the ad content is lawful and accept the terms, refund and privacy policies.</label><p class="err" id="e-terms"></p>
  ${q.req?`<p class="muted sm">Some editions you picked don't publish an online rate. We'll send you a quote for the whole order before you pay. Nothing is charged now.</p>`:`<p class="muted sm">Total ${inr(q.total)} for ${q.n} date${q.n>1?"s":""} × ${S.items.length} edition${S.items.length>1?"s":""}. You'll pay on the secure Razorpay page with UPI, card or netbanking.</p>`}`; }
 case 5: return `<div class="done"><div class="skel" style="width:60px;height:60px;border-radius:50%;margin:0 auto 18px;background:linear-gradient(90deg,var(--soft),var(--accent-2),var(--soft));background-size:200% 100%"></div><span class="eyebrow">Hang on. Don't close this tab.</span><h3>Confirming your payment</h3><p class="muted">We're checking with the bank and reserving your space with the newspapers. This takes a few seconds.</p></div>`;
 case 6: return `<div class="done"><div class="ico"><svg class="i" style="stroke:#fff"><use href="#i-check"/></svg></div><h3>${S.quote?"Quote request received":"Booking received"}</h3><p class="muted">Your booking ID</p><p class="bid">${S.id}</p><p class="muted">We've sent the details to ${esc(S.email)}. Our desk verifies the ad and releases it to ${S.items.length>1?S.items.length+" editions":esc(S.items[0].paper)}. The e-paper clipping comes to you on each publishing date.</p><p class="hint">A confirmation email with your GST invoice follows shortly.</p></div>`;
 }
}
function sideHTML(){
 const q = quoteAll(S), L=(k,v)=>`<div class="ln"><span>${k}</span><b>${v}</b></div>`;
 return `<strong>Your selection</strong>
  ${L("Format",TYPES[S.type].n)}${L("Category",esc(S.cat)||"-")}
  ${S.items.length?`<hr style="border:none;border-top:1px solid var(--line)">`+(q.qs.map(x=>L(`${esc(x.paper)}<br><small>${esc(x.city)}</small>`,x.q?inr(x.q.per):"On request")).join("")):L("Editions","-")}
  ${q?`<hr style="border:none;border-top:1px solid var(--line)">${L("Total / insertion",inr(q.perGst))}${L("Dates",S.dates.length||"-")}${L("Subtotal",inr(q.sub))}${L("GST 5%",inr(q.gst))}<div class="ln tot"><span>Total</span><span>${inr(q.total)}</span></div>${step<1?`<p class="hint">Shown for a minimum-length ad. The final price is set once you write the ad.</p>`:""}`:`<p class="muted sm" style="margin-top:10px">Pick an edition to see the price.</p>`}
  <div class="help"><a href="tel:+919000000000"><svg class="i"><use href="#i-phone"/></svg>Call us</a><a href="https://wa.me/919000000000"><svg class="i"><use href="#i-mail"/></svg>WhatsApp</a></div>`;
}
function render(){
 const fin = step>=5;
 $("#prog").innerHTML = STEPS.map((s,i)=>`<span class="${i<=step?"on":""}">${i+1}. ${s}</span>`).join("");
 $("#prog").style.display = fin?"none":"";
 const q = quoteAll(S);
 $("#selbar").innerHTML = fin||step===0?"":`<span>${S.items.length?`<b>${S.items.length}</b> edition${S.items.length>1?"s":""} selected`:"No edition selected yet"}</span><span>Total / insertion <b>${!q?"-":q.req&&!q.per?"On request":inr(q.perGst)+(q.req?" + quote":"")}</b></span>`;
 const box=$("#stepBox"); box.classList.toggle("enter", box.dataset.step!==String(step)); box.dataset.step=step; box.innerHTML = stepHTML(); $("#side").innerHTML = sideHTML();
 $("#side").style.display = fin||step===0?"none":"";
 $(".wz-body").classList.toggle("solo",fin||step===0);
 $("#back").style.visibility = step===0||fin?"hidden":"visible";
 $("#next").style.display = step===5?"none":"";
 $("#next").innerHTML = step===4?(q.req?"Request quote":`Pay ${inr(q.total)}`):step===6?"Done":`Continue<svg class="i"><use href="#i-chev"/></svg>`;
 if (step<5) history.replaceState(null,"",`#book/step-${step+1}`);
 saveDraft();
}
function showErrors(e){ $$(".err",$("#stepBox")).forEach(x=>x.textContent=""); $$("[aria-invalid]",$("#stepBox")).forEach(x=>x.removeAttribute("aria-invalid"));
 for (const [k,m] of Object.entries(e)){ const el=$("#e-"+k); if(el) el.textContent=m; $("#"+k)?.setAttribute("aria-invalid","true"); }
 const f = Object.keys(e)[0]; if (f) ($("#"+f)||$("#e-"+f))?.focus?.(); }
const refreshSide = ()=>{ $("#side").innerHTML = sideHTML(); const q=quoteAll(S); if(step===4&&q) $("#next").textContent=q.req?"Request quote":`Pay ${inr(q.total)}`; };

$("#stepBox").addEventListener("click",e=>{
 const t = e.target.closest("[data-set]"); if (t){ S[t.dataset.set]=t.dataset.v; if(t.dataset.set==="type") S.enh=[]; render(); return; }
 const op = e.target.closest("[data-open-paper]"); if (op){ const n=op.dataset.openPaper; S._open = S._open===n?"":n;
  const p=P.find(x=>x.name===n); if(S._open && !S.items.some(i=>i.paper===n)){ const c = p.cities.includes(S._cityF)?S._cityF:(p.cities.length===1?p.cities[0]:""); if(c) S.items.push({paper:n,city:c}); }
  render(); $(".eds")?.scrollIntoView({block:"nearest",behavior:"smooth"}); return; }
 const al = e.target.closest("[data-all]"); if (al){ const p=P.find(x=>x.name===S._open); S.items=S.items.filter(i=>i.paper!==p.name); if(al.dataset.all==="1") S.items.push(...p.cities.map(c=>({paper:p.name,city:c}))); render(); return; }
 const rm = e.target.closest("[data-rm]"); if (rm){ S.items=S.items.filter(i=>key(i)!==rm.dataset.rm); render(); return; }
 const d = e.target.closest("[data-date]"); if (d){ const k=d.dataset.date; S.dates = S.dates.includes(k)?S.dates.filter(x=>x!==k):[...S.dates,k]; render(); return; }
 const m = e.target.closest("[data-mon]"); if (m){ viewMonth.setMonth(viewMonth.getMonth()+ +m.dataset.mon); render(); return; }
 const g = e.target.closest("[data-go]"); if (g){ step=+g.dataset.go; render(); return; }
 const pc = e.target.closest("[data-pickcat]"); if (pc){ const c=pc.dataset.pickcat; if (S.cat!==c){ S.cat=c; S.sub=""; S.child=""; } S._q=""; render(); if(!SUBCATS[c]) setTimeout(()=>go(1),150); else $(".cpanel")?.scrollIntoView({block:"nearest",behavior:"smooth"}); return; }
 const sp = e.target.closest("[data-subpick]"); if (sp){ S.sub=sp.dataset.subpick; S.child=""; render(); if(!CHILDCATS[S.cat+"|"+S.sub]) setTimeout(()=>go(1),150); return; }
 const ch = e.target.closest("[data-child]"); if (ch){ S.child=ch.dataset.child; render(); setTimeout(()=>go(1),150); return; }
 const pa = e.target.closest("[data-path]"); if (pa){ const [c,sb,k]=pa.dataset.path.split("|"); S.cat=c; S.sub=sb; S.child=k; S._q=""; render();
  if ((!SUBCATS[c]||sb) && (!CHILDCATS[c+"|"+sb]||k)) setTimeout(()=>go(1),150); return; }
 if (e.target.closest("[data-back-sub]")){ S.sub=""; S.child=""; render(); return; }
 if (e.target.closest("[data-clear-cat]")){ S.cat=""; S.sub=""; S.child=""; render(); return; }
 const sg = e.target.closest("[data-sg]"); if (sg){ swapWord(+sg.dataset.at, sg.dataset.cur, sg.dataset.sg); return; }
 if (e.target.closest("[data-translate]")){ translateAd(); return; }
 const kbb = e.target.closest("[data-kb]"); if (kbb){ S.kb=kbb.dataset.kb; render(); $("#text")?.focus(); return; }
 if (e.target.closest("[data-tpl]")){ S.text = NAME_CHANGE_TEMPLATE; render(); const t=$("#text"); t.focus(); t.setSelectionRange(t.value.indexOf("["), t.value.indexOf("]")+1); }
});
$("#stepBox").addEventListener("input",e=>{
 const t=e.target, id=t.id;
 if (id) { const er=$("#e-"+id); if (er && er.textContent) { er.textContent=""; t.removeAttribute("aria-invalid"); } }
 if (id==="catQ"){ S._q=t.value; const tmp=document.createElement("div"); tmp.innerHTML=stepHTML(); $("#cpanelBody").innerHTML=tmp.querySelector("#cpanelBody").innerHTML; return; }
 if (id==="wLang"){S._lang=t.value; render(); return;} if (id==="wCityF"){S._cityF=t.value; render(); return;}
 if (id==="cat"){S.cat=t.value; S.sub=""; S.child=""; render(); return;}
 if (id==="sub"){S.sub=t.value; S.child=""; render(); return;}
 if (id==="child"){S.child=t.value; saveDraft(); return;}
 if (t.dataset.ed){ const it={paper:S._open,city:t.dataset.ed}; S.items = t.checked?[...S.items,it]:S.items.filter(i=>key(i)!==key(it)); render(); return; }
 if (id==="text" && S.kb==="gu" && /[\s.,;:!?)\-\/]$/.test(t.value.slice(0, t.selectionStart))){
  const pos=t.selectionStart, before=t.value.slice(0,pos), m=before.match(/([A-Za-z]+)([\s.,;:!?)\-\/])$/);
  if (m){ const g=toGujarati(m[1]), start=before.length-m[0].length; const nb=before.slice(0,start)+g+m[2]; t.value=nb+t.value.slice(pos); t.setSelectionRange(nb.length,nb.length); googleWord(t, m[1], g, start); }
 }
 if (id==="text"){ S.text=t.value; const pv=$("#pv"); if(pv){ pv.textContent=(S.enh.includes("tick")?"✓ ":"")+(S.text||"Start typing to see your ad as it will print."); pv.classList.toggle("empty",!S.text);} if($("#wc")) $("#wc").textContent=wordCount(S.text); }
 if (t.dataset.enh){ S.enh = t.checked?[...S.enh,t.dataset.enh]:S.enh.filter(x=>x!==t.dataset.enh); render(); return; }
 if (id==="w"||id==="h") S[id]=+t.value;
 if (id==="color") S.color=t.checked;
 if (id==="page") S.page=t.value;
 if (id==="doc"){ upload(t, "doc", "dn", "Upload PDF or photo (up to 10 MB)"); return; }
 if (id==="file"){ upload(t, "file", "fn", "Click to upload your artwork"); return; }
 if (["name","email"].includes(id)) S[id]=t.value.trim();
 if (id==="phone"){ t.value=t.value.replace(/\D/g,""); S.phone=t.value; }
 if (id==="gstin"){ S.gstin=t.value.toUpperCase().trim(); }
 if (id==="terms") S.terms=t.checked;
 refreshSide(); saveDraft();
});
async function go(dir){
 if (dir>0){ const e=validate(); if(Object.keys(e).length) return showErrors(e); }
 if (step===6){ closeWizard(); return; }
 if (step===4 && dir>0){
  step=5; render(); history.replaceState(null,"","#book/processing");
  try { const id = await pay(); finishBooking(id); }
  catch (err) { step=4; render(); $("#e-terms").textContent = err.message || "Payment didn't go through. You haven't been charged. Try again."; }
  return;
 }
 step = Math.max(0,Math.min(4,step+dir)); render(); $(".wz-body").scrollTop=0;
}

/* ---------- payment: server creates the Razorpay order and verifies the signature ---------- */
const api = async (url, body) => { const r = await fetch(url,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)}); const j = await r.json().catch(()=>({})); if(!r.ok) throw new Error(j.error||"Something went wrong. Please try again."); return j; };
const loadScript = src => new Promise((ok,no)=>{ const s=document.createElement("script"); s.src=src; s.onload=ok; s.onerror=()=>no(new Error("Couldn't load the payment page. Check your connection.")); document.head.append(s); });
async function pay(){
 if (location.protocol==="file:"){ await new Promise(r=>setTimeout(r,1800)); return localDemo(); } // opened without server.js
 const o = await api("/api/order", {...S, _lang:undefined, _cityF:undefined, _open:undefined});
 if (o.demo || o.quote) { S.quote = !!o.quote; return o.booking_id; }
 if (!window.Razorpay) await loadScript("https://checkout.razorpay.com/v1/checkout.js");
 const res = await new Promise((ok,no)=>{
  const rz = new Razorpay({ key:o.key_id, order_id:o.order_id, amount:o.amount, currency:"INR", name:"ad2release", description:`Booking ${o.booking_id}`, prefill:o.prefill, theme:{color:getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()},
   handler: ok, modal:{ ondismiss:()=>no(new Error("Payment cancelled. You haven't been charged.")) } });
  rz.on("payment.failed", r=>no(new Error(r.error?.description||"Payment failed. You haven't been charged.")));
  rz.open();
 });
 await api("/api/verify", {booking_id:o.booking_id, ...res});
 return o.booking_id;
}
function localDemo(){
 S.quote = quoteAll(S).req;
 const id = "A2R-" + String(Math.floor(10000+Math.random()*89999)), all = store.get("a2r_bookings",{});
 all[id] = {items:S.items,dates:S.dates,total:quoteAll(S).total,status:"DEMO",email:S.email}; store.set("a2r_bookings",all); return id;
}
function finishBooking(id){
 S.id=id; try{localStorage.removeItem("a2r_draft")}catch{}
 { const all=store.get("a2r_bookings",{}), q=quoteAll(S); all[id]={items:S.items,dates:S.dates,total:q.total,status:S.quote?"QUOTE":"PAID",email:S.email}; store.set("a2r_bookings",all); }
 step=6; render(); history.replaceState(null,"","#book/confirmed");
}

/* ---------- uploads: server signs a slot, the file goes straight to storage (Google Cloud Storage in production) ---------- */
const UP_OK = ["application/pdf","image/jpeg","image/png"];
async function upload(input, field, labelId, emptyText){
 const f = input.files[0], err = $("#e-"+field), lbl = $("#"+labelId);
 S[field] = ""; S[field+"Key"] = ""; err.textContent = "";
 if (!f) { lbl.textContent = emptyText; return; }
 if (!UP_OK.includes(f.type)) { err.textContent = "Upload a PDF, JPG or PNG file."; input.value=""; lbl.textContent = emptyText; return; }
 if (!f.size) { err.textContent = "This file is empty. Choose the document again."; input.value=""; lbl.textContent = emptyText; return; }
 if (f.size > 10*1024*1024) { err.textContent = "File must be 10 MB or smaller."; input.value=""; lbl.textContent = emptyText; return; }
 if (location.protocol === "file:") { S[field] = f.name; S[field+"Key"] = "local"; lbl.textContent = "Attached: " + f.name; return; } // opened without server.js
 S._uploading = (S._uploading||0) + 1; lbl.textContent = "Uploading " + f.name + "...";
 try {
  const slot = await api("/api/upload-url", { type: f.type, size: f.size });
  const r = await fetch(slot.url, { method: "PUT", headers: slot.headers, body: f });
  if (!r.ok) throw new Error();
  S[field] = f.name; S[field+"Key"] = slot.key; lbl.textContent = "Uploaded: " + f.name;
 } catch (x) { err.textContent = (x && x.message && !/fetch|network/i.test(x.message)) ? x.message : "Upload didn't go through. Check your connection and try again."; input.value=""; lbl.textContent = emptyText; }
 finally { S._uploading--; refreshSide(); saveDraft(); }
}


/* ---------- Google: word spelling while typing, and whole-ad translation (both proxied by server.js) ---------- */
// put Google's best spelling in place of the quick local guess, and offer the alternatives as chips
async function googleWord(t, latin, guess, at){
 if (location.protocol==="file:") return;
 try {
  const { options } = await api("/api/transliterate", { word: latin });
  if (!options || !options.length) return;
  if (t.value.slice(at, at+guess.length) === guess && options[0] !== guess) {
   const caret = t.selectionStart, d = options[0].length - guess.length;
   t.value = t.value.slice(0,at) + options[0] + t.value.slice(at+guess.length);
   t.setSelectionRange(caret + (caret > at ? d : 0), caret + (caret > at ? d : 0));
   t.dispatchEvent(new Event("input",{bubbles:true}));
  }
  const box = $("#sugg"); if (box) box.innerHTML = options.map(o=>`<button type="button" class="chip" data-sg="${esc(o)}" data-at="${at}" data-cur="${esc(options[0])}" lang="gu">${esc(o)}</button>`).join("");
 } catch { /* keep the local spelling */ }
}
function swapWord(at, cur, pick){
 const t=$("#text"); if (!t || t.value.slice(at, at+cur.length) !== cur) return;
 t.value = t.value.slice(0,at) + pick + t.value.slice(at+cur.length);
 t.dispatchEvent(new Event("input",{bubbles:true}));
 $$("#sugg [data-sg]").forEach(b=>{ b.dataset.cur = pick; b.setAttribute("aria-pressed", b.dataset.sg===pick); });
 t.focus();
}
let lastEnglish = "";
async function translateAd(){
 const t=$("#text"), msg=$("#trMsg"); if (!t) return;
 if (!/[A-Za-z]/.test(t.value)) { msg.textContent = "Write the ad in English first."; return; }
 msg.textContent = "Translating...";
 try {
  const { text } = await api("/api/translate", { text: t.value });
  lastEnglish = t.value; t.value = text; t.dispatchEvent(new Event("input",{bubbles:true}));
  msg.innerHTML = `Translated by Google. Please check names and numbers. <button type="button" class="btn sm ghost" data-undo-tr>Undo</button>`;
 } catch (x) { msg.textContent = x.message || "Translation failed. Please try again."; }
}
document.addEventListener("click", e => { if (e.target.closest("[data-undo-tr]") && lastEnglish) { const t=$("#text"); t.value=lastEnglish; lastEnglish=""; t.dispatchEvent(new Event("input",{bubbles:true})); $("#trMsg").textContent=""; } });

/* ---------- phonetic English → Gujarati (no keyboard setup needed) ---------- */
// ponytail: simple phonetic scheme (like most Gujarati typing tools); upgrade to a dictionary-backed IME if customers need exact spellings
const GU_V = [["aa","આ","ા"],["ai","ઐ","ૈ"],["au","ઔ","ૌ"],["ee","ઈ","ી"],["ii","ઈ","ી"],["oo","ઊ","ૂ"],["uu","ઊ","ૂ"],["ru","ઋ","ૃ"],["a","અ",""],["i","ઇ","િ"],["u","ઉ","ુ"],["e","એ","ે"],["o","ઓ","ો"],["A","આ","ા"],["I","ઈ","ી"],["U","ઊ","ૂ"]];
const GU_C = [["ksh","ક્ષ"],["chh","છ"],["Sh","ષ"],["sh","શ"],["kh","ખ"],["gh","ઘ"],["ch","ચ"],["jh","ઝ"],["Th","ઠ"],["Dh","ઢ"],["th","થ"],["dh","ધ"],["ph","ફ"],["bh","ભ"],["jn","જ્ઞ"],["ny","ઞ"],["k","ક"],["g","ગ"],["c","ક"],["j","જ"],["T","ટ"],["D","ડ"],["N","ણ"],["t","ત"],["d","દ"],["n","ન"],["p","પ"],["f","ફ"],["b","બ"],["m","મ"],["y","ય"],["r","ર"],["l","લ"],["L","ળ"],["v","વ"],["w","વ"],["s","સ"],["h","હ"],["z","ઝ"],["q","ક"],["x","ક્સ"]];
function toGujarati(word){
 let out="", i=0, cons=false;
 const match = list => list.find(([k]) => word.startsWith(k, i) || (k.length>1 && k===k.toLowerCase() && word.slice(i, i+k.length).toLowerCase()===k && !/[A-Z]/.test(word.slice(i, i+k.length).slice(1))));
 while (i < word.length) {
  // anusvara: capital M, or n/m after a vowel and before a consonant of the same family (sampark → સંપર્ક)
  if (word[i]==="M" || (i>0 && !cons && ((word[i]==="n" && /[kgcjtdTD]/.test(word[i+1]||"")) || (word[i]==="m" && /[pb]/.test(word[i+1]||""))))) { out+="ં"; i++; continue; }
  const v = GU_V.find(([k]) => word.startsWith(k, i)) || GU_V.find(([k]) => k.length>1 && word.slice(i,i+k.length).toLowerCase()===k);
  if (v) { out += cons ? v[2] : v[1]; cons=false; i+=v[0].length; continue; }
  const c = GU_C.find(([k]) => word.startsWith(k, i)) || GU_C.find(([k]) => word.slice(i,i+k.length).toLowerCase()===k.toLowerCase() && k===k.toLowerCase());
  if (c) { if (cons) out += "્"; out += c[1]; cons=true; i+=c[0].length; continue; }
  out += word[i]; cons=false; i++;
 }
 return out;
}
function closeWizard(){ $("#wiz").close(); }
$("#wiz").addEventListener("close",()=>history.replaceState(null,"",location.pathname+location.search));
$("#wiz").addEventListener("cancel",e=>{ if(step===5) e.preventDefault(); });
$("#next").onclick=()=>go(1); $("#back").onclick=()=>go(-1); $("#wzClose").onclick=()=>{ if(step!==5) closeWizard(); };

function openWizardAt(pre={}){
 const it = pre.paper && pre.city ? [{paper:pre.paper,city:pre.city}] : [];
 S = fresh({...pre, items:it, _open: pre.paper||""}); delete S.paper; delete S.city;
 viewMonth=minDate(); viewMonth.setDate(1); step = 0;
 render(); $("#wiz").showModal();
}
/* global triggers */
document.addEventListener("click",e=>{
 const b = e.target.closest("[data-book],[data-paper],[data-cat],[data-city],[data-open],[data-close]");
 if (!b || b.closest("#wiz")) return;
 if (b.dataset.close!==undefined){ b.closest("dialog").close(); return; }
 if (b.dataset.open){ e.preventDefault(); $("#"+b.dataset.open).showModal(); return; }
 e.preventDefault();
 const pre = {};
 if (b.dataset.book) pre.type=b.dataset.book;
 if (b.dataset.type) pre.type=b.dataset.type;
 if (b.dataset.cat) pre.cat=b.dataset.cat;
 if (b.dataset.paper) pre.paper=b.dataset.paper;
 if (b.dataset.city) { pre._cityF=b.dataset.city; const p=P.find(x=>x.name===pre.paper); if(p&&p.cities.includes(b.dataset.city)) pre.city=b.dataset.city; }
 if (pre.paper && !pre.city){ const p=P.find(x=>x.name===pre.paper); if(p.cities.length===1) pre.city=p.cities[0]; }
 openWizardAt(pre);
});
$("#heroSearch").addEventListener("submit",e=>{ e.preventDefault(); const pre={}; const pp=$("#hsPaper").value, cc=$("#hsCity").value;
 if (cc) pre._cityF=cc; if (pp){ pre.paper=pp; const p=P.find(x=>x.name===pp); if(cc&&p.cities.includes(cc)) pre.city=cc; else if(p.cities.length===1) pre.city=p.cities[0]; }
 openWizardAt(pre); });
// resume a draft when the page is opened (or reloaded) at #book/step-N
if (location.hash.startsWith("#book")){
 const d = store.get("a2r_draft",null);
 S = fresh(d?.S||{}); viewMonth=minDate(); viewMonth.setDate(1);
 S.dates = S.dates.filter(k=>new Date(k+"T00:00")>=minDate());
 const want = Math.min(4, (+(location.hash.match(/step-(\d)/)||[])[1]||1)-1);
 step = 0; while(step<want && !Object.keys(validate()).length) step++;
 render(); $("#wiz").showModal();
}

/* track + login */
$("#trForm").addEventListener("submit",async e=>{ e.preventDefault(); const id=$("#trId").value.trim().toUpperCase(), em=$("#trEmail").value.trim();
 const b = await findBooking(id,em);
 $("#trErr").textContent = b?"":"We couldn't find a booking with that ID and email. Check both, or call +91 90000 00000.";
 $("#trOut").innerHTML = b?`<div class="box" style="margin-top:8px"><strong>${esc(id)}</strong><p class="muted sm" style="margin:6px 0 0">${(b.items||[]).map(i=>esc(i.paper)+", "+esc(i.city)).join("; ")} · ${(b.dates||[]).map(fmt).join(", ")}<br>${inr(b.total)} · ${esc(STATUS[b.status]||b.status)}</p></div>`:""; });

/* ---------- display ad sizes (newspaper-display-booking.html) ---------- */
const SIZES = [["Small strip","8 × 5 cm",8,5],["Quarter column","8 × 12 cm",8,12],["Eighth page","16 × 13 cm",16,13],["Quarter page","16 × 25 cm",16,25],["Half page","33 × 25 cm",33,25],["Full page","33 × 50 cm",33,50]];
if (document.getElementById("dsPaper")){
 const DP=P.filter(p=>p.cities.some(c=>boxRate(p,c,"da","")!=null)); $("#dsPaper").append(...DP.map(p=>opt(p.name)));
 const fillDs=()=>{ const p=P.find(x=>x.name===$("#dsPaper").value); $("#dsCity").replaceChildren(...p.cities.map(c=>opt(c))); };
 const drawDs=()=>{ const p=$("#dsPaper").value, city=$("#dsCity").value, col=$("#dsColor").checked;
  $("#dsTable").innerHTML = SIZES.map(([n,lbl,w,h],i)=>{ const q=quote({paper:p,city,cat:"Business",type:"da",text:"",enh:[],dates:[1],w,h,color:col});
   return `<tr style="--d:${i}"><td><b>${n}</b><br><small class="muted">${lbl}</small></td><td class="num">${q?inr(q.sub):"On request"}</td><td class="num">${q?inr(q.total):"-"}</td><td><button class="btn sm primary" data-book="da" data-paper="${esc(p)}" data-city="${esc(city)}" data-cat="Business">Get a quote</button></td></tr>`; }).join("");
 };
 $("#dsPaper").addEventListener("change",()=>{fillDs();drawDs();}); $("#dsCity").addEventListener("change",drawDs); $("#dsColor").addEventListener("change",drawDs);
 fillDs(); drawDs();
}

/* ---------- manage booking (my/sign-in.html) ---------- */
const STATUS={QUOTE:"Quote requested. We'll call you.",CREATED:"Awaiting payment",PAID:"Paid. Our desk is reviewing your ad.",DEMO:"Demo booking",PUBLISHED:"Published"};
async function findBooking(id,email){
 try{ const r=await fetch(`/api/booking/${encodeURIComponent(id)}?email=${encodeURIComponent(email)}`); if(r.ok) return {id,...(await r.json())}; }catch{}
 const b=store.get("a2r_bookings",{})[id]; // browser-only copy (demo mode / static hosting)
 return b && (!b.email || b.email.toLowerCase()===email.toLowerCase()) ? {id,...b} : null;
}
function invoiceWindow(b){
 const w=window.open("","_blank"); if(!w) return alert("Allow pop-ups to download the invoice.");
 const sub=b.total/1.05, gst=b.total-sub;
 w.document.write(`<title>Invoice ${esc(b.id)}</title><body style="font:15px/1.5 system-ui;max-width:640px;margin:40px auto;color:#1c1917"><h1 style="margin:0">ad2release</h1><p>Tax invoice for booking <b>${esc(b.id)}</b></p><table style="width:100%;border-collapse:collapse"><tr><td style="padding:8px 0;border-bottom:1px solid #ddd">${(b.items||[]).map(i=>esc(i.paper)+", "+esc(i.city)).join("<br>")}<br><small>${b.dates.map(fmt).join(", ")}</small></td><td style="text-align:right;border-bottom:1px solid #ddd">${inr(sub)}</td></tr><tr><td style="padding:8px 0">GST 5%</td><td style="text-align:right">${inr(gst)}</td></tr><tr><td style="padding:8px 0"><b>Total</b></td><td style="text-align:right"><b>${inr(b.total)}</b></td></tr></table><p style="color:#666">Placeholder invoice. GSTIN and legal details are added before launch.</p><script>print()<\/script></body>`);
 w.document.close();
}
function showBookings(list,who){
 $("#siWho").textContent=who; $("#siOut").hidden=false;
 $("#siList").innerHTML = list.length ? list.map(b=>`<div class="box" style="display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center">
  <div><strong style="font:700 20px Outfit">${esc(b.id)}</strong> <span class="off" style="display:inline-block;margin-left:6px;padding:2px 10px;border-radius:99px;background:var(--accent-2);color:var(--accent);font:600 12px Outfit">${esc(STATUS[b.status]||b.status)}</span>
   <p class="muted sm" style="margin:6px 0 0">${(b.items||[]).map(i=>esc(i.paper)+", "+esc(i.city)).join("; ")}<br>${(b.dates||[]).map(fmt).join(", ")} · <b>${inr(b.total)}</b></p></div>
  <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:end">
   ${b.status==="CREATED"?`<button class="btn sm primary" data-act="pay" data-id="${esc(b.id)}">Pay now</button>`:""}
   <button class="btn sm" data-act="inv" data-id="${esc(b.id)}">Invoice</button>
   <a class="btn sm" href="https://wa.me/919000000000?text=${encodeURIComponent("Change release date for "+b.id)}">Change date</a>
   <a class="btn sm" href="https://wa.me/919000000000?text=${encodeURIComponent("Documents for booking "+b.id)}">Send documents</a></div></div>`).join("")
  : `<div class="box" style="text-align:center"><h3>No bookings yet</h3><p class="muted">Your newspaper ads appear here after you book.</p><button class="btn primary" data-book>Book an ad</button></div>`;
 $("#siOut").scrollIntoView({behavior:"smooth",block:"start"});
 window._bk=Object.fromEntries(list.map(b=>[b.id,b]));
}
if (document.getElementById("lookForm")){
 $("#lookForm").addEventListener("submit",async e=>{ e.preventDefault();
  const id=$("#siId").value.trim().toUpperCase(), em=$("#siEmail").value.trim(), err=$("#lookErr");
  if(!id){err.textContent="Enter the Ad ID from your confirmation.";return $("#siId").focus();}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){err.textContent="Enter the email you used while booking.";return $("#siEmail").focus();}
  const b=await findBooking(id,em);
  if(!b){err.textContent="We couldn't find a booking with that ID and email. Check both, or message us on WhatsApp."; return;}
  err.textContent=""; showBookings([b],`Booking ${id}`);
 });
 let sent=false;
 $("#codeForm").addEventListener("submit",e=>{ e.preventDefault();
  const em=$("#cdEmail").value.trim(), err=$("#codeErr");
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){err.textContent="Enter a valid email address.";return $("#cdEmail").focus();}
  if(!sent){ sent=true; err.textContent=""; $("#cdEmail").readOnly=true; $("#cdWrap").hidden=false; $("#cdCode").focus(); $("#cdBtn").textContent="Verify and sign in"; $("#codeNote").textContent=`We've emailed a 6-digit code to ${em}. It expires in 10 minutes.`; return; }
  if(!/^\d{6}$/.test($("#cdCode").value)){err.textContent="Enter the 6-digit code from your email.";return $("#cdCode").focus();}
  // ponytail: needs an email provider on server.js to send and verify codes; until then this lists bookings stored in this browser for that email
  const all=store.get("a2r_bookings",{});
  showBookings(Object.keys(all).filter(id=>!all[id].email||all[id].email.toLowerCase()===em.toLowerCase()).map(id=>({id,...all[id]})),em);
 });
 $("#siList").addEventListener("click",e=>{ const b=e.target.closest("[data-act]"); if(!b) return; const bk=window._bk[b.dataset.id];
  if(b.dataset.act==="inv") invoiceWindow(bk); if(b.dataset.act==="pay") openWizardAt({}); });
}

/* ---------- inner-page widgets ---------- */
// city x category: sort table
document.querySelector("[data-sort]") && document.addEventListener("click",e=>{
 const b=e.target.closest("[data-sort]"); if(!b) return;
 $$("[data-sort]").forEach(x=>x.setAttribute("aria-pressed",x===b));
 const rows=$$("#ccTable tr"), en=r=>r.dataset.lang==="English"?0:1;
 rows.sort((a,c)=> b.dataset.sort==="price" ? a.dataset.price-c.dataset.price : en(a)-en(c) || a.dataset.price-c.dataset.price).forEach(r=>$("#ccTable").append(r));
});
// display: size tabs filter the table
let dsFmt="all";
if (document.getElementById("dsTabs")){
 const show={all:()=>true,full:n=>n==="Full page",half:n=>n==="Half page",quarter:n=>/Quarter|Eighth/.test(n),strip:n=>/strip|column/i.test(n)};
 const apply=()=>$$("#dsTable tr").forEach(r=>r.hidden=!show[dsFmt](r.querySelector("b").textContent));
 $("#dsTabs").addEventListener("click",e=>{const b=e.target.closest("[data-fmt]"); if(!b) return; dsFmt=b.dataset.fmt; $$("#dsTabs [data-fmt]").forEach(x=>x.setAttribute("aria-pressed",x===b)); apply();});
 new MutationObserver(apply).observe($("#dsTable"),{childList:true});
}
// display: hero quote form opens booking prefilled
if (document.getElementById("dqForm")){
 $("#dqPaper").append(...P.map(p=>opt(p.name)));
 const f=()=>$("#dqCity").replaceChildren(...P.find(x=>x.name===$("#dqPaper").value).cities.map(c=>opt(c)));
 $("#dqPaper").addEventListener("change",f); f();
 $("#dqForm").addEventListener("submit",e=>{ e.preventDefault(); openWizardAt({type:"da",cat:"Business",paper:$("#dqPaper").value,city:$("#dqCity").value,text:`Section: ${$("#dqSec").value}. `}); });
}
