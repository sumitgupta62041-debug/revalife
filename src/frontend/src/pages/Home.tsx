import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  FlaskConical,
  Leaf,
  RotateCcw,
  Shield,
  Truck,
  Zap,
} from "lucide-react";
import type { ProductCategory } from "../backend";
import { ProductCard } from "../components/ProductCard";
import { useFeaturedProducts } from "../hooks/useProducts";

const HOME_SKELETON_KEYS = ["ha", "hb", "hc", "hd", "he", "hf"] as const;

const categoryLabels: Record<ProductCategory, string> = {
  multivitamins: "Multivitamins",
  herbalSupplements: "Herbal Supplements",
  fitness: "Protein & Fitness",
  immunity: "Immunity Boosters",
  ayurvedicCare: "Ayurvedic Care",
  digestiveHealth: "Digestive Health",
};

// Category quick links config
const CATEGORY_LINKS: {
  key: ProductCategory;
  emoji: string;
  label: string;
  color: string;
}[] = [
  {
    key: "herbalSupplements" as ProductCategory,
    emoji: "🌿",
    label: "Herbals",
    color: "hover:border-wellness-green/60",
  },
  {
    key: "multivitamins" as ProductCategory,
    emoji: "💊",
    label: "Supplements",
    color: "hover:border-purple-400/60",
  },
  {
    key: "ayurvedicCare" as ProductCategory,
    emoji: "🪔",
    label: "Oils & Care",
    color: "hover:border-amber-400/60",
  },
  {
    key: "immunity" as ProductCategory,
    emoji: "🛡️",
    label: "Capsules",
    color: "hover:border-teal-400/60",
  },
  {
    key: "fitness" as ProductCategory,
    emoji: "💪",
    label: "Powders",
    color: "hover:border-blue-400/60",
  },
  {
    key: "digestiveHealth" as ProductCategory,
    emoji: "🌱",
    label: "Digestive",
    color: "hover:border-emerald-400/60",
  },
];

const TRUST_BADGES = [
  {
    icon: Leaf,
    label: "100% Natural",
    sub: "No artificial additives",
    bg: "bg-wellness-green/10",
    border: "border-wellness-green/25",
    iconColor: "text-wellness-green",
  },
  {
    icon: FlaskConical,
    label: "Science-Backed",
    sub: "Research-driven formulas",
    bg: "bg-blue-50",
    border: "border-blue-200/60",
    iconColor: "text-blue-600",
  },
  {
    icon: Shield,
    label: "Lab Tested",
    sub: "Certified quality",
    bg: "bg-purple-50",
    border: "border-purple-200/60",
    iconColor: "text-purple-600",
  },
  {
    icon: RotateCcw,
    label: "Free Returns",
    sub: "Easy 7-day returns",
    bg: "bg-amber-50",
    border: "border-amber-200/60",
    iconColor: "text-amber-600",
  },
];

export default function Home() {
  const { data: featuredProducts = [], isLoading } = useFeaturedProducts();

  return (
    <div className="min-h-screen">
      {/* ── Hero ────────────────────────────────────────────── */}
      <section
        className="relative bg-cover bg-center py-32 md:py-48"
        style={{
          backgroundImage: "url(/assets/generated/hero-bg.dim_1920x1080.png)",
        }}
      >
        <div className="absolute inset-0 bg-background/84" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-wellness-green/10 text-wellness-green text-xs font-semibold tracking-widest uppercase mb-6 border border-wellness-green/20">
              India's Premium Wellness Brand
            </span>
            <h1 className="text-4xl md:text-6xl font-bold font-display text-foreground mb-5 leading-[1.12]">
              Science-Backed{" "}
              <span className="text-wellness-green">Wellness</span>
              <br />
              for India
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-lg leading-relaxed">
              Premium health supplements backed by research, crafted for Indian
              wellness needs. Quality you can trust, results you can feel.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products">
                <Button
                  size="lg"
                  className="bg-wellness-green hover:bg-wellness-green-dark rounded-full px-8 text-base gap-2 shadow-card hover:shadow-card-hover transition-all duration-200"
                  data-ocid="hero.shop_now_button"
                >
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/science">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 text-base border-border hover:border-wellness-green/50 hover:text-wellness-green transition-all duration-200"
                  data-ocid="hero.learn_more_button"
                >
                  Our Science
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Discount Banner ────────────────────────────────── */}
      <div className="bg-wellness-green py-2.5 px-4 text-center">
        <p className="text-white text-sm font-semibold tracking-wide flex items-center justify-center gap-2">
          <Zap className="h-4 w-4" />
          Use code{" "}
          <span className="font-bold bg-white/20 px-2 py-0.5 rounded-md mx-1">
            HEALTHY20
          </span>{" "}
          for 20% off on your first order!{" "}
          <Link
            to="/products"
            className="underline underline-offset-2 font-bold ml-1 hover:no-underline"
            data-ocid="banner.shop_now_link"
          >
            Shop Now →
          </Link>
        </p>
      </div>

      {/* ── Trust Badges ────────────────────────────────────── */}
      <section className="py-10 bg-muted/30 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-3xl mx-auto">
            {TRUST_BADGES.map(
              ({ icon: Icon, label, sub, bg, border, iconColor }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center gap-2.5"
                >
                  <div
                    className={`h-12 w-12 rounded-full ${bg} border ${border} flex items-center justify-center`}
                  >
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <span className="font-semibold text-sm text-foreground font-display">
                    {label}
                  </span>
                  <span className="text-xs text-muted-foreground hidden md:block leading-snug">
                    {sub}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── Category Quick Links ─────────────────────────────── */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-wellness-green mb-2">
              Browse by Category
            </p>
            <h2 className="text-xl md:text-2xl font-bold font-display">
              Shop by Wellness Goal
            </h2>
          </div>
          <div
            className="grid grid-cols-3 md:grid-cols-6 gap-3 max-w-3xl mx-auto"
            data-ocid="home.category_links"
          >
            {CATEGORY_LINKS.map(({ key, emoji, label, color }) => (
              <Link key={key} to="/products" data-ocid={`home.category.${key}`}>
                <div
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-card border border-border/40 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center group ${color}`}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                    {emoji}
                  </span>
                  <span className="text-xs font-semibold text-foreground leading-tight font-display">
                    {label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────────── */}
      <section className="py-16 bg-muted/25 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-9">
            <div>
              <p className="text-[11px] font-semibold tracking-widest uppercase text-wellness-green mb-2">
                Bestsellers
              </p>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground">
                Featured Products
              </h2>
              <div className="h-0.5 w-10 bg-wellness-green rounded-full mt-2" />
            </div>
            <Link to="/products" data-ocid="home.view_all_link">
              <Button
                variant="ghost"
                size="sm"
                className="text-wellness-green hover:text-wellness-green hover:bg-wellness-green/8 gap-1.5 hidden md:flex"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {HOME_SKELETON_KEYS.map((k) => (
                <div
                  key={k}
                  className="rounded-2xl overflow-hidden bg-card shadow-card border border-border/40"
                >
                  <Skeleton className="aspect-[4/5] w-full" />
                  <div className="p-4 space-y-2.5">
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-8 w-full mt-2 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {featuredProducts.slice(0, 6).map((product) => (
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

          <div className="text-center mt-10">
            <Link to="/products" data-ocid="home.view_all_button">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-10 border-wellness-green text-wellness-green hover:bg-wellness-green hover:text-white transition-all duration-200"
              >
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why revAlife ─────────────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-wellness-green mb-2">
              Why Choose Us
            </p>
            <h2 className="text-2xl md:text-3xl font-bold font-display">
              Why revAlife?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Trustworthy",
                desc: "Every product is carefully selected and tested to meet the highest safety standards.",
              },
              {
                icon: Award,
                title: "Science-Backed",
                desc: "Our formulations are based on scientific research and proven ingredients.",
              },
              {
                icon: Truck,
                title: "LPU Delivery",
                desc: "Fast, reliable delivery directly to your room or hostel at Lovely Professional University.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-card rounded-2xl p-7 shadow-card border border-border/40 text-center hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-full bg-wellness-green/10 border border-wellness-green/20 flex items-center justify-center mx-auto mb-5">
                  <Icon className="h-6 w-6 text-wellness-green" />
                </div>
                <h3 className="font-bold text-lg mb-2.5 font-display">
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

      {/* ── Science CTA ──────────────────────────────────────── */}
      <section className="py-16 bg-muted/25 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-wellness-green/5 border border-wellness-green/20 rounded-3xl px-8 py-14">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-wellness-green mb-4">
              Our Approach
            </p>
            <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">
              Science-Backed Wellness
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed text-sm md:text-base max-w-md mx-auto">
              At revAlife, we combine traditional Indian wellness wisdom with
              modern scientific research to bring you supplements you can truly
              trust.
            </p>
            <Link to="/science">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 border-wellness-green text-wellness-green hover:bg-wellness-green hover:text-white transition-all duration-200"
                data-ocid="home.learn_science_button"
              >
                Learn More About Our Science
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
