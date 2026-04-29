// ─── Types ────────────────────────────────────────────────────────────────────

export type ChatMessage = {
  role: "user" | "bot";
  content: string;
};

type ConversationContext = {
  mentionedGoals: string[];
  recommendedProducts: string[];
  messageCount: number;
  lastProductMentioned: string;
  stage: "open";
};

// ─── Product Catalogue ────────────────────────────────────────────────────────

type Product = {
  id: string;
  name: string;
  emoji: string;
  price: number;
  benefit: string;
  category: string;
};

const PRODUCTS: Product[] = [
  {
    id: "ashwagandha",
    name: "Ashwagandha KSM-66 Extract",
    emoji: "🌿",
    price: 799,
    benefit: "stress, energy aur immunity ke liye #1 choice",
    category: "herbal",
  },
  {
    id: "shilajit",
    name: "Shilajit Pure Himalayan Resin",
    emoji: "🏔️",
    price: 1199,
    benefit: "deep energy, stamina aur vitality boost",
    category: "herbal",
  },
  {
    id: "brahmi",
    name: "Brahmi Brain Booster",
    emoji: "🧠",
    price: 649,
    benefit: "memory, focus aur concentration improve karta hai",
    category: "herbal",
  },
  {
    id: "moringa",
    name: "Moringa Superfood Powder",
    emoji: "🌱",
    price: 549,
    benefit: "75+ nutrients, immunity aur energy ka powerhouse",
    category: "immunity",
  },
  {
    id: "amla",
    name: "Amla Vitamin C — 500 mg Natural",
    emoji: "🍋",
    price: 399,
    benefit: "natural Vitamin C — immunity aur skin glow",
    category: "immunity",
  },
  {
    id: "triphala",
    name: "Triphala Gut Health Capsules",
    emoji: "💚",
    price: 449,
    benefit: "digestion theek karta hai, bloating band",
    category: "digestion",
  },
  {
    id: "curcumin",
    name: "Curcumin 95% + BioPerine",
    emoji: "🌻",
    price: 699,
    benefit: "inflammation, joint pain aur immunity",
    category: "digestion",
  },
  {
    id: "protein",
    name: "Plant Protein Powder — Vanilla",
    emoji: "💪",
    price: 1299,
    benefit: "muscle build, post-workout recovery",
    category: "fitness",
  },
  {
    id: "multivitamin",
    name: "Multivitamin Daily Pack",
    emoji: "✨",
    price: 899,
    benefit: "daily essentials — energy, immunity, overall health",
    category: "vitamins",
  },
  {
    id: "hairskin",
    name: "Hair & Skin Nourisher Capsules",
    emoji: "💆",
    price: 999,
    benefit: "hair fall rokta hai, skin glow deta hai",
    category: "beauty",
  },
];

// ─── Module-level context ─────────────────────────────────────────────────────

function createContext(): ConversationContext {
  return {
    mentionedGoals: [],
    recommendedProducts: [],
    messageCount: 0,
    lastProductMentioned: "",
    stage: "open",
  };
}

let ctx: ConversationContext = createContext();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hasWord(text: string, word: string): boolean {
  // biome-ignore lint/suspicious/noMisleadingCharacterClass: intentional word boundary
  return new RegExp(`\\b${word}\\b`, "i").test(text);
}

const GREETING_KEYWORDS = [
  "hi",
  "hii",
  "hiii",
  "hiiii",
  "hello",
  "hey",
  "helo",
  "helloo",
  "namaste",
  "namaskar",
  "hiya",
  "sup",
  "hola",
  "yo",
  "bhai",
  "yaar",
  "kya hal",
  "kya haal",
  "kaise ho",
  "kya chal",
  "wassup",
  "what's up",
  "whats up",
];

function isGreeting(lower: string): boolean {
  const clean = lower.trim();
  if (GREETING_KEYWORDS.some((kw) => clean === kw)) return true;
  if (
    GREETING_KEYWORDS.some(
      (kw) => clean.startsWith(`${kw} `) || clean.startsWith(`${kw},`),
    )
  )
    return true;
  return false;
}

function isAcknowledgement(lower: string): boolean {
  const acks = [
    "ok",
    "okay",
    "theek hai",
    "theek",
    "acha",
    "accha",
    "hmm",
    "hm",
    "shukriya",
    "thanks",
    "thank you",
    "dhanyawad",
    "nice",
    "great",
    "good",
    "cool",
    "wah",
    "waah",
    "badhiya",
    "samajh gaya",
    "samajh gayi",
    "got it",
    "understood",
    "👍",
  ];
  const clean = lower.trim();
  return acks.some(
    (a) => clean === a || clean === `${a}!` || clean === `${a}.`,
  );
}

function isPriceQuery(lower: string): boolean {
  return (
    lower.includes("kitna hai") ||
    lower.includes("kitne ka") ||
    lower.includes("price") ||
    lower.includes("cost") ||
    lower.includes("rate") ||
    lower.includes("daam") ||
    lower.includes("paisa") ||
    lower.includes("paise") ||
    lower.includes("rupee") ||
    lower.includes("₹")
  );
}

function isOrderIntent(lower: string): boolean {
  return (
    lower.includes("order") ||
    lower.includes("kharidna") ||
    lower.includes("lena hai") ||
    lower.includes("chahiye") ||
    lower.includes("buy") ||
    lower.includes("purchase") ||
    lower.includes("cart") ||
    lower.includes("checkout")
  );
}

// ─── Product Selection ────────────────────────────────────────────────────────

function pickNextProduct(): Product {
  const unrecommended = PRODUCTS.filter(
    (p) => !ctx.recommendedProducts.includes(p.id),
  );
  const pool = unrecommended.length > 0 ? unrecommended : PRODUCTS;
  return pool[0];
}

function formatProduct(p: Product): string {
  return `${p.emoji} **${p.name}** (₹${p.price}) — ${p.benefit}`;
}

function recordProduct(p: Product): void {
  if (!ctx.recommendedProducts.includes(p.id)) {
    ctx.recommendedProducts.push(p.id);
  }
  ctx.lastProductMentioned = p.id;
  if (ctx.recommendedProducts.length >= PRODUCTS.length) {
    ctx.recommendedProducts = [];
  }
}

// ─── Symptom → Product Mapping ────────────────────────────────────────────────

function detectSymptomProducts(lower: string): Product[] {
  const matched: Product[] = [];

  const add = (id: string) => {
    const p = PRODUCTS.find((x) => x.id === id);
    if (p && !matched.find((m) => m.id === id)) matched.push(p);
  };

  // Fatigue / energy
  if (
    lower.includes("thaka") ||
    lower.includes("thakaan") ||
    hasWord(lower, "tired") ||
    lower.includes("energy nahi") ||
    lower.includes("kamzori") ||
    lower.includes("weakness") ||
    lower.includes("weak")
  ) {
    add("ashwagandha");
    add("shilajit");
  }

  // Sleep
  if (
    lower.includes("neend") ||
    lower.includes("nind") ||
    lower.includes("sleep") ||
    lower.includes("insomnia") ||
    lower.includes("raat ko") ||
    lower.includes("so nahi")
  ) {
    add("ashwagandha");
    add("brahmi");
  }

  // Stress / anxiety
  if (
    lower.includes("stress") ||
    lower.includes("tension") ||
    lower.includes("anxiety") ||
    lower.includes("chinta") ||
    lower.includes("pareshan") ||
    lower.includes("pressure")
  ) {
    add("ashwagandha");
    add("brahmi");
  }

  // Immunity / sick
  if (
    lower.includes("immun") ||
    lower.includes("bimaar") ||
    lower.includes("bimaari") ||
    lower.includes("sick") ||
    lower.includes("cold") ||
    lower.includes("khansi") ||
    lower.includes("bukhar") ||
    lower.includes("fever") ||
    lower.includes("flu") ||
    lower.includes("infection")
  ) {
    add("amla");
    add("moringa");
  }

  // Gym / muscle / fitness / workout
  if (
    lower.includes("gym") ||
    lower.includes("muscle") ||
    lower.includes("workout") ||
    lower.includes("bodybuilding") ||
    lower.includes("protein") ||
    lower.includes("weight gain") ||
    lower.includes("mass") ||
    lower.includes("athlete") ||
    lower.includes("sport")
  ) {
    add("protein");
    add("ashwagandha");
  }

  // Digestion
  if (
    lower.includes("pet") ||
    lower.includes("digestion") ||
    lower.includes("acidity") ||
    lower.includes("bloat") ||
    lower.includes("gas") ||
    lower.includes("constip") ||
    lower.includes("stomach") ||
    lower.includes("kabz")
  ) {
    add("triphala");
    add("curcumin");
  }

  // Hair / skin / beauty
  if (
    lower.includes("baal") ||
    lower.includes("hair") ||
    lower.includes("skin") ||
    lower.includes("glow") ||
    lower.includes("twacha") ||
    lower.includes("chamak") ||
    lower.includes("pimple") ||
    lower.includes("acne") ||
    lower.includes("daag")
  ) {
    add("hairskin");
    add("amla");
  }

  // Brain / study / focus
  if (
    lower.includes("padhai") ||
    lower.includes("padh") ||
    lower.includes("study") ||
    lower.includes("focus") ||
    lower.includes("concentration") ||
    lower.includes("brain") ||
    lower.includes("memory") ||
    lower.includes("yaad") ||
    lower.includes("exam") ||
    lower.includes("student")
  ) {
    add("brahmi");
    add("multivitamin");
  }

  // Joint pain / inflammation
  if (
    lower.includes("dard") ||
    lower.includes("pain") ||
    lower.includes("joint") ||
    lower.includes("ghutna") ||
    lower.includes("inflammation") ||
    lower.includes("sujan") ||
    lower.includes("arthritis")
  ) {
    add("curcumin");
    add("shilajit");
  }

  // Weight / fat loss
  if (
    lower.includes("weight") ||
    lower.includes("motapa") ||
    lower.includes("fat") ||
    lower.includes("slim") ||
    lower.includes("vajan") ||
    lower.includes("lose weight") ||
    lower.includes("weight loss")
  ) {
    add("moringa");
    add("triphala");
  }

  // Vitamins / nutrients
  if (
    lower.includes("vitamin") ||
    lower.includes("mineral") ||
    lower.includes("nutrient") ||
    lower.includes("supplement")
  ) {
    add("multivitamin");
    add("amla");
  }

  // Office / work / sedentary
  if (
    lower.includes("office") ||
    lower.includes("desk") ||
    lower.includes("laptop") ||
    lower.includes("computer") ||
    lower.includes("sitting")
  ) {
    add("ashwagandha");
    add("multivitamin");
  }

  return matched;
}

// ─── FAQ Detection ────────────────────────────────────────────────────────────

type FAQKey =
  | "delivery"
  | "shipping"
  | "return"
  | "payment"
  | "contact"
  | "usage"
  | "safe";

const FAQ_RESPONSES: Record<FAQKey, string> = {
  delivery:
    "Abhi delivery sirf **Lovely Professional University** campus tak available hai. Orders 1–2 business days mein deliver ho jaate hain. 🚚\n\nBy the way, koi health goal hai jiske liye main product suggest kar sakta hoon?",
  shipping:
    "₹500 se upar ke orders pe **FREE delivery**! ₹500 se neeche pe sirf ₹15 shipping charge. 📦\n\nKoi product dekhna hai? Main recommend kar sakta hoon!",
  return:
    "Delivery ke 7 din ke andar return kar sakte hain — unopened product. Contact karein: revalife171@gmail.com ya +91 8942932189. 📞\n\nWaise, koi health concern hai? Sahi product pehli baar mein milega toh return ki zaroorat nahi! 😊",
  payment:
    "Hum sirf **UPI** aur **COD** accept karte hain.\n• UPI ID: s.saw.13@superyes (PhonePe QR bhi available)\n• COD — delivery pe cash payment\n\nDono options checkout page pe hain. Koi product try karna chahte ho? 💳",
  contact:
    "📧 revalife171@gmail.com\n📞 +91 8942932189 ya +91 8700829733\n📍 Lovely Professional University, Punjab\n⏰ Morning 6–8 AM, Evening 4–6 PM\n\nWhatsApp pe bhi contact kar sakte ho! Koi health sawaal ho toh yahan bhi pooch sakte ho. 😊",
  usage:
    "Har product ki usage instructions product page pe clearly likhi hain. Generally subah khaane ke baad paani ke saath lena best rahta hai. 👨‍⚕️\n\nKaunse product ke baare mein jaanna tha? Main detail se bata sakta hoon!",
  safe: "Sabhi revAlife products **GMP-certified** facilities mein banate hain — purity aur quality ka full guarantee. Natural ingredients, tested aur safe. 🙏\n\nKoi specific product ke baare mein safety question hai?",
};

function detectFAQ(lower: string): string | null {
  if (
    hasWord(lower, "delivery") ||
    lower.includes("kab milega") ||
    lower.includes("kitne din") ||
    lower.includes("shipping time")
  )
    return FAQ_RESPONSES.delivery;

  if (hasWord(lower, "shipping") || lower.includes("shipping charge"))
    return FAQ_RESPONSES.shipping;

  if (
    hasWord(lower, "return") ||
    hasWord(lower, "refund") ||
    lower.includes("wapas")
  )
    return FAQ_RESPONSES.return;

  if (
    hasWord(lower, "payment") ||
    hasWord(lower, "upi") ||
    hasWord(lower, "cod") ||
    lower.includes("bhugtan") ||
    (hasWord(lower, "pay") && !lower.includes("payday"))
  )
    return FAQ_RESPONSES.payment;

  if (
    hasWord(lower, "contact") ||
    hasWord(lower, "support") ||
    lower.includes("phone number") ||
    lower.includes("whatsapp") ||
    lower.includes("email")
  )
    return FAQ_RESPONSES.contact;

  if (
    lower.includes("how to use") ||
    lower.includes("kaise lein") ||
    lower.includes("kaise use") ||
    hasWord(lower, "dosage") ||
    hasWord(lower, "dose")
  )
    return FAQ_RESPONSES.usage;

  if (
    hasWord(lower, "safe") ||
    lower.includes("side effect") ||
    lower.includes("harmful") ||
    lower.includes("nuksaan")
  )
    return FAQ_RESPONSES.safe;

  return null;
}

// ─── Specific Product Query Detection ────────────────────────────────────────

function detectProductQuery(lower: string): Product | null {
  for (const p of PRODUCTS) {
    const nameLower = p.name.toLowerCase();
    // Match major words of product name
    const words = nameLower.split(" ").filter((w) => w.length > 4);
    if (words.some((w) => lower.includes(w))) return p;
  }
  return null;
}

// ─── Response Builders ────────────────────────────────────────────────────────

function greetingResponse(): string {
  const featured = pickNextProduct();
  recordProduct(featured);
  const responses = [
    `Hii bhai! 😊 Main RevAlife Health Assistant hoon. Koi health problem hai toh bata — main best product suggest karoonga!\n\nAj ka featured: ${formatProduct(featured)}\n\nKya yeh try karna chahoge? Ya koi specific health goal hai?`,
    `Namaste! 🙏 Swaagat hai revAlife mein! Main tumhara health buddy hoon — bina doctor ke fees ke!\n\nAbbhi try kar rahe hain: ${formatProduct(featured)}\n\nKoi health concern hai? Batao, main sahi product dhundhunga!`,
    `Hey! 👋 Aagaye revAlife pe — accha kiya! Main hoon yahan aapki wellness journey mein help karne ke liye.\n\nBestseller abhi: ${formatProduct(featured)}\n\nKaunsi health problem hai? Main expert advice dunga!`,
  ];
  return responses[ctx.messageCount % responses.length];
}

function acknowledgementResponse(): string {
  const next = pickNextProduct();
  recordProduct(next);
  const responses = [
    `😊 Khushi hui help kar ke! Waise bhai, ek aur great product hai — ${formatProduct(next)}. Dekhna chahoge?`,
    `Great! Koi aur sawaal ho toh pooch lena. By the way, ${formatProduct(next)} — yeh bhi kaam ka product hai tumhare liye! 💪`,
    `Bilkul! Main yahan hoon. Waise, koi health issue hai jo solve karna chahte ho? ${formatProduct(next)} kaafi popular hai! 🌿`,
  ];
  return responses[ctx.messageCount % responses.length];
}

function symptomResponse(products: Product[]): string {
  const main = products[0];
  const secondary = products[1];
  recordProduct(main);

  let msg = `Samajh gaya! Is problem ke liye ${formatProduct(main)} best rahega — ${main.benefit}. `;

  if (secondary) {
    recordProduct(secondary);
    msg += `Aur double benefit ke liye ${secondary.emoji} **${secondary.name}** (₹${secondary.price}) bhi try kar sakte ho. `;
  }

  msg += "\n\nLPU delivery free hai ₹500+ pe! Abhi order karna chahoge? 🛒";
  return msg;
}

function priceResponse(): string {
  const lastProd = PRODUCTS.find((p) => p.id === ctx.lastProductMentioned);
  if (lastProd) {
    return `${lastProd.emoji} **${lastProd.name}** ki price hai **₹${lastProd.price}** — aur ₹500+ order pe LPU mein FREE delivery! 🎉\n\nAbhi order karte ho? Products page pe jaao ya cart mein add karo!`;
  }

  const affordable = PRODUCTS.slice()
    .sort((a, b) => a.price - b.price)
    .slice(0, 3);
  const list = affordable
    .map((p) => `${p.emoji} **${p.name}** — ₹${p.price}`)
    .join("\n");
  return `Hamare products ₹399 se shuru hote hain! Top affordable picks:\n\n${list}\n\nKaunsa lena chahoge? 😊`;
}

function orderIntentResponse(): string {
  const lastProd = PRODUCTS.find((p) => p.id === ctx.lastProductMentioned);
  if (lastProd) {
    return `${lastProd.emoji} Bahut accha! **${lastProd.name}** lene ke liye:\n\n1. Products page pe jaao\n2. Cart mein add karo\n3. Checkout pe UPI ya COD choose karo\n\nLPU delivery 1–2 din mein! 🚀 Koi aur help chahiye?`;
  }
  return "Bilkul! Order karne ke liye Products page pe jaao, apna product choose karo, aur checkout mein UPI ya COD select karo. LPU delivery 1\u20132 din mein hogi! \uD83D\uDE9A\n\nKaunsa product lena tha? Main guide kar sakta hoon!";
}

function productQueryResponse(product: Product): string {
  recordProduct(product);
  const details: Record<string, string> = {
    ashwagandha:
      "Ashwagandha KSM-66 sabse potent form hai — cortisol reduce karta hai, energy boost karta hai, sleep better karta hai. Subah khaane ke saath lena best hai.",
    shilajit:
      "Pure Himalayan Shilajit 85+ minerals ke saath — stamina, testosterone, aur deep energy ke liye. Matar ke daane jitna warm water mein dissolve karo.",
    brahmi:
      "Brahmi ancient Ayurvedic herb hai brain ke liye — memory sharp karta hai, anxiety kam karta hai, exams mein focus badhata hai.",
    moringa:
      "Moringa 'Miracle Tree' kehte hain — 75+ nutrients, Vitamin C + protein + iron sab ek mein. Daily superfood hai.",
    amla: "Amla natural Vitamin C ka best source — synthetic se 20x zyada bioavailable. Immunity, skin glow, aur hair ke liye perfect.",
    triphala:
      "Triphala 3 fruits ka combination — Amalaki, Bibhitaki, Haritaki. Gut cleanse, digestion, aur toxins remove karta hai.",
    curcumin:
      "Curcumin 95% + BioPerine (black pepper extract) — absorption 2000% badhta hai. Inflammation, joint pain, aur immunity ke liye best.",
    protein:
      "Plant-based protein — pea + rice protein blend. 24g protein per serving, no whey, vegan friendly. Muscle build aur recovery ke liye.",
    multivitamin:
      "Complete daily vitamin pack — A, B-complex, C, D3, Zinc, Magnesium sab included. Men aur women dono ke liye.",
    hairskin:
      "Biotin + Collagen + Vitamin E + Amla — hair fall rokta hai 4-6 hafte mein, skin glow karne lagti hai. Inside-out beauty!",
  };
  const detail = details[product.id] ?? product.benefit;
  return `${product.emoji} **${product.name}** ke baare mein:\n\n${detail}\n\n💰 Price: **₹${product.price}** | LPU delivery FREE (₹500+)\n\nAbhi try karna chahoge? Koi aur question? 😊`;
}

function genericSalesResponse(): string {
  const next = pickNextProduct();
  recordProduct(next);
  const probes = [
    `Bhai batao — thakan, neend, stress, ya koi aur issue hai? Main exact product suggest karoonga! Waise ${formatProduct(next)} — bahut popular hai! 🌿`,
    `Koi health goal batao — gym, padhai, immunity, digestion — main perfect product dhundhunga! Abhi trending: ${formatProduct(next)} ✨`,
    `Aapki health ki baat karein! Kaunsi problem hai? Main ek product suggest karta hoon jo actually kaam karta hai. Check karo: ${formatProduct(next)} 💪`,
  ];
  return probes[ctx.messageCount % probes.length];
}

function proactiveEngagement(): string {
  const prompts = [
    "Waise bhai, ek quick sawaal — roz subah uthke thaka hua feel hota hai? Agar haan, main ek game-changing product suggest kar sakta hoon! 🌅",
    "Bhai, gym jaate ho ya padhai karte ho? Dono ke liye alag products hain revAlife mein — batao, main perfect combo suggest karoonga! 💪📚",
    "Ek sawaal — immunity strong rakhna chahte ho? Especially season change mein bimaar padna avoid karna chahte ho? 🛡️",
  ];
  return prompts[Math.floor(ctx.messageCount / 3) % prompts.length];
}

// ─── Main processMessage ──────────────────────────────────────────────────────

export function processMessage(userMessage: string): ChatMessage {
  const trimmed = userMessage.trim();
  if (!trimmed) {
    return {
      role: "bot",
      content: genericSalesResponse(),
    };
  }

  const lower = trimmed.toLowerCase();
  ctx.messageCount += 1;

  // 1. Greeting
  if (isGreeting(lower)) {
    return { role: "bot", content: greetingResponse() };
  }

  // 2. Price query
  if (isPriceQuery(lower)) {
    return { role: "bot", content: priceResponse() };
  }

  // 3. Order intent
  if (isOrderIntent(lower)) {
    return { role: "bot", content: orderIntentResponse() };
  }

  // 4. Specific product query
  const queriedProduct = detectProductQuery(lower);
  if (queriedProduct) {
    return { role: "bot", content: productQueryResponse(queriedProduct) };
  }

  // 5. FAQ detection
  const faqResp = detectFAQ(lower);
  if (faqResp) {
    return { role: "bot", content: faqResp };
  }

  // 6. Symptom / goal detection
  const symptomProducts = detectSymptomProducts(lower);
  if (symptomProducts.length > 0) {
    // Track mentioned goals
    ctx.mentionedGoals.push(lower.substring(0, 50));
    return { role: "bot", content: symptomResponse(symptomProducts) };
  }

  // 7. Acknowledgement
  if (isAcknowledgement(lower)) {
    return { role: "bot", content: acknowledgementResponse() };
  }

  // 8. Proactive engagement every 3rd message
  if (ctx.messageCount % 3 === 0) {
    return { role: "bot", content: proactiveEngagement() };
  }

  // 9. Generic sales fallback
  return { role: "bot", content: genericSalesResponse() };
}

// ─── Reset (for testing / widget re-open) ────────────────────────────────────

export function resetConversation(): void {
  ctx = createContext();
}
