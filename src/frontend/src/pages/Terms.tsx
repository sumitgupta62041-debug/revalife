import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

const SECTIONS: { title: string; content: string }[] = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing and using the revAlife website, you agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree, please do not use our website. You must be at least 18 years old to make purchases on our platform. You agree to provide accurate, current, and complete information when creating an account or placing an order.",
  },
  {
    title: "2. Delivery Area Restriction",
    content:
      "revAlife currently delivers exclusively to Lovely Professional University (LPU), Phagwara, Punjab — 144411. Orders with any other shipping address will not be processed and will be cancelled. By placing an order, you confirm that your delivery address is within the LPU campus. We are working on expanding to more locations and will update these terms accordingly.",
  },
  {
    title: "3. Orders & Pricing",
    content:
      "All orders are subject to acceptance and product availability. Prices are listed in Indian Rupees (INR) and include applicable taxes. A flat shipping charge of Rs 15 applies to all orders. We reserve the right to refuse or cancel any order at our discretion, including for reasons such as pricing errors, product availability, or suspected fraudulent activity. If a pricing error is discovered, we will notify you and offer the option to proceed at the correct price or cancel.",
  },
  {
    title: "4. Payment Terms",
    content:
      "revAlife accepts only two payment methods:\n\n\u2022 UPI \u2014 pay instantly via any UPI app (Google Pay, PhonePe, Paytm, etc.) to UPI ID: s.saw.13@superyes\n\u2022 Cash on Delivery (COD) \u2014 pay in cash when your order is delivered\n\nWe do not accept credit cards, debit cards, or net banking. By selecting UPI, you agree to complete the payment within the stipulated time. Unpaid orders will be automatically cancelled.",
  },
  {
    title: "5. Product Information & Disclaimers",
    content:
      "All revAlife products are dietary supplements. They are not medicines and are not intended to diagnose, treat, cure, or prevent any disease or medical condition. Product descriptions, ingredient information, and wellness claims are provided for general informational purposes only. Always consult a qualified healthcare professional before starting any new supplement, particularly if you have a medical condition, are pregnant, nursing, or are taking prescription medications.",
  },
  {
    title: "6. Returns, Cancellations & Replacements",
    content:
      "\u2022 Cancellation: Orders in Pending or Confirmed status may be cancelled by the customer before shipment.\n\u2022 Returns & Replacements: Eligible for 7 days from delivery date for the following reasons only: Defective product, Wrong product delivered, or Product damaged in shipment.\n\u2022 Returned products must be in original, unopened packaging.\n\u2022 Refunds are processed within 7\u201310 business days after the returned product is received and inspected.\n\u2022 Shipping charges (Rs 15) are non-refundable except where the return is due to our error.",
  },
  {
    title: "7. Intellectual Property",
    content:
      "All content on the revAlife website \u2014 including the brand name, logo, product images, descriptions, graphics, and software \u2014 is the exclusive property of revAlife and is protected by Indian and international copyright and trademark laws. You may not copy, reproduce, distribute, or create derivative works from any content without our express written permission.",
  },
  {
    title: "8. Limitation of Liability",
    content:
      "revAlife shall not be liable for any indirect, incidental, special, punitive, or consequential damages arising out of or related to your use of our website, products, or services. Our maximum total liability for any claim shall not exceed the amount actually paid by you for the product giving rise to the claim. We are not responsible for delays or non-delivery caused by incorrect address information, unavailability at time of delivery, or circumstances beyond our control.",
  },
  {
    title: "9. Governing Law & Dispute Resolution",
    content:
      "These Terms & Conditions are governed by the laws of India. Any disputes arising out of or relating to these terms or your use of our services shall be subject to the exclusive jurisdiction of the competent courts in Punjab, India. By using our website, you consent to the jurisdiction and venue of such courts.",
  },
  {
    title: "10. Changes to Terms",
    content:
      "We reserve the right to modify these Terms & Conditions at any time. Changes become effective immediately upon posting to our website. Continued use of our website after any changes constitutes your acceptance of the updated terms. We encourage you to review this page periodically.",
  },
  {
    title: "11. Contact Information",
    content:
      "For questions about these Terms & Conditions, please contact us:\n\nEmail: revalife171@gmail.com\nPhone: +91 8942932189 / +91 8700829733\nAddress: Lovely Professional University, Phagwara, Punjab, India \u2014 144411",
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen" data-ocid="terms.page">
      {/* Header */}
      <section className="bg-card border-b py-14 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-wellness-green/10 text-wellness-green border-wellness-green/20 font-medium">
            Legal
          </Badge>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-wellness-green/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-wellness-green" />
            </div>
            <h1 className="text-4xl font-bold font-display text-foreground">
              Terms &amp; Conditions
            </h1>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Please read these terms carefully before using our website or
            placing an order. By using revAlife, you agree to these terms.
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
          <div className="space-y-6" data-ocid="terms.sections">
            {SECTIONS.map((sec, i) => (
              <Card
                key={sec.title}
                data-ocid={`terms.section.item.${i + 1}`}
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
