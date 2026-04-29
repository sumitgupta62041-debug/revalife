import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";
import { useLoginModal } from "../App";
import { useCart } from "../hooks/useCart";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, isLoading, updateQuantity, removeItem, isUpdating } = useCart();
  const { identity } = useInternetIdentity();
  const { openLoginModal } = useLoginModal();

  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number,
  ) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, BigInt(newQuantity));
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeItem(productId);
      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleCheckout = () => {
    if (!identity) {
      openLoginModal();
      return;
    }
    navigate({ to: "/checkout" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-4 border-wellness-green border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">Loading your cart…</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background" data-ocid="cart.empty_state">
        {/* Page header */}
        <div className="bg-card border-b border-border/60 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold font-display">
              Shopping Cart
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="h-24 w-24 rounded-full bg-muted border border-border/40 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
          </div>
          <h2 className="text-2xl font-bold font-display mb-2">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed mb-8">
            Looks like you haven't added anything yet. Explore our wellness
            products!
          </p>
          <Link to="/products">
            <Button
              className="bg-wellness-green hover:bg-wellness-green-dark rounded-full px-8 shadow-card transition-all"
              data-ocid="cart.continue_shopping_button"
            >
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Flat ₹15 shipping always
  const subtotal = Number(cart.subtotal);
  const shipping = 15;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-card border-b border-border/60 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold font-display">
            Shopping Cart
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {cart.items.length} item{cart.items.length !== 1 ? "s" : ""} in your
            cart
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3" data-ocid="cart.items_list">
            {cart.items.map((item, index) => (
              <div
                key={item.product.id}
                className="bg-card rounded-2xl p-4 shadow-card border border-border/40 flex gap-4 items-start hover:shadow-card-hover transition-shadow duration-200"
                data-ocid={`cart.item.${index + 1}`}
              >
                {/* Product image */}
                <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-muted border border-border/30">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-foreground font-display mb-1">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                    {item.product.category}
                  </p>
                  <span className="text-base font-bold text-wellness-green">
                    ₹{Number(item.product.price).toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Qty controls + line total + remove */}
                <div className="shrink-0 flex flex-col items-end gap-3">
                  {/* Quantity pill */}
                  <div className="flex items-center border border-border rounded-full overflow-hidden bg-background shadow-xs">
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateQuantity(
                          item.product.id,
                          Number(item.quantity) - 1,
                        )
                      }
                      disabled={isUpdating || Number(item.quantity) <= 1}
                      className="h-8 w-8 flex items-center justify-center hover:bg-muted disabled:opacity-40 transition-colors"
                      data-ocid={`cart.qty_minus.${index + 1}`}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 text-sm font-semibold tabular-nums min-w-[2rem] text-center">
                      {Number(item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateQuantity(
                          item.product.id,
                          Number(item.quantity) + 1,
                        )
                      }
                      disabled={isUpdating}
                      className="h-8 w-8 flex items-center justify-center hover:bg-muted disabled:opacity-40 transition-colors"
                      data-ocid={`cart.qty_plus.${index + 1}`}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Line total */}
                  <span className="text-sm font-bold text-foreground">
                    ₹{Number(item.price).toLocaleString("en-IN")}
                  </span>

                  {/* Remove */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-full hover:bg-destructive/8"
                        aria-label="Remove item"
                        data-ocid={`cart.delete_button.${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent data-ocid="cart.dialog">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove item?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove{" "}
                          <strong>{item.product.name}</strong> from your cart?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel data-ocid="cart.cancel_button">
                          Keep it
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemoveItem(item.product.id)}
                          data-ocid="cart.confirm_button"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary sidebar */}
          <div>
            <div
              className="bg-card rounded-2xl shadow-card border border-border/40 p-6 sticky top-24"
              data-ocid="cart.order_summary"
            >
              <h2 className="text-base font-bold font-display mb-5">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal ({cart.items.length} item
                    {cart.items.length !== 1 ? "s" : ""})
                  </span>
                  <span className="font-medium">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5" />
                    Shipping
                  </span>
                  <span className="font-medium">₹{shipping}</span>
                </div>
              </div>

              <div className="mt-2 px-3 py-2 bg-wellness-green/5 border border-wellness-green/20 rounded-lg text-xs text-wellness-green">
                🚚 Delivering to LPU Campus, Phagwara
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-bold mb-6">
                <span className="text-base">Total</span>
                <span className="text-lg text-wellness-green">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-wellness-green hover:bg-wellness-green-dark rounded-full py-5 font-semibold shadow-card hover:shadow-card-hover transition-all"
                size="lg"
                data-ocid="cart.checkout_button"
              >
                Proceed to Checkout
              </Button>
              <Link to="/products">
                <Button
                  variant="outline"
                  className="w-full mt-3 rounded-full"
                  data-ocid="cart.continue_shopping_button"
                >
                  Add More Products
                </Button>
              </Link>

              <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
                🔒 Safe &amp; secure checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
