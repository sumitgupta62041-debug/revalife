import { Link } from "@tanstack/react-router";
import { Loader2, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLoginModal } from "../App";
import type { PendingCartAction } from "../App";
import { useCartDrawer } from "../contexts/CartDrawerContext";
import { useCart } from "../hooks/useCart";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { ProductImageFallback } from "./ProductImageFallback";

interface ProductCardProps {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  imageUrl: string;
  categoryLabel: string;
  inStock?: boolean;
}

/** Poll until actor is ready or timeout expires. */
async function waitForActor(
  checkReady: () => boolean,
  pollMs = 200,
  timeoutMs = 10000,
): Promise<boolean> {
  if (checkReady()) return true;
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve) => {
    const id = setInterval(() => {
      if (checkReady()) {
        clearInterval(id);
        resolve(true);
      } else if (Date.now() >= deadline) {
        clearInterval(id);
        resolve(false);
      }
    }, pollMs);
  });
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function ProductCard({
  id,
  name,
  price,
  imageUrl,
  categoryLabel,
  inStock = true,
}: ProductCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [retryReady, setRetryReady] = useState(false);
  const { identity } = useInternetIdentity();
  const { openLoginModalWithAction } = useLoginModal();
  const { addToCart, isActorReady } = useCart();
  const { openDrawer } = useCartDrawer();

  const isAuthenticated = !!identity;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inStock) return;

    if (!isAuthenticated) {
      const action: PendingCartAction = {
        type: "addToCart",
        productId: id,
        quantity: BigInt(1),
        drawerData: { id, name, price, imageUrl },
      };
      openLoginModalWithAction(action);
      return;
    }

    setAdding(true);
    try {
      // Wait up to 2 seconds for actor to be ready before first attempt
      const ready = await waitForActor(() => isActorReady);
      if (!ready) {
        setRetryReady(true);
        toast.error("Loading ho raha hai — thodi der mein retry karo");
        return;
      }
      setRetryReady(false);

      // Retry up to 2 times with 400ms delay
      let lastErr: unknown;
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          await addToCart(id, BigInt(1));
          openDrawer({ id, name, price, imageUrl });
          setAddedFeedback(true);
          setTimeout(() => setAddedFeedback(false), 1500);
          return; // success — exit
        } catch (err) {
          lastErr = err;
          console.warn(
            `[ProductCard] addToCart attempt ${attempt} failed:`,
            err,
          );
          if (attempt < 2) await sleep(400);
        }
      }
      // All retries exhausted — show retry button
      console.error("[ProductCard] addToCart failed after retries:", lastErr);
      setRetryReady(true);
      toast.error("Cart mein add nahi hua — retry button pe click karo");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      className="group relative rounded-xl overflow-hidden bg-card border border-border/40 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
      data-ocid="product.card"
    >
      {/* Clickable image + name area → product detail */}
      <Link
        to="/products/$id"
        params={{ id }}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wellness-green focus-visible:ring-offset-2 rounded-t-xl"
        tabIndex={0}
        aria-label={`View ${name} details`}
      >
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          {imgFailed ? (
            <ProductImageFallback name={name} categoryLabel={categoryLabel} />
          ) : (
            <img
              src={imageUrl}
              alt={name}
              loading="lazy"
              decoding="async"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              width={300}
              height={375}
              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
              onError={() => setImgFailed(true)}
            />
          )}

          {/* Out of stock overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="bg-muted text-muted-foreground text-xs font-semibold px-3 py-1.5 rounded-full border border-border">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product name */}
        <div className="px-2.5 pt-2.5 pb-1">
          <h3 className="text-xs font-semibold text-foreground font-display leading-snug line-clamp-2 text-center">
            {name}
          </h3>
        </div>
      </Link>

      {/* Add to Cart button — always visible, stops propagation to Link */}
      <div className="px-2 pb-2.5">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={adding || !inStock}
          aria-label={`Add ${name} to cart`}
          data-ocid="product.add_to_cart_button"
          className={[
            "w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200",
            "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wellness-green focus-visible:ring-offset-1",
            addedFeedback
              ? "bg-wellness-green text-white border-wellness-green"
              : inStock
                ? "bg-wellness-green/10 hover:bg-wellness-green hover:text-white text-wellness-green border-wellness-green/40"
                : "bg-muted text-muted-foreground border-border cursor-not-allowed opacity-50",
          ].join(" ")}
        >
          {adding ? (
            <Loader2 className="h-3 w-3 shrink-0 animate-spin" />
          ) : (
            <ShoppingCart className="h-3 w-3 shrink-0" />
          )}
          {adding
            ? "Adding…"
            : addedFeedback
              ? "Added ✓"
              : retryReady
                ? "Retry"
                : "+ Cart"}
        </button>
      </div>
    </div>
  );
}
