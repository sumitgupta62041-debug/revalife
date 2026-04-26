import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Home, Package, Truck, XCircle } from "lucide-react";
import { useState } from "react";
import { OrderStatus } from "../backend";
import { useOrders } from "../hooks/useOrders";

const orderStatusColors: Record<OrderStatus, string> = {
  [OrderStatus.pending]: "bg-yellow-500",
  [OrderStatus.confirmed]: "bg-blue-500",
  [OrderStatus.shipped]: "bg-purple-500",
  [OrderStatus.delivered]: "bg-green-500",
  [OrderStatus.cancelled]: "bg-red-500",
};

const orderStatusIcons: Record<OrderStatus, React.ReactNode> = {
  [OrderStatus.pending]: <Package className="h-6 w-6" />,
  [OrderStatus.confirmed]: <CheckCircle className="h-6 w-6" />,
  [OrderStatus.shipped]: <Truck className="h-6 w-6" />,
  [OrderStatus.delivered]: <Home className="h-6 w-6" />,
  [OrderStatus.cancelled]: <XCircle className="h-6 w-6" />,
};

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [searchedOrderId, setSearchedOrderId] = useState("");
  const {
    data: order,
    isLoading,
    error,
  } = useOrders.useGetOrderById(searchedOrderId);

  const handleTrack = () => {
    if (orderId.trim()) {
      setSearchedOrderId(orderId.trim());
    }
  };

  const getEstimatedDelivery = (createdAt: bigint) => {
    const orderDate = new Date(Number(createdAt) / 1000000);
    const minDays = 3;
    const maxDays = 7;
    const minDelivery = new Date(orderDate);
    minDelivery.setDate(minDelivery.getDate() + minDays);
    const maxDelivery = new Date(orderDate);
    maxDelivery.setDate(maxDelivery.getDate() + maxDays);
    return `${minDelivery.toLocaleDateString()} - ${maxDelivery.toLocaleDateString()}`;
  };

  const getStatusProgress = (status: OrderStatus): number => {
    switch (status) {
      case OrderStatus.pending:
        return 25;
      case OrderStatus.confirmed:
        return 50;
      case OrderStatus.shipped:
        return 75;
      case OrderStatus.delivered:
        return 100;
      case OrderStatus.cancelled:
        return 0;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Track Your Order
        </h1>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="orderId">Enter Order ID</Label>
                <Input
                  id="orderId"
                  placeholder="Enter your order ID"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleTrack()}
                />
              </div>
              <Button
                onClick={handleTrack}
                className="w-full bg-wellness-green hover:bg-wellness-green-dark"
              >
                Track Order
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading && searchedOrderId && (
          <div className="text-center py-8">
            <p>Loading order details...</p>
          </div>
        )}

        {error && searchedOrderId && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-700 font-semibold">Order not found</p>
              <p className="text-sm text-red-600 mt-2">
                Please check your order ID and try again. If you continue to
                have issues, contact customer support.
              </p>
            </CardContent>
          </Card>
        )}

        {order && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-bold text-lg">{order.orderId}</p>
                  </div>
                  <Badge className={orderStatusColors[order.orderStatus]}>
                    {order.orderStatus}
                  </Badge>
                </div>

                {order.orderStatus !== OrderStatus.cancelled && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-semibold">
                        {getStatusProgress(order.orderStatus)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-wellness-green h-2 rounded-full transition-all"
                        style={{
                          width: `${getStatusProgress(order.orderStatus)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-4 pt-4">
                  {[
                    { status: OrderStatus.pending, label: "Order Placed" },
                    { status: OrderStatus.confirmed, label: "Order Confirmed" },
                    { status: OrderStatus.shipped, label: "Shipped" },
                    { status: OrderStatus.delivered, label: "Delivered" },
                  ].map((step, index) => {
                    const isActive =
                      getStatusProgress(order.orderStatus) >= (index + 1) * 25;
                    const isCancelled =
                      order.orderStatus === OrderStatus.cancelled;
                    return (
                      <div
                        key={step.status}
                        className="flex items-center space-x-4"
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isActive && !isCancelled
                              ? "bg-wellness-green text-white"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          {orderStatusIcons[step.status]}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-semibold ${isActive && !isCancelled ? "text-gray-900" : "text-gray-400"}`}
                          >
                            {step.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Date</p>
                  <p className="font-semibold">
                    {new Date(
                      Number(order.createdAt) / 1000000,
                    ).toLocaleDateString()}
                  </p>
                </div>

                {order.orderStatus !== OrderStatus.cancelled &&
                  order.orderStatus !== OrderStatus.delivered && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Estimated Delivery
                      </p>
                      <p className="font-semibold">
                        {getEstimatedDelivery(order.createdAt)}
                      </p>
                    </div>
                  )}

                <div>
                  <p className="text-sm text-gray-600 mb-2">Items</p>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: order items have no stable id
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.product.name} x {Number(item.quantity)}
                        </span>
                        <span className="font-semibold">
                          ₹{Number(item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total Amount</span>
                    <span className="text-wellness-green">
                      ₹{Number(order.totalAmount)}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Shipping Address</p>
                  <p className="text-sm">
                    {order.shippingAddress.line1}
                    {order.shippingAddress.line2 &&
                      `, ${order.shippingAddress.line2}`}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    - {order.shippingAddress.pincode}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
