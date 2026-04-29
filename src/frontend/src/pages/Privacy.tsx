import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

const SECTIONS: { title: string; content: string }[] = [
  {
    title: "1. Information We Collect",
    content:
      "When you create an account, place an order, or contact us, revAlife collects personal information you provide voluntarily. This includes:\n\n• Full name, email address, and phone number\n• Shipping address (hostel/room details at LPU)\n• Order history and product preferences\n• Payment method preference (UPI or Cash on Delivery — we do not collect card or bank credentials)\n• Device and browser information for analytics (anonymised)\n\nWe collect this information solely to process your orders, communicate with you, and continuously improve our service.",
  },
  {
    title: "2. How We Use Your Information",
    content:
      "Your information is used exclusively for:\n\n• Processing and fulfilling your orders\n• Sending order status updates and delivery notifications\n• Responding to customer support requests\n• Improving product recommendations and site experience\n• Sending promotional communications (only with your consent — opt out anytime)\n\nWe never sell, rent, or trade your personal information to third parties.",
  },
  {
    title: "3. Payment Security",
    content:
      "revAlife accepts only UPI and Cash on Delivery. We do not collect or store any credit card, debit card, or bank account information. UPI transactions are processed through your own UPI app — we only confirm receipt. All order data is stored securely on the Internet Computer blockchain with end-to-end encryption.",
  },
  {
    title: "4. Cookies & Tracking",
    content:
      "We use essential cookies to maintain your session and shopping cart. We do not use tracking cookies for advertising. Anonymised analytics help us understand how users navigate the site to improve user experience. You can clear cookies via your browser settings at any time without affecting your account data.",
  },
  {
    title: "5. Data Retention",
    content:
      "We retain your account and order data for as long as your account is active or as needed to fulfil legal obligations. You may request deletion of your account and associated data at any time by contacting us at revalife171@gmail.com. Data deletion requests are processed within 30 days.",
  },
  {
    title: "6. Your Rights",
    content:
      "Under the Information Technology Act, 2000 and applicable Indian data protection rules, you have the right to:\n\n• Access a copy of the personal data we hold about you\n• Correct inaccurate or outdated information\n• Request deletion of your personal data\n• Withdraw consent for promotional communications at any time\n• File a complaint if you believe your data rights have been violated\n\nTo exercise any of these rights, contact us at revalife171@gmail.com.",
  },
  {
    title: "7. Data Security",
    content:
      "revAlife takes data security seriously. Your data is stored on the Internet Computer, a secure and decentralised platform. We maintain appropriate technical and organisational safeguards against unauthorised access, loss, destruction, or alteration of your personal information. No system is 100% secure, but we continuously improve our security practices.",
  },
  {
    title: "8. Indian IT Act Compliance",
    content:
      "revAlife complies with the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011. We are committed to protecting your privacy in accordance with Indian law and applicable regulations.",
  },
  {
    title: "9. Third-Party Links",
    content:
      "Our website may contain links to third-party websites (such as WhatsApp). We are not responsible for the privacy practices of those websites. We encourage you to review their privacy policies before providing any personal information.",
  },
  {
    title: "10. Contact Us",
    content:
      "If you have questions, concerns, or requests regarding this Privacy Policy, please contact us:\n\nEmail: revalife171@gmail.com\nPhone: +91 8942932189 / +91 8700829733\nAddress: Lovely Professional University, Phagwara, Punjab, India — 144411",
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen" data-ocid="privacy.page">
      {/* Header */}
      <section className="bg-card border-b py-14 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-wellness-green/10 text-wellness-green border-wellness-green/20 font-medium">
            Legal
          </Badge>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-wellness-green/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-wellness-green" />
            </div>
            <h1 className="text-4xl font-bold font-display text-foreground">
              Privacy Policy
            </h1>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            We respect your privacy and are committed to protecting your
            personal information. This policy explains what we collect, why, and
            how we keep it safe.
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </section>

      <section className="py-14 px-4 bg-background">
        <div className="container mx-auto max-w-3xl">
          <div className="space-y-6" data-ocid="privacy.sections">
            {SECTIONS.map((sec, i) => (
              <Card
                key={sec.title}
                data-ocid={`privacy.section.item.${i + 1}`}
                className="border shadow-card"
              >
                <CardContent className="p-7">
                  <h2 className="text-lg font-bold font-display text-foreground mb-3">
                    {sec.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {sec.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
