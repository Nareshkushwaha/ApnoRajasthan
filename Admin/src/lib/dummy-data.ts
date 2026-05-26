export const articles = [
  { id: 1, title: "राजस्थान में मानसून ने दी दस्तक, कई जिलों में भारी बारिश", category: "मौसम", author: "राजेश शर्मा", date: "2025-04-22", status: "Published", views: 12543 },
  { id: 2, title: "जयपुर मेट्रो का विस्तार, नया रूट जल्द शुरू होगा", category: "शहर", author: "प्रिया सिंह", date: "2025-04-21", status: "Published", views: 8921 },
  { id: 3, title: "उदयपुर में पर्यटकों की भारी भीड़, होटल फुल", category: "पर्यटन", author: "अमित कुमार", date: "2025-04-20", status: "Draft", views: 0 },
  { id: 4, title: "राजस्थान सरकार का बड़ा फैसला: किसानों को राहत", category: "राजनीति", author: "सुनीता मीना", date: "2025-04-19", status: "Published", views: 21034 },
  { id: 5, title: "जोधपुर में क्रिकेट टूर्नामेंट का आगाज़", category: "खेल", author: "विकास जैन", date: "2025-04-18", status: "Published", views: 5621 },
  { id: 6, title: "बीकानेर का प्रसिद्ध भुजिया अब विदेशों में", category: "व्यापार", author: "राजेश शर्मा", date: "2025-04-17", status: "Draft", views: 0 },
  { id: 7, title: "अजमेर दरगाह पर उर्स की तैयारियां पूरी", category: "धर्म", author: "प्रिया सिंह", date: "2025-04-16", status: "Published", views: 9812 },
];

export const categories = [
  { id: 1, name: "राजनीति", slug: "politics", count: 142, color: "#dc2626" },
  { id: 2, name: "शहर", slug: "city", count: 98, color: "#ea580c" },
  { id: 3, name: "मौसम", slug: "weather", count: 56, color: "#0284c7" },
  { id: 4, name: "खेल", slug: "sports", count: 87, color: "#16a34a" },
  { id: 5, name: "पर्यटन", slug: "tourism", count: 64, color: "#9333ea" },
  { id: 6, name: "व्यापार", slug: "business", count: 73, color: "#ca8a04" },
  { id: 7, name: "धर्म", slug: "religion", count: 45, color: "#db2777" },
  { id: 8, name: "मनोरंजन", slug: "entertainment", count: 102, color: "#0891b2" },
];

export const users = [
  { id: 1, name: "राजेश शर्मा", email: "rajesh@apnorajasthan.com", role: "Admin", status: "Active", joined: "2024-01-15" },
  { id: 2, name: "प्रिया सिंह", email: "priya@apnorajasthan.com", role: "Editor", status: "Active", joined: "2024-03-22" },
  { id: 3, name: "अमित कुमार", email: "amit@apnorajasthan.com", role: "Editor", status: "Active", joined: "2024-05-10" },
  { id: 4, name: "सुनीता मीना", email: "sunita@apnorajasthan.com", role: "Editor", status: "Inactive", joined: "2024-07-03" },
  { id: 5, name: "विकास जैन", email: "vikas@apnorajasthan.com", role: "Editor", status: "Active", joined: "2024-09-18" },
];

export const media = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: `image-${i + 1}.jpg`,
  type: i % 4 === 0 ? "video" : "image",
  size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
  url: `https://picsum.photos/seed/ar${i}/400/300`,
  date: "2025-04-2" + (i % 10),
}));

export const videos = [
  { id: 1, title: "राजस्थान के लोक नृत्य", category: "संस्कृति", duration: "5:32", views: 24531, thumb: "https://picsum.photos/seed/v1/400/225" },
  { id: 2, title: "जयपुर हवा महल की कहानी", category: "इतिहास", duration: "8:14", views: 18923, thumb: "https://picsum.photos/seed/v2/400/225" },
  { id: 3, title: "थार रेगिस्तान का सफर", category: "पर्यटन", duration: "12:01", views: 33012, thumb: "https://picsum.photos/seed/v3/400/225" },
  { id: 4, title: "उदयपुर लेक पैलेस", category: "पर्यटन", duration: "6:45", views: 15672, thumb: "https://picsum.photos/seed/v4/400/225" },
];

export const galleries = [
  { id: 1, title: "जयपुर हेरिटेज वॉक", images: 24, cover: "https://picsum.photos/seed/g1/600/400", date: "2025-04-15" },
  { id: 2, title: "पुष्कर मेला 2025", images: 36, cover: "https://picsum.photos/seed/g2/600/400", date: "2025-04-10" },
  { id: 3, title: "रणथंभौर सफारी", images: 18, cover: "https://picsum.photos/seed/g3/600/400", date: "2025-04-05" },
  { id: 4, title: "उदयपुर लेक्स", images: 28, cover: "https://picsum.photos/seed/g4/600/400", date: "2025-04-01" },
];

export const ads = [
  { id: 1, name: "होम पेज बैनर", position: "Header", status: "Active", clicks: 1243, impressions: 45231 },
  { id: 2, name: "साइडबार ऐड", position: "Sidebar", status: "Active", clicks: 532, impressions: 21034 },
  { id: 3, name: "फुटर बैनर", position: "Footer", status: "Paused", clicks: 211, impressions: 9821 },
  { id: 4, name: "इन-आर्टिकल ऐड", position: "Inline", status: "Active", clicks: 873, impressions: 32145 },
];

export const messages = [
  { id: 1, name: "मोहन लाल", email: "mohan@gmail.com", subject: "खबर सुझाव", message: "मेरे गांव की एक खबर भेजना चाहता हूं", date: "2025-04-22", read: false },
  { id: 2, name: "सीमा गुप्ता", email: "seema@gmail.com", subject: "विज्ञापन पूछताछ", message: "विज्ञापन की दरें जानना है", date: "2025-04-21", read: true },
  { id: 3, name: "अनिल वर्मा", email: "anil@gmail.com", subject: "शिकायत", message: "एक खबर में गलत जानकारी है", date: "2025-04-20", read: false },
  { id: 4, name: "रीना शर्मा", email: "reena@gmail.com", subject: "धन्यवाद", message: "बहुत अच्छी खबरें देते हैं आप", date: "2025-04-19", read: true },
];

export const notifications = [
  { id: 1, title: "ब्रेकिंग न्यूज़ अलर्ट", message: "जयपुर में बड़ा हादसा", sent: "2025-04-22 10:30", recipients: 45231 },
  { id: 2, title: "मौसम अपडेट", message: "कल भारी बारिश की चेतावनी", sent: "2025-04-21 18:00", recipients: 45198 },
  { id: 3, title: "स्पेशल रिपोर्ट", message: "राजस्थान चुनाव विश्लेषण", sent: "2025-04-20 09:15", recipients: 44872 },
];
