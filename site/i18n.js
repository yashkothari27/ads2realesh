/* Site language: English (source), Hindi, Gujarati.
   ponytail: phrase dictionary applied to text nodes; anything not listed stays English.
   Upgrade path: generate /hi/ and /gu/ copies of each page in build.js if Hindi/Gujarati search ranking matters. */
(() => {
const T = {
"India's newspaper ad booking desk. Classified, display and legal notices.": ["भारत का अख़बार विज्ञापन बुकिंग डेस्क। क्लासिफ़ाइड, डिस्प्ले और कानूनी सूचनाएँ।", "ભારતનું અખબાર જાહેરાત બુકિંગ ડેસ્ક. ક્લાસિફાઇડ, ડિસ્પ્લે અને કાનૂની નોટિસ."],
"Track booking": ["बुकिंग ट्रैक करें", "બુકિંગ ટ્રેક કરો"],
"Sign in": ["साइन इन", "સાઇન ઇન"],
"Classified": ["क्लासिफ़ाइड", "ક્લાસિફાઇડ"],
"Rates & offers": ["दरें और ऑफ़र", "દરો અને ઑફર"],
"Display ads": ["डिस्प्ले विज्ञापन", "ડિસ્પ્લે જાહેરાત"],
"Newspaper decider": ["अख़बार चुनें", "અખબાર પસંદ કરો"],
"FAQ": ["सवाल-जवाब", "પ્રશ્નોત્તરી"],
"Book ad": ["विज्ञापन बुक करें", "જાહેરાત બુક કરો"],
"Newspaper advertising, sorted": ["अख़बार विज्ञापन, अब आसान", "અખબાર જાહેરાત, હવે સરળ"],
"Your ad in tomorrow's paper,": ["आपका विज्ञापन कल के अख़बार में,", "તમારી જાહેરાત આવતીકાલના અખબારમાં,"],
"booked tonight.": ["आज रात बुक करें।", "આજે રાત્રે બુક કરો."],
"Classified, display and public notice ads in 100+ newspapers across 14 languages. See the exact rate, approve your draft, pay online, and get the published clipping by email.": ["14 भाषाओं के 100+ अख़बारों में क्लासिफ़ाइड, डिस्प्ले और सार्वजनिक सूचना विज्ञापन। सही दर देखें, ड्राफ़्ट मंज़ूर करें, ऑनलाइन भुगतान करें और छपी हुई कटिंग ईमेल पर पाएँ।", "14 ભાષાનાં 100+ અખબારોમાં ક્લાસિફાઇડ, ડિસ્પ્લે અને જાહેર નોટિસ જાહેરાત. ચોક્કસ દર જુઓ, ડ્રાફ્ટ મંજૂર કરો, ઑનલાઇન ચુકવણી કરો અને છપાયેલું કટિંગ ઈમેલ પર મેળવો."],
"See rates": ["दरें देखें", "દરો જુઓ"],
"Newspaper card rates": ["अख़बार की कार्ड दरें", "અખબારના કાર્ડ દરો"],
"Free drafting and translation": ["मुफ़्त ड्राफ़्टिंग और अनुवाद", "મફત ડ્રાફ્ટિંગ અને અનુવાદ"],
"GST invoice": ["GST बिल", "GST બિલ"],
"GST invoice on every order": ["हर ऑर्डर पर GST बिल", "દરેક ઑર્ડર પર GST બિલ"],
"Any newspaper": ["कोई भी अख़बार", "કોઈપણ અખબાર"],
"Any city": ["कोई भी शहर", "કોઈપણ શહેર"],
"Book in 100+ newspapers, national and regional": ["100+ राष्ट्रीय और क्षेत्रीय अख़बारों में बुक करें", "100+ રાષ્ટ્રીય અને પ્રાદેશિક અખબારોમાં બુક કરો"],
"Start by category": ["श्रेणी से शुरू करें", "કેટેગરીથી શરૂ કરો"],
"What do you want to announce?": ["आप क्या घोषित करना चाहते हैं?", "તમે શું જાહેર કરવા માંગો છો?"],
"Pick a category and we'll show the newspapers and page sections that suit it.": ["श्रेणी चुनें, हम उसके लिए सही अख़बार और पन्ने दिखाएँगे।", "કેટેગરી પસંદ કરો, અમે તેના માટે યોગ્ય અખબાર અને પાનાં બતાવીશું."],
// categories
"Name change": ["नाम परिवर्तन", "નામ ફેરફાર"],
"Matrimonial": ["वैवाहिक", "લગ્નવિષયક"],
"Property": ["प्रॉपर्टी", "પ્રોપર્ટી"],
"Recruitment": ["भर्ती", "ભરતી"],
"Obituary": ["शोक संदेश", "શોક સંદેશ"],
"Remembrance": ["श्रद्धांजलि", "શ્રદ્ધાંજલિ"],
"Public notice": ["सार्वजनिक सूचना", "જાહેર નોટિસ"],
"Court notice": ["कोर्ट नोटिस", "કોર્ટ નોટિસ"],
"Lost and found": ["खोया-पाया", "ખોવાયેલું-મળેલું"],
"Lost documents": ["खोए दस्तावेज़", "ખોવાયેલા દસ્તાવેજ"],
"Lost share certificate": ["खोया शेयर सर्टिफ़िकेट", "ખોવાયેલું શેર સર્ટિફિકેટ"],
"Business": ["व्यापार", "વ્યવસાય"],
"Personal and greetings": ["व्यक्तिगत और शुभकामनाएँ", "વ્યક્તિગત અને શુભેચ્છા"],
"Vehicles": ["वाहन", "વાહન"],
"Education": ["शिक्षा", "શિક્ષણ"],
"Travel": ["यात्रा", "પ્રવાસ"],
"To let": ["किराए के लिए", "ભાડે આપવાનું"],
"Tenders": ["टेंडर", "ટેન્ડર"],
"Astrology": ["ज्योतिष", "જ્યોતિષ"],
"Retail": ["रिटेल", "રિટેલ"],
"Services": ["सेवाएँ", "સેવાઓ"],
"Marriage bureau": ["मैरिज ब्यूरो", "મેરેજ બ્યુરો"],
"Situation wanted": ["नौकरी चाहिए", "નોકરી જોઈએ છે"],
"Announcement": ["घोषणा", "ઘોષણા"],
"Computers": ["कंप्यूटर", "કમ્પ્યુટર"],
"Wedding services": ["शादी सेवाएँ", "લગ્ન સેવાઓ"],
// formats
"Three ad formats. Pick the one that fits.": ["तीन विज्ञापन फ़ॉर्मेट। जो सही लगे, चुनें।", "ત્રણ જાહેરાત ફોર્મેટ. તમને યોગ્ય લાગે તે પસંદ કરો."],
"Text classified": ["टेक्स्ट क्लासिफ़ाइड", "ટેક્સ્ટ ક્લાસિફાઇડ"],
"Classified text": ["क्लासिफ़ाइड टेक्स्ट", "ક્લાસિફાઇડ ટેક્સ્ટ"],
"Classified display": ["क्लासिफ़ाइड डिस्प्ले", "ક્લાસિફાઇડ ડિસ્પ્લે"],
"Display ad": ["डिस्प्ले विज्ञापन", "ડિસ્પ્લે જાહેરાત"],
"Book this ad": ["यह विज्ञापन बुक करें", "આ જાહેરાત બુક કરો"],
"Get a quote": ["कोटेशन पाएँ", "ક્વોટ મેળવો"],
"CHARGED": ["शुल्क", "ચાર્જ"],
"PRINTS": ["कहाँ छपेगा", "ક્યાં છપાશે"],
"BEST FOR": ["किसके लिए", "કોના માટે"],
"Most booked": ["सबसे ज़्यादा बुक", "સૌથી વધુ બુક"],
"Sample layout": ["नमूना लेआउट", "નમૂના લેઆઉટ"],
"LOWEST COST": ["सबसे कम कीमत", "સૌથી ઓછી કિંમત"],
"BEST VALUE": ["सबसे अच्छा मूल्य", "શ્રેષ્ઠ મૂલ્ય"],
"BRAND CAMPAIGNS": ["ब्रांड अभियान", "બ્રાન્ડ ઝુંબેશ"],
"Just words, nothing more": ["सिर्फ़ शब्द, और कुछ नहीं", "ફક્ત શબ્દો, બીજું કંઈ નહીં"],
"Words plus a logo or photo": ["शब्द के साथ लोगो या फ़ोटो", "શબ્દો સાથે લોગો કે ફોટો"],
"Big, designed, high impact": ["बड़ा, डिज़ाइन किया हुआ, असरदार", "મોટી, ડિઝાઇન કરેલી, અસરકારક"],
// rates
"Rate finder": ["दर खोजें", "દર શોધો"],
"Which newspaper fits your budget?": ["आपके बजट में कौन सा अख़बार?", "તમારા બજેટમાં કયું અખબાર?"],
"Find papers": ["अख़बार खोजें", "અખબાર શોધો"],
"Newspaper": ["अख़बार", "અખબાર"],
"Language": ["भाषा", "ભાષા"],
"Rate": ["दर", "દર"],
"Estimated cost": ["अनुमानित खर्च", "અંદાજિત ખર્ચ"],
"Book": ["बुक करें", "બુક કરો"],
"Pricing explained": ["कीमत की जानकारी", "કિંમતની માહિતી"],
"What will my newspaper ad cost?": ["मेरे अख़बार विज्ञापन का खर्च कितना होगा?", "મારી અખબાર જાહેરાતનો ખર્ચ કેટલો થશે?"],
"Publishing timeline": ["प्रकाशन समय", "પ્રકાશન સમય"],
"How early do I need to book?": ["मुझे कितना पहले बुक करना होगा?", "મારે કેટલું વહેલું બુક કરવું પડશે?"],
"Newspaper and edition": ["अख़बार और संस्करण", "અખબાર અને આવૃત્તિ"],
"Length or size": ["लंबाई या आकार", "લંબાઈ અથવા કદ"],
"Day, page and colour": ["दिन, पन्ना और रंग", "દિવસ, પાનું અને રંગ"],
"Choose your own date": ["अपनी तारीख़ चुनें", "તમારી તારીખ પસંદ કરો"],
"Sunday papers": ["रविवार के अख़बार", "રવિવારનાં અખબાર"],
"Running late?": ["देर हो रही है?", "મોડું થઈ રહ્યું છે?"],
"By line / word": ["लाइन / शब्द के हिसाब से", "લાઇન / શબ્દ પ્રમાણે"],
"By sq. cm": ["वर्ग सेमी के हिसाब से", "ચો. સેમી પ્રમાણે"],
"On quote": ["कोटेशन पर", "ક્વોટ પર"],
"Rates and offers": ["दरें और ऑफ़र", "દરો અને ઑફર"],
"Get the rate for your ad": ["अपने विज्ञापन की दर पाएँ", "તમારી જાહેરાતનો દર મેળવો"],
"Ad format": ["विज्ञापन फ़ॉर्मेट", "જાહેરાત ફોર્મેટ"],
"Category, newspaper and edition": ["श्रेणी, अख़बार और संस्करण", "કેટેગરી, અખબાર અને આવૃત્તિ"],
"Your rate": ["आपकी दर", "તમારો દર"],
// how, notices, why
"How to book": ["कैसे बुक करें", "કેવી રીતે બુક કરવું"],
"Seven steps, about five minutes": ["सात कदम, लगभग पाँच मिनट", "સાત પગલાં, લગભગ પાંચ મિનિટ"],
"Start booking": ["बुकिंग शुरू करें", "બુકિંગ શરૂ કરો"],
"Ad type": ["विज्ञापन प्रकार", "જાહેરાત પ્રકાર"],
"Category": ["श्रेणी", "કેટેગરી"],
"Dates": ["तारीख़ें", "તારીખો"],
"Compose": ["लिखें", "લખો"],
"Review": ["जाँचें", "ચકાસો"],
"Pay": ["भुगतान", "ચુકવણી"],
"Statutory and legal notices": ["वैधानिक और कानूनी सूचनाएँ", "વૈધાનિક અને કાનૂની નોટિસ"],
"Notices that must appear in print": ["जो सूचनाएँ छपना ज़रूरी है", "જે નોટિસ છાપવી જરૂરી છે"],
"Company": ["कंपनी", "કંપની"],
"Share": ["शेयर", "શેર"],
"Recovery": ["वसूली", "વસૂલાત"],
"Why book with us": ["हमसे क्यों बुक करें", "અમારી સાથે કેમ બુક કરવું"],
"One desk for every newspaper": ["हर अख़बार के लिए एक डेस्क", "દરેક અખબાર માટે એક ડેસ્ક"],
"Card rates": ["कार्ड दरें", "કાર્ડ દરો"],
"One booking, many papers": ["एक बुकिंग, कई अख़बार", "એક બુકિંગ, અનેક અખબાર"],
"Free drafting": ["मुफ़्त ड्राफ़्टिंग", "મફત ડ્રાફ્ટિંગ"],
"Proof of publication": ["प्रकाशन का प्रमाण", "પ્રકાશનનો પુરાવો"],
// newspapers, cities, faq, support, footer
"Browse newspapers": ["अख़बार देखें", "અખબાર જુઓ"],
"Book by newspaper": ["अख़बार के हिसाब से बुक करें", "અખબાર પ્રમાણે બુક કરો"],
"All": ["सभी", "બધાં"],
"English dailies": ["अंग्रेज़ी दैनिक", "અંગ્રેજી દૈનિક"],
"Browse cities": ["शहर देखें", "શહેર જુઓ"],
"Book by city": ["शहर के हिसाब से बुक करें", "શહેર પ્રમાણે બુક કરો"],
"Questions before you book": ["बुक करने से पहले सवाल", "બુક કરતાં પહેલાં પ્રશ્નો"],
"Basics": ["बुनियादी बातें", "મૂળભૂત વાતો"],
"Classified ads": ["क्लासिफ़ाइड विज्ञापन", "ક્લાસિફાઇડ જાહેરાત"],
"Booking and payment": ["बुकिंग और भुगतान", "બુકિંગ અને ચુકવણી"],
"Need help?": ["मदद चाहिए?", "મદદ જોઈએ છે?"],
"Talk to the booking desk": ["बुकिंग डेस्क से बात करें", "બુકિંગ ડેસ્ક સાથે વાત કરો"],
"Call": ["कॉल करें", "કૉલ કરો"],
"Email": ["ईमेल", "ઈમેલ"],
"Categories": ["श्रेणियाँ", "કેટેગરીઓ"],
"Newspapers": ["अख़बार", "અખબારો"],
"Ad types": ["विज्ञापन प्रकार", "જાહેરાત પ્રકાર"],
"Rates": ["दरें", "દરો"],
"Legal notices": ["कानूनी सूचनाएँ", "કાનૂની નોટિસ"],
"About us": ["हमारे बारे में", "અમારા વિશે"],
"Contact": ["संपर्क", "સંપર્ક"],
"Privacy policy": ["गोपनीयता नीति", "ગોપનીયતા નીતિ"],
"Refund policy": ["रिफ़ंड नीति", "રિફંડ નીતિ"],
"Terms and conditions": ["नियम और शर्तें", "નિયમો અને શરતો"],
"Agency program": ["एजेंसी प्रोग्राम", "એજન્સી પ્રોગ્રામ"],
"Sitemap": ["साइटमैप", "સાઇટમેપ"],
// booking flow
"Book your newspaper ad": ["अपना अख़बार विज्ञापन बुक करें", "તમારી અખબાર જાહેરાત બુક કરો"],
"1. Newspaper": ["1. अख़बार", "1. અખબાર"],
"2. Compose": ["2. विज्ञापन लिखें", "2. જાહેરાત લખો"],
"3. Dates": ["3. तारीख़ें", "3. તારીખો"],
"4. Details & pay": ["4. विवरण और भुगतान", "4. વિગતો અને ચુકવણી"],
"Choose newspapers and editions": ["अख़बार और संस्करण चुनें", "અખબાર અને આવૃત્તિ પસંદ કરો"],
"City": ["शहर", "શહેર"],
"Choose category": ["श्रेणी चुनें", "કેટેગરી પસંદ કરો"],
"All languages": ["सभी भाषाएँ", "બધી ભાષાઓ"],
"All cities": ["सभी शहर", "બધાં શહેર"],
"Continue": ["आगे बढ़ें", "આગળ વધો"],
"Back": ["पीछे", "પાછળ"],
"Your selection": ["आपका चयन", "તમારી પસંદગી"],
"Format": ["फ़ॉर्मेट", "ફોર્મેટ"],
"Editions": ["संस्करण", "આવૃત્તિઓ"],
"Total / insertion": ["कुल / प्रति प्रकाशन", "કુલ / પ્રતિ પ્રકાશન"],
"Subtotal": ["उप-योग", "પેટા સરવાળો"],
"Total": ["कुल", "કુલ"],
"Call us": ["कॉल करें", "કૉલ કરો"],
"Write your ad": ["अपना विज्ञापन लिखें", "તમારી જાહેરાત લખો"],
"Size and artwork": ["आकार और आर्टवर्क", "કદ અને આર્ટવર્ક"],
"Ad text": ["विज्ञापन का पाठ", "જાહેરાતનું લખાણ"],
"Enhancements": ["अतिरिक्त विकल्प", "વધારાના વિકલ્પો"],
"Bold text": ["बोल्ड अक्षर", "બોલ્ડ અક્ષર"],
"Tick mark": ["टिक निशान", "ટિક નિશાની"],
"Background colour": ["बैकग्राउंड रंग", "બેકગ્રાઉન્ડ રંગ"],
"Border": ["बॉर्डर", "બોર્ડર"],
"Preview": ["पूर्वावलोकन", "પૂર્વાવલોકન"],
"Pick publishing dates": ["प्रकाशन की तारीख़ें चुनें", "પ્રકાશનની તારીખો પસંદ કરો"],
"Review and pay": ["जाँचें और भुगतान करें", "ચકાસો અને ચુકવણી કરો"],
"Full name": ["पूरा नाम", "પૂરું નામ"],
"Mobile": ["मोबाइल", "મોબાઇલ"],
"Email for invoice and proof": ["बिल और प्रमाण के लिए ईमेल", "બિલ અને પુરાવા માટે ઈમેલ"],
"No edition selected yet": ["अभी कोई संस्करण नहीं चुना", "હજી કોઈ આવૃત્તિ પસંદ નથી"],
"Pick an edition to see the price.": ["कीमत देखने के लिए संस्करण चुनें।", "કિંમત જોવા માટે આવૃત્તિ પસંદ કરો."],
"Booking received": ["बुकिंग मिल गई", "બુકિંગ મળી ગયું"],
"Your booking ID": ["आपकी बुकिंग ID", "તમારું બુકિંગ ID"],
"Done": ["हो गया", "થઈ ગયું"],
"Edit": ["बदलें", "બદલો"],
// inner pages
"Home": ["होम", "હોમ"],
"Compare rates": ["दरों की तुलना करें", "દરોની તુલના કરો"],
"How the price is worked out": ["कीमत कैसे तय होती है", "કિંમત કેવી રીતે નક્કી થાય છે"],
"Offers": ["ऑफ़र", "ઑફર"],
"Lowest price": ["सबसे कम कीमत", "સૌથી ઓછી કિંમત"],
"English first": ["पहले अंग्रेज़ी", "પહેલાં અંગ્રેજી"],
"Manage your booking": ["अपनी बुकिंग देखें", "તમારું બુકિંગ મેનેજ કરો"],
"Find my booking": ["मेरी बुकिंग खोजें", "મારું બુકિંગ શોધો"],
"Email me a code": ["मुझे कोड ईमेल करें", "મને કોડ ઈમેલ કરો"],
"Send me a code": ["कोड भेजें", "કોડ મોકલો"],
"Ad ID": ["विज्ञापन ID", "જાહેરાત ID"],
"Email address": ["ईमेल पता", "ઈમેલ સરનામું"],
"Email used while booking": ["बुकिंग के समय का ईमेल", "બુકિંગ વખતનો ઈમેલ"],
"Your bookings": ["आपकी बुकिंग", "તમારાં બુકિંગ"],
"Invoice": ["बिल", "બિલ"],
"Change date": ["तारीख़ बदलें", "તારીખ બદલો"],
"Send documents": ["दस्तावेज़ भेजें", "દસ્તાવેજ મોકલો"],
"Pay now": ["अभी भुगतान करें", "હમણાં ચુકવણી કરો"],
"Book a classified": ["क्लासिफ़ाइड बुक करें", "ક્લાસિફાઇડ બુક કરો"],
"Get your rate": ["अपनी दर पाएँ", "તમારો દર મેળવો"],
"Get my rate": ["मेरी दर पाएँ", "મારો દર મેળવો"],
"Popular searches": ["लोकप्रिय खोजें", "લોકપ્રિય શોધ"],
};
const LANG_NAMES = { English: ["अंग्रेज़ी", "અંગ્રેજી"], Hindi: ["हिंदी", "હિન્દી"], Marathi: ["मराठी", "મરાઠી"], Gujarati: ["गुजराती", "ગુજરાતી"], Bengali: ["बंगाली", "બંગાળી"], Tamil: ["तमिल", "તમિલ"], Telugu: ["तेलुगु", "તેલુગુ"], Kannada: ["कन्नड़", "કન્નડ"], Malayalam: ["मलयालम", "મલયાલમ"], Odia: ["ओड़िया", "ઓડિયા"], Punjabi: ["पंजाबी", "પંજાબી"], Assamese: ["असमिया", "આસામી"], Urdu: ["उर्दू", "ઉર્દૂ"] };
for (const [en, [hi, gu]] of Object.entries(LANG_NAMES)) { T[en] = [hi, gu]; T[en + " papers"] = [hi + " अख़बार", gu + " અખબાર"]; }
const CITY = window.A2R_CITY || {};
Object.assign(T, CITY, window.A2R_T || {});

let lang = new URLSearchParams(location.search).get("lang"); // ?lang=hi links open in that language
try { if (lang) localStorage.setItem("a2r_lang", lang); else lang = localStorage.getItem("a2r_lang") || "en"; } catch { lang = lang || "en"; }
if (!["en", "hi", "gu"].includes(lang)) lang = "en";
const col = { hi: 0, gu: 1 }[lang];
document.documentElement.lang = lang;

// generated sentences (city and category pages, counts, prices) are matched by pattern
const CATL = {}; for (const k of Object.keys(T)) CATL[k.toLowerCase()] = T[k];
const C = x => (CITY[x] || [x, x])[col];                       // city
const K = x => (CATL[x.toLowerCase()] || [x, x])[col];         // category, any case
const L = x => (LANG_NAMES[x] || [x, x])[col];                 // language
const P = [
 [/^(.+) Ads in (.+) Newspapers: Rates and Booking$/, m => [`${C(m[2])} के अख़बारों में ${K(m[1])} विज्ञापन: दरें और बुकिंग`, `${C(m[2])}નાં અખબારોમાં ${K(m[1])} જાહેરાત: દરો અને બુકિંગ`]],
 [/^Newspaper Ads in (.+): Rates and Booking$/, m => [`${C(m[1])} में अख़बार विज्ञापन: दरें और बुकिंग`, `${C(m[1])}માં અખબાર જાહેરાત: દરો અને બુકિંગ`]],
 [/^(.+) ads in (.+) newspapers$/, m => [`${C(m[2])} के अख़बारों में ${K(m[1])} विज्ञापन`, `${C(m[2])}નાં અખબારોમાં ${K(m[1])} જાહેરાત`]],
 [/^Book a (.+) ad in any of (\d+) papers with a (.+) edition\. We write it, translate it and email you the published clipping\.$/, m => [`${C(m[3])} संस्करण वाले ${m[2]} अख़बारों में से किसी में भी ${K(m[1])} विज्ञापन बुक करें। हम इसे लिखते हैं, अनुवाद करते हैं और छपी कटिंग ईमेल करते हैं।`, `${C(m[3])} આવૃત્તિ ધરાવતાં ${m[2]} અખબારોમાંથી કોઈપણમાં ${K(m[1])} જાહેરાત બુક કરો. અમે તે લખીએ છીએ, અનુવાદ કરીએ છીએ અને છપાયેલું કટિંગ ઈમેલ કરીએ છીએ.`]],
 [/^Free drafting for your (.+) ad\.$/, m => [`आपके ${K(m[1])} विज्ञापन की मुफ़्त ड्राफ़्टिंग।`, `તમારી ${K(m[1])} જાહેરાતનું મફત ડ્રાફ્ટિંગ.`]],
 [/^Before you book a (.+) ad$/, m => [`${K(m[1])} विज्ञापन बुक करने से पहले`, `${K(m[1])} જાહેરાત બુક કરતાં પહેલાં`]],
 [/^Book an ad in (.+)$/, m => [`${C(m[1])} में विज्ञापन बुक करें`, `${C(m[1])}માં જાહેરાત બુક કરો`]],
 [/^Book a (.+) ad$/, m => [`${K(m[1])} विज्ञापन बुक करें`, `${K(m[1])} જાહેરાત બુક કરો`]],
 [/^(.+) ad rates in (.+)$/, m => [`${C(m[2])} में ${K(m[1])} विज्ञापन दरें`, `${C(m[2])}માં ${K(m[1])} જાહેરાતના દરો`]],
 [/^set by the newspaper for its (.+) edition\.$/, m => [`अख़बार अपने ${C(m[1])} संस्करण के लिए तय करता है।`, `અખબાર તેની ${C(m[1])} આવૃત્તિ માટે નક્કી કરે છે.`]],
 [/^Run the same ad in an English and a regional (.+) paper in one order and pay once\.$/, m => [`एक ही विज्ञापन ${C(m[1])} के एक अंग्रेज़ी और एक क्षेत्रीय अख़बार में, एक ऑर्डर में चलाएँ और एक बार भुगतान करें।`, `એક જ જાહેરાત ${C(m[1])}ના એક અંગ્રેજી અને એક પ્રાદેશિક અખબારમાં, એક ઑર્ડરમાં ચલાવો અને એક જ વાર ચુકવણી કરો.`]],
 [/^Pick several (.+) newspapers in the booking form and they share one payment, one invoice and one set of dates\. Not sure which to choose\? Call us and we'll suggest the best mix for your budget\.$/, m => [`बुकिंग फ़ॉर्म में ${C(m[1])} के कई अख़बार चुनें, सबका एक भुगतान, एक बिल और एक जैसी तारीख़ें होंगी। तय नहीं कर पा रहे? हमें कॉल करें, हम आपके बजट के हिसाब से सही अख़बार सुझाएँगे।`, `બુકિંગ ફોર્મમાં ${C(m[1])}નાં અનેક અખબાર પસંદ કરો, બધાંની એક ચુકવણી, એક બિલ અને એક જ તારીખો રહેશે. નક્કી નથી કરી શકતા? અમને કૉલ કરો, અમે તમારા બજેટ પ્રમાણે યોગ્ય અખબાર સૂચવીશું.`]],
 [/^(.+) ads in (.+): questions$/, m => [`${C(m[2])} में ${K(m[1])} विज्ञापन: सवाल`, `${C(m[2])}માં ${K(m[1])} જાહેરાત: પ્રશ્નો`]],
 [/^How much does a (.+) ad cost in (.+)\?$/, m => [`${C(m[2])} में ${K(m[1])} विज्ञापन का खर्च कितना है?`, `${C(m[2])}માં ${K(m[1])} જાહેરાતનો ખર્ચ કેટલો છે?`]],
 [/^A 25-word ad costs between (₹[\d,]+) and (₹[\d,]+) per insertion before GST, depending on the newspaper\.$/, m => [`25 शब्दों का विज्ञापन अख़बार के हिसाब से प्रति प्रकाशन ${m[1]} से ${m[2]} तक (GST से पहले) पड़ता है।`, `25 શબ્દની જાહેરાત અખબાર પ્રમાણે પ્રતિ પ્રકાશન ${m[1]} થી ${m[2]} સુધી (GST પહેલાં) થાય છે.`]],
 [/^Other ads in (.+)$/, m => [`${C(m[1])} में अन्य विज्ञापन`, `${C(m[1])}માં અન્ય જાહેરાત`]],
 [/^(.+) ads in other cities$/, m => [`अन्य शहरों में ${K(m[1])} विज्ञापन`, `અન્ય શહેરોમાં ${K(m[1])} જાહેરાત`]],
 [/^Newspaper ads in (.+)$/, m => [`${C(m[1])} में अख़बार विज्ञापन`, `${C(m[1])}માં અખબાર જાહેરાત`]],
 [/^(.+) ads in (.+)$/, m => [`${C(m[2])} में ${K(m[1])} विज्ञापन`, `${C(m[2])}માં ${K(m[1])} જાહેરાત`]],
 [/^(\d+) newspapers publish a (.+) edition\. Pick what you want to announce to compare rates\.$/, m => [`${m[1]} अख़बारों का ${C(m[2])} संस्करण छपता है। दरों की तुलना के लिए चुनें कि आप क्या घोषित करना चाहते हैं।`, `${m[1]} અખબારોની ${C(m[2])} આવૃત્તિ છપાય છે. દરોની તુલના માટે પસંદ કરો કે તમે શું જાહેર કરવા માંગો છો.`]],
 [/^Newspapers in (.+)$/, m => [`${C(m[1])} के अख़बार`, `${C(m[1])}નાં અખબાર`]],
 [/^(\w+) · (\d+) editions · from (₹[\d,]+)\/(word|sq\. cm)$/, m => [`${L(m[1])} · ${m[2]} संस्करण · ${m[3]}/${m[4] === "word" ? "शब्द" : "वर्ग सेमी"} से`, `${L(m[1])} · ${m[2]} આવૃત્તિ · ${m[3]}/${m[4] === "word" ? "શબ્દ" : "ચો. સેમી"}થી`]],
 [/^(\w+) · from (₹[\d,]+)\/word$/, m => [`${L(m[1])} · ${m[2]}/शब्द से`, `${L(m[1])} · ${m[2]}/શબ્દથી`]],
 [/^(₹[\d,]+)\/word$/, m => [`${m[1]}/शब्द`, `${m[1]}/શબ્દ`]],
 [/^(\d+) words × (₹[\d,]+)$/, m => [`${m[1]} शब्द × ${m[2]}`, `${m[1]} શબ્દ × ${m[2]}`]],
 [/^(\d+) sq\. cm × (₹[\d,]+)$/, m => [`${m[1]} वर्ग सेमी × ${m[2]}`, `${m[1]} ચો. સેમી × ${m[2]}`]],
 [/^Minimum (\d+) words · \+ 5% GST$/, m => [`कम से कम ${m[1]} शब्द · + 5% GST`, `ઓછામાં ઓછા ${m[1]} શબ્દ · + 5% GST`]],
 [/^(\d+) words, (.+) only$/, m => [`${m[1]} शब्द, केवल ${C(m[2])}`, `${m[1]} શબ્દ, ફક્ત ${C(m[2])}`]],
 [/^4 × 5 cm, (.+) only$/, m => [`4 × 5 सेमी, केवल ${C(m[1])}`, `4 × 5 સેમી, ફક્ત ${C(m[1])}`]],
 [/^All (\d+) editions$/, m => [`सभी ${m[1]} संस्करण`, `બધી ${m[1]} આવૃત્તિ`]],
 [/^(\d+) newspapers in (\d+) languages \(sample list\)$/, m => [`${m[1]} अख़बार, ${m[2]} भाषाएँ (नमूना सूची)`, `${m[1]} અખબાર, ${m[2]} ભાષા (નમૂના સૂચિ)`]],
 [/^No newspapers in our list publish in (.+) yet\. Call us and we'll check regional papers\.$/, m => [`हमारी सूची का कोई अख़बार अभी ${C(m[1])} में नहीं छपता। हमें कॉल करें, हम क्षेत्रीय अख़बार देखेंगे।`, `અમારી યાદીનું કોઈ અખબાર હજી ${C(m[1])}માં છપાતું નથી. અમને કૉલ કરો, અમે પ્રાદેશિક અખબાર જોઈશું.`]],
 [/^(\d+) selected$/, m => [`${m[1]} चुने गए`, `${m[1]} પસંદ`]],
 [/^(.+): tick the editions to publish in$/, m => [`${m[1]}: जिन संस्करणों में छपवाना है, उन्हें चुनें`, `${m[1]}: જે આવૃત્તિમાં છપાવવું છે તે પસંદ કરો`]],
 [/^Pay (₹[\d,]+)$/, m => [`${m[1]} का भुगतान करें`, `${m[1]} ચૂકવો`]],
 [/^Earliest date: (.+)\. Every date you pick runs in all (\d+) selected editions?\.$/, m => [`सबसे पहली तारीख़: ${m[1]}। आप जो भी तारीख़ चुनेंगे, वह सभी ${m[2]} चुने गए संस्करणों में छपेगी।`, `સૌથી વહેલી તારીખ: ${m[1]}. તમે પસંદ કરો તે દરેક તારીખ બધી ${m[2]} પસંદ કરેલી આવૃત્તિમાં છપાશે.`]],
 [/^words\. Your papers charge a minimum of (\d+) words\. Phone numbers count as one word\. Need help writing it\? Our desk drafts and translates for free\.$/, m => [`शब्द। आपके अख़बार कम से कम ${m[1]} शब्दों का शुल्क लेते हैं। फ़ोन नंबर एक शब्द गिना जाता है। लिखने में मदद चाहिए? हमारा डेस्क मुफ़्त में लिखता और अनुवाद करता है।`, `શબ્દ. તમારાં અખબાર ઓછામાં ઓછા ${m[1]} શબ્દનો ચાર્જ લે છે. ફોન નંબર એક શબ્દ ગણાય છે. લખવામાં મદદ જોઈએ છે? અમારું ડેસ્ક મફતમાં લખે છે અને અનુવાદ કરે છે.`]],
 [/^Total (₹[\d,]+) for (\d+) dates? × (\d+) editions?\. You'll pay on the secure Razorpay page with UPI, card or netbanking\.$/, m => [`कुल ${m[1]}: ${m[2]} तारीख़ × ${m[3]} संस्करण। आप UPI, कार्ड या नेटबैंकिंग से सुरक्षित Razorpay पेज पर भुगतान करेंगे।`, `કુલ ${m[1]}: ${m[2]} તારીખ × ${m[3]} આવૃત્તિ. તમે UPI, કાર્ડ કે નેટબેંકિંગથી સુરક્ષિત Razorpay પેજ પર ચુકવણી કરશો.`]],
 [/^We've sent the details to (\S+)\. Our desk verifies the ad and releases it to (.+)\. The e-paper clipping comes to you on each publishing date\.$/, m => [`हमने विवरण ${m[1]} पर भेज दिया है। हमारा डेस्क विज्ञापन जाँचकर ${m[2]} को भेजेगा। हर प्रकाशन तारीख़ पर ई-पेपर कटिंग आपको मिलेगी।`, `અમે વિગતો ${m[1]} પર મોકલી છે. અમારું ડેસ્ક જાહેરાત ચકાસીને ${m[2]}ને મોકલશે. દરેક પ્રકાશન તારીખે ઈ-પેપર કટિંગ તમને મળશે.`]],
 [/^We've emailed a 6-digit code to (\S+)\. It expires in 10 minutes\.$/, m => [`हमने ${m[1]} पर 6 अंकों का कोड भेजा है। यह 10 मिनट में ख़त्म हो जाएगा।`, `અમે ${m[1]} પર 6 અંકનો કોડ મોકલ્યો છે. તે 10 મિનિટમાં સમાપ્ત થશે.`]],
];
const tr = key => { const t = T[key]; if (t) return t[col]; for (const [re, f] of P) { const m = key.match(re); if (m) return f(m)[col]; } return null; };

function trNode(n) {
  const key = n.nodeValue.trim().replace(/\s+/g, " ");
  if (key.length < 2) return;
  const out = tr(key); if (out == null) return;
  const p = n.parentNode;
  // an <option> without value= submits its text; pin the English value so prices and the server still match
  if (p && p.tagName === "OPTION" && !p.hasAttribute("value")) p.value = key;
  n.nodeValue = n.nodeValue.replace(n.nodeValue.trim(), out);
}
const ATTRS = ["placeholder", "aria-label", "title"];
function trAttrs(el) { for (const a of ATTRS) { const v = el.getAttribute && el.getAttribute(a); if (v) { const o = tr(v.trim()); if (o != null) el.setAttribute(a, o); } } }
function walk(root) {
  if (root.nodeType === 3) return trNode(root);
  if (root.nodeType !== 1 || /^(SCRIPT|STYLE|TEXTAREA)$/.test(root.tagName)) return;
  trAttrs(root); root.querySelectorAll("[placeholder],[aria-label],[title]").forEach(trAttrs);
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => /^(SCRIPT|STYLE|TEXTAREA)$/.test(n.parentNode.tagName) ? 2 : 1 });
  for (let n; (n = w.nextNode());) trNode(n);
}

const sel = document.getElementById("langSel");
if (sel) { sel.value = lang; sel.addEventListener("change", () => { try { localStorage.setItem("a2r_lang", sel.value); } catch {} location.reload(); }); }
if (col === undefined) return;
const [head, brand] = document.title.split(" | "); const th = tr(head); if (th) document.title = th + (brand ? " | " + brand : "");
walk(document.body);
// the booking pop-up, filters and results re-render, so translate whatever gets added later
new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(walk))).observe(document.body, { childList: true, subtree: true });
})();
