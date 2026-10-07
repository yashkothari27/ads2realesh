const CAT_ICON = {"Name change": "c-0", "Matrimonial": "c-1", "Property": "c-2", "Recruitment": "c-3", "Obituary": "c-4", "Remembrance": "c-5", "Public notice": "c-6", "Court notice": "c-7", "Lost and found": "c-8", "Lost documents": "c-9", "Lost share certificate": "c-10", "Business": "c-11", "Personal and greetings": "c-12", "Vehicles": "c-13", "Education": "c-14", "Travel": "c-15", "To let": "c-16", "Tenders": "c-17", "Astrology": "c-18", "Retail": "c-19", "Services": "c-20", "Marriage bureau": "c-21", "Situation wanted": "c-22", "Announcement": "c-23", "Computers": "c-24", "Wedding services": "c-25"};
// ponytail: shared by every page; a missing section resolves to a detached dummy so its init is a no-op
const NIL = ()=>document.createElement("div");
const $ = (s,r=document)=>r.querySelector(s)||NIL(), $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const CITIES = [...new Set(P.flatMap(p=>p.cities))].sort();
const store = { get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}}, set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}} };

/* ---------- page render ---------- */
$("#yr").textContent = new Date().getFullYear();
const opt = (v,t=v)=>new Option(t,v);
$("#strip").innerHTML = P.slice(0,14).map(p=>`<a href="#" data-paper="${esc(p.name)}">${esc(p.name)}</a>`).join("");
$("#cats").innerHTML = CATS.map(c=>`<button class="cat" data-cat="${esc(c)}"><span class="cico"><svg class="i"><use href="#${CAT_ICON[c]||"i-tag"}"/></svg></span>${esc(c)}</button>`).join("");
$("#fCats").innerHTML = CATS.slice(0,7).map(c=>`<a href="#" data-cat="${esc(c)}">${esc(c)}</a>`).join("");
$("#fPapers").innerHTML = P.slice(0,7).map(p=>`<a href="#" data-paper="${esc(p.name)}">${esc(p.name)}</a>`).join("");
const ROOT = new URL(".", document.currentScript.src).href;
const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
$("#clist").innerHTML = CITIES.map(c=>`<a href="${ROOT}newspaper/city/${slug(c)}/index.html">${esc(c)}</a>`).join("");
$("#hsPaper").append(opt("","Any newspaper"),...P.map(p=>opt(p.name)));
$("#hsCity").append(opt("","Any city"),...CITIES.map(c=>opt(c)));
$("#fCat").append(...CATS.map(c=>opt(c)));
$("#fCity").append(...CITIES.map(c=>opt(c)));
$("#fCity").value = "Mumbai";

let lang = "All";
function renderPapers(){
 const list = P.filter(p=>lang==="All"||p.lang===lang);
 $("#langs").innerHTML = ["All",...LANGS].map(l=>`<button class="chip" aria-pressed="${l===lang}" data-lang="${l}">${l}</button>`).join("");
 $("#plist").innerHTML = list.map(p=>`<div class="pitem"><div><strong>${esc(p.name)}</strong><small>${p.lang} · ${p.cities.length} editions · from ${inr(p.word)}/word</small></div><button class="btn sm" data-paper="${esc(p.name)}">Book</button></div>`).join("");
 $("#pcount").textContent = `${P.length} newspapers in ${LANGS.length} languages (sample list)`;
}
renderPapers();
$("#langs").addEventListener("click",e=>{const b=e.target.closest("[data-lang]"); if(b){lang=b.dataset.lang; renderPapers();}});

function runFinder(){
 const cat=$("#fCat").value, city=$("#fCity").value, t=$("#fType").value;
 const rows = P.filter(p=>p.cities.includes(city)).map(p=>({p, q:quote({paper:p.name,cat,type:t,text:"w ".repeat(25),enh:[],dates:[1],w:4,h:5,color:false})})).sort((a,b)=>a.q.sub-b.q.sub);
 $("#fRes").innerHTML = rows.length ? rows.map(({p,q})=>`<tr><td>${esc(p.name)}</td><td>${p.lang}</td><td class="num">${q.unitLbl}</td><td class="num"><b>${inr(q.sub)}</b></td><td><button class="btn sm primary" data-paper="${esc(p.name)}" data-city="${esc(city)}" data-cat="${esc(cat)}" data-type="${t}">Book</button></td></tr>`).join("")
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
 ["PROPERTY","2BHK on rent, Baner","Semi-furnished, 940 sq ft, 6th floor, covered parking. Walk to the IT park. Rs 32,000/month, family preferred. Owner: 98220 41736."],
 ["NAME CHANGE","Public notice","I, Kavita Ramesh Joshi, resident of Thane West, have changed my name to Kavita Anand Kulkarni for all purposes, as per affidavit dated 14 Sep."],
 ["RECRUITMENT","Site supervisors wanted","Civil diploma, 3 to 6 years on residential projects. Walk-in Saturday 10 am to 2 pm, Hinjewadi Phase 2. Carry original documents."],
 ["MATRIMONIAL","Alliance invited","For a Pune-based software engineer, 29, 5'9\", vegetarian family. Seeking an educated, working match. Biodata with photo: 99702 18564."],
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
const PKG_OFF = 0.12; // ponytail: flat indicative package discount; real offers come from the rates table
$("#rcCat").append(...CATS.map(c=>opt(c)));
$("#rcPaper").append(...P.map(p=>opt(p.name)));
const rcFill = ()=>{ const p=P.find(x=>x.name===$("#rcPaper").value); $("#rcCity").replaceChildren(...p.cities.map(c=>opt(c))); };
function rcRender(){
 const t=$("[name=rct]:checked").value, cat=$("#rcCat").value, p=P.find(x=>x.name===$("#rcPaper").value), city=$("#rcCity").value, cm=CAT_MULT[cat]||1;
 const unit = t==="ct" ? p.word*cm : p.sqcm*cm, u = t==="ct" ? "word" : "sq. cm";
 const sample = t==="ct" ? Math.max(25,p.min)*unit : 20*unit, n=p.cities.length;
 const pk = n>1 ? sample*n*(1-PKG_OFF) : 0;
 $("#rcOut").innerHTML = `<div class="muted sm">${esc(p.name)} · ${esc(city)} · ${esc(cat)}</div>
  <div class="big">${inr(unit)}<span style="font-size:18px;font-weight:500"> / ${u}</span></div>
  <div class="muted sm">${t==="ct"?`Minimum ${p.min} words`:"Minimum about 4 × 5 cm"} · + 5% GST</div>
  <table><thead><tr><th>Option</th><th>Before GST</th><th>With GST</th></tr></thead><tbody>
   <tr><td>${t==="ct"?Math.max(25,p.min)+" words":"4 × 5 cm"}, ${esc(city)} only</td><td class="num">${inr(sample)}</td><td class="num">${inr(sample*1.05)}</td></tr>
   ${n>1?`<tr><td>All ${n} editions <span class="off">${PKG_OFF*100}% OFF</span></td><td class="num">${inr(pk)}</td><td class="num">${inr(pk*1.05)}</td></tr>`:""}
  </tbody></table>
  <button class="btn primary" style="width:100%;margin-top:18px" data-paper="${esc(p.name)}" data-city="${esc(city)}" data-cat="${esc(cat)}" data-type="${t}">Book this ad <svg class="i"><use href="#i-arrow"/></svg></button>
  <p class="muted sm" style="margin:10px 0 0">Indicative rate. The final rate is confirmed at checkout.</p>`;
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
const STEPS = ["Newspaper","Compose","Dates","Details & pay"];
let S, step = 0, viewMonth;
function fresh(pre={}){ return Object.assign({type:"ct",cat:"",items:[],dates:[],text:"",enh:[],w:4,h:5,color:false,file:"",name:"",phone:"",email:"",gstin:"",terms:false,id:"",_lang:"",_cityF:"",_open:""}, pre); }
const minDate = ()=>{const d=new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()+CUTOFF_DAYS+(new Date().getHours()>=17?1:0)); return d;};
const iso = d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const fmt = s=>new Date(s+"T00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",weekday:"short"});
const key = it=>it.paper+"|"+it.city;
const saveDraft = ()=>{ if(step<4) store.set("a2r_draft",{S:{...S,file:""},step}); };

function validate(){
 const e = {};
 if (step===0){ if(!S.cat) e.cat="Choose a category."; else if(!S.items.length) e.items="Pick a newspaper, then tick at least one edition."; }
 if (step===1){
  if (S.type==="ct"){ if(wordCount(S.text)<3) e.text="Write your ad. It needs at least a few words."; }
  else { if(!(S.w>=2&&S.w<=33)) e.w="Width must be 2 to 33 cm."; if(!(S.h>=2&&S.h<=52)) e.h="Height must be 2 to 52 cm."; if(!S.file&&wordCount(S.text)<3) e.file="Upload your artwork, or describe the ad so our desk can design it."; }
 }
 if (step===2 && !S.dates.length) e.dates="Pick at least one publishing date.";
 if (step===3){
  if (S.name.trim().length<2) e.name="Enter your full name.";
  if (!/^[6-9]\d{9}$/.test(S.phone)) e.phone="Enter a 10-digit Indian mobile number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(S.email)) e.email="Enter a valid email address.";
  if (S.gstin && !/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(S.gstin)) e.gstin="This GSTIN format looks wrong (15 characters).";
  if (!S.terms) e.terms="Please accept the terms to continue.";
 }
 return e;
}
const F = (id,label,html,hint="")=>`<label class="f" for="${id}">${label}</label>${html}${hint?`<p class="hint">${hint}</p>`:""}<p class="err" id="e-${id}"></p>`;
const rateOf = x => S.type==="ct" ? inr(x.word)+"/word" : inr(x.sqcm*(S.type==="da"?DA_MULT:1))+"/sq. cm";

function stepHTML(){
 switch(step){
 case 0: { const open = P.find(x=>x.name===S._open);
  const list = P.filter(x=>(!S._lang||x.lang===S._lang)&&(!S._cityF||x.cities.includes(S._cityF)));
  return `<h3>Choose newspapers and editions</h3>
  <div class="seg" role="group" aria-label="Ad format">${Object.entries(TYPES).map(([k,t])=>`<button class="segb" aria-pressed="${S.type===k}" data-set="type" data-v="${k}"><svg class="i"><use href="#${t.ico}"/></svg>${t.n}</button>`).join("")}</div>
  <div class="r3" style="margin-top:4px">
   <div>${F("cat","Category",`<select id="cat"><option value="">Choose category</option>${CATS.map(c=>`<option ${S.cat===c?"selected":""}>${esc(c)}</option>`).join("")}</select>`)}</div>
   <div>${F("wLang","Language",`<select id="wLang"><option value="">All languages</option>${LANGS.map(l=>`<option ${S._lang===l?"selected":""}>${l}</option>`).join("")}</select>`)}</div>
   <div>${F("wCityF","City",`<select id="wCityF"><option value="">All cities</option>${CITIES.map(c=>`<option ${S._cityF===c?"selected":""}>${c}</option>`).join("")}</select>`)}</div>
  </div>
  ${S.items.length?`<div class="selchips">${S.items.map(it=>`<span class="selchip">${esc(it.paper)} · ${esc(it.city)}<button data-rm="${esc(key(it))}" aria-label="Remove ${esc(it.paper)} ${esc(it.city)}"><svg class="i"><use href="#i-x"/></svg></button></span>`).join("")}</div>`:""}
  <p class="err" id="e-items"></p>
  <div class="pick">${list.map(x=>{const c=S.items.filter(i=>i.paper===x.name).length; return `<button class="opt" aria-pressed="${S._open===x.name}" aria-expanded="${S._open===x.name}" data-open-paper="${esc(x.name)}"><strong>${esc(x.name)}</strong><small>${x.lang} · ${x.cities.length} editions · from ${rateOf(x)}</small>${c?`<small style="color:var(--accent);font-weight:600">${c} selected</small>`:""}</button>`}).join("")||`<p class="muted">No newspapers match these filters. Clear a filter to see more.</p>`}</div>
  ${open?`<div class="eds"><strong>${esc(open.name)}: tick the editions to publish in</strong><div class="checks" style="margin-top:10px">${open.cities.map(c=>`<label><input type="checkbox" data-ed="${esc(c)}" ${S.items.some(i=>i.paper===open.name&&i.city===c)?"checked":""}> ${esc(c)}</label>`).join("")}</div>
   <div style="margin-top:10px;display:flex;gap:8px"><button class="btn sm" data-all="1">All editions</button><button class="btn sm ghost" data-all="0">Clear</button></div></div>`:""}`; }
 case 1: { const mins = S.items.map(it=>P.find(x=>x.name===it.paper).min); const mn = Math.max(...mins);
  if (S.type==="ct") return `<h3>Write your ad</h3>
  ${F("text","Ad text",`<textarea id="text" maxlength="800" placeholder="e.g. TO-LET 2BHK semi-furnished, Bandra W, near station. Rs 45,000/month. Call 98xxxxxxxx">${esc(S.text)}</textarea>`,`<span id="wc">${wordCount(S.text)}</span> words. Your papers charge a minimum of ${mn} words. Phone numbers count as one word. Need help writing it? Our desk drafts and translates for free.`)}
  <label class="f">Enhancements</label><div class="checks">${ENH.map(([k,n,pc])=>`<label><input type="checkbox" data-enh="${k}" ${S.enh.includes(k)?"checked":""}> ${n} <span class="muted">+${pc}%</span></label>`).join("")}</div>
  <label class="f">Preview</label><div class="preview ${S.text?"":"empty"}" id="pv" style="color:#1c1917;${S.enh.includes("bold")?"font-weight:700;":""}${S.enh.includes("bg")?"background:#fde8e6;":""}${S.enh.includes("border")?"border:2px solid #1c1917;":""}">${S.enh.includes("tick")?"&#10003; ":""}${esc(S.text)||"Start typing to see your ad as it will print."}</div>`;
  return `<h3>Size and artwork</h3>
  <div class="row2">${F("w","Width (cm)",`<input id="w" type="number" min="2" max="33" step="1" value="${S.w}">`,"A standard column is about 4 cm")}${F("h","Height (cm)",`<input id="h" type="number" min="2" max="52" step="1" value="${S.h}">`)}</div>
  <div class="checks"><label><input type="checkbox" id="color" ${S.color?"checked":""}> Colour ad <span class="muted">+30%</span></label></div>
  ${F("file","Artwork (JPG, PNG or PDF, up to 10 MB)",`<label class="drop" style="display:block;cursor:pointer"><svg class="i"><use href="#i-upload"/></svg><br><span id="fn">${S.file?esc(S.file):"Click to upload your artwork"}</span><input id="file" type="file" accept=".jpg,.jpeg,.png,.pdf" class="sr"></label>`)}
  ${F("text","Or describe the ad and our desk designs it",`<textarea id="text" maxlength="1200" placeholder="Headline, details, contact, and any logo or colours you want">${esc(S.text)}</textarea>`)}`; }
 case 2: { const m=viewMonth, md=minDate(); const days=new Date(m.getFullYear(),m.getMonth()+1,0).getDate(); const lead=(m.getDay()+6)%7;
  let cells=["Mo","Tu","We","Th","Fr","Sa","Su"].map(d=>`<span class="dh">${d}</span>`).join("")+"<span></span>".repeat(lead);
  for(let d=1;d<=days;d++){const dt=new Date(m.getFullYear(),m.getMonth(),d), k=iso(dt); cells+=`<button data-date="${k}" ${dt<md?"disabled":""} aria-pressed="${S.dates.includes(k)}" aria-label="${fmt(k)}">${d}</button>`;}
  const canPrev = m > new Date(md.getFullYear(),md.getMonth(),1);
  return `<h3>Pick publishing dates</h3><p class="muted sm">Earliest date: ${fmt(iso(md))}. Every date you pick runs in all ${S.items.length} selected edition${S.items.length>1?"s":""}.</p>
  <div class="calhd"><button class="btn sm" data-mon="-1" ${canPrev?"":"disabled"} aria-label="Previous month"><svg class="i"><use href="#i-chevl"/></svg></button><strong>${m.toLocaleDateString("en-IN",{month:"long",year:"numeric"})}</strong><button class="btn sm" data-mon="1" aria-label="Next month"><svg class="i"><use href="#i-chev"/></svg></button></div>
  <div class="cal">${cells}</div><p class="err" id="e-dates"></p>
  ${S.dates.length?`<p class="sm"><b>Selected:</b> ${[...S.dates].sort().map(fmt).join(", ")}</p>`:""}`; }
 case 3: { const q=quoteAll(S); return `<h3>Review and pay</h3>
  <div class="tbl"><table><tbody>
  <tr><th>Format</th><td>${TYPES[S.type].n} · ${esc(S.cat)}</td><td><button class="btn sm" data-go="0">Edit</button></td></tr>
  <tr><th>Editions</th><td>${S.items.map(it=>`${esc(it.paper)}, ${esc(it.city)}`).join("<br>")}</td><td><button class="btn sm" data-go="0">Edit</button></td></tr>
  <tr><th>${S.type==="ct"?"Ad text":"Size"}</th><td>${S.type==="ct"?esc(S.text):`${S.w} × ${S.h} cm${S.color?", colour":""}${S.file?"<br>"+esc(S.file):""}`}</td><td><button class="btn sm" data-go="1">Edit</button></td></tr>
  <tr><th>Dates</th><td>${[...S.dates].sort().map(fmt).join(", ")}</td><td><button class="btn sm" data-go="2">Edit</button></td></tr>
  </tbody></table></div>
  <div class="row2">${F("name","Full name",`<input id="name" autocomplete="name" value="${esc(S.name)}">`)}${F("phone","Mobile",`<input id="phone" type="tel" inputmode="numeric" maxlength="10" autocomplete="tel-national" value="${esc(S.phone)}" placeholder="10-digit mobile">`)}</div>
  ${F("email","Email for invoice and proof",`<input id="email" type="email" autocomplete="email" value="${esc(S.email)}">`)}
  ${F("gstin","GSTIN (optional, for business invoice)",`<input id="gstin" maxlength="15" style="text-transform:uppercase" value="${esc(S.gstin)}">`)}
  <label style="display:flex;gap:10px;align-items:start;margin-top:12px;font-size:14px"><input type="checkbox" id="terms" style="width:auto;min-height:auto;margin-top:4px" ${S.terms?"checked":""}> I confirm the ad content is lawful and accept the terms, refund and privacy policies.</label><p class="err" id="e-terms"></p>
  <p class="muted sm">Total ${inr(q.total)} for ${q.n} date${q.n>1?"s":""} × ${S.items.length} edition${S.items.length>1?"s":""}. You'll pay on the secure Razorpay page with UPI, card or netbanking.</p>`; }
 case 4: return `<div class="done"><div class="skel" style="width:60px;height:60px;border-radius:50%;margin:0 auto 18px;background:linear-gradient(90deg,var(--soft),var(--accent-2),var(--soft));background-size:200% 100%"></div><span class="eyebrow">Hang on. Don't close this tab.</span><h3>Confirming your payment</h3><p class="muted">We're checking with the bank and reserving your space with the newspapers. This takes a few seconds.</p></div>`;
 case 5: return `<div class="done"><div class="ico"><svg class="i" style="stroke:#fff"><use href="#i-check"/></svg></div><h3>Booking received</h3><p class="muted">Your booking ID</p><p class="bid">${S.id}</p><p class="muted">We've sent the details to ${esc(S.email)}. Our desk verifies the ad and releases it to ${S.items.length>1?S.items.length+" editions":esc(S.items[0].paper)}. The e-paper clipping comes to you on each publishing date.</p><p class="hint">A confirmation email with your GST invoice follows shortly.</p></div>`;
 }
}
function sideHTML(){
 const q = quoteAll(S), L=(k,v)=>`<div class="ln"><span>${k}</span><b>${v}</b></div>`;
 return `<strong>Your selection</strong>
  ${L("Format",TYPES[S.type].n)}${L("Category",esc(S.cat)||"-")}
  ${S.items.length?`<hr style="border:none;border-top:1px solid var(--line)">`+(q.qs.map(x=>L(`${esc(x.paper)}<br><small>${esc(x.city)}</small>`,inr(x.q.per))).join("")):L("Editions","-")}
  ${q?`<hr style="border:none;border-top:1px solid var(--line)">${L("Total / insertion",inr(q.perGst))}${L("Dates",S.dates.length||"-")}${L("Subtotal",inr(q.sub))}${L("GST 5%",inr(q.gst))}<div class="ln tot"><span>Total</span><span>${inr(q.total)}</span></div>${step<1?`<p class="hint">Shown for a minimum-length ad. The final price is set once you write the ad.</p>`:""}`:`<p class="muted sm" style="margin-top:10px">Pick an edition to see the price.</p>`}
  <div class="help"><a href="tel:+919000000000"><svg class="i"><use href="#i-phone"/></svg>Call us</a><a href="https://wa.me/919000000000"><svg class="i"><use href="#i-mail"/></svg>WhatsApp</a></div>`;
}
function render(){
 const fin = step>=4;
 $("#prog").innerHTML = STEPS.map((s,i)=>`<span class="${i<=step?"on":""}">${i+1}. ${s}</span>`).join("");
 $("#prog").style.display = fin?"none":"";
 const q = quoteAll(S);
 $("#selbar").innerHTML = fin?"":`<span>${S.items.length?`<b>${S.items.length}</b> edition${S.items.length>1?"s":""} selected`:"No edition selected yet"}</span><span>Total / insertion <b>${q?inr(q.perGst):"-"}</b></span>`;
 const box=$("#stepBox"); box.classList.toggle("enter", box.dataset.step!==String(step)); box.dataset.step=step; box.innerHTML = stepHTML(); $("#side").innerHTML = sideHTML();
 $("#side").style.display = fin?"none":"";
 $(".wz-body").classList.toggle("solo",fin);
 $("#back").style.visibility = step===0||fin?"hidden":"visible";
 $("#next").style.display = step===4?"none":"";
 $("#next").innerHTML = step===3?`Pay ${inr(q.total)}`:step===5?"Done":`Continue<svg class="i"><use href="#i-chev"/></svg>`;
 if (step<4) history.replaceState(null,"",`#book/step-${step+1}`);
 saveDraft();
}
function showErrors(e){ $$(".err",$("#stepBox")).forEach(x=>x.textContent=""); $$("[aria-invalid]",$("#stepBox")).forEach(x=>x.removeAttribute("aria-invalid"));
 for (const [k,m] of Object.entries(e)){ const el=$("#e-"+k); if(el) el.textContent=m; $("#"+k)?.setAttribute("aria-invalid","true"); }
 const f = Object.keys(e)[0]; if (f) ($("#"+f)||$("#e-"+f))?.focus?.(); }
const refreshSide = ()=>{ $("#side").innerHTML = sideHTML(); const q=quoteAll(S); if(step===3&&q) $("#next").textContent=`Pay ${inr(q.total)}`; };

$("#stepBox").addEventListener("click",e=>{
 const t = e.target.closest("[data-set]"); if (t){ S[t.dataset.set]=t.dataset.v; if(t.dataset.set==="type") S.enh=[]; render(); return; }
 const op = e.target.closest("[data-open-paper]"); if (op){ const n=op.dataset.openPaper; S._open = S._open===n?"":n;
  const p=P.find(x=>x.name===n); if(S._open && !S.items.some(i=>i.paper===n)){ const c = p.cities.includes(S._cityF)?S._cityF:(p.cities.length===1?p.cities[0]:""); if(c) S.items.push({paper:n,city:c}); }
  render(); $(".eds")?.scrollIntoView({block:"nearest",behavior:"smooth"}); return; }
 const al = e.target.closest("[data-all]"); if (al){ const p=P.find(x=>x.name===S._open); S.items=S.items.filter(i=>i.paper!==p.name); if(al.dataset.all==="1") S.items.push(...p.cities.map(c=>({paper:p.name,city:c}))); render(); return; }
 const rm = e.target.closest("[data-rm]"); if (rm){ S.items=S.items.filter(i=>key(i)!==rm.dataset.rm); render(); return; }
 const d = e.target.closest("[data-date]"); if (d){ const k=d.dataset.date; S.dates = S.dates.includes(k)?S.dates.filter(x=>x!==k):[...S.dates,k]; render(); return; }
 const m = e.target.closest("[data-mon]"); if (m){ viewMonth.setMonth(viewMonth.getMonth()+ +m.dataset.mon); render(); return; }
 const g = e.target.closest("[data-go]"); if (g){ step=+g.dataset.go; render(); }
});
$("#stepBox").addEventListener("input",e=>{
 const t=e.target, id=t.id;
 if (id==="wLang"){S._lang=t.value; render(); return;} if (id==="wCityF"){S._cityF=t.value; render(); return;}
 if (id==="cat"){S.cat=t.value; render(); return;}
 if (t.dataset.ed){ const it={paper:S._open,city:t.dataset.ed}; S.items = t.checked?[...S.items,it]:S.items.filter(i=>key(i)!==key(it)); render(); return; }
 if (id==="text"){ S.text=t.value; const pv=$("#pv"); if(pv){ pv.textContent=(S.enh.includes("tick")?"✓ ":"")+(S.text||"Start typing to see your ad as it will print."); pv.classList.toggle("empty",!S.text);} if($("#wc")) $("#wc").textContent=wordCount(S.text); }
 if (t.dataset.enh){ S.enh = t.checked?[...S.enh,t.dataset.enh]:S.enh.filter(x=>x!==t.dataset.enh); render(); return; }
 if (id==="w"||id==="h") S[id]=+t.value;
 if (id==="color") S.color=t.checked;
 if (id==="file"){ const f=t.files[0]; if(f&&f.size>10*1024*1024){ $("#e-file").textContent="File is larger than 10 MB."; t.value=""; return;} S.file=f?f.name:""; $("#fn").textContent=S.file||"Click to upload your artwork"; }
 if (["name","email"].includes(id)) S[id]=t.value.trim();
 if (id==="phone"){ t.value=t.value.replace(/\D/g,""); S.phone=t.value; }
 if (id==="gstin"){ S.gstin=t.value.toUpperCase().trim(); }
 if (id==="terms") S.terms=t.checked;
 refreshSide(); saveDraft();
});
async function go(dir){
 if (dir>0){ const e=validate(); if(Object.keys(e).length) return showErrors(e); }
 if (step===5){ closeWizard(); return; }
 if (step===3 && dir>0){
  step=4; render(); history.replaceState(null,"","#book/processing");
  try { const id = await pay(); finishBooking(id); }
  catch (err) { step=3; render(); $("#e-terms").textContent = err.message || "Payment didn't go through. You haven't been charged. Try again."; }
  return;
 }
 step = Math.max(0,Math.min(3,step+dir)); render(); $(".wz-body").scrollTop=0;
}

/* ---------- payment: server creates the Razorpay order and verifies the signature ---------- */
const api = async (url, body) => { const r = await fetch(url,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)}); const j = await r.json().catch(()=>({})); if(!r.ok) throw new Error(j.error||"Something went wrong. Please try again."); return j; };
const loadScript = src => new Promise((ok,no)=>{ const s=document.createElement("script"); s.src=src; s.onload=ok; s.onerror=()=>no(new Error("Couldn't load the payment page. Check your connection.")); document.head.append(s); });
async function pay(){
 if (location.protocol==="file:"){ await new Promise(r=>setTimeout(r,1800)); return localDemo(); } // opened without server.js
 const o = await api("/api/order", {...S, _lang:undefined, _cityF:undefined, _open:undefined});
 if (o.demo) return o.booking_id;
 if (!window.Razorpay) await loadScript("https://checkout.razorpay.com/v1/checkout.js");
 const res = await new Promise((ok,no)=>{
  const rz = new Razorpay({ key:o.key_id, order_id:o.order_id, amount:o.amount, currency:"INR", name:"ads2realesh", description:`Booking ${o.booking_id}`, prefill:o.prefill, theme:{color:getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()},
   handler: ok, modal:{ ondismiss:()=>no(new Error("Payment cancelled. You haven't been charged.")) } });
  rz.on("payment.failed", r=>no(new Error(r.error?.description||"Payment failed. You haven't been charged.")));
  rz.open();
 });
 await api("/api/verify", {booking_id:o.booking_id, ...res});
 return o.booking_id;
}
function localDemo(){
 const id = "A2R-" + String(Math.floor(10000+Math.random()*89999)), all = store.get("a2r_bookings",{});
 all[id] = {items:S.items,dates:S.dates,total:quoteAll(S).total,status:"DEMO"}; store.set("a2r_bookings",all); return id;
}
function finishBooking(id){
 S.id=id; try{localStorage.removeItem("a2r_draft")}catch{}
 step=5; render(); history.replaceState(null,"","#book/confirmed");
}
function closeWizard(){ $("#wiz").close(); }
$("#wiz").addEventListener("close",()=>history.replaceState(null,"",location.pathname+location.search));
$("#wiz").addEventListener("cancel",e=>{ if(step===4) e.preventDefault(); });
$("#next").onclick=()=>go(1); $("#back").onclick=()=>go(-1); $("#wzClose").onclick=()=>{ if(step!==4) closeWizard(); };

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
 const want = Math.min(3, (+(location.hash.match(/step-(\d)/)||[])[1]||1)-1);
 step = 0; while(step<want && !Object.keys(validate()).length) step++;
 render(); $("#wiz").showModal();
}

/* track + login */
$("#trForm").addEventListener("submit",async e=>{ e.preventDefault(); const id=$("#trId").value.trim().toUpperCase();
 let b=null; try{ const r=await fetch("/api/booking/"+encodeURIComponent(id)); if(r.ok) b=await r.json(); }catch{}
 b = b || store.get("a2r_bookings",{})[id];
 const label={CREATED:"Awaiting payment",PAID:"Paid. Our desk is reviewing your ad.",DEMO:"Demo booking"};
 $("#trErr").textContent = b?"":"We couldn't find that booking ID. Check it, or call +91 90000 00000.";
 $("#trOut").innerHTML = b?`<div class="box" style="margin-top:8px"><strong>${esc(id)}</strong><p class="muted sm" style="margin:6px 0 0">${(b.items||[]).map(i=>esc(i.paper)+", "+esc(i.city)).join("; ")} · ${b.dates.map(fmt).join(", ")}<br>${inr(b.total)} · ${esc(label[b.status]||b.status)}</p></div>`:""; });

/* ---------- display ad sizes (newspaper-display-booking.html) ---------- */
const SIZES = [["Small strip","8 × 5 cm",8,5],["Quarter column","8 × 12 cm",8,12],["Eighth page","16 × 13 cm",16,13],["Quarter page","16 × 25 cm",16,25],["Half page","33 × 25 cm",33,25],["Full page","33 × 50 cm",33,50]];
if (document.getElementById("dsPaper")){
 const DP=P.filter(p=>p.sqcm); $("#dsPaper").append(...DP.map(p=>opt(p.name)));
 const fillDs=()=>{ const p=P.find(x=>x.name===$("#dsPaper").value); $("#dsCity").replaceChildren(...p.cities.map(c=>opt(c))); };
 const drawDs=()=>{ const p=$("#dsPaper").value, city=$("#dsCity").value, col=$("#dsColor").checked;
  $("#dsTable").innerHTML = SIZES.map(([n,lbl,w,h],i)=>{ const q=quote({paper:p,cat:"Business",type:"da",text:"",enh:[],dates:[1],w,h,color:col});
   return `<tr style="--d:${i}"><td><b>${n}</b><br><small class="muted">${lbl}</small></td><td class="num">${inr(q.sub)}</td><td class="num">${inr(q.total)}</td><td><button class="btn sm primary" data-book="da" data-paper="${esc(p)}" data-city="${esc(city)}" data-cat="Business">Get a quote</button></td></tr>`; }).join("");
 };
 $("#dsPaper").addEventListener("change",()=>{fillDs();drawDs();}); $("#dsCity").addEventListener("change",drawDs); $("#dsColor").addEventListener("change",drawDs);
 fillDs(); drawDs();
}

/* ---------- sign in with mobile OTP (my/sign-in.html) ---------- */
if (document.getElementById("siForm")){
 let sent=false;
 $("#siForm").addEventListener("submit",e=>{ e.preventDefault();
  const ph=$("#siPhone").value.replace(/\D/g,""), err=$("#siErr");
  if(!sent){ if(!/^[6-9]\d{9}$/.test(ph)){ err.textContent="Enter a valid 10-digit mobile number."; $("#siPhone").setAttribute("aria-invalid","true"); return; }
   sent=true; err.textContent=""; $("#siPhone").removeAttribute("aria-invalid"); $("#siPhone").readOnly=true; $("#siOtpWrap").hidden=false; $("#siOtp").focus(); $("#siBtn").textContent="Verify and sign in";
   $("#siNote").textContent=`We've sent a 6-digit code to +91 ${ph}.`; return; }
  if(!/^\d{6}$/.test($("#siOtp").value)){ err.textContent="Enter the 6-digit code from the SMS."; $("#siOtp").setAttribute("aria-invalid","true"); return; }
  // ponytail: OTP send/verify needs an SMS provider on server.js; until then this only shows bookings made in this browser
  const all=store.get("a2r_bookings",{}), ids=Object.keys(all);
  $("#siForm").hidden=true; $("#siOut").hidden=false;
  $("#siList").innerHTML = ids.length ? ids.map(id=>{const b=all[id]; return `<div class="pitem"><div><strong>${esc(id)}</strong><small>${(b.items||[]).map(i=>esc(i.paper)+", "+esc(i.city)).join("; ")}</small><small>${b.dates.map(fmt).join(", ")}</small></div><b>${inr(b.total)}</b></div>`}).join("")
   : `<div class="box" style="text-align:center"><h3>No bookings yet</h3><p class="muted">Your newspaper ads will appear here after you book.</p><button class="btn primary" data-book>Book an ad</button></div>`;
 });
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
