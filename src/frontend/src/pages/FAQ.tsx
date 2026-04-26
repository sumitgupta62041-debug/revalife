import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Frequently Asked Questions
        </h1>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              Are revAlife products safe?
            </AccordionTrigger>
            <AccordionContent>
              Yes, all revAlife products undergo rigorous quality testing and
              are manufactured in GMP-certified facilities. We test for purity,
              potency, and contaminants to ensure safety. However, we recommend
              consulting with a healthcare professional before starting any new
              supplement, especially if you have existing health conditions or
              are taking medications.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              Are the ingredients natural?
            </AccordionTrigger>
            <AccordionContent>
              We use a combination of natural and scientifically-formulated
              ingredients. Many of our products contain herbal extracts,
              vitamins, and minerals sourced from natural sources. All
              ingredients are carefully selected based on scientific research
              and safety profiles. Complete ingredient lists are provided on
              each product page.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              How long does delivery take?
            </AccordionTrigger>
            <AccordionContent>
              Orders are typically delivered within 3-7 business days across
              India. Delivery times may vary based on your location and courier
              availability. You will receive tracking information once your
              order is shipped.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              Do you deliver pan-India?
            </AccordionTrigger>
            <AccordionContent>
              Yes, we deliver to all states across India. We work with reliable
              courier partners to ensure your products reach you safely, no
              matter where you are located.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              What are the shipping charges?
            </AccordionTrigger>
            <AccordionContent>
              We offer free shipping on all orders above ₹500. For orders below
              ₹500, a flat shipping charge of ₹50 applies. Shipping charges are
              calculated automatically at checkout.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              What is your return policy?
            </AccordionTrigger>
            <AccordionContent>
              We offer a 7-day return policy from the date of delivery. Products
              must be unopened, in original packaging, and not consumed. Please
              contact our customer support to initiate a return. Refunds are
              processed within 7-10 business days after we receive the returned
              product.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              Can I return opened products?
            </AccordionTrigger>
            <AccordionContent>
              For hygiene and safety reasons, we cannot accept returns of opened
              or consumed products unless there is a manufacturing defect or
              quality issue. If you receive a defective product, please contact
              us immediately with photos and details.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              What payment methods do you accept?
            </AccordionTrigger>
            <AccordionContent>
              We accept multiple payment methods including UPI, Credit/Debit
              Cards, Net Banking, and Cash on Delivery (COD). All online
              payments are processed securely through encrypted channels.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-9" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              Is COD available?
            </AccordionTrigger>
            <AccordionContent>
              Yes, Cash on Delivery (COD) is available for all orders. You can
              pay in cash when your order is delivered to your doorstep. COD is
              subject to availability in your area.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-10" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              Is my payment information secure?
            </AccordionTrigger>
            <AccordionContent>
              Yes, we use industry-standard encryption and security measures to
              protect your payment information. We do not store complete credit
              card details on our servers. All transactions are processed
              through secure, PCI DSS compliant payment gateways.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-11" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              How can I track my order?
            </AccordionTrigger>
            <AccordionContent>
              You can track your order by visiting the Order Tracking page and
              entering your order ID. You will also receive tracking information
              via email once your order is shipped. You can view all your orders
              in the My Account section.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-12" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">
              How do I contact customer support?
            </AccordionTrigger>
            <AccordionContent>
              You can reach our customer support team via email at
              revalife171@gmail.com or call us at +91 8942932189 or +91
              8700829733. Our business hours are 6-8 AM and 4-6 PM IST. You can
              also chat with us on WhatsApp for instant support.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
