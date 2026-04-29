import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { useCartDrawer } from "../contexts/CartDrawerContext";
import { useCart } from "../hooks/useCart";

const SHIPPING_COST = 15;
const FREE_SHIPPING_THRESHOLD = 500;

export default function CartDrawer() {
  const { isOpen, lastAddedProduct, closeDrawer } = useCartDrawer();
  const { cart, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeDrawer();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeDrawer]);

  const items = cart?.items ?? [];
  const subtotal = items.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0,
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    closeDrawer();
    navigate({ to: "/checkout" });
  };

  const handleViewCart = () => {
    closeDrawer();
    navigate({ to: "/cart" });
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={closeDrawer}
        onKeyDown={(e) => e.key === "Enter" && closeDrawer()}
        role="presentation"
        aria-hidden="true"
        className={[
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Drawer Panel — right-side slide-in using plain div, NOT dialog */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role */}
      <div
        aria-modal="true"
        aria-label="Shopping Cart"
        data-ocid="cart.drawer"
        className={[
          "fixed top-0 right-0 h-full z-50",
          "w-[380px] md:w-[420px]",
          "flex flex-col bg-card border-l border-border shadow-2xl",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-wellness-green" />
            <h2 className="text-base font-semibold font-display text-foreground">
              Your Cart
            </h2>
            {items.length > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-wellness-green/10 text-wellness-green text-xs font-bold">
                {items.reduce((acc, i) => acc + Number(i.quantity), 0)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart"
            data-ocid="cart.close_button"
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* ── Scrollable Content ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-2 space-y-4">
          {/* Just Added */}
          {lastAddedProduct && (
            <div className="rounded-xl bg-wellness-green/5 border border-wellness-green/20 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-wellness-green" />
                <span className="text-xs font-semibold text-wellness-green">
                  Just added to cart!
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-lg overflow-hidden border border-border/50 shrink-0 bg-muted">
                  <img
                    src={lastAddedProduct.imageUrl}
                    alt={lastAddedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold font-display text-foreground line-clamp-2 leading-snug">
                    {lastAddedProduct.name}
                  </p>
                  <p className="text-base font-bold text-wellness-green mt-1 font-display">
                    ₹{lastAddedProduct.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cart Items */}
          {items.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-center"
              data-ocid="cart.empty_state"
            >
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <p className="font-semibold font-display text-foreground mb-1">
                Your cart is empty
              </p>
              <p className="text-xs text-muted-foreground mb-5">
                Browse our wellness products and add something!
              </p>
              <Button
                onClick={() => {
                  closeDrawer();
                  navigate({ to: "/products" });
                }}
                className="bg-wellness-green hover:bg-wellness-green-dark text-white rounded-full px-6 h-9 text-sm"
                data-ocid="cart.browse_products_button"
              >
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="space-y-3" data-ocid="cart.items_list">
              {items.map((item, index) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0"
                  data-ocid={`cart.item.${index + 1}`}
                >
                  <div className="h-14 w-14 rounded-lg overflow-hidden border border-border/50 shrink-0 bg-muted">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold font-display text-foreground leading-snug line-clamp-2">
                      {item.product.name}
                    </p>
                    <p className="text-sm font-bold text-wellness-green mt-0.5 font-display">
                      ₹
                      {(
                        Number(item.price) * Number(item.quantity)
                      ).toLocaleString("en-IN")}
                    </p>
                    {/* Qty controls */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          Number(item.quantity) > 1
                            ? updateQuantity(
                                item.product.id,
                                BigInt(Number(item.quantity) - 1),
                              )
                            : removeItem(item.product.id)
                        }
                        aria-label="Decrease quantity"
                        className="h-6 w-6 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        data-ocid={`cart.decrease_qty.${index + 1}`}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs font-semibold w-5 text-center">
                        {Number(item.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            BigInt(Number(item.quantity) + 1),
                          )
                        }
                        aria-label="Increase quantity"
                        className="h-6 w-6 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        data-ocid={`cart.increase_qty.${index + 1}`}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id)}
                    aria-label={`Remove ${item.product.name}`}
                    className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    data-ocid={`cart.delete_button.${index + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Order Summary + CTAs ── */}
        {items.length > 0 && (
          <div className="px-4 pt-3 pb-5 border-t border-border space-y-4 bg-card">
            {/* Summary box */}
            <div
              className="bg-muted/30 rounded-xl p-3.5 space-y-2"
              data-ocid="cart.order_summary"
            >
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold font-display">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <Separator className="bg-border/60" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Shipping</span>
                {shipping === 0 ? (
                  <span className="text-wellness-green font-semibold text-xs">
                    FREE 🎉
                  </span>
                ) : (
                  <span className="font-semibold font-display">
                    ₹{shipping}
                  </span>
                )}
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-muted-foreground">
                  Add ₹
                  {(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString("en-IN")}{" "}
                  more for free shipping
                </p>
              )}
              <Separator className="bg-border/60" />
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm">Total</span>
                <span className="text-lg font-bold text-wellness-green font-display">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5">
              <Button
                onClick={handleCheckout}
                className="w-full h-12 rounded-xl bg-wellness-green hover:bg-wellness-green-dark text-white text-sm font-semibold shadow-card hover:shadow-card-hover transition-all"
                data-ocid="cart.checkout_now_button"
              >
                Checkout Now →
              </Button>
              <Button
                onClick={closeDrawer}
                variant="outline"
                className="w-full h-12 rounded-xl border-2 border-wellness-green text-wellness-green hover:bg-wellness-green/5 text-sm font-semibold transition-all"
                data-ocid="cart.add_more_products_button"
              >
                Add More Products
              </Button>
            </div>

            {/* View full cart link */}
            <button
              type="button"
              onClick={handleViewCart}
              className="w-full text-center text-xs text-muted-foreground hover:text-wellness-green underline underline-offset-2 transition-colors"
              data-ocid="cart.view_full_cart_link"
            >
              View Full Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
