import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  Clock,
  Info,
  MapPin,
  Package,
  Truck,
} from "lucide-react";

const SHIPPING_STEPS = [
  {
    step: 1,
    label: "Order Placed",
    desc: "We receive your order and begin processing.",
  },
  {
    step: 2,
    label: "Confirmed",
    desc: "Payment verified and order confirmed within a few hours.",
  },
  {
    step: 3,
    label: "Packed",
    desc: "Your products are carefully packed for delivery.",
  },
  {
    step: 4,
    label: "Out for Delivery",
    desc: "On the way to your hostel/room at LPU campus.",
  },
  {
    step: 5,
    label: "Delivered",
    desc: "Handed to you personally. Enjoy your wellness journey!",
  },
];

const POLICY_POINTS = [
  "Delivery is currently limited to LPU campus only — no exceptions",
  "Orders are processed within 1–2 business days",
  "Delivery is available to all hostels, blocks, and on-campus residences at LPU, Phagwara",
  "Flat Rs 15 shipping on all orders",
  "Shipping time estimates are not guaranteed — delays may occur during holidays",
  "We are not responsible for delays caused by incorrect room or hostel details",
  "Please ensure someone is available to receive the package when contacted",
  "Contact us immediately if your package is damaged upon arrival",
];

export default function Shipping() {
  return (
    <div className="min-h-screen" data-ocid="shipping.page">
      {/* Header */}
      <section className="bg-card border-b py-14 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-wellness-green/10 text-wellness-green border-wellness-green/20 font-medium">
            Shipping Info
          </Badge>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-wellness-green/10 flex items-center justify-center">
              <Truck className="h-5 w-5 text-wellness-green" />
            </div>
            <h1 className="text-4xl font-bold font-display text-foreground">
              Shipping Policy
            </h1>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Fast, affordable, and personal delivery right to your hostel room at
            LPU.
          </p>
        </div>
      </section>

      <section className="py-14 px-4 bg-background">
        <div className="container mx-auto max-w-4xl space-y-8">
          {/* LPU-Only Notice */}
          <div
            className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-xl px-6 py-5 shadow-subtle"
            data-ocid="shipping.lpu_notice"
          >
            <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-amber-900 mb-1">
                Delivery Currently Limited to LPU Campus
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                We deliver exclusively to{" "}
                <strong>
                  Lovely Professional University (LPU), Phagwara, Punjab —
                  144411
                </strong>
                . Orders placed with any other delivery address will not be
                processed. We're expanding soon — stay tuned!
              </p>
            </div>
          </div>

          {/* Key Info Cards */}
          <div className="grid sm:grid-cols-3 gap-5">
            <Card className="border shadow-card">
              <CardContent className="p-6">
                <div className="h-11 w-11 rounded-xl bg-wellness-green/10 flex items-center justify-center mb-4">
                  <Clock className="h-5 w-5 text-wellness-green" />
                </div>
                <h3 className="font-bold text-foreground font-display mb-2">
                  Delivery Time
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  1–3 business days within LPU campus from order confirmation.
                </p>
              </CardContent>
            </Card>
            <Card className="border shadow-card">
              <CardContent className="p-6">
                <div className="h-11 w-11 rounded-xl bg-wellness-green/10 flex items-center justify-center mb-4">
                  <Truck className="h-5 w-5 text-wellness-green" />
                </div>
                <h3 className="font-bold text-foreground font-display mb-2">
                  Shipping Cost
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Flat <strong>Rs 15</strong> on all orders. No minimum order
                  requirement.
                </p>
              </CardContent>
            </Card>
            <Card className="border shadow-card">
              <CardContent className="p-6">
                <div className="h-11 w-11 rounded-xl bg-wellness-green/10 flex items-center justify-center mb-4">
                  <MapPin className="h-5 w-5 text-wellness-green" />
                </div>
                <h3 className="font-bold text-foreground font-display mb-2">
                  Coverage Area
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All hostels, blocks, and on-campus residences at LPU,
                  Phagwara.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Steps */}
          <Card className="border shadow-card">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold font-display text-foreground mb-6 flex items-center gap-2">
                <Package className="h-5 w-5 text-wellness-green" />
                Delivery Journey
              </h2>
              <div className="space-y-5">
                {SHIPPING_STEPS.map((s, i) => (
                  <div key={s.step} className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-wellness-green flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                      {s.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm">
                        {s.label}
                      </p>
                      <p className="text-sm text-muted-foreground">{s.desc}</p>
                    </div>
                    {i < SHIPPING_STEPS.length - 1 && (
                      <div className="hidden sm:block absolute" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Policy Points */}
          <Card className="border shadow-card">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold font-display text-foreground mb-5 flex items-center gap-2">
                <Info className="h-5 w-5 text-wellness-green" />
                Shipping Policy Details
              </h2>
              <ul className="space-y-3">
                {POLICY_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-wellness-green mt-2 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Order Tracking CTA */}
          <Card className="border shadow-card bg-wellness-green/5 border-wellness-green/20">
            <CardContent className="p-7 flex flex-col sm:flex-row items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-wellness-green/10 flex items-center justify-center flex-shrink-0">
                <Package className="h-6 w-6 text-wellness-green" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="font-bold text-foreground font-display mb-1">
                  Track Your Order
                </p>
                <p className="text-sm text-muted-foreground">
                  Use your Order ID to check real-time delivery status.
                </p>
              </div>
              <a
                href="/track-order"
                data-ocid="shipping.track_order_button"
                className="inline-block bg-wellness-green text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-wellness-green-dark transition-smooth flex-shrink-0"
              >
                Track Order
              </a>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
