import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const FAQ_CATEGORIES = [
  {
    category: "Shipping & Delivery",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    items: [
      {
        q: "Where do you deliver?",
        a: "We currently deliver exclusively to Lovely Professional University (LPU), Phagwara, Punjab — 144411. This includes all hostels, blocks, and on-campus residences. We plan to expand to more locations soon!",
      },
      {
        q: "What are the shipping charges?",
        a: "We charge a flat shipping fee of Rs 15 on all orders, regardless of order size. There are no hidden charges.",
      },
      {
        q: "How long does delivery take?",
        a: "Orders within LPU campus are typically delivered within 1–3 business days. Delivery time may vary based on product availability and your campus location. You will be contacted before delivery.",
      },
      {
        q: "How will my order be delivered?",
        a: "Orders are carefully packed and hand-delivered within the LPU campus. Please ensure you enter your correct hostel block and room number at checkout. You'll be contacted on your registered phone number before delivery.",
      },
      {
        q: "Can I track my order?",
        a: "Yes! Visit the Order Tracking page, enter your Order ID, and see real-time status updates. You can also check your order history in My Account. For quick updates, WhatsApp us at +91 8942932189.",
      },
    ],
  },
  {
    category: "Payments",
    badge: "bg-green-100 text-green-700 border-green-200",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept UPI (any UPI app — Google Pay, PhonePe, Paytm, etc.) and Cash on Delivery (COD). We do not accept credit cards, debit cards, or net banking. UPI ID: s.saw.13@superyes.",
      },
      {
        q: "Is Cash on Delivery (COD) available?",
        a: "Yes, COD is available for all orders. Pay in cash when your order is delivered to your doorstep — no advance payment required.",
      },
      {
        q: "Is my payment information secure?",
        a: "Absolutely. We only accept UPI and COD — we never collect or store your card details. UPI payments are processed entirely within your own UPI app. Your financial data is never shared with us.",
      },
      {
        q: "What is the UPI ID for payment?",
        a: "Our UPI ID is s.saw.13@superyes. You can also scan our PhonePe QR code displayed on the checkout page for quick payment.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    items: [
      {
        q: "What is your return policy?",
        a: "We offer a 7-day return window from the date of delivery. Returns are accepted for three specific reasons: Defective product, Wrong product delivered, or Product damaged in shipment. Products must be in original, unopened packaging.",
      },
      {
        q: "Can I cancel my order?",
        a: "Yes, you can cancel orders that are in Pending or Confirmed status. Once an order is shipped, it cannot be cancelled. Go to My Account > My Orders to initiate a cancellation.",
      },
      {
        q: "Can I replace a product?",
        a: "Yes, replacements are available within 7 days of delivery for: Defective product, Wrong product delivered, or Product damaged in shipment. Go to My Account > My Orders and select the Replace option.",
      },
      {
        q: "How long does a refund take?",
        a: "Refunds are processed within 7–10 business days after we receive and inspect the returned product. Shipping charges (Rs 15) are non-refundable unless the return is due to our error.",
      },
    ],
  },
  {
    category: "Products & Safety",
    badge: "bg-purple-100 text-purple-700 border-purple-200",
    items: [
      {
        q: "Are revAlife products safe?",
        a: "Yes. All products are manufactured in GMP-certified facilities, are FSSAI compliant, and undergo third-party testing for purity, potency, and microbial safety. We recommend consulting a healthcare professional if you have existing conditions or are on medication.",
      },
      {
        q: "Are the ingredients natural?",
        a: "Yes. Our products use natural, plant-based ingredients including Ayurvedic herbs like Ashwagandha KSM-66, Moringa, Triphala, Brahmi, and Shilajit. No artificial colours, flavours, or harmful additives.",
      },
      {
        q: "Do products contain any allergens?",
        a: "Full ingredient lists are displayed on each product page. If you have specific allergies, please review the ingredient list carefully. When in doubt, consult your healthcare provider before use.",
      },
      {
        q: "How should I store my products?",
        a: "Store in a cool, dry place away from direct sunlight. Keep the packaging sealed and out of reach of children. Refer to each product's label for specific storage instructions.",
      },
      {
        q: "How long before I see results?",
        a: "Results vary by individual, product, and consistency of use. Most wellness supplements work best with regular use over 4–8 weeks. Always follow the recommended dosage. These products support general wellness and are not intended to treat or cure any disease.",
      },
    ],
  },
  {
    category: "Account & Orders",
    badge: "bg-rose-100 text-rose-700 border-rose-200",
    items: [
      {
        q: "How do I create an account?",
        a: "Click the user icon in the top-right corner of any page and select Login. Our sign-in is handled securely on-site. Once logged in, you can view orders, save addresses, and manage your account.",
      },
      {
        q: "How do I contact customer support?",
        a: "Email us at revalife171@gmail.com, call +91 8942932189 or +91 8700829733, or WhatsApp us. Our business hours are 6–8 AM and 4–6 PM IST. For order issues, have your Order ID ready.",
      },
    ],
  },
];

export default function FAQ() {
  return (
    <div className="min-h-screen" data-ocid="faq.page">
      {/* Header */}
      <section className="bg-card border-b py-14 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-wellness-green/10 text-wellness-green border-wellness-green/20 font-medium">
            Help Center
          </Badge>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-wellness-green/10 flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-wellness-green" />
            </div>
            <h1 className="text-4xl font-bold font-display text-foreground">
              Frequently Asked Questions
            </h1>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Quick answers to the most common questions about ordering, payments,
            shipping, returns, and our products.
          </p>
        </div>
      </section>

      <section className="py-14 px-4 bg-background">
        <div
          className="container mx-auto max-w-3xl space-y-10"
          data-ocid="faq.categories"
        >
          {FAQ_CATEGORIES.map((cat, ci) => (
            <div key={cat.category} data-ocid={`faq.category.item.${ci + 1}`}>
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-xl font-bold font-display text-foreground">
                  {cat.category}
                </h2>
                <Badge className={`text-xs font-medium border ${cat.badge}`}>
                  {cat.items.length} questions
                </Badge>
              </div>
              <Card className="border shadow-card">
                <CardContent className="p-0">
                  <Accordion type="single" collapsible>
                    {cat.items.map((item, qi) => (
                      <AccordionItem
                        key={item.q}
                        value={`${ci}-${qi}`}
                        data-ocid={`faq.item.${ci + 1}.${qi + 1}`}
                        className="border-b last:border-b-0 px-6"
                      >
                        <AccordionTrigger className="text-left font-semibold text-foreground text-sm py-4 hover:no-underline hover:text-wellness-green transition-colors">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className="container mx-auto max-w-3xl mt-12">
          <Card
            className="border shadow-card bg-card"
            data-ocid="faq.contact_cta"
          >
            <CardContent className="p-8 text-center">
              <HelpCircle className="h-10 w-10 text-wellness-green mx-auto mb-3" />
              <h3 className="text-lg font-bold font-display text-foreground mb-2">
                Still have a question?
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                Our team is available on WhatsApp, email, and phone during
                business hours.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="https://wa.me/918942932189?text=Hi%20revAlife%2C%20I%20have%20a%20question"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="faq.whatsapp_button"
                  className="inline-flex items-center gap-2 bg-wellness-green text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-wellness-green-dark transition-smooth"
                >
                  Chat on WhatsApp
                </a>
                <a
                  href="mailto:revalife171@gmail.com"
                  data-ocid="faq.email_button"
                  className="inline-flex items-center gap-2 border border-border text-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:border-wellness-green hover:text-wellness-green transition-smooth"
                >
                  Send an Email
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
