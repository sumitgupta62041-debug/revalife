import { useQuery } from "@tanstack/react-query";
import type { Product, ProductCategory } from "../backend";
import { useActor } from "./useActor";

// ─── Hardcoded fallback products ──────────────────────────────────────────────
// These ensure products ALWAYS show even when backend actor is unavailable.
// Categories must match ProductCategory enum values exactly.
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "fallback-1",
    name: "Ashwagandha KSM-66 Extract",
    shortDescription:
      "Premium stress relief & energy supplement with KSM-66 root extract",
    fullDescription:
      "Ashwagandha KSM-66 is the world's best-studied, most bioavailable full-spectrum root extract. Clinically proven to reduce stress, boost energy levels, improve immunity, and support hormonal balance. 500mg per capsule, 60 capsules per bottle.",
    price: BigInt(799),
    category: "herbalSupplements" as ProductCategory,
    imageUrl: "/assets/products/product-1.jpg",
    benefits: [
      "Reduces stress & anxiety",
      "Boosts energy & stamina",
      "Improves immunity",
      "Supports hormonal balance",
    ],
    ingredients: [
      "Ashwagandha KSM-66 Root Extract 500mg",
      "Black Pepper Extract (Piperine) 5mg",
    ],
    howToUse:
      "Take 1 capsule twice daily after meals with water, or as directed by healthcare professional.",
    safetyInfo:
      "Not recommended for pregnant or breastfeeding women. Consult doctor if on medication.",
    inStock: true,
    featured: true,
  },
  {
    id: "fallback-2",
    name: "Organic Moringa Leaf Powder",
    shortDescription:
      "Superfood nutrition boost — antioxidant-rich organic moringa",
    fullDescription:
      "Sourced from organic moringa farms in India, this superfood powder is packed with vitamins A, C, E, calcium, potassium, and protein. Add to smoothies, juices, or meals for a powerful daily nutrition boost.",
    price: BigInt(449),
    category: "herbalSupplements" as ProductCategory,
    imageUrl: "/assets/products/product-2.jpg",
    benefits: [
      "Rich in vitamins & minerals",
      "Powerful antioxidant",
      "Boosts energy naturally",
      "Supports healthy metabolism",
    ],
    ingredients: ["100% Organic Moringa Oleifera Leaf Powder"],
    howToUse:
      "Add 1 teaspoon (3g) to water, smoothie, or juice daily. Best taken in the morning.",
    safetyInfo:
      "Safe for most adults. Start with smaller doses. Consult doctor if pregnant.",
    inStock: true,
    featured: true,
  },
  {
    id: "fallback-3",
    name: "Triphala Churna (Organic)",
    shortDescription: "Ancient Ayurvedic blend for digestive health & detox",
    fullDescription:
      "Triphala is a cornerstone of Ayurvedic medicine — a synergistic blend of three fruits (Amalaki, Bibhitaki, Haritaki) that gently cleanses the digestive tract, supports regularity, and promotes natural detoxification.",
    price: BigInt(299),
    category: "digestiveHealth" as ProductCategory,
    imageUrl: "/assets/products/product-3.jpg",
    benefits: [
      "Improves digestion",
      "Natural detox support",
      "Promotes regularity",
      "Rich in antioxidants",
    ],
    ingredients: [
      "Amalaki (Emblica officinalis) 33%",
      "Bibhitaki (Terminalia bellirica) 33%",
      "Haritaki (Terminalia chebula) 33%",
    ],
    howToUse:
      "Mix 1 teaspoon in warm water at bedtime. Can also be taken with honey.",
    safetyInfo:
      "Mild laxative effect. Reduce dose if loose stools occur. Not for children under 5.",
    inStock: true,
    featured: false,
  },
  {
    id: "fallback-4",
    name: "Curcumin with Piperine",
    shortDescription:
      "High-absorption turmeric extract for inflammation & joint health",
    fullDescription:
      "Our Curcumin supplement combines 95% standardized curcuminoids with BioPerine (black pepper extract) for maximum absorption. Scientifically proven to reduce inflammation, support joint health, and provide powerful antioxidant protection.",
    price: BigInt(649),
    category: "immunity" as ProductCategory,
    imageUrl: "/assets/products/product-4.jpg",
    benefits: [
      "Reduces inflammation",
      "Supports joint health",
      "Powerful antioxidant",
      "Improves brain function",
    ],
    ingredients: [
      "Turmeric Extract (95% Curcuminoids) 500mg",
      "BioPerine Black Pepper Extract 5mg",
    ],
    howToUse:
      "Take 1 capsule twice daily after meals. Best absorbed with a fatty meal.",
    safetyInfo:
      "May interact with blood thinners. Consult doctor before use if on medication.",
    inStock: true,
    featured: true,
  },
  {
    id: "fallback-5",
    name: "Plant-Based Protein Blend",
    shortDescription: "Complete vegan protein for muscle building & recovery",
    fullDescription:
      "Our premium plant-based protein combines pea, brown rice, and hemp proteins for a complete amino acid profile. 25g protein per serving, great chocolate flavour, no added sugar, easy to digest.",
    price: BigInt(1299),
    category: "fitness" as ProductCategory,
    imageUrl: "/assets/products/product-5.jpg",
    benefits: [
      "25g protein per serving",
      "Complete amino acid profile",
      "Easy to digest",
      "No artificial sweeteners",
    ],
    ingredients: [
      "Pea Protein Isolate",
      "Brown Rice Protein",
      "Hemp Seed Protein",
      "Cocoa Powder",
      "Stevia",
    ],
    howToUse:
      "Mix 1 scoop (30g) in 250ml water or plant milk. Take post-workout or as a meal supplement.",
    safetyInfo:
      "Contains soy. Not a meal replacement. Drink plenty of water with high protein intake.",
    inStock: true,
    featured: true,
  },
  {
    id: "fallback-6",
    name: "Daily Multivitamin Complex",
    shortDescription:
      "Complete daily nutrition with 25 essential vitamins & minerals",
    fullDescription:
      "Specially formulated for Indian adults, our Daily Multivitamin provides 25 essential nutrients including Vitamin D3, B12, Iron, Zinc, and Folate — nutrients commonly deficient in Indian diets. One tablet daily for complete nutritional support.",
    price: BigInt(549),
    category: "multivitamins" as ProductCategory,
    imageUrl: "/assets/products/product-6.jpg",
    benefits: [
      "25 vitamins & minerals",
      "Boosts energy levels",
      "Supports immunity",
      "Promotes healthy hair & skin",
    ],
    ingredients: [
      "Vitamins A, C, D3, E, K2",
      "B-Complex (B1, B2, B3, B5, B6, B7, B9, B12)",
      "Iron, Zinc, Calcium, Magnesium, Selenium",
    ],
    howToUse: "Take 1 tablet daily after breakfast with water.",
    safetyInfo:
      "Do not exceed recommended dose. Keep out of reach of children.",
    inStock: true,
    featured: true,
  },
  {
    id: "fallback-7",
    name: "Pure Shilajit Resin",
    shortDescription:
      "Himalayan shilajit resin for energy, vitality & testosterone support",
    fullDescription:
      "Authentic Himalayan Shilajit resin, purified and standardized to 60% fulvic acid. This ancient Ayurvedic rasayana supports energy, stamina, testosterone levels, and cognitive function. Used in Ayurveda for thousands of years.",
    price: BigInt(999),
    category: "ayurvedicCare" as ProductCategory,
    imageUrl: "/assets/products/product-7.jpg",
    benefits: [
      "Boosts energy & vitality",
      "Supports testosterone",
      "Improves stamina",
      "Enhances cognitive function",
    ],
    ingredients: ["Purified Shilajit Resin (60% Fulvic Acid)"],
    howToUse:
      "Dissolve a pea-sized amount (300mg) in warm milk or water. Take once daily in the morning.",
    safetyInfo:
      "Not for children or pregnant women. Use authentic products only. Store in cool, dry place.",
    inStock: true,
    featured: true,
  },
  {
    id: "fallback-8",
    name: "Hair & Skin Biotin Plus",
    shortDescription:
      "Biotin with Zinc & Vitamins for hair growth and glowing skin",
    fullDescription:
      "Our Hair & Skin Biotin Plus combines high-potency Biotin (10,000mcg) with Zinc, Vitamin C, and Hyaluronic Acid for comprehensive beauty nutrition. Promotes hair growth, reduces hair fall, improves skin elasticity, and strengthens nails.",
    price: BigInt(699),
    category: "multivitamins" as ProductCategory,
    imageUrl: "/assets/products/product-8.jpg",
    benefits: [
      "Reduces hair fall",
      "Promotes hair growth",
      "Glowing skin",
      "Stronger nails",
    ],
    ingredients: [
      "Biotin 10,000mcg",
      "Zinc 8mg",
      "Vitamin C 60mg",
      "Hyaluronic Acid 50mg",
      "Bamboo Extract",
    ],
    howToUse:
      "Take 1 capsule daily after breakfast with water. Best results in 3 months.",
    safetyInfo:
      "May affect lab test results. Inform your doctor you are taking biotin before any tests.",
    inStock: true,
    featured: false,
  },
  {
    id: "fallback-9",
    name: "Amla (Indian Gooseberry) Extract",
    shortDescription:
      "India's richest Vitamin C source for immunity & hair health",
    fullDescription:
      "Amla is India's most potent natural superfood — one amla berry contains 20x more Vitamin C than an orange. Our standardized extract provides powerful antioxidant protection, boosts immunity, supports hair health, and aids digestion.",
    price: BigInt(399),
    category: "immunity" as ProductCategory,
    imageUrl: "/assets/products/product-9.jpg",
    benefits: [
      "Highest natural Vitamin C",
      "Boosts immunity",
      "Promotes hair health",
      "Powerful antioxidant",
    ],
    ingredients: [
      "Amla (Phyllanthus emblica) Extract 500mg (standardized to 45% Vitamin C)",
    ],
    howToUse: "Take 1 capsule twice daily after meals with water.",
    safetyInfo:
      "May increase bleeding risk. Consult doctor before surgery or if on blood thinners.",
    inStock: true,
    featured: false,
  },
  {
    id: "fallback-10",
    name: "Brahmi Brain Booster",
    shortDescription: "Ayurvedic brain tonic for memory, focus & stress relief",
    fullDescription:
      "Brahmi (Bacopa monnieri) has been used in Ayurveda for centuries as a brain tonic. Clinically proven to improve memory retention, enhance focus, reduce anxiety, and support overall cognitive function. Ideal for students and professionals.",
    price: BigInt(549),
    category: "herbalSupplements" as ProductCategory,
    imageUrl: "/assets/products/product-10.jpg",
    benefits: [
      "Improves memory & recall",
      "Enhances focus & concentration",
      "Reduces stress & anxiety",
      "Supports brain health",
    ],
    ingredients: [
      "Brahmi (Bacopa monnieri) Extract 300mg (standardized to 20% Bacosides)",
      "Ashwagandha Root Extract 100mg",
    ],
    howToUse:
      "Take 1 capsule twice daily after meals. Best taken consistently for at least 4–6 weeks.",
    safetyInfo:
      "May cause nausea if taken on empty stomach. Not recommended for children under 12.",
    inStock: true,
    featured: false,
  },
];

// ─── React Query hooks ────────────────────────────────────────────────────────

export function useGetProduct(id: string) {
  const { actor } = useActor();

  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      if (actor) {
        try {
          const product = await actor.getProduct(id);
          if (product) return product;
        } catch {
          // fall through to fallback
        }
      }
      const fallback = FALLBACK_PRODUCTS.find((p) => p.id === id);
      if (fallback) return fallback;
      throw new Error("Product not found");
    },
    enabled: !!id,
  });
}

export function useListProducts(category: ProductCategory | null) {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ["products", category],
    queryFn: async () => {
      // Try live backend first
      if (actor) {
        try {
          const results = await actor.listProducts(category);
          if (results && results.length > 0) return results;
        } catch {
          // fall through to fallback
        }
      }
      // Always fall back to hardcoded products so phone/any device always shows products
      if (category) {
        return FALLBACK_PRODUCTS.filter((p) => p.category === category);
      }
      return FALLBACK_PRODUCTS;
    },
    // Always enabled — don't gate on actor so fallback data shows immediately
    enabled: !isActorFetching || !actor,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useFeaturedProducts() {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ["featuredProducts"],
    queryFn: async () => {
      if (actor) {
        try {
          const results = await actor.getFeaturedProducts();
          if (results && results.length > 0) return results;
        } catch {
          // fall through to fallback
        }
      }
      // Return featured fallback products (or first 6 if none marked featured)
      const featured = FALLBACK_PRODUCTS.filter((p) => p.featured);
      return featured.length > 0
        ? featured.slice(0, 6)
        : FALLBACK_PRODUCTS.slice(0, 6);
    },
    enabled: !isActorFetching || !actor,
    staleTime: 30_000,
    retry: 1,
  });
}

export const useProducts = {
  useGetProduct,
  useListProducts,
  useFeaturedProducts,
};
