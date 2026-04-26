import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    window.location.hostname || "revalife-app",
  );

  return (
    <footer className="bg-muted/40 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-wellness-green transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/science"
                  className="text-muted-foreground hover:text-wellness-green transition-colors"
                >
                  Our Science
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-wellness-green transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/faq"
                  className="text-muted-foreground hover:text-wellness-green transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-muted-foreground hover:text-wellness-green transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-muted-foreground hover:text-wellness-green transition-colors"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  to="/track-order"
                  className="text-muted-foreground hover:text-wellness-green transition-colors"
                >
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-wellness-green transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-wellness-green transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a
                  href="mailto:revalife171@gmail.com"
                  className="hover:text-wellness-green transition-colors"
                >
                  revalife171@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+918942932189"
                  className="hover:text-wellness-green transition-colors"
                >
                  +91 8942932189
                </a>
              </li>
              <li>
                <a
                  href="tel:+918700829733"
                  className="hover:text-wellness-green transition-colors"
                >
                  +91 8700829733
                </a>
              </li>
              <li className="text-sm">Lovely Professional University</li>
              <li className="text-sm">Punjab, India</li>
              <li className="text-sm font-medium mt-2">Business Hours:</li>
              <li className="text-sm">6-8 AM, 4-6 PM IST</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Connect</h3>
            <a
              href="https://wa.me/918942932189?text=Hi%20revAlife%2C%20I%20need%20help%20with..."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-wellness-green text-white px-4 py-2 rounded-lg hover:bg-wellness-green-dark transition-colors"
            >
              <SiWhatsapp className="h-5 w-5" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-muted-foreground text-sm">
          <p>© {currentYear} revAlife. All rights reserved.</p>
          <p className="mt-2 flex items-center justify-center gap-1">
            Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" />{" "}
            using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-wellness-green hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
