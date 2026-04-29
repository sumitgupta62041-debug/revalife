import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCategory } from "../backend";
import { ProductCard } from "../components/ProductCard";
import { FALLBACK_PRODUCTS, useListProducts } from "../hooks/useProducts";

const SKELETON_KEYS = ["a", "b", "c", "d", "e", "f", "g", "h"];

const categoryLabels: Record<ProductCategory, string> = {
  [ProductCategory.multivitamins]: "Multivitamins",
  [ProductCategory.herbalSupplements]: "Herbal Supplements",
  [ProductCategory.fitness]: "Protein & Fitness",
  [ProductCategory.immunity]: "Immunity Boosters",
  [ProductCategory.ayurvedicCare]: "Ayurvedic Care",
  [ProductCategory.digestiveHealth]: "Digestive Health",
};

type PriceRange = "all" | "under300" | "300-600" | "600-1000" | "above1000";

const PRICE_RANGES: { key: PriceRange; label: string }[] = [
  { key: "all", label: "All Prices" },
  { key: "under300", label: "Under ₹300" },
  { key: "300-600", label: "₹300 – ₹600" },
  { key: "600-1000", label: "₹600 – ₹1000" },
  { key: "above1000", label: "Above ₹1000" },
];

function matchesPriceRange(price: number, range: PriceRange): boolean {
  switch (range) {
    case "under300":
      return price < 300;
    case "300-600":
      return price >= 300 && price <= 600;
    case "600-1000":
      return price > 600 && price <= 1000;
    case "above1000":
      return price > 1000;
    default:
      return true;
  }
}

export default function Products() {
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");

  const { data: products = [], isLoading } = useListProducts(null);

  // Always use FALLBACK_PRODUCTS as the base so products are always visible
  const baseProducts = products.length > 0 ? products : FALLBACK_PRODUCTS;

  const filteredProducts = useMemo(() => {
    return baseProducts.filter((product) => {
      const matchesCategory =
        !selectedCategory || product.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shortDescription
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesPrice = matchesPriceRange(Number(product.price), priceRange);
      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [baseProducts, selectedCategory, searchQuery, priceRange]);

  const hasFilters =
    !!selectedCategory || !!searchQuery || priceRange !== "all";

  function clearFilters() {
    setSelectedCategory(null);
    setSearchQuery("");
    setPriceRange("all");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-card border-b border-border/60 py-10">
        <div className="container mx-auto px-4">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-wellness-green mb-2">
            revAlife Store
          </p>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground">
            Our Products
          </h1>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Science-backed supplements crafted for Indian wellness needs
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* ── Search bar ──────────────────────────────────────── */}
        <div className="relative mb-6 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 rounded-full border-border/60 bg-card focus:ring-2 focus:ring-wellness-green/30 h-11"
            data-ocid="products.search_input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
              data-ocid="products.search_clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* ── Filters row ─────────────────────────────────────── */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Category filter pills */}
          <div
            className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1"
            data-ocid="products.category_filter"
            style={{ scrollbarWidth: "none" }}
          >
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                selectedCategory === null
                  ? "bg-wellness-green text-white border-wellness-green shadow-xs"
                  : "bg-card text-foreground border-border hover:border-wellness-green/60 hover:text-wellness-green"
              }`}
              data-ocid="products.filter.all"
            >
              All Products
            </button>
            {(
              Object.entries(categoryLabels) as [ProductCategory, string][]
            ).map(([key, label]) => (
              <button
                type="button"
                key={key}
                onClick={() =>
                  setSelectedCategory(key === selectedCategory ? null : key)
                }
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  selectedCategory === key
                    ? "bg-wellness-green text-white border-wellness-green shadow-xs"
                    : "bg-card text-foreground border-border hover:border-wellness-green/60 hover:text-wellness-green"
                }`}
                data-ocid={`products.filter.${key}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Price range filter */}
          <div
            className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1"
            data-ocid="products.price_filter"
            style={{ scrollbarWidth: "none" }}
          >
            {PRICE_RANGES.map(({ key, label }) => (
              <button
                type="button"
                key={key}
                onClick={() => setPriceRange(key)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                  priceRange === key
                    ? "bg-foreground text-background border-foreground"
                    : "bg-card text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground"
                }`}
                data-ocid={`products.price.${key}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Results count + clear filters ───────────────────── */}
        {!isLoading && (
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filteredProducts.length}
              </span>{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
              {hasFilters && " matching your filters"}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-wellness-green font-medium hover:underline underline-offset-2 flex items-center gap-1"
                data-ocid="products.clear_filters"
              >
                <X className="h-3 w-3" />
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* ── Grid ──────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {SKELETON_KEYS.map((k) => (
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
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {filteredProducts.map((product) => (
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
        ) : (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="products.empty_state"
          >
            <div className="h-20 w-20 rounded-full bg-muted border border-border/40 flex items-center justify-center mx-auto mb-5">
              <Package className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-semibold font-display text-foreground mb-2">
              No products found
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {hasFilters
                ? "Try adjusting your search or filters."
                : "Check back soon for new arrivals!"}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-wellness-green font-medium hover:underline underline-offset-2"
                data-ocid="products.empty_state.clear_button"
              >
                Clear all filters →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
