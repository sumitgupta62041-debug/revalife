import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Leaf,
  RotateCcw,
  Shield,
  Tag,
  Truck,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { ProductCategory } from "../backend";
import { ProductCard } from "../components/ProductCard";
import { useFeaturedProducts } from "../hooks/useProducts";

// ── Types ─────────────────────────────────────────────────────────────────────

const categoryLabels: Record<ProductCategory, string> = {
  multivitamins: "Multivitamins",
  herbalSupplements: "Herbal Supplements",
  fitness: "Protein & Fitness",
  immunity: "Immunity Boosters",
  ayurvedicCare: "Ayurvedic Care",
  digestiveHealth: "Digestive Health",
};

// ── Category Nav Data ─────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    key: "immunity",
    emoji: "🛡️",
    label: "Immunity",
    color: "from-teal-50 to-teal-100/60",
  },
  {
    key: "fitness",
    emoji: "💪",
    label: "Protein",
    color: "from-blue-50 to-blue-100/60",
  },
  {
    key: "herbalSupplements",
    emoji: "🌿",
    label: "Herbal",
    color: "from-green-50 to-green-100/60",
  },
  {
    key: "ayurvedicCare",
    emoji: "🪔",
    label: "Ayurvedic",
    color: "from-amber-50 to-amber-100/60",
  },
  {
    key: "multivitamins",
    emoji: "💊",
    label: "Vitamins",
    color: "from-purple-50 to-purple-100/60",
  },
  {
    key: "digestiveHealth",
    emoji: "🌱",
    label: "Digestion",
    color: "from-emerald-50 to-emerald-100/60",
  },
  {
    key: "herbalSupplements",
    emoji: "✨",
    label: "Hair & Skin",
    color: "from-pink-50 to-pink-100/60",
  },
  {
    key: "immunity",
    emoji: "⚡",
    label: "Energy",
    color: "from-yellow-50 to-yellow-100/60",
  },
  {
    key: "ayurvedicCare",
    emoji: "🧘",
    label: "Stress Relief",
    color: "from-indigo-50 to-indigo-100/60",
  },
] as const;

// ── Hero Carousel Slides ──────────────────────────────────────────────────────

const SLIDES = [
  {
    id: "s1",
    gradient: "from-[#0f4c25] via-[#166534] to-[#15803d]",
    badge: "BESTSELLER",
    badgeColor: "bg-yellow-400 text-yellow-900",
    heading: "Ashwagandha KSM-66®",
    subheading: "Clinically proven adaptogen for stress relief & energy",
    price: "Under ₹499",
    cta: "Shop Now",
    ctaLink: "/products",
    accent: "text-green-300",
    pattern: "🌿",
  },
  {
    id: "s2",
    gradient: "from-[#1e3a5f] via-[#1e40af] to-[#1d4ed8]",
    badge: "SCIENCE-BACKED",
    badgeColor: "bg-blue-300 text-blue-900",
    heading: "Boost Your Immunity",
    subheading: "Premium supplements formulated for Indian wellness needs",
    price: "Starting ₹299",
    cta: "Explore Range",
    ctaLink: "/products",
    accent: "text-blue-200",
    pattern: "🛡️",
  },
  {
    id: "s3",
    gradient: "from-[#4a2c6e] via-[#6b21a8] to-[#7c3aed]",
    badge: "SPECIAL OFFER",
    badgeColor: "bg-purple-200 text-purple-900",
    heading: "First Order Special",
    subheading: "Get 20% off on your first purchase with code HEALTHY20",
    price: "Code: HEALTHY20",
    cta: "Claim Offer",
    ctaLink: "/products",
    accent: "text-purple-200",
    pattern: "🎁",
  },
];

// ── Trust Badges ──────────────────────────────────────────────────────────────

const TRUST_BADGES = [
  {
    icon: Truck,
    title: "FREE Delivery",
    sub: "Orders above ₹500",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: RotateCcw,
    title: "7 Days Returns",
    sub: "Easy hassle-free",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Tag,
    title: "Best Prices",
    sub: "Guaranteed low cost",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Leaf,
    title: "100% Natural",
    sub: "No artificial additives",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

const HOME_SKELETON_KEYS = [
  "ha",
  "hb",
  "hc",
  "hd",
  "he",
  "hf",
  "hg",
  "hh",
] as const;

// ── Hero Carousel Component ───────────────────────────────────────────────────

function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () =>
      setSelectedIndex(emblaApi.selectedScrollSnap()),
    );
  }, [emblaApi]);

  // Auto-play every 4 seconds
  useEffect(() => {
    if (!emblaApi || isHovered) return;
    const timer = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(timer);
  }, [emblaApi, isHovered]);

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-ocid="hero.carousel"
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {SLIDES.map((slide) => (
            <div
              key={slide.id}
              className={`relative flex-[0_0_100%] bg-gradient-to-r ${slide.gradient} h-[220px] md:h-[360px] flex items-center`}
            >
              {/* Decorative pattern */}
              <div className="absolute right-8 md:right-20 top-1/2 -translate-y-1/2 text-[80px] md:text-[140px] opacity-10 select-none pointer-events-none">
                {slide.pattern}
              </div>

              <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="max-w-xl">
                  {/* Badge */}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 ${slide.badgeColor}`}
                  >
                    {slide.badge}
                  </span>

                  {/* Heading */}
                  <h2 className="text-2xl md:text-5xl font-bold font-display text-white leading-tight mb-2 md:mb-3">
                    {slide.heading}
                  </h2>

                  {/* Subheading */}
                  <p
                    className={`text-sm md:text-lg mb-4 md:mb-6 leading-relaxed ${slide.accent}`}
                  >
                    {slide.subheading}
                  </p>

                  {/* Price + CTA */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-white/80 font-semibold text-sm md:text-base bg-white/10 px-3 py-1 rounded-full border border-white/20">
                      {slide.price}
                    </span>
                    <Link
                      to={slide.ctaLink}
                      data-ocid={`hero.slide_${slide.id}_cta`}
                    >
                      <button
                        type="button"
                        className="bg-white text-foreground font-bold text-sm md:text-base px-5 md:px-8 py-2 md:py-3 rounded-full hover:bg-white/90 transition-all duration-200 shadow-lg flex items-center gap-2"
                      >
                        {slide.cta}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow buttons */}
      <button
        type="button"
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 md:h-11 md:w-11 bg-white/90 hover:bg-white rounded-full shadow-card-hover flex items-center justify-center transition-all duration-200 text-foreground hover:scale-110"
        data-ocid="hero.carousel_prev"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 md:h-11 md:w-11 bg-white/90 hover:bg-white rounded-full shadow-card-hover flex items-center justify-center transition-all duration-200 text-foreground hover:scale-110"
        data-ocid="hero.carousel_next"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === selectedIndex
                ? "w-6 h-2.5 bg-white"
                : "w-2.5 h-2.5 bg-white/50 hover:bg-white/75"
            }`}
            data-ocid={`hero.dot_${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main Home Component ───────────────────────────────────────────────────────

export default function Home() {
  const { data: featuredProducts = [], isLoading } = useFeaturedProducts();

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero Carousel ─────────────────────────────────────── */}
      <section data-ocid="home.hero_section">
        <HeroCarousel />
      </section>

      {/* ── Category Navigation Row ──────────────────────────── */}
      <section
        className="bg-card border-b border-border/50 py-4 md:py-5"
        data-ocid="home.category_section"
      >
        <div className="container mx-auto px-4">
          <div
            className="flex items-start gap-3 md:gap-4 overflow-x-auto pb-1 scrollbar-hide justify-start md:justify-center flex-nowrap"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {CATEGORIES.map(({ key, emoji, label, color }, i) => (
              <Link
                key={`${key}-${label}`}
                to="/products"
                data-ocid={`home.category.${i + 1}`}
                className="flex flex-col items-center gap-1.5 group shrink-0"
              >
                <div
                  className={`h-14 w-14 md:h-16 md:w-16 rounded-full bg-gradient-to-br ${color} border border-border/40 flex items-center justify-center group-hover:shadow-card-hover group-hover:scale-105 group-hover:border-wellness-green/40 transition-all duration-200`}
                >
                  <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform duration-200">
                    {emoji}
                  </span>
                </div>
                <span className="text-[10px] md:text-xs font-semibold text-foreground/80 group-hover:text-wellness-green text-center leading-tight transition-colors whitespace-nowrap">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Promotional Strip ─────────────────────────────────── */}
      <div className="bg-gradient-to-r from-wellness-green-dark via-wellness-green to-[oklch(0.72_0.16_140)] py-3 px-4">
        <p className="text-white text-sm font-semibold tracking-wide flex items-center justify-center gap-2 text-center">
          <Zap className="h-4 w-4 shrink-0" />
          Use code{" "}
          <span className="font-bold bg-white/20 px-2 py-0.5 rounded-md mx-0.5 border border-white/30">
            HEALTHY20
          </span>{" "}
          for 20% off on your first order!{" "}
          <Link
            to="/products"
            className="underline underline-offset-2 font-bold ml-1 hover:no-underline whitespace-nowrap"
            data-ocid="banner.shop_now_link"
          >
            Shop Now →
          </Link>
        </p>
      </div>

      {/* ── Trust Badges ──────────────────────────────────────── */}
      <section
        className="py-6 md:py-8 bg-background border-b border-border/40"
        data-ocid="home.trust_section"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {TRUST_BADGES.map(({ icon: Icon, title, sub, color, bg }) => (
              <div
                key={title}
                className="flex items-center gap-3 bg-card rounded-xl p-3.5 md:p-4 border border-border/40 shadow-card hover:shadow-card-hover transition-shadow duration-200"
              >
                <div
                  className={`h-10 w-10 rounded-full ${bg} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <div className="font-bold text-xs md:text-sm text-foreground font-display leading-tight">
                    {title}
                  </div>
                  <div className="text-[10px] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                    {sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────── */}
      <section
        className="py-10 md:py-14 bg-muted/25"
        data-ocid="home.products_section"
      >
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="flex items-end justify-between mb-6 md:mb-8">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-wellness-green mb-1.5">
                Bestsellers
              </p>
              <h2 className="text-xl md:text-2xl font-bold font-display text-foreground leading-tight">
                Featured Products
              </h2>
              <div className="h-0.5 w-8 bg-wellness-green rounded-full mt-2" />
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center gap-1 text-sm font-semibold text-wellness-green hover:text-wellness-green-dark transition-colors"
              data-ocid="home.view_all_link"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Product grid */}
          {isLoading ? (
            <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-5 gap-1 md:gap-5">
              {HOME_SKELETON_KEYS.map((k) => (
                <div
                  key={k}
                  className="rounded-xl overflow-hidden bg-card shadow-card border border-border/40"
                >
                  <Skeleton className="aspect-[4/5] w-full" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-8 w-full mt-2 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-5 gap-1 md:gap-5">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  shortDescription={product.shortDescription}
                  price={Number(product.price)}
                  imageUrl={product.imageUrl}
                  categoryLabel={
                    categoryLabels[product.category] ??
                    (product.category as string)
                  }
                />
              ))}
            </div>
          )}

          {/* View all CTA */}
          <div className="text-center mt-8 md:mt-10">
            <Link to="/products" data-ocid="home.view_all_button">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-wellness-green text-wellness-green font-bold text-sm hover:bg-wellness-green hover:text-white transition-all duration-200 shadow-xs hover:shadow-card"
              >
                View All Products <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why revAlife ──────────────────────────────────────── */}
      <section
        className="py-10 md:py-14 bg-background border-t border-border/40"
        data-ocid="home.why_section"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-10">
            <p className="text-[10px] font-bold tracking-widest uppercase text-wellness-green mb-2">
              Why Choose Us
            </p>
            <h2 className="text-xl md:text-2xl font-bold font-display">
              Why revAlife?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Trustworthy Quality",
                desc: "Every product is carefully selected and tested to meet the highest safety and purity standards.",
                accent: "bg-green-50 border-green-200/60",
                iconColor: "text-green-600",
              },
              {
                icon: Award,
                title: "Science-Backed",
                desc: "Our formulations are based on scientific research and proven bioactive ingredients.",
                accent: "bg-blue-50 border-blue-200/60",
                iconColor: "text-blue-600",
              },
              {
                icon: FlaskConical,
                title: "LPU Delivery",
                desc: "Fast, reliable delivery directly to your room or hostel at Lovely Professional University.",
                accent: "bg-purple-50 border-purple-200/60",
                iconColor: "text-purple-600",
              },
            ].map(({ icon: Icon, title, desc, accent, iconColor }) => (
              <div
                key={title}
                className="bg-card rounded-2xl p-6 md:p-7 shadow-card border border-border/40 text-center hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
              >
                <div
                  className={`h-12 w-12 rounded-full ${accent} border flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
                <h3 className="font-bold text-base mb-2 font-display">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Science CTA Banner ────────────────────────────────── */}
      <section
        className="py-10 md:py-14 bg-muted/30 border-t border-border/40"
        data-ocid="home.science_section"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-wellness-green/5 to-wellness-green/10 border border-wellness-green/20 rounded-3xl px-6 md:px-10 py-10 md:py-14">
            <p className="text-[10px] font-bold tracking-widest uppercase text-wellness-green mb-4">
              Our Approach
            </p>
            <h2 className="text-xl md:text-2xl font-bold font-display mb-3">
              Science-Backed Wellness
            </h2>
            <p className="text-muted-foreground mb-7 leading-relaxed text-sm max-w-md mx-auto">
              At revAlife, we combine traditional Indian wellness wisdom with
              modern scientific research to bring you supplements you can truly
              trust.
            </p>
            <Link to="/science" data-ocid="home.learn_science_button">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-wellness-green text-wellness-green font-bold text-sm hover:bg-wellness-green hover:text-white transition-all duration-200"
              >
                Learn About Our Science
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
