import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { Banknote, Check, Copy, MapPin, Smartphone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { type Address, type CustomerDetails, PaymentMethod } from "../backend";
import { useCart } from "../hooks/useCart";
import { useCreateOrder } from "../hooks/useOrders";
import { useProfile } from "../hooks/useProfile";

const LPU_CITY = "Phagwara";
const LPU_STATE = "Punjab";
const LPU_PINCODE = "144411";

function StepCircle({ n, completed }: { n: number; completed: boolean }) {
  return (
    <span className="h-8 w-8 rounded-full bg-wellness-green text-white flex items-center justify-center mr-3 shrink-0 text-sm font-bold shadow-xs">
      {completed ? <Check className="h-4 w-4" strokeWidth={2.5} /> : n}
    </span>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, isLoading: cartLoading } = useCart();
  const { profile } = useProfile();
  const createOrderMutation = useCreateOrder();

  const [step, setStep] = useState(1);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
  });
  const [shippingAddress, setShippingAddress] = useState<Address>({
    line1: "",
    line2: "",
    city: LPU_CITY,
    state: LPU_STATE,
    pincode: LPU_PINCODE,
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.upi,
  );
  const [selectedAddressIndex, setSelectedAddressIndex] =
    useState<string>("new");

  const handleSelectSavedAddress = (index: string) => {
    setSelectedAddressIndex(index);
    if (index !== "new" && profile?.savedAddresses) {
      const addr = profile.savedAddresses[Number.parseInt(index)];
      setShippingAddress({
        ...addr,
        city: LPU_CITY,
        state: LPU_STATE,
        pincode: LPU_PINCODE,
      });
    } else {
      setShippingAddress({
        line1: "",
        line2: "",
        city: LPU_CITY,
        state: LPU_STATE,
        pincode: LPU_PINCODE,
      });
    }
  };

  const validateStep1 = () => {
    if (
      !customerDetails.name ||
      !customerDetails.email ||
      !customerDetails.phone
    ) {
      toast.error("Please fill all customer details");
      return false;
    }
    if (!customerDetails.phone.match(/^\+?91[6-9]\d{9}$/)) {
      toast.error("Please enter a valid Indian phone number (+91XXXXXXXXXX)");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!shippingAddress.line1) {
      toast.error("Please enter your room/hostel/block number");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateStep2()) return;
    try {
      const orderId = await createOrderMutation.mutateAsync({
        customerDetails,
        shippingAddress,
        paymentMethod,
      });
      toast.success("Order placed successfully! 🎉");
      navigate({ to: "/order-confirmation/$orderId", params: { orderId } });
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-4 border-wellness-green border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    navigate({ to: "/cart" });
    return null;
  }

  const subtotal = Number(cart.subtotal);
  const shipping = 15;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-card border-b border-border/60 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold font-display">
            Checkout
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Complete your order — delivery to LPU campus only
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            {/* ── Step 1: Customer Details ── */}
            <Card className="border border-border/50 shadow-card rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-base font-semibold">
                  <StepCircle n={1} completed={step > 1} />
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={customerDetails.name}
                      onChange={(e) =>
                        setCustomerDetails({
                          ...customerDetails,
                          name: e.target.value,
                        })
                      }
                      disabled={step > 1}
                      className="rounded-lg"
                      data-ocid="checkout.name_input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={customerDetails.email}
                      onChange={(e) =>
                        setCustomerDetails({
                          ...customerDetails,
                          email: e.target.value,
                        })
                      }
                      disabled={step > 1}
                      className="rounded-lg"
                      data-ocid="checkout.email_input"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+91XXXXXXXXXX"
                    value={customerDetails.phone}
                    onChange={(e) =>
                      setCustomerDetails({
                        ...customerDetails,
                        phone: e.target.value,
                      })
                    }
                    disabled={step > 1}
                    className="rounded-lg"
                    data-ocid="checkout.phone_input"
                  />
                </div>
                {step === 1 && (
                  <Button
                    onClick={() => {
                      if (validateStep1()) setStep(2);
                    }}
                    className="bg-wellness-green hover:bg-wellness-green-dark rounded-full px-6 transition-all"
                    data-ocid="checkout.continue_to_shipping_button"
                  >
                    Continue to Shipping
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* ── Step 2: Shipping Address ── */}
            {step >= 2 && (
              <Card className="border border-border/50 shadow-card rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-base font-semibold">
                    <StepCircle n={2} completed={step > 2} />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* LPU notice */}
                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-200/80 rounded-xl px-4 py-3">
                    <MapPin className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800">
                        Delivery available only at LPU campus
                      </p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        Currently delivering to{" "}
                        <strong>
                          Lovely Professional University, Phagwara, Punjab —
                          144411
                        </strong>
                        . Enter your room, hostel, or block number below.
                      </p>
                    </div>
                  </div>

                  {profile?.savedAddresses &&
                    profile.savedAddresses.length > 0 && (
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">
                          Use Saved Address
                        </Label>
                        <Select
                          value={selectedAddressIndex}
                          onValueChange={handleSelectSavedAddress}
                        >
                          <SelectTrigger className="rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">
                              Enter New Address
                            </SelectItem>
                            {profile.savedAddresses.map((addr, index) => (
                              // biome-ignore lint/suspicious/noArrayIndexKey: addresses have no stable id
                              <SelectItem key={index} value={index.toString()}>
                                {addr.line1}, {addr.city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                  <div className="space-y-1.5">
                    <Label htmlFor="line1" className="text-sm font-medium">
                      Room / Hostel / Block Number *
                    </Label>
                    <Input
                      id="line1"
                      placeholder="e.g. Room 204, Block B, Boys Hostel"
                      value={shippingAddress.line1}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          line1: e.target.value,
                        })
                      }
                      disabled={step > 2}
                      className="rounded-lg"
                      data-ocid="checkout.address_line1_input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="line2" className="text-sm font-medium">
                      Landmark / Additional Info
                    </Label>
                    <Input
                      id="line2"
                      placeholder="e.g. Near Gate 2, Uni Mall"
                      value={shippingAddress.line2}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          line2: e.target.value,
                        })
                      }
                      disabled={step > 2}
                      className="rounded-lg"
                      data-ocid="checkout.address_line2_input"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "city", label: "City", value: LPU_CITY },
                      { id: "state", label: "State", value: LPU_STATE },
                      { id: "pincode", label: "Pincode", value: LPU_PINCODE },
                    ].map(({ id, label, value }) => (
                      <div key={id} className="space-y-1.5">
                        <Label
                          htmlFor={id}
                          className="text-sm font-medium flex items-center gap-1"
                        >
                          {label}
                          <span className="text-xs text-muted-foreground font-normal">
                            (fixed)
                          </span>
                        </Label>
                        <Input
                          id={id}
                          value={value}
                          readOnly
                          disabled
                          className="rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                        />
                      </div>
                    ))}
                  </div>

                  {step === 2 && (
                    <div className="flex gap-3 pt-1">
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="rounded-full"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={() => {
                          if (validateStep2()) setStep(3);
                        }}
                        className="bg-wellness-green hover:bg-wellness-green-dark rounded-full px-6 transition-all"
                        data-ocid="checkout.continue_to_payment_button"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* ── Step 3: Payment ── */}
            {step >= 3 && (
              <Card className="border border-border/50 shadow-card rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-base font-semibold">
                    <StepCircle n={3} completed={false} />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                    data-ocid="payment.method_select"
                    className="space-y-3"
                  >
                    {/* UPI */}
                    <div
                      className={`border rounded-xl cursor-pointer transition-all duration-200 ${
                        paymentMethod === PaymentMethod.upi
                          ? "border-wellness-green bg-wellness-green/5 shadow-xs"
                          : "border-border hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-3 p-4">
                        <RadioGroupItem
                          value={PaymentMethod.upi}
                          id="upi"
                          data-ocid="payment.upi_radio"
                        />
                        <Label
                          htmlFor="upi"
                          className="flex items-center cursor-pointer flex-1 gap-3"
                        >
                          <div className="h-9 w-9 rounded-full bg-wellness-green/10 flex items-center justify-center shrink-0">
                            <Smartphone className="h-4 w-4 text-wellness-green" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">UPI</p>
                            <p className="text-xs text-muted-foreground">
                              PhonePe, GPay, Paytm, or any UPI app
                            </p>
                          </div>
                        </Label>
                      </div>
                      {paymentMethod === PaymentMethod.upi && (
                        <div className="px-5 pb-5 border-t border-wellness-green/15 pt-4">
                          <div className="flex flex-col sm:flex-row gap-6 items-start">
                            <div className="flex flex-col items-center shrink-0">
                              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                                Scan to Pay
                              </p>
                              <img
                                src="/assets/phonepe-qr.jpeg"
                                alt="PhonePe QR Code — Scan to Pay"
                                className="w-36 h-36 object-contain border-2 border-wellness-green/30 rounded-xl shadow-xs"
                              />
                              <p className="text-xs text-muted-foreground mt-1.5">
                                PhonePe QR Code
                              </p>
                            </div>
                            <div className="flex flex-col gap-3">
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                                  UPI ID
                                </p>
                                <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 border border-border/50">
                                  <span className="font-mono font-semibold text-foreground select-all text-sm">
                                    s.saw.13@superyes
                                  </span>
                                  <button
                                    type="button"
                                    data-ocid="payment.upi_copy_button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        "s.saw.13@superyes",
                                      );
                                      toast.success("UPI ID copied!");
                                    }}
                                    className="ml-1 p-1 rounded hover:bg-wellness-green/10 transition-colors"
                                    aria-label="Copy UPI ID"
                                  >
                                    <Copy className="h-3.5 w-3.5 text-wellness-green" />
                                  </button>
                                </div>
                              </div>
                              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                                <li>Open your UPI app</li>
                                <li>Scan QR or enter UPI ID above</li>
                                <li>Pay the exact order amount</li>
                                <li>Take a screenshot of payment</li>
                              </ol>
                              <p className="text-xs text-amber-700 font-medium bg-amber-50 border border-amber-200/80 rounded-lg px-3 py-1.5">
                                ⚠️ Send payment screenshot via WhatsApp after
                                ordering
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* COD */}
                    <div
                      className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                        paymentMethod === PaymentMethod.cod
                          ? "border-wellness-green bg-wellness-green/5 shadow-xs"
                          : "border-border hover:bg-muted/30"
                      }`}
                    >
                      <RadioGroupItem
                        value={PaymentMethod.cod}
                        id="cod"
                        data-ocid="payment.cod_radio"
                      />
                      <Label
                        htmlFor="cod"
                        className="flex items-center cursor-pointer flex-1 gap-3"
                      >
                        <div className="h-9 w-9 rounded-full bg-wellness-green/10 flex items-center justify-center shrink-0">
                          <Banknote className="h-4 w-4 text-wellness-green" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            Cash on Delivery
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Pay cash when you receive your order
                          </p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="flex gap-3 pt-3">
                    <Button
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="rounded-full"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={createOrderMutation.isPending}
                      className="flex-1 bg-wellness-green hover:bg-wellness-green-dark rounded-full shadow-card hover:shadow-card-hover transition-all"
                      size="lg"
                      data-ocid="checkout.place_order_button"
                    >
                      {createOrderMutation.isPending
                        ? "Placing Order…"
                        : "Place Order"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary sidebar */}
          <div>
            <Card className="sticky top-24 border border-border/50 shadow-card rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2.5">
                  {cart.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between text-sm gap-3"
                    >
                      <span className="text-muted-foreground line-clamp-1 flex-1 min-w-0">
                        {item.product.name} ×{Number(item.quantity)}
                      </span>
                      <span className="font-semibold shrink-0">
                        ₹{Number(item.price).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">₹{shipping}</span>
                  </div>
                  <div className="border-t pt-2.5 flex justify-between">
                    <span className="font-bold text-base">Total</span>
                    <span className="font-bold text-lg text-wellness-green">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-wellness-green/5 border border-wellness-green/20 rounded-xl px-3 py-2.5">
                  <MapPin className="h-3.5 w-3.5 text-wellness-green shrink-0" />
                  <p className="text-xs text-wellness-green font-medium">
                    Delivering to LPU Campus, Phagwara
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
