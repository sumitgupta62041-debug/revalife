import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, Star } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { useLoginModal } from "../App";
import { useCartDrawer } from "../contexts/CartDrawerContext";
import { useCart } from "../hooks/useCart";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface ProductCardProps {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  imageUrl: string;
  categoryLabel: string;
  inStock?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  herbalSupplements: "bg-wellness-green",
  immunity: "bg-amber-500",
  digestiveHealth: "bg-teal-600",
  fitness: "bg-blue-600",
  multivitamins: "bg-purple-600",
  ayurvedicCare: "bg-orange-600",
};

export function ProductCard({
  id,
  name,
  shortDescription,
  price,
  imageUrl,
  categoryLabel,
  inStock = true,
}: ProductCardProps) {
  const { identity } = useInternetIdentity();
  const { openLoginModal } = useLoginModal();
  const { addToCart, isAddingToCart } = useCart();
  const { openDrawer } = useCartDrawer();

  const categoryColorClass =
    CATEGORY_COLORS[categoryLabel] ?? "bg-wellness-green";

  const handleAddToCart = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!identity) {
        openLoginModal();
        return;
      }

      if (!inStock) {
        toast.error("Product is out of stock");
        return;
      }

      try {
        await addToCart(id, BigInt(1));
        openDrawer({ id, name, price, imageUrl });
      } catch {
        toast.error("Could not add to cart. Please try again.");
      }
    },
    [
      id,
      name,
      price,
      imageUrl,
      inStock,
      identity,
      openLoginModal,
      addToCart,
      openDrawer,
    ],
  );

  return (
    <div
      className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated hover:-translate-y-1.5 transition-all duration-300 flex flex-col border border-border/40"
      data-ocid="product.card"
    >
      {/* Clickable image + content area — links to product detail */}
      <Link
        to="/products/$id"
        params={{ id }}
        className="flex flex-col flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wellness-green focus-visible:ring-inset rounded-2xl"
        data-ocid="product.view_link"
      >
        {/* Image container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "/assets/images/placeholder.svg";
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

          {/* Category badge */}
          <span
            className={`absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-sm ${categoryColorClass}/90`}
          >
            {categoryLabel.replace(/([A-Z])/g, " $1").trim()}
          </span>

          {/* Out of stock overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="bg-muted text-muted-foreground text-xs font-semibold px-3 py-1.5 rounded-full border border-border">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 gap-2">
          {/* Star rating */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4].map((i) => (
              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
            ))}
            <Star className="h-3 w-3 text-amber-300 fill-amber-300/40" />
            <span className="text-[11px] text-muted-foreground ml-1.5 font-medium">
              4.5
            </span>
          </div>

          {/* Product name */}
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-foreground font-display">
            {name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {shortDescription}
          </p>

          <div className="flex-1" />

          {/* Price */}
          <div className="pt-2">
            <span className="text-lg font-bold text-wellness-green font-display leading-none">
              ₹{price.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </Link>

      {/* Add to Cart button — outside the link */}
      <div className="px-4 pb-4">
        <Button
          size="sm"
          onClick={handleAddToCart}
          disabled={isAddingToCart || !inStock}
          className="w-full rounded-full bg-wellness-green hover:bg-wellness-green-dark text-white text-xs gap-1.5 shadow-xs hover:shadow-card transition-all duration-200 disabled:opacity-60 h-9"
          data-ocid="product.add_to_cart_button"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {isAddingToCart ? "Adding..." : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
