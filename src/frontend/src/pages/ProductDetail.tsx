import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  MessageCircle,
  Minus,
  Plus,
  ShoppingCart,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useLoginModal } from "../App";
import type { PendingCartAction } from "../App";
import { ProductCategory } from "../backend";
import { ProductCard } from "../components/ProductCard";
import { ProductImageFallback } from "../components/ProductImageFallback";
import { useCartDrawer } from "../contexts/CartDrawerContext";
import { useCart } from "../hooks/useCart";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { FALLBACK_PRODUCTS, useGetProduct } from "../hooks/useProducts";

const categoryLabels: Record<ProductCategory, string> = {
  [ProductCategory.multivitamins]: "Multivitamins",
  [ProductCategory.herbalSupplements]: "Herbal Supplements",
  [ProductCategory.fitness]: "Protein & Fitness",
  [ProductCategory.immunity]: "Immunity Boosters",
  [ProductCategory.ayurvedicCare]: "Ayurvedic Care",
  [ProductCategory.digestiveHealth]: "Digestive Health",
};

export default function ProductDetail() {
  const { id } = useParams({ from: "/products/$id" });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { openLoginModalWithAction } = useLoginModal();
  const { data: product, isLoading } = useGetProduct(id);
  const { addToCart, isAddingToCart } = useCart();
  const { openDrawer } = useCartDrawer();
  const [quantity, setQuantity] = useState(1);
  const [imgFailed, setImgFailed] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Keep a stable ref to the current quantity so event handlers don't go stale
  const quantityRef = useRef(quantity);
  useEffect(() => {
    quantityRef.current = quantity;
  }, [quantity]);

  const isAuthenticated = !!identity;

  // Reset image failed state when product changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll + reset on id change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setImgFailed(false);
    setAddedFeedback(false);
  }, [id]);

  // ── Listen for replay events dispatched by PostLoginReplayer after login ──
  // biome-ignore lint/correctness/useExhaustiveDependencies: product can be null on mount
  useEffect(() => {
    if (!product) return;

    const handler = async (e: Event) => {
      const action = (e as CustomEvent<PendingCartAction>).detail;
      if (action.type !== "addToCart" || action.productId !== product.id)
        return;

      try {
        await addToCart(product.id, action.quantity);
        openDrawer({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          imageUrl: product.imageUrl,
        });
        setAddedFeedback(true);
        setTimeout(() => setAddedFeedback(false), 1500);
      } catch {
        // useCart.onError already shows the toast
      }
    };

    window.addEventListener("revalife:replayCartAction", handler);
    return () =>
      window.removeEventListener("revalife:replayCartAction", handler);
  }, [product?.id, addToCart, openDrawer]);

  const relatedProducts = product
    ? FALLBACK_PRODUCTS.filter(
        (p) => p.category === product.category && p.id !== product.id,
      ).slice(0, 3)
    : [];

  const handleAddToCart = async () => {
    if (!product) return;

    // ── Pre-auth check: queue action BEFORE attempting mutation ───────────
    if (!isAuthenticated) {
      openLoginModalWithAction({
        type: "addToCart",
        productId: product.id,
        quantity: BigInt(quantity),
        drawerData: {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          imageUrl: product.imageUrl,
        },
      });
      return;
    }

    try {
      // Use product.id (canonical backend ID) — NOT the URL param `id`
      await addToCart(product.id, BigInt(quantity));
      openDrawer({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        imageUrl: product.imageUrl,
      });
      setAddedFeedback(true);
      setTimeout(() => setAddedFeedback(false), 1500);
    } catch {
      // useCart.onError already shows the toast
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      // Queue a buy-now as an add-to-cart action then navigate after replay
      if (!product) return;
      openLoginModalWithAction({
        type: "addToCart",
        productId: product.id,
        quantity: BigInt(quantity),
        drawerData: {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          imageUrl: product.imageUrl,
        },
      });
      // After login + add, user can proceed from cart drawer
      return;
    }
    if (!product) return;
    try {
      await addToCart(product.id, BigInt(quantity));
      navigate({ to: "/checkout" });
    } catch {
      toast.error("Failed to proceed to checkout. Please try again.");
    }
  };

  const handleWhatsAppShare = () => {
    if (!product) return;
    const msg = encodeURIComponent(
      `Check out ${product.name} on revAlife! ₹${Number(product.price).toLocaleString("en-IN")} — ${window.location.href}`,
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="w-full aspect-square rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center px-4">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
            <XCircle className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <h2 className="text-xl font-bold font-display mb-2">
            Product not found
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            This product may have been removed or the link is incorrect.
          </p>
          <Link to="/products">
            <Button className="bg-wellness-green hover:bg-wellness-green-dark rounded-full px-7">
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabel =
    categoryLabels[product.category] ?? (product.category as string);

  return (
    <div className="min-h-screen bg-background py-10 md:py-14">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8"
          aria-label="Breadcrumb"
          data-ocid="product.breadcrumb"
        >
          <Link to="/" className="hover:text-wellness-green transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link
            to="/products"
            className="hover:text-wellness-green transition-colors"
          >
            Products
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium line-clamp-1">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div className="aspect-square w-full rounded-2xl overflow-hidden border border-border/50 shadow-card bg-muted">
            {imgFailed ? (
              <ProductImageFallback
                name={product.name}
                categoryLabel={product.category as string}
                className="w-full h-full"
              />
            ) : (
              <img
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
                decoding="async"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                width={600}
                height={600}
                className="w-full h-full object-cover"
                onError={() => setImgFailed(true)}
              />
            )}
          </div>

          {/* Details */}
          <div className="space-y-5">
            {/* Category + Stock badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-wellness-green/10 text-wellness-green border border-wellness-green/30 rounded-full px-3 py-1 text-xs font-semibold hover:bg-wellness-green/10">
                {categoryLabel}
              </Badge>
              {product.inStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-3 w-3" />
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-destructive border border-red-200">
                  <XCircle className="h-3 w-3" />
                  Out of Stock
                </span>
              )}
            </div>

            {/* Name + Price */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground leading-tight">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-wellness-green mt-3 font-display">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                + ₹15 shipping · Free above ₹500
              </p>
            </div>

            {/* Quantity selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-foreground font-display">
                Quantity
              </span>
              <div className="flex items-center gap-0 border border-border/60 rounded-full overflow-hidden bg-card shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="h-9 w-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors disabled:opacity-40"
                  aria-label="Decrease quantity"
                  data-ocid="product.quantity_decrease"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span
                  className="min-w-[2.5rem] text-center text-sm font-bold text-foreground font-display select-none"
                  data-ocid="product.quantity_value"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  disabled={quantity >= 10}
                  className="h-9 w-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors disabled:opacity-40"
                  aria-label="Increase quantity"
                  data-ocid="product.quantity_increase"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !product.inStock}
                className="flex-1 bg-wellness-green hover:bg-wellness-green-dark rounded-full h-12 text-base font-semibold shadow-card hover:shadow-card-hover transition-all"
                size="lg"
                data-ocid="product.add_to_cart_button"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isAddingToCart
                  ? "Adding…"
                  : addedFeedback
                    ? "Added! ✓"
                    : "Add to Cart"}
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={isAddingToCart || !product.inStock}
                variant="outline"
                className="flex-1 border-wellness-green text-wellness-green hover:bg-wellness-green hover:text-white rounded-full h-12 text-base font-semibold transition-all"
                size="lg"
                data-ocid="product.buy_now_button"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Buy Now
              </Button>
            </div>

            {/* WhatsApp share */}
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#25D366] transition-colors font-medium"
              data-ocid="product.whatsapp_share_button"
            >
              <MessageCircle className="h-4 w-4" />
              Share on WhatsApp
            </button>

            {/* Disclaimer */}
            <Alert className="border-amber-200/80 bg-amber-50 rounded-xl">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-xs text-amber-800 leading-relaxed">
                These statements have not been evaluated by the FDA. This
                product is not intended to diagnose, treat, cure or prevent any
                disease.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* Detail sections */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          {/* Description */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold font-display text-foreground">
                Description
              </h2>
              <div className="flex-1 h-px bg-border/60" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.fullDescription}
            </p>
          </section>

          {/* How to Use */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold font-display text-foreground">
                How to Use
              </h2>
              <div className="flex-1 h-px bg-border/60" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.howToUse}
            </p>
          </section>

          {/* Benefits */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold font-display text-foreground">
                Benefits
              </h2>
              <div className="flex-1 h-px bg-border/60" />
            </div>
            <ul className="space-y-2">
              {product.benefits.map((benefit, index) => (
                <li
                  // biome-ignore lint/suspicious/noArrayIndexKey: static benefits list
                  key={index}
                  className="flex items-start gap-2.5 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-wellness-green shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </section>

          {/* Ingredients */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold font-display text-foreground">
                Ingredients
              </h2>
              <div className="flex-1 h-px bg-border/60" />
            </div>
            <ul className="space-y-2">
              {product.ingredients.map((ingredient, index) => (
                <li
                  // biome-ignore lint/suspicious/noArrayIndexKey: static ingredients list
                  key={index}
                  className="flex items-start gap-2.5 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-wellness-green/60 shrink-0" />
                  {ingredient}
                </li>
              ))}
            </ul>
          </section>

          {/* Safety Info — full width */}
          <section className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold font-display text-foreground">
                Safety Information
              </h2>
              <div className="flex-1 h-px bg-border/60" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.safetyInfo}
            </p>
          </section>
        </div>

        {/* ── Related Products ───────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="mt-16" data-ocid="product.related_section">
            <div className="mb-8">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-wellness-green mb-2">
                You might also like
              </p>
              <h2 className="text-xl md:text-2xl font-bold font-display text-foreground">
                Related Products
              </h2>
              <div className="h-0.5 w-8 bg-wellness-green rounded-full mt-2" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 max-w-2xl">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  shortDescription={p.shortDescription}
                  price={Number(p.price)}
                  imageUrl={p.imageUrl}
                  categoryLabel={
                    categoryLabels[p.category] ?? (p.category as string)
                  }
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
