import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Package, Truck } from "lucide-react";

export default function Shipping() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Shipping Information
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Clock className="h-8 w-8 text-wellness-green mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Delivery Timeline
                  </h3>
                  <p className="text-gray-700">
                    Orders are typically delivered within{" "}
                    <strong>3-7 business days</strong> across India. Delivery
                    times may vary based on your location and product
                    availability.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-8 w-8 text-wellness-green mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Coverage Area</h3>
                  <p className="text-gray-700">
                    We deliver to <strong>all states across India</strong>.
                    Whether you're in a metro city or a remote location, we'll
                    get your products to you safely.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Truck className="h-8 w-8 text-wellness-green" />
              <h2 className="text-2xl font-bold">Shipping Charges</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Orders above ₹500</span>
                    <span className="font-bold text-wellness-green text-lg">
                      FREE SHIPPING
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Orders below ₹500</span>
                    <span className="font-bold text-lg">₹50</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Tip: Add more items to your cart to qualify for free shipping!
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Package className="h-8 w-8 text-wellness-green" />
              <h2 className="text-2xl font-bold">Courier Partners</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  We work with trusted courier partners to ensure safe and
                  timely delivery of your orders. All packages are carefully
                  packed to prevent damage during transit. You will receive
                  tracking information via email once your order is shipped,
                  allowing you to monitor its progress.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Order Tracking</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Track your order easily using your order ID. You can:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Visit the Order Tracking page and enter your order ID</li>
                  <li>Check your email for tracking updates</li>
                  <li>View order status in the My Account section</li>
                  <li>Contact customer support for assistance</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Shipping Policy</h2>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3 text-gray-700">
                  <li>• Orders are processed within 1-2 business days</li>
                  <li>• Shipping times are estimates and not guaranteed</li>
                  <li>
                    • Delays may occur due to weather, holidays, or courier
                    issues
                  </li>
                  <li>
                    • We are not responsible for delays caused by incorrect
                    addresses
                  </li>
                  <li>
                    • Please ensure someone is available to receive the package
                  </li>
                  <li>
                    • Contact us immediately if your package is damaged upon
                    arrival
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
