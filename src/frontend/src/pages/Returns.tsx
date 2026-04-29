import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  Mail,
  Phone,
  RotateCcw,
  XCircle,
} from "lucide-react";

const RETURN_REASONS = [
  "Defective product — manufacturing defect or quality issue",
  "Wrong product delivered — different from what was ordered",
  "Product damaged in shipment — broken or damaged packaging upon arrival",
];

const RETURN_STEPS = [
  {
    step: 1,
    title: "Initiate via My Account",
    desc: "Go to My Account > My Orders, find the delivered order, and click Return or Replace. Select your reason from the available options.",
  },
  {
    step: 2,
    title: "Or Contact Us Directly",
    desc: "Email revalife171@gmail.com or call +91 8942932189 with your Order ID, reason, and photos of the issue. We'll process your request within 24 hours.",
  },
  {
    step: 3,
    title: "Arrange Return Pickup",
    desc: "Our team will coordinate pickup from your LPU hostel room. Keep the product in its original, unopened packaging until collection.",
  },
  {
    step: 4,
    title: "Inspection & Resolution",
    desc: "Once received, we inspect the product. Approved returns receive a full refund. Replacements are shipped within 1–2 business days.",
  },
];

const NOT_ELIGIBLE = [
  "Products opened or consumed (unless defective)",
  "Return request initiated after 7 days from delivery",
  "Products with tampered or missing original packaging",
  "Products purchased as bundles where individual items are not defective",
  "Change of mind, incorrect product selection, or taste preference",
];

export default function Returns() {
  return (
    <div className="min-h-screen" data-ocid="returns.page">
      {/* Header */}
      <section className="bg-card border-b py-14 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-wellness-green/10 text-wellness-green border-wellness-green/20 font-medium">
            Returns & Refunds
          </Badge>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-wellness-green/10 flex items-center justify-center">
              <RotateCcw className="h-5 w-5 text-wellness-green" />
            </div>
            <h1 className="text-4xl font-bold font-display text-foreground">
              Returns Policy
            </h1>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            We want you to be completely satisfied. If something isn't right,
            our 7-day return policy has you covered.
          </p>
        </div>
      </section>

      <section className="py-14 px-4 bg-background">
        <div className="container mx-auto max-w-4xl space-y-8">
          {/* Policy Highlights */}
          <div className="grid sm:grid-cols-3 gap-5">
            <Card className="border shadow-card">
              <CardContent className="p-6 text-center">
                <div className="h-11 w-11 rounded-xl bg-wellness-green/10 flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-5 w-5 text-wellness-green" />
                </div>
                <p className="text-2xl font-bold font-display text-wellness-green mb-1">
                  7 Days
                </p>
                <p className="text-sm text-muted-foreground">
                  Return window from delivery date
                </p>
              </CardContent>
            </Card>
            <Card className="border shadow-card">
              <CardContent className="p-6 text-center">
                <div className="h-11 w-11 rounded-xl bg-wellness-green/10 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-5 w-5 text-wellness-green" />
                </div>
                <p className="text-2xl font-bold font-display text-wellness-green mb-1">
                  3
                </p>
                <p className="text-sm text-muted-foreground">
                  Accepted return reasons
                </p>
              </CardContent>
            </Card>
            <Card className="border shadow-card">
              <CardContent className="p-6 text-center">
                <div className="h-11 w-11 rounded-xl bg-wellness-green/10 flex items-center justify-center mx-auto mb-3">
                  <RotateCcw className="h-5 w-5 text-wellness-green" />
                </div>
                <p className="text-2xl font-bold font-display text-wellness-green mb-1">
                  7–10 Days
                </p>
                <p className="text-sm text-muted-foreground">
                  Refund processing time
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Eligible Reasons */}
          <Card className="border shadow-card">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold font-display text-foreground mb-5 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-wellness-green" />
                Accepted Return Reasons
              </h2>
              <div className="space-y-3">
                {RETURN_REASONS.map((reason) => (
                  <div key={reason} className="flex items-start gap-3">
                    <CheckCircle className="h-4.5 w-4.5 text-wellness-green mt-0.5 flex-shrink-0 h-5 w-5" />
                    <p className="text-sm text-muted-foreground">{reason}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                Photo evidence may be required for defective or damaged
                products. Please keep the original packaging until your return
                is confirmed.
              </p>
            </CardContent>
          </Card>

          {/* Return Process */}
          <Card className="border shadow-card">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold font-display text-foreground mb-6 flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-wellness-green" />
                How to Return or Replace
              </h2>
              <div className="space-y-6">
                {RETURN_STEPS.map((s) => (
                  <div key={s.step} className="flex items-start gap-5">
                    <div className="h-9 w-9 rounded-full bg-wellness-green flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                      {s.step}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">
                        {s.title}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Not Eligible */}
          <Card className="border shadow-card border-destructive/20 bg-destructive/5">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold font-display text-foreground mb-5 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-destructive" />
                Not Eligible for Return
              </h2>
              <ul className="space-y-3">
                {NOT_ELIGIBLE.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Refund Timeline */}
          <Card className="border shadow-card">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold font-display text-foreground mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-wellness-green" />
                Refund Timeline
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Once your returned product is received and inspected, refunds
                are processed within{" "}
                <strong className="text-foreground">7–10 business days</strong>.
                The refund will be credited back via UPI or issued as a store
                credit for COD orders. It may take an additional 2–3 business
                days to reflect in your account.
              </p>
              <p className="text-xs text-muted-foreground">
                Shipping charges (Rs 15) are non-refundable unless the return is
                due to our error.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="border shadow-card">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold font-display text-foreground mb-5 flex items-center gap-2">
                <Mail className="h-5 w-5 text-wellness-green" />
                Need Help with a Return?
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-wellness-green/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-wellness-green" />
                  </div>
                  <a
                    href="mailto:revalife171@gmail.com"
                    className="text-sm text-wellness-green hover:underline font-medium"
                  >
                    revalife171@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-wellness-green/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 text-wellness-green" />
                  </div>
                  <div>
                    <a
                      href="tel:+918942932189"
                      className="block text-sm text-wellness-green hover:underline font-medium"
                    >
                      +91 8942932189
                    </a>
                    <a
                      href="tel:+918700829733"
                      className="block text-sm text-wellness-green hover:underline font-medium"
                    >
                      +91 8700829733
                    </a>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Business hours: 6–8 AM and 4–6 PM IST
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
