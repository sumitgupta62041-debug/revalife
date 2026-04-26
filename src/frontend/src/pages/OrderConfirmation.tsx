import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useParams } from "@tanstack/react-router";
import { CheckCircle, Mail, Package, Phone } from "lucide-react";
import { useOrders } from "../hooks/useOrders";

export default function OrderConfirmation() {
  const { orderId } = useParams({ from: "/order-confirmation/$orderId" });
  const { data: order, isLoading } = useOrders.useGetOrderById(orderId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Order not found</p>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600">Thank you for your order</p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="text-xl font-bold">{order.orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-wellness-green">
                  ₹{Number(order.totalAmount)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
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

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p className="text-sm text-gray-700">
                  {order.shippingAddress.line1}
                  {order.shippingAddress.line2 &&
                    `, ${order.shippingAddress.line2}`}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                  {order.shippingAddress.pincode}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3 mb-4">
              <Package className="h-6 w-6 text-wellness-green mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Estimated Delivery</h3>
                <p className="text-gray-700">
                  Your order will be delivered within 3-7 business days
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Next Steps</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li>You will receive an order confirmation email shortly</li>
                <li>Track your order status in My Account</li>
                <li>Contact us if you have any questions</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Customer Support</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-wellness-green" />
                <a
                  href="mailto:revalife171@gmail.com"
                  className="text-wellness-green hover:underline"
                >
                  revalife171@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-wellness-green" />
                <div>
                  <a
                    href="tel:+918942932189"
                    className="text-wellness-green hover:underline"
                  >
                    +91 8942932189
                  </a>
                  {", "}
                  <a
                    href="tel:+918700829733"
                    className="text-wellness-green hover:underline"
                  >
                    +91 8700829733
                  </a>
                </div>
              </div>
              <p className="text-gray-600">
                Business Hours: 6-8 AM, 4-6 PM IST
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-4">
          <Link to="/account" search={{ tab: "orders" }} className="flex-1">
            <Button variant="outline" className="w-full">
              View Order Details
            </Button>
          </Link>
          <Link to="/products" className="flex-1">
            <Button className="w-full bg-wellness-green hover:bg-wellness-green-dark">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
