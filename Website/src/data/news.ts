export type Category =
  | "politics"
  | "rajasthan"
  | "national"
  | "international"
  | "sports"
  | "entertainment"
  | "technology"
  | "jobs";

export interface Author {
  slug: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  twitter?: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  image: string;
  category: Category;
  authorSlug: string;
  publishedAt: string; // ISO
  tags: string[];
  views: number;
  trending?: boolean;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  category: Category;
}

export interface GalleryImage {
  id: string;
  src: string;
  caption: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  politics: "राजनीति",
  rajasthan: "राजस्थान",
  national: "राष्ट्रीय",
  international: "विदेश",
  sports: "खेल",
  entertainment: "मनोरंजन",
  technology: "टेक्नोलॉजी",
  jobs: "नौकरी",
};

export const CATEGORY_PATH: Record<Category, string> = {
  politics: "/politics",
  rajasthan: "/rajasthan",
  national: "/national",
  international: "/international",
  sports: "/sports",
  entertainment: "/entertainment",
  technology: "/technology",
  jobs: "/jobs",
};

export const authors: Author[] = [
  {
    slug: "ravi-sharma",
    name: "रवि शर्मा",
    role: "वरिष्ठ संवाददाता, राजनीति",
    avatar: "https://i.pravatar.cc/200?img=12",
    bio: "रवि शर्मा 15 वर्षों से राजनीतिक पत्रकारिता में सक्रिय हैं। वे राजस्थान और दिल्ली की राजनीति पर गहरी पकड़ रखते हैं।",
    twitter: "@ravisharma",
  },
  {
    slug: "priya-meena",
    name: "प्रिया मीणा",
    role: "ब्यूरो चीफ, जयपुर",
    avatar: "https://i.pravatar.cc/200?img=47",
    bio: "प्रिया मीणा जयपुर ब्यूरो की प्रमुख हैं। राजस्थान की हर बड़ी ख़बर इनकी कलम से होकर गुज़रती है।",
    twitter: "@priyameena",
  },
  {
    slug: "arjun-singh",
    name: "अर्जुन सिंह",
    role: "खेल संपादक",
    avatar: "https://i.pravatar.cc/200?img=33",
    bio: "क्रिकेट, फुटबॉल और कबड्डी पर विशेष कवरेज। दो वर्ल्ड कप कवर कर चुके हैं।",
  },
  {
    slug: "neha-kapoor",
    name: "नेहा कपूर",
    role: "मनोरंजन संपादक",
    avatar: "https://i.pravatar.cc/200?img=49",
    bio: "बॉलीवुड और OTT की दुनिया से जुड़ी हर ख़बर पर नेहा की पैनी नज़र रहती है।",
  },
  {
    slug: "vikram-jain",
    name: "विक्रम जैन",
    role: "टेक्नोलॉजी रिपोर्टर",
    avatar: "https://i.pravatar.cc/200?img=15",
    bio: "गैजेट्स, AI और स्टार्टअप्स — टेक्नोलॉजी की हर हलचल विक्रम तक पहुँचती है।",
  },
  {
    slug: "sunita-rathore",
    name: "सुनीता राठौड़",
    role: "अंतरराष्ट्रीय मामलों की संपादक",
    avatar: "https://i.pravatar.cc/200?img=44",
    bio: "विदेश नीति और वैश्विक राजनीति पर लंबा अनुभव।",
  },
];

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=70`;

const body = (topic: string): string[] => [
  `${topic} को लेकर देश भर में चर्चा का माहौल है। विशेषज्ञों का मानना है कि आने वाले दिनों में इसका असर व्यापक रूप से देखने को मिल सकता है। शुरुआती रिपोर्टों के अनुसार सरकार और संबंधित एजेंसियाँ स्थिति पर पैनी नज़र बनाए हुए हैं।`,
  `सूत्रों के मुताबिक़ इस मुद्दे पर उच्च स्तरीय बैठक भी आयोजित की गई जिसमें सभी पहलुओं पर विस्तार से चर्चा हुई। बैठक में मौजूद अधिकारियों ने कहा कि जनता के हितों को सर्वोपरि रखते हुए ही कोई भी फ़ैसला लिया जाएगा।`,
  `विपक्ष ने भी इस पूरे मामले पर अपनी प्रतिक्रिया दी है और कहा है कि सरकार को पारदर्शिता बरतनी चाहिए। वहीं सत्ता पक्ष का कहना है कि सभी नियमों का पालन किया जा रहा है और जनता को सही समय पर हर जानकारी दी जाएगी।`,
  `स्थानीय निवासियों से बातचीत में मिली-जुली प्रतिक्रिया देखने को मिली। कुछ लोगों ने इसका स्वागत किया तो कुछ ने चिंता ज़ाहिर की। विशेषज्ञों का सुझाव है कि व्यापक संवाद के बाद ही अंतिम निर्णय लिया जाना चाहिए।`,
  `अपनो राजस्थान की टीम इस ख़बर पर लगातार नज़र बनाए हुए है। जैसे ही कोई नया अपडेट सामने आएगा, हम आप तक तत्काल पहुँचाएँगे। ताज़ा ख़बरों के लिए जुड़े रहिए हमारे साथ।`,
];

const A = (
  slug: string,
  title: string,
  excerpt: string,
  image: string,
  category: Category,
  authorSlug: string,
  daysAgo: number,
  tags: string[],
  views: number,
  trending = false
): Article => ({
  slug,
  title,
  excerpt,
  body: body(title),
  image: img(image),
  category,
  authorSlug,
  publishedAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
  tags,
  views,
  trending,
});

export const articles: Article[] = [
  // Politics
  A("loksabha-budget-session-shuru", "लोकसभा बजट सत्र की शुरुआत, विपक्ष का हंगामा", "बजट सत्र के पहले ही दिन सदन में जोरदार हंगामे के बीच कार्यवाही स्थगित करनी पड़ी।", "photo-1529107386315-e1a2ed48a620", "politics", "ravi-sharma", 0, ["संसद", "बजट"], 25400, true),
  A("rajasthan-mukhyamantri-naya-aelan", "मुख्यमंत्री का बड़ा ऐलान — किसानों को मिलेगा सीधा लाभ", "मुख्यमंत्री ने राज्य के किसानों के लिए नई योजना का ऐलान किया है जिससे लाखों परिवार लाभान्वित होंगे।", "photo-1581092580497-e0d23cbdf1dc", "politics", "priya-meena", 1, ["राजस्थान", "किसान"], 18900, true),
  A("opposition-rally-jaipur", "जयपुर में विपक्ष की महारैली, उमड़ी भीड़", "रामलीला मैदान में आयोजित रैली में बड़ी संख्या में कार्यकर्ता पहुँचे।", "photo-1591622180605-f93d11ee65f6", "politics", "ravi-sharma", 1, ["रैली"], 12500),
  A("bjp-congress-bayan-yudh", "बीजेपी-कांग्रेस के बीच बयानों की जंग तेज़", "नए सर्वे को लेकर दोनों दलों के बीच आरोप-प्रत्यारोप का दौर जारी।", "photo-1495020689067-958852a7765e", "politics", "ravi-sharma", 2, ["चुनाव"], 9800),
  A("rashtrapati-bhavan-samaroh", "राष्ट्रपति भवन में भव्य समारोह आयोजित", "देश के कई गणमान्य व्यक्तियों ने हिस्सा लिया।", "photo-1518563259479-d003c05a6507", "politics", "sunita-rathore", 3, ["राष्ट्रपति"], 7600),
  A("naye-rajyapal-shapath", "नए राज्यपाल ने ली शपथ, कई राज्यों में बदलाव", "केंद्र ने पाँच राज्यों के राज्यपाल बदले हैं।", "photo-1583321500900-82807e458f3c", "politics", "ravi-sharma", 4, ["राज्यपाल"], 6400),
  A("vidhansabha-monsoon-session", "विधानसभा का मानसून सत्र अगले सप्ताह से", "विधायी कामकाज की लंबी सूची तैयार।", "photo-1586511934875-5c5411eecddf", "politics", "priya-meena", 5, ["विधानसभा"], 5200),
  A("mantri-mandal-vistar-charcha", "मंत्रिमंडल विस्तार पर तेज़ हुई चर्चा", "अगले महीने तक संभावित बदलाव।", "photo-1582121020411-44e8a1b96d2d", "politics", "ravi-sharma", 6, ["कैबिनेट"], 4400),
  A("panchayat-chunav-tareekh", "पंचायत चुनाव की तारीख़ों का ऐलान जल्द", "चुनाव आयोग ने तैयारियाँ तेज़ कीं।", "photo-1588072432836-e10032774350", "politics", "priya-meena", 7, ["पंचायत"], 3900),
  A("sansad-suraksha-naye-niyam", "संसद सुरक्षा को लेकर नए नियम लागू", "विज़िटर पास प्रक्रिया कड़ी की गई।", "photo-1556761175-5973dc0f32e7", "politics", "ravi-sharma", 8, ["सुरक्षा"], 3500),

  // Rajasthan
  A("jaipur-metro-naya-route", "जयपुर मेट्रो के नए रूट को मंज़ूरी, चार नए स्टेशन", "मेट्रो के विस्तार से लाखों यात्रियों को राहत मिलेगी।", "photo-1599661046289-e31897846e41", "rajasthan", "priya-meena", 0, ["जयपुर", "मेट्रो"], 21000, true),
  A("udaipur-paryatan-record", "उदयपुर में पर्यटकों का नया रिकॉर्ड", "इस सीज़न में पिछले सभी रिकॉर्ड टूटे।", "photo-1599661046827-dacde6976549", "rajasthan", "priya-meena", 1, ["उदयपुर", "पर्यटन"], 14500, true),
  A("jodhpur-mehrangarh-festival", "जोधपुर मेहरानगढ़ में सांस्कृतिक उत्सव शुरू", "तीन दिनों तक चलने वाले उत्सव में देश-विदेश से कलाकार जुटे।", "photo-1477586957327-847a0f3f4fe3", "rajasthan", "priya-meena", 1, ["जोधपुर"], 9900),
  A("bikaner-camel-fair", "बीकानेर ऊँट महोत्सव की धूम", "रंग-बिरंगे ऊँटों की प्रतियोगिता ने मन मोहा।", "photo-1545159824-04c6f43b8a35", "rajasthan", "priya-meena", 2, ["बीकानेर"], 8700),
  A("jaisalmer-desert-camp", "जैसलमेर में रेगिस्तानी कैंप्स की बुकिंग फुल", "विदेशी पर्यटकों की भारी आमद।", "photo-1488646953014-85cb44e25828", "rajasthan", "priya-meena", 3, ["जैसलमेर"], 7200),
  A("ajmer-dargah-urs-tayari", "अजमेर दरग़ाह उर्स की तैयारियाँ अंतिम चरण में", "लाखों ज़ायरीनों के पहुँचने का अनुमान।", "photo-1600100397122-d76c1aef0f8a", "rajasthan", "priya-meena", 4, ["अजमेर"], 6500),
  A("kota-coaching-naye-niyam", "कोटा कोचिंग संस्थानों के लिए नए नियम", "छात्रों के मानसिक स्वास्थ्य पर ज़ोर।", "photo-1523240795612-9a054b0db644", "rajasthan", "priya-meena", 5, ["कोटा", "शिक्षा"], 5800),
  A("alwar-industrial-park", "अलवर में नए औद्योगिक पार्क का शिलान्यास", "10 हज़ार लोगों को रोज़गार मिलने की उम्मीद।", "photo-1565514020179-026b92b84bb6", "rajasthan", "priya-meena", 6, ["अलवर"], 4900),
  A("pushkar-mela-2024", "पुष्कर मेला 2024 का रंगारंग आगाज़", "पारंपरिक झलक देखने उमड़े लोग।", "photo-1518709268805-4e9042af2176", "rajasthan", "priya-meena", 6, ["पुष्कर"], 4500),
  A("mount-abu-snowfall", "माउंट आबू में पारा शून्य से नीचे, बर्फ़ जैसा नज़ारा", "पर्यटक उठा रहे ठंड का लुत्फ़।", "photo-1551524559-8af4e6624178", "rajasthan", "priya-meena", 7, ["माउंट आबू"], 4100),
  A("rajasthan-bijli-yojana", "राजस्थान में नई बिजली योजना लागू", "गाँव-गाँव तक पहुँचेगी सस्ती बिजली।", "photo-1473341304170-971dccb5ac1e", "rajasthan", "priya-meena", 8, ["बिजली"], 3700),
  A("chittorgarh-killa-jeernoddhar", "चित्तौड़गढ़ क़िले के जीर्णोद्धार का काम तेज़", "ASI ने जारी किया विशेष प्लान।", "photo-1564507592333-c60657eea523", "rajasthan", "priya-meena", 9, ["चित्तौड़"], 3300),

  // National
  A("dilli-pradushan-emergency", "दिल्ली में प्रदूषण आपातकाल जैसी स्थिति", "AQI 450 के पार, स्कूलों में छुट्टी घोषित।", "photo-1573108037329-37aa11631526", "national", "ravi-sharma", 0, ["दिल्ली", "प्रदूषण"], 32000, true),
  A("mumbai-baarish-recordtod", "मुंबई में रिकॉर्डतोड़ बारिश, जनजीवन ठप", "लोकल ट्रेनें प्रभावित, स्कूल बंद।", "photo-1570168007204-dfb528c6958f", "national", "ravi-sharma", 1, ["मुंबई"], 18000),
  A("chandrayaan-naya-mission", "ISRO ने किया चंद्रयान के अगले मिशन का ऐलान", "अगले वर्ष होगा प्रक्षेपण।", "photo-1446776877081-d282a0f896e2", "national", "vikram-jain", 1, ["ISRO"], 22000, true),
  A("railway-naye-vande-bharat", "रेलवे ने जोड़ी 5 नई वंदे भारत ट्रेनें", "उत्तर भारत के यात्रियों को बड़ी सौग़ात।", "photo-1474487548417-781cb71495f3", "national", "ravi-sharma", 2, ["रेलवे"], 14000),
  A("supreme-court-aham-faisla", "सुप्रीम कोर्ट का अहम फ़ैसला, कई मामलों पर असर", "संविधान पीठ ने सुनाया फ़ैसला।", "photo-1589994965851-a8f479c573a9", "national", "ravi-sharma", 2, ["कोर्ट"], 12000),
  A("gst-council-meeting", "GST काउंसिल की बैठक में कई बदलाव", "कई वस्तुओं पर टैक्स घटा।", "photo-1554224155-6726b3ff858f", "national", "ravi-sharma", 3, ["GST"], 9500),
  A("rbi-repo-rate", "RBI ने रेपो रेट में किया बदलाव", "होम लोन EMI पर पड़ेगा असर।", "photo-1611974789855-9c2a0a7236a3", "national", "vikram-jain", 4, ["RBI"], 8800),
  A("bharat-china-border", "भारत-चीन सीमा पर तनाव में कमी", "दोनों देशों के बीच कूटनीतिक बातचीत सकारात्मक।", "photo-1518709779341-56cf4535e94b", "national", "sunita-rathore", 5, ["सीमा"], 7600),
  A("upi-record-transactions", "UPI लेन-देन ने तोड़े सारे रिकॉर्ड", "एक महीने में 14 अरब ट्रांज़ैक्शन।", "photo-1556742049-0cfed4f6a45d", "national", "vikram-jain", 6, ["UPI"], 6900),
  A("kashi-vishwanath-vistar", "काशी विश्वनाथ कॉरिडोर का और विस्तार", "श्रद्धालुओं के लिए नई सुविधाएँ।", "photo-1561361513-2d000a50f0dc", "national", "ravi-sharma", 7, ["काशी"], 6100),
  A("modi-videsh-yatra", "PM मोदी की विदेश यात्रा से कई समझौते", "व्यापार और रक्षा क्षेत्र में बड़े क़रार।", "photo-1526778548025-fa2f459cd5c1", "national", "sunita-rathore", 8, ["PM मोदी"], 5500),

  // International
  A("us-elections-update", "अमेरिकी चुनाव में नया मोड़, रेस हुई दिलचस्प", "ताज़ा सर्वे ने सबको चौंकाया।", "photo-1541872703-74c5e44368f9", "international", "sunita-rathore", 0, ["अमेरिका"], 19500, true),
  A("russia-ukraine-yudh", "रूस-यूक्रेन युद्ध में नए हालात", "शांति वार्ता पर चर्चा शुरू।", "photo-1457369804613-52c61a468e7d", "international", "sunita-rathore", 1, ["रूस"], 14200),
  A("china-economy-suresh", "चीन की अर्थव्यवस्था में सुधार के संकेत", "वैश्विक बाज़ार में हलचल।", "photo-1548013146-72479768bada", "international", "sunita-rathore", 2, ["चीन"], 9300),
  A("uk-pradhanmantri-bayan", "UK के प्रधानमंत्री का बड़ा बयान", "अप्रवासन नीति में बदलाव की घोषणा।", "photo-1486299267070-83823f5448dd", "international", "sunita-rathore", 3, ["UK"], 7800),
  A("dubai-naye-vyapaar-niyam", "दुबई के नए व्यापार नियम भारतीयों के लिए राहत", "GCC क्षेत्र में नए मौक़े।", "photo-1512453979798-5ea266f8880c", "international", "sunita-rathore", 4, ["दुबई"], 6700),
  A("japan-bhukamp", "जापान में आया भीषण भूकंप", "तीव्रता 7.1 मापी गई।", "photo-1545569310-2b3c5a4f0e25", "international", "sunita-rathore", 5, ["जापान"], 8800),
  A("germany-elections", "जर्मनी में चुनाव परिणाम चौंकाने वाले", "नई गठबंधन सरकार बनने की संभावना।", "photo-1467269204594-9661b134dd2b", "international", "sunita-rathore", 6, ["जर्मनी"], 5400),
  A("nepal-naya-pm", "नेपाल में नए प्रधानमंत्री ने ली शपथ", "भारत के साथ रिश्तों पर ज़ोर।", "photo-1605640840605-14ac1855827b", "international", "sunita-rathore", 7, ["नेपाल"], 4900),
  A("sri-lanka-paryatan", "श्रीलंका में पर्यटन से अर्थव्यवस्था को सहारा", "भारतीय पर्यटकों की संख्या में रिकॉर्ड वृद्धि।", "photo-1546708973-8c0a3e0a4b74", "international", "sunita-rathore", 8, ["श्रीलंका"], 4400),

  // Sports
  A("india-australia-test", "भारत बनाम ऑस्ट्रेलिया टेस्ट में रोमांचक मुक़ाबला", "विराट कोहली का जोरदार शतक।", "photo-1531415074968-036ba1b575da", "sports", "arjun-singh", 0, ["क्रिकेट"], 45000, true),
  A("ipl-auction-bade-naam", "IPL ऑक्शन में बिके बड़े-बड़े नाम", "एक खिलाड़ी पर 24 करोड़ की बोली।", "photo-1540747913346-19e32dc3e97e", "sports", "arjun-singh", 1, ["IPL"], 38000, true),
  A("olympics-bharatiya-dal", "ओलंपिक के लिए भारतीय दल का ऐलान", "पहली बार 120 खिलाड़ी जाएँगे।", "photo-1461896836934-ffe607ba8211", "sports", "arjun-singh", 2, ["ओलंपिक"], 22000),
  A("hockey-india-jeet", "हॉकी इंडिया ने जीता एशिया कप", "फ़ाइनल में पाकिस्तान को हराया।", "photo-1574629810360-7efbbe195018", "sports", "arjun-singh", 3, ["हॉकी"], 18000),
  A("kabaddi-pro-league", "प्रो कबड्डी लीग में राजस्थान की बड़ी जीत", "अंतिम समय में पलटी बाज़ी।", "photo-1576280314550-83cd02e5fbf4", "sports", "arjun-singh", 4, ["कबड्डी"], 12000),
  A("football-naya-coach", "भारतीय फुटबॉल टीम को मिला नया कोच", "विदेशी कोच पर लगा दांव।", "photo-1486286701208-1d58e9338013", "sports", "arjun-singh", 5, ["फुटबॉल"], 9500),
  A("badminton-pv-sindhu", "PV सिंधु ने जीता ऑल इंग्लैंड ख़िताब", "देश को मिला एक और गौरव।", "photo-1521587760476-6c12a4b040da", "sports", "arjun-singh", 6, ["बैडमिंटन"], 14000),
  A("chess-anand-jeet", "विश्वनाथन आनंद ने जीता शतरंज मास्टर्स", "60 साल की उम्र में भी कमाल।", "photo-1529699211952-734e80c4d42b", "sports", "arjun-singh", 7, ["शतरंज"], 8200),
  A("athletics-naya-record", "एथलेटिक्स में भारतीय धावक ने तोड़ा रिकॉर्ड", "एशियन गेम्स में स्वर्ण।", "photo-1452626038306-9aae5e071dd3", "sports", "arjun-singh", 8, ["एथलेटिक्स"], 6700),
  A("tennis-india-davis-cup", "डेविस कप में भारत की धमाकेदार वापसी", "अगले दौर में पहुँची टीम।", "photo-1554068865-24cecd4e34b8", "sports", "arjun-singh", 9, ["टेनिस"], 5400),

  // Entertainment
  A("bollywood-blockbuster-release", "साल की सबसे बड़ी फ़िल्म रिलीज़, फैंस में जोश", "पहले दिन कमाई के टूट सकते हैं रिकॉर्ड।", "photo-1485846234645-a62644f84728", "entertainment", "neha-kapoor", 0, ["बॉलीवुड"], 35000, true),
  A("ott-naye-shows", "OTT पर इस हफ़्ते रिलीज़ हुए ये बेहतरीन शोज़", "हर शैली के दर्शकों के लिए कुछ ख़ास।", "photo-1522869635100-9f4c5e86aa37", "entertainment", "neha-kapoor", 1, ["OTT"], 18000, true),
  A("filmfare-awards-2024", "फ़िल्मफ़ेयर अवार्ड्स 2024 की चकाचौंध", "देखें कौन रहा सबसे आगे।", "photo-1517604931442-7e0c8ed2963c", "entertainment", "neha-kapoor", 2, ["अवार्ड"], 14000),
  A("shahrukh-khan-naye-project", "शाहरुख़ ख़ान की अगली फ़िल्म का ऐलान", "इस बार करेंगे एक्शन अवतार।", "photo-1542204165-65bf26472b9b", "entertainment", "neha-kapoor", 3, ["शाहरुख़"], 22000),
  A("south-cinema-buzz", "साउथ सिनेमा में फिर से धमाका", "रजनीकांत की नई फ़िल्म ने मचाई धूम।", "photo-1489599809505-f2f4c44b6d96", "entertainment", "neha-kapoor", 4, ["साउथ"], 13000),
  A("music-album-launch", "संगीत प्रेमियों के लिए नया एल्बम", "एआर रहमान का जादू फिर बरसा।", "photo-1511671782779-c97d3d27a1d4", "entertainment", "neha-kapoor", 5, ["संगीत"], 8800),
  A("celebrity-shaadi", "बॉलीवुड कपल की शाही शादी की तस्वीरें वायरल", "उदयपुर में हुआ भव्य आयोजन।", "photo-1519741497674-611481863552", "entertainment", "neha-kapoor", 6, ["शादी"], 26000),
  A("tv-serial-naya-twist", "लोकप्रिय TV सीरियल में आया बड़ा ट्विस्ट", "दर्शकों की प्रतिक्रिया जोरदार।", "photo-1593359677879-a4bb92f829d1", "entertainment", "neha-kapoor", 7, ["टीवी"], 7400),
  A("box-office-collection", "इस हफ़्ते की बॉक्स ऑफ़िस कमाई", "तीन फ़िल्मों ने पार किया 100 करोड़।", "photo-1440404653325-ab127d49abc1", "entertainment", "neha-kapoor", 8, ["बॉक्स ऑफिस"], 6300),
  A("cannes-film-festival", "कान फ़िल्म फेस्टिवल में भारतीय सितारों की धूम", "रेड कार्पेट पर देसी अंदाज़।", "photo-1478720568477-152d9b164e26", "entertainment", "neha-kapoor", 9, ["कान"], 5800),

  // Technology
  A("iphone-naya-launch", "Apple ने लॉन्च किया नया iPhone, क़ीमत जानें", "इस बार कैमरे में बड़ा बदलाव।", "photo-1592750475338-74b7b21085ab", "technology", "vikram-jain", 0, ["iPhone"], 28000, true),
  A("ai-chatgpt-update", "ChatGPT का नया वर्ज़न जारी, ये हैं ख़ास बातें", "AI की दुनिया में बड़ा बदलाव।", "photo-1677442136019-21780ecad995", "technology", "vikram-jain", 1, ["AI"], 19000, true),
  A("samsung-foldable-phone", "Samsung का नया फोल्डेबल फोन भारत में", "क़ीमत और फ़ीचर्स देखें।", "photo-1511707171634-5f897ff02aa9", "technology", "vikram-jain", 2, ["Samsung"], 12000),
  A("electric-car-india", "भारत में लॉन्च हुई नई इलेक्ट्रिक कार", "एक चार्ज पर 500 किमी रेंज।", "photo-1593941707882-a5bba14938c7", "technology", "vikram-jain", 3, ["EV"], 14000),
  A("5g-network-vistar", "5G नेटवर्क का देश के 200 शहरों तक विस्तार", "अब और छोटे शहर भी जुड़े।", "photo-1563770660941-20978e870e26", "technology", "vikram-jain", 4, ["5G"], 9700),
  A("startup-funding-record", "भारतीय स्टार्टअप्स को मिली रिकॉर्ड फंडिंग", "5 यूनिकॉर्न इस तिमाही में।", "photo-1556761175-b413da4baf72", "technology", "vikram-jain", 5, ["स्टार्टअप"], 7200),
  A("google-pixel-india", "Google Pixel का नया मॉडल भारत में", "AI फ़ीचर्स से लैस।", "photo-1598327105666-5b89351aff97", "technology", "vikram-jain", 6, ["Google"], 8400),
  A("cyber-security-warning", "साइबर सुरक्षा को लेकर बड़ी चेतावनी जारी", "इन ऐप्स से रहें सावधान।", "photo-1550751827-4bd374c3f58b", "technology", "vikram-jain", 7, ["सुरक्षा"], 11000),
  A("isro-mangalyaan-2", "ISRO का अगला मिशन — मंगलयान-2", "2025 में होगा प्रक्षेपण।", "photo-1614729939124-032d0bd5d11d", "technology", "vikram-jain", 8, ["ISRO"], 9100),
  A("crypto-rules-india", "भारत में क्रिप्टो को लेकर नए नियम", "टैक्स ढाँचे में बड़ा बदलाव।", "photo-1518546305927-5a555bb7020d", "technology", "vikram-jain", 9, ["क्रिप्टो"], 6300),

  // Jobs
  A("ssc-cgl-naya-bharti", "SSC CGL में 18000 पदों पर भर्ती शुरू", "ग्रेजुएट युवाओं के लिए सुनहरा मौक़ा।", "photo-1454165804606-c3d57bc86b40", "jobs", "ravi-sharma", 0, ["SSC"], 25000, true),
  A("rajasthan-patwari-bharti", "राजस्थान पटवारी भर्ती की अधिसूचना जारी", "5000 पदों पर निकली वैकेंसी।", "photo-1434030216411-0b793f4b4173", "jobs", "priya-meena", 1, ["RPSC"], 22000, true),
  A("railway-rrb-vacancy", "रेलवे RRB में 35000 पदों पर भर्ती", "ITI और 10वीं पास के लिए।", "photo-1474487548417-781cb71495f3", "jobs", "ravi-sharma", 2, ["रेलवे"], 19000),
  A("upsc-prelims-tareekh", "UPSC प्रीलिम्स की तारीख़ घोषित", "तैयारी का अंतिम चरण।", "photo-1503676260728-1c00da094a0b", "jobs", "ravi-sharma", 3, ["UPSC"], 16000),
  A("bank-po-bharti", "IBPS PO में 4000 पदों पर भर्ती", "देश भर के बैंकों में मौक़ा।", "photo-1450101499163-c8848c66ca85", "jobs", "ravi-sharma", 4, ["बैंक"], 13000),
  A("teacher-bharti-rajasthan", "राजस्थान में 30000 शिक्षक पदों पर भर्ती", "REET पास उम्मीदवार करें आवेदन।", "photo-1503676260728-1c00da094a0b", "jobs", "priya-meena", 5, ["शिक्षक"], 14000),
  A("army-agniveer-bharti", "अग्निवीर भर्ती रैली का शेड्यूल जारी", "12 राज्यों में होगी भर्ती।", "photo-1541872703-74c5e44368f9", "jobs", "ravi-sharma", 6, ["सेना"], 10000),
  A("isro-scientist-bharti", "ISRO में वैज्ञानिकों के पदों पर भर्ती", "इंजीनियरिंग ग्रेजुएट करें आवेदन।", "photo-1581094794329-c8112a89af12", "jobs", "vikram-jain", 7, ["ISRO"], 8400),
  A("delhi-police-constable", "दिल्ली पुलिस कांस्टेबल भर्ती शुरू", "7547 पदों पर वैकेंसी।", "photo-1453873531674-2151bcd01707", "jobs", "ravi-sharma", 8, ["पुलिस"], 9100),
  A("ongc-naye-pad", "ONGC में 1500 तकनीकी पदों पर भर्ती", "डिप्लोमा धारकों के लिए।", "photo-1581092580497-e0d23cbdf1dc", "jobs", "vikram-jain", 9, ["ONGC"], 6800),
];

export const videos: Video[] = [
  { id: "v1", title: "बजट 2024: मध्यम वर्ग को क्या मिला?", thumbnail: img("photo-1611224923853-80b023f02d71"), duration: "12:45", views: "2.4M", category: "politics" },
  { id: "v2", title: "जयपुर मेट्रो: नए रूट का पूरा प्लान", thumbnail: img("photo-1599661046289-e31897846e41"), duration: "08:20", views: "1.1M", category: "rajasthan" },
  { id: "v3", title: "विराट का तूफ़ानी शतक — हाइलाइट्स", thumbnail: img("photo-1531415074968-036ba1b575da"), duration: "05:30", views: "5.2M", category: "sports" },
  { id: "v4", title: "नई फ़िल्म का ट्रेलर रिलीज़", thumbnail: img("photo-1485846234645-a62644f84728"), duration: "03:10", views: "8.7M", category: "entertainment" },
  { id: "v5", title: "iPhone 16 का पहला रिव्यू", thumbnail: img("photo-1592750475338-74b7b21085ab"), duration: "15:00", views: "3.3M", category: "technology" },
  { id: "v6", title: "उदयपुर — झीलों की नगरी", thumbnail: img("photo-1599661046827-dacde6976549"), duration: "10:15", views: "950K", category: "rajasthan" },
  { id: "v7", title: "अमेरिकी चुनाव विश्लेषण", thumbnail: img("photo-1541872703-74c5e44368f9"), duration: "22:00", views: "1.4M", category: "international" },
  { id: "v8", title: "SSC CGL तैयारी टिप्स", thumbnail: img("photo-1454165804606-c3d57bc86b40"), duration: "18:40", views: "780K", category: "jobs" },
  { id: "v9", title: "ChatGPT — कैसे करें इस्तेमाल", thumbnail: img("photo-1677442136019-21780ecad995"), duration: "14:25", views: "2.1M", category: "technology" },
  { id: "v10", title: "मुंबई बारिश का मंज़र", thumbnail: img("photo-1570168007204-dfb528c6958f"), duration: "06:50", views: "3.8M", category: "national" },
  { id: "v11", title: "IPL ऑक्शन के सबसे बड़े डील", thumbnail: img("photo-1540747913346-19e32dc3e97e"), duration: "11:30", views: "4.6M", category: "sports" },
  { id: "v12", title: "बॉक्स ऑफ़िस रिपोर्ट", thumbnail: img("photo-1440404653325-ab127d49abc1"), duration: "07:45", views: "1.9M", category: "entertainment" },
];

export const galleryImages: GalleryImage[] = [
  { id: "g1", src: img("photo-1599661046289-e31897846e41"), caption: "जयपुर का हवा महल — गुलाबी नगरी की पहचान" },
  { id: "g2", src: img("photo-1477586957327-847a0f3f4fe3"), caption: "मेहरानगढ़ क़िला, जोधपुर" },
  { id: "g3", src: img("photo-1488646953014-85cb44e25828"), caption: "जैसलमेर का सुनहरा रेगिस्तान" },
  { id: "g4", src: img("photo-1545159824-04c6f43b8a35"), caption: "बीकानेर ऊँट महोत्सव" },
  { id: "g5", src: img("photo-1518709268805-4e9042af2176"), caption: "पुष्कर मेला — रंगों का संगम" },
  { id: "g6", src: img("photo-1599661046827-dacde6976549"), caption: "उदयपुर की झीलें" },
  { id: "g7", src: img("photo-1564507592333-c60657eea523"), caption: "चित्तौड़गढ़ क़िला" },
  { id: "g8", src: img("photo-1551524559-8af4e6624178"), caption: "माउंट आबू की वादियाँ" },
  { id: "g9", src: img("photo-1600100397122-d76c1aef0f8a"), caption: "अजमेर शरीफ़" },
  { id: "g10", src: img("photo-1586511934875-5c5411eecddf"), caption: "विधानसभा भवन, जयपुर" },
  { id: "g11", src: img("photo-1473341304170-971dccb5ac1e"), caption: "ग्रामीण राजस्थान" },
  { id: "g12", src: img("photo-1531415074968-036ba1b575da"), caption: "क्रिकेट का जुनून" },
];

export const liveSchedule = [
  { time: "06:00", show: "प्रभात समाचार" },
  { time: "08:00", show: "नमस्कार राजस्थान" },
  { time: "10:00", show: "ब्रेकिंग नाउ" },
  { time: "12:00", show: "दोपहर का दंगल" },
  { time: "15:00", show: "देश-विदेश" },
  { time: "18:00", show: "शाम की बहस" },
  { time: "20:00", show: "प्राइम टाइम" },
  { time: "22:00", show: "रात्रि बुलेटिन" },
];

// Selectors
export const getByCategory = (cat: Category) => articles.filter((a) => a.category === cat);
export const getBySlug = (slug: string) => articles.find((a) => a.slug === slug);
export const getAuthor = (slug: string) => authors.find((a) => a.slug === slug);
export const getArticlesByAuthor = (slug: string) => articles.filter((a) => a.authorSlug === slug);
export const getTrending = (limit = 6) =>
  [...articles].sort((a, b) => b.views - a.views).slice(0, limit);
export const getLatest = (limit = 10) =>
  [...articles].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)).slice(0, limit);
export const getRelated = (article: Article, limit = 3) =>
  articles
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, limit);
export const searchArticles = (q: string) => {
  const query = q.trim().toLowerCase();
  if (!query) return [] as Article[];
  return articles.filter(
    (a) =>
      a.title.toLowerCase().includes(query) ||
      a.excerpt.toLowerCase().includes(query) ||
      a.tags.some((t) => t.toLowerCase().includes(query)) ||
      CATEGORY_LABELS[a.category].toLowerCase().includes(query)
  );
};

export const breakingTicker = [
  "बड़ी ख़बर: लोकसभा बजट सत्र शुरू, विपक्ष का हंगामा",
  "जयपुर मेट्रो के नए रूट को मंज़ूरी",
  "भारत बनाम ऑस्ट्रेलिया टेस्ट में विराट का शतक",
  "ISRO का अगला मिशन — मंगलयान-2",
  "दिल्ली में प्रदूषण आपातकाल, स्कूल बंद",
  "SSC CGL में 18000 पदों पर भर्ती",
  "मुख्यमंत्री का किसानों को बड़ा तोहफ़ा",
];
