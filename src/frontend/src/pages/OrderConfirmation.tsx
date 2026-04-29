import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
} from "lucide-react";
import { useGetOrderById } from "../hooks/useOrders";

export default function OrderConfirmation() {
  const { orderId } = useParams({ from: "/order-confirmation/$orderId" });
  const { data: order, isLoading } = useGetOrderById(orderId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border/60 py-8">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-12 max-w-3xl space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <Package className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
          <h2 className="text-xl font-bold font-display mb-2">
            Order not found
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            We couldn't find this order. It may have been moved or the link is
            invalid.
          </p>
          <Link to="/">
            <Button className="bg-wellness-green hover:bg-wellness-green-dark rounded-full">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = Number(order.totalAmount) - 15;
  const paymentLabel = String(order.paymentMethod).includes("cod")
    ? "Cash on Delivery"
    : "UPI";

  return (
    <div
      className="min-h-screen bg-background"
      data-ocid="order_confirmation.page"
    >
      {/* Success banner */}
      <div className="bg-wellness-green text-white py-10">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle2 className="h-9 w-9 text-white" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display mb-1">
            Order Placed Successfully!
          </h1>
          <p className="text-white/80 text-sm">
            Thank you for your order. We'll deliver it to your LPU address soon.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-4">
        {/* Order ID + meta */}
        <div className="bg-card rounded-2xl border border-border/40 shadow-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">
              Order ID
            </p>
            <p className="font-mono font-bold text-foreground text-base">
              #{order.orderId.toUpperCase()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Placed on{" "}
              {new Date(Number(order.createdAt) / 1_000_000).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                },
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-amber-100 text-amber-800 border border-amber-200 text-xs">
              Pending
            </Badge>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total Paid</p>
              <p className="font-bold text-xl text-wellness-green">
                ₹{Number(order.totalAmount).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {/* Order items */}
        <div className="bg-card rounded-2xl border border-border/40 shadow-card p-5">
          <h2 className="font-bold font-display text-base mb-4 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-wellness-green" />
            Order Items
          </h2>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: items have no stable id
              <div key={index} className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl overflow-hidden bg-muted border border-border/30 shrink-0">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground line-clamp-1">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {Number(item.quantity)}
                  </p>
                </div>
                <span className="text-sm font-bold text-foreground shrink-0">
                  ₹{Number(item.price).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>₹15</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-1 border-t border-border/50">
              <span>Total</span>
              <span className="text-wellness-green">
                ₹{Number(order.totalAmount).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery info + payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl border border-border/40 shadow-card p-5">
            <h3 className="font-bold font-display text-sm mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-wellness-green" />
              Delivery Address
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 &&
                `, ${order.shippingAddress.line2}`}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Lovely Professional University, {order.shippingAddress.city},{" "}
              {order.shippingAddress.state} — {order.shippingAddress.pincode}
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border/40 shadow-card p-5 space-y-3">
            <h3 className="font-bold font-display text-sm mb-1">
              Payment &amp; Delivery
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground w-20 text-xs">
                Payment
              </span>
              <Badge variant="outline" className="text-xs font-semibold">
                {paymentLabel}
              </Badge>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Clock className="h-4 w-4 text-wellness-green mt-0.5 shrink-0" />
              <p className="text-muted-foreground text-xs">
                Estimated delivery:{" "}
                <strong className="text-foreground">3–5 business days</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Next steps */}
        <div className="bg-muted/40 rounded-2xl border border-border/30 p-5">
          <h3 className="font-semibold font-display text-sm mb-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-wellness-green" />
            What happens next?
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              "Your order is being reviewed and will be confirmed shortly",
              "For UPI orders — send your payment screenshot via WhatsApp",
              "Track your order status in My Account under Orders",
              "Our team will deliver to your LPU room/hostel address",
            ].map((step) => (
              <li key={step} className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-wellness-green mt-0.5 shrink-0" />
                {step}
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="bg-card rounded-2xl border border-border/40 shadow-card p-5">
          <h3 className="font-semibold font-display text-sm mb-3">
            Need help?
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 text-sm">
            <a
              href="mailto:revalife171@gmail.com"
              className="flex items-center gap-2 text-wellness-green hover:underline"
            >
              <Mail className="h-4 w-4" />
              revalife171@gmail.com
            </a>
            <a
              href="tel:+918942932189"
              className="flex items-center gap-2 text-wellness-green hover:underline"
            >
              <Phone className="h-4 w-4" />
              +91 8942932189
            </a>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Business Hours: 6–8 AM &amp; 4–6 PM IST
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pb-4">
          <Link to="/account" search={{ tab: "orders" }} className="flex-1">
            <Button
              variant="outline"
              className="w-full rounded-full"
              data-ocid="order_confirmation.track_order_button"
            >
              <Package className="h-4 w-4 mr-2" />
              Track Order
            </Button>
          </Link>
          <Link to="/products" className="flex-1">
            <Button
              className="w-full bg-wellness-green hover:bg-wellness-green-dark rounded-full shadow-card transition-all"
              data-ocid="order_confirmation.continue_shopping_button"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
