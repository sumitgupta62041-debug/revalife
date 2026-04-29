import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle,
  Home,
  Package,
  Search,
  Truck,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { OrderStatus } from "../backend";
import { useGetOrderById } from "../hooks/useOrders";

const STATUS_STEPS = [
  { status: OrderStatus.pending, label: "Order Placed", icon: Package },
  { status: OrderStatus.confirmed, label: "Confirmed", icon: CheckCircle },
  { status: OrderStatus.shipped, label: "Shipped", icon: Truck },
  { status: OrderStatus.delivered, label: "Delivered", icon: Home },
];

const STATUS_PROGRESS: Record<string, number> = {
  [OrderStatus.pending]: 1,
  [OrderStatus.confirmed]: 2,
  [OrderStatus.shipped]: 3,
  [OrderStatus.delivered]: 4,
  [OrderStatus.cancelled]: 0,
};

function statusBadge(status: OrderStatus) {
  switch (status) {
    case OrderStatus.pending:
      return "bg-amber-100 text-amber-700 border-amber-200";
    case OrderStatus.confirmed:
      return "bg-blue-100 text-blue-700 border-blue-200";
    case OrderStatus.shipped:
      return "bg-purple-100 text-purple-700 border-purple-200";
    case OrderStatus.delivered:
      return "bg-green-100 text-green-700 border-green-200";
    case OrderStatus.cancelled:
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

function formatDate(time: bigint) {
  return new Date(Number(time) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getEstimatedDelivery(createdAt: bigint) {
  const orderDate = new Date(Number(createdAt) / 1_000_000);
  const minDate = new Date(orderDate);
  minDate.setDate(minDate.getDate() + 1);
  const maxDate = new Date(orderDate);
  maxDate.setDate(maxDate.getDate() + 3);
  return `${minDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} – ${maxDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`;
}

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [searchedOrderId, setSearchedOrderId] = useState("");
  const { data: order, isLoading, isError } = useGetOrderById(searchedOrderId);

  const handleTrack = () => {
    const trimmed = orderId.trim();
    if (trimmed) setSearchedOrderId(trimmed);
  };

  const currentStep = order
    ? (STATUS_PROGRESS[order.orderStatus as string] ?? 0)
    : 0;
  const isCancelled = order?.orderStatus === OrderStatus.cancelled;

  return (
    <div className="min-h-screen" data-ocid="order_tracking.page">
      {/* Header */}
      <section className="bg-card border-b py-14 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold font-display text-foreground mb-3">
            Track Your Order
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Enter your Order ID below to see real-time delivery status.
          </p>
        </div>
      </section>

      <section className="py-14 px-4 bg-background">
        <div className="container mx-auto max-w-3xl space-y-8">
          {/* Search Card */}
          <Card
            className="border shadow-card"
            data-ocid="order_tracking.search_card"
          >
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="orderId">Order ID</Label>
                  <Input
                    id="orderId"
                    data-ocid="order_tracking.order_id_input"
                    placeholder="Enter your Order ID (e.g. ABC12345...)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                  />
                  <p className="text-xs text-muted-foreground">
                    Find your Order ID in your confirmation message or My
                    Account &gt; Orders.
                  </p>
                </div>
                <Button
                  onClick={handleTrack}
                  disabled={!orderId.trim()}
                  data-ocid="order_tracking.track_button"
                  className="w-full bg-wellness-green hover:bg-wellness-green-dark text-white"
                  size="lg"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Track Order
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Loading */}
          {isLoading && searchedOrderId && (
            <div className="space-y-4" data-ocid="order_tracking.loading_state">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-56 w-full rounded-xl" />
            </div>
          )}

          {/* Error */}
          {isError && searchedOrderId && !isLoading && (
            <Card
              className="border border-destructive/30 bg-destructive/5"
              data-ocid="order_tracking.error_state"
            >
              <CardContent className="p-8 text-center">
                <XCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
                <p className="font-bold text-foreground mb-1">
                  Order Not Found
                </p>
                <p className="text-sm text-muted-foreground">
                  No order found with ID{" "}
                  <span className="font-mono font-semibold">
                    {searchedOrderId}
                  </span>
                  . Please double-check your Order ID and try again.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Order Result */}
          {order && !isLoading && (
            <div
              className="space-y-6"
              data-ocid="order_tracking.result_section"
            >
              {/* Status Card */}
              <Card className="border shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-base font-bold font-display">
                      Order Status
                    </span>
                    <Badge
                      className={`text-xs px-2 py-0.5 ${statusBadge(order.orderStatus)}`}
                    >
                      {order.orderStatus.charAt(0).toUpperCase() +
                        order.orderStatus.slice(1)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2 space-y-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Order ID</span>
                    <span className="font-mono font-semibold text-foreground text-xs">
                      {order.orderId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Order Date</span>
                    <span className="font-semibold text-foreground">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  {!isCancelled &&
                    order.orderStatus !== OrderStatus.delivered && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Estimated Delivery
                        </span>
                        <span className="font-semibold text-foreground">
                          {getEstimatedDelivery(order.createdAt)}
                        </span>
                      </div>
                    )}

                  {/* Progress Steps */}
                  {!isCancelled ? (
                    <div className="relative pt-2">
                      {/* Progress bar */}
                      <div className="absolute top-[28px] left-6 right-6 h-0.5 bg-border" />
                      <div
                        className="absolute top-[28px] left-6 h-0.5 bg-wellness-green transition-all duration-700"
                        style={{
                          width:
                            currentStep === 0
                              ? "0%"
                              : currentStep >= 4
                                ? "calc(100% - 3rem)"
                                : `calc(${((currentStep - 1) / 3) * 100}% - ${currentStep === 1 ? "0px" : "1.5rem"})`,
                        }}
                      />
                      <div className="relative flex justify-between">
                        {STATUS_STEPS.map((step, i) => {
                          const isActive = currentStep > i;
                          const isCurrent = currentStep === i + 1;
                          return (
                            <div
                              key={step.status}
                              className="flex flex-col items-center gap-2"
                              data-ocid={`order_tracking.step.${i + 1}`}
                            >
                              <div
                                className={`h-12 w-12 rounded-full flex items-center justify-center transition-all z-10 ${
                                  isActive
                                    ? "bg-wellness-green text-white shadow-card"
                                    : isCurrent
                                      ? "bg-wellness-green/10 border-2 border-wellness-green text-wellness-green"
                                      : "bg-muted text-muted-foreground"
                                }`}
                              >
                                <step.icon className="h-5 w-5" />
                              </div>
                              <p
                                className={`text-xs font-medium text-center max-w-[60px] ${
                                  isActive || isCurrent
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {step.label}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-xl">
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                      <p className="text-sm text-foreground font-medium">
                        This order has been cancelled.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Details */}
              <Card className="border shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold font-display">
                    Order Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Items */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Items Ordered
                    </p>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={`${item.product.id}-${idx}`}
                          data-ocid={`order_tracking.item.${idx + 1}`}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-foreground font-medium">
                            {item.product.name}
                            <span className="text-muted-foreground font-normal">
                              {" "}
                              &times; {Number(item.quantity)}
                            </span>
                          </span>
                          <span className="text-muted-foreground">
                            ₹
                            {(
                              Number(item.price) * Number(item.quantity)
                            ).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4 flex justify-between font-bold">
                    <span className="text-foreground">Total Amount</span>
                    <span className="text-wellness-green">
                      ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Shipping */}
                  <div className="border-t pt-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Shipping Address
                    </p>
                    <p className="text-sm text-foreground">
                      {order.shippingAddress.line1}
                      {order.shippingAddress.line2
                        ? `, ${order.shippingAddress.line2}`
                        : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state} —{" "}
                      {order.shippingAddress.pincode}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Help CTA */}
          {!searchedOrderId && (
            <Card className="border shadow-card bg-muted/30">
              <CardContent className="p-7 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Don't have your Order ID? Find it in your account order
                  history or contact us on WhatsApp.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a
                    href="/account"
                    data-ocid="order_tracking.my_account_link"
                    className="text-sm text-wellness-green hover:underline font-medium"
                  >
                    View My Orders
                  </a>
                  <span className="text-muted-foreground">·</span>
                  <a
                    href="https://wa.me/918942932189?text=Hi%20revAlife%2C%20I%20need%20help%20tracking%20my%20order"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid="order_tracking.whatsapp_link"
                    className="text-sm text-wellness-green hover:underline font-medium"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
