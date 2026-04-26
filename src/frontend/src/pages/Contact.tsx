import { Card, CardContent } from "@/components/ui/card";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export default function Contact() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-wellness-green mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <a
                    href="mailto:revalife171@gmail.com"
                    className="text-wellness-green hover:underline"
                  >
                    revalife171@gmail.com
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-wellness-green mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <div className="space-y-1">
                    <a
                      href="tel:+918942932189"
                      className="block text-wellness-green hover:underline"
                    >
                      +91 8942932189
                    </a>
                    <a
                      href="tel:+918700829733"
                      className="block text-wellness-green hover:underline"
                    >
                      +91 8700829733
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-wellness-green mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p className="text-gray-700">
                    Lovely Professional University
                    <br />
                    Punjab, India
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-wellness-green mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Business Hours</h3>
                  <p className="text-gray-700">
                    Morning: 6:00 AM - 8:00 AM
                    <br />
                    Evening: 4:00 PM - 6:00 PM
                    <br />
                    <span className="text-sm text-gray-600">(IST)</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-wellness-green text-white">
          <CardContent className="p-8 text-center">
            <SiWhatsapp className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">
              Chat with us on WhatsApp
            </h2>
            <p className="mb-6">
              Get instant support and answers to your questions
            </p>
            <a
              href="https://wa.me/918942932189?text=Hi%20revAlife%2C%20I%20need%20help%20with..."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-wellness-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Chat
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
