import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

const FOOTER_SECTIONS = [
  {
    title: "Company",
    links: [
      { to: "/about", label: "About Us" },
      { to: "/science", label: "Our Science" },
      { to: "/contact", label: "Contact Us" },
    ],
  },
  {
    title: "Help",
    links: [
      { to: "/faq", label: "FAQs" },
      { to: "/shipping", label: "Shipping Info" },
      { to: "/returns", label: "Returns & Refunds" },
      { to: "/track-order", label: "Order Tracking" },
      { to: "/terms", label: "Terms of Service" },
      { to: "/privacy", label: "Privacy Policy" },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    window.location.hostname || "revalife-app",
  );

  return (
    <footer className="bg-card border-t border-border/60 mt-auto">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="md:col-span-1">
            <span className="text-2xl font-bold font-display text-wellness-green tracking-tight">
              revAlife
            </span>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-xs">
              Science-backed wellness supplements crafted for Indian health
              needs. Quality you can trust.
            </p>
          </div>

          {/* Link sections */}
          {FOOTER_SECTIONS.map(({ title, links }) => (
            <div key={title}>
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-foreground mb-1">
                {title}
              </h3>
              <div className="h-0.5 w-8 bg-wellness-green rounded-full mb-4" />
              <ul className="space-y-2.5">
                {links.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-sm text-muted-foreground hover:text-wellness-green transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact + Connect */}
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-widest text-foreground mb-1">
              Contact
            </h3>
            <div className="h-0.5 w-8 bg-wellness-green rounded-full mb-4" />
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="mailto:revalife171@gmail.com"
                  className="hover:text-wellness-green transition-colors duration-200"
                >
                  revalife171@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+918942932189"
                  className="hover:text-wellness-green transition-colors duration-200"
                >
                  +91 8942932189
                </a>
              </li>
              <li>
                <a
                  href="tel:+918700829733"
                  className="hover:text-wellness-green transition-colors duration-200"
                >
                  +91 8700829733
                </a>
              </li>
              <li>
                <a
                  href="tel:+918840378589"
                  className="hover:text-wellness-green transition-colors duration-200"
                >
                  +91 884 037 8589
                </a>
              </li>
              <li>
                <a
                  href="tel:+919336457006"
                  className="hover:text-wellness-green transition-colors duration-200"
                >
                  +91 93364 57006
                </a>
              </li>
              <li className="pt-1 text-xs">
                Lovely Professional University
                <br />
                Punjab, India
              </li>
              <li className="text-xs text-muted-foreground/70">
                Mon–Sat: 6–8 AM & 4–6 PM IST
              </li>
            </ul>

            <a
              href="https://wa.me/918942932189?text=Hi%20revAlife%2C%20I%20need%20help%20with..."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 bg-wellness-green text-white text-sm font-medium px-4 py-2.5 rounded-full hover:bg-wellness-green-dark transition-all duration-200 shadow-xs hover:shadow-card"
            >
              <SiWhatsapp className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            © {currentYear} revAlife. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/70 flex items-center justify-center gap-1">
            Built with{" "}
            <Heart className="h-3.5 w-3.5 text-destructive fill-destructive" />{" "}
            using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-wellness-green hover:underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
