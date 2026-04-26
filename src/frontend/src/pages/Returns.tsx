import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Mail, RotateCcw } from "lucide-react";

export default function Returns() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Returns & Refunds
        </h1>

        <div className="space-y-6">
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <RotateCcw className="h-8 w-8 text-wellness-green" />
              <h2 className="text-2xl font-bold">7-Day Return Policy</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  We offer a <strong>7-day return policy</strong> from the date
                  of delivery. If you're not satisfied with your purchase, you
                  can return eligible products within this period for a full
                  refund. Please note that the return period starts from the
                  delivery date, not the order date.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-8 w-8 text-wellness-green" />
              <h2 className="text-2xl font-bold">Eligibility Criteria</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-700 mb-4">
                  To be eligible for a return, products must meet the following
                  conditions:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-wellness-green mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Product must be <strong>unopened and unused</strong>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-wellness-green mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Product must be in <strong>original packaging</strong>{" "}
                      with all labels intact
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-wellness-green mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Product must <strong>not be consumed</strong> or partially
                      used
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-wellness-green mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Return must be initiated{" "}
                      <strong>within 7 days of delivery</strong>
                    </span>
                  </li>
                </ul>
                <p className="text-sm text-gray-600 mt-4">
                  Note: For hygiene and safety reasons, we cannot accept returns
                  of opened or consumed products unless there is a manufacturing
                  defect or quality issue.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Return Process</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-wellness-green text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">
                        Contact Customer Support
                      </h3>
                      <p className="text-gray-700 text-sm">
                        Email us at revalife171@gmail.com or call +91 8942932189
                        / +91 8700829733 to initiate a return. Provide your
                        order ID and reason for return.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-wellness-green text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">
                        Get Return Authorization
                      </h3>
                      <p className="text-gray-700 text-sm">
                        Our team will review your request and provide return
                        instructions if eligible. You'll receive a return
                        authorization and shipping address.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-wellness-green text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Ship the Product</h3>
                      <p className="text-gray-700 text-sm">
                        Pack the product securely in its original packaging and
                        ship it to the provided address. We recommend using a
                        trackable shipping method.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-wellness-green text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Receive Refund</h3>
                      <p className="text-gray-700 text-sm">
                        Once we receive and inspect the returned product, we'll
                        process your refund within 7-10 business days.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="h-8 w-8 text-wellness-green" />
              <h2 className="text-2xl font-bold">Refund Timeline</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Refunds are processed within{" "}
                  <strong>7-10 business days</strong> after we receive and
                  inspect the returned product. The refund will be credited to
                  your original payment method. Please note that it may take an
                  additional 3-5 business days for the refund to reflect in your
                  account, depending on your bank or payment provider.
                </p>
                <p className="text-sm text-gray-600">
                  Shipping charges are non-refundable unless the return is due
                  to our error or a defective product.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="h-8 w-8 text-wellness-green" />
              <h2 className="text-2xl font-bold">Contact for Returns</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-700 mb-4">
                  For return requests or questions, please contact our customer
                  support:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:revalife171@gmail.com"
                      className="text-wellness-green hover:underline"
                    >
                      revalife171@gmail.com
                    </a>
                  </p>
                  <p className="text-gray-700">
                    <strong>Phone:</strong>{" "}
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
                  </p>
                  <p className="text-gray-700">
                    <strong>Business Hours:</strong> 6-8 AM, 4-6 PM IST
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
