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
import { Banknote, Building2, CreditCard, Smartphone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { type Address, type CustomerDetails, PaymentMethod } from "../backend";
import { useCart } from "../hooks/useCart";
import { useOrders } from "../hooks/useOrders";
import { useProfile } from "../hooks/useProfile";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, isLoading: cartLoading } = useCart();
  const { profile } = useProfile();
  const { createOrder, isCreating } = useOrders.useCreateOrder();

  const [step, setStep] = useState(1);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
  });
  const [shippingAddress, setShippingAddress] = useState<Address>({
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
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
      setShippingAddress(addr);
    } else {
      setShippingAddress({
        line1: "",
        line2: "",
        city: "",
        state: "",
        pincode: "",
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
      toast.error("Please enter a valid Indian phone number");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (
      !shippingAddress.line1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      toast.error("Please fill all address fields");
      return false;
    }
    if (!shippingAddress.pincode.match(/^\d{6}$/)) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateStep2()) return;

    try {
      const orderId = await createOrder(
        customerDetails,
        shippingAddress,
        paymentMethod,
      );
      toast.success("Order placed successfully!");
      navigate({ to: "/order-confirmation/$orderId", params: { orderId } });
    } catch (_error) {
      toast.error("Failed to place order");
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    navigate({ to: "/cart" });
    return null;
  }

  const subtotal = Number(cart.subtotal);
  const shipping = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="bg-wellness-green text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    1
                  </span>
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerDetails.name}
                    onChange={(e) =>
                      setCustomerDetails({
                        ...customerDetails,
                        name: e.target.value,
                      })
                    }
                    disabled={step > 1}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerDetails.email}
                    onChange={(e) =>
                      setCustomerDetails({
                        ...customerDetails,
                        email: e.target.value,
                      })
                    }
                    disabled={step > 1}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
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
                  />
                </div>
                {step === 1 && (
                  <Button
                    onClick={() => {
                      if (validateStep1()) setStep(2);
                    }}
                    className="bg-wellness-green hover:bg-wellness-green-dark"
                  >
                    Continue to Shipping
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Shipping Address */}
            {step >= 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-wellness-green text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      2
                    </span>
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile?.savedAddresses &&
                    profile.savedAddresses.length > 0 && (
                      <div>
                        <Label>Select Address</Label>
                        <Select
                          value={selectedAddressIndex}
                          onValueChange={handleSelectSavedAddress}
                        >
                          <SelectTrigger>
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
                  <div>
                    <Label htmlFor="line1">Address Line 1 *</Label>
                    <Input
                      id="line1"
                      value={shippingAddress.line1}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          line1: e.target.value,
                        })
                      }
                      disabled={step > 2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="line2">Address Line 2</Label>
                    <Input
                      id="line2"
                      value={shippingAddress.line2}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          line2: e.target.value,
                        })
                      }
                      disabled={step > 2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            city: e.target.value,
                          })
                        }
                        disabled={step > 2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            state: e.target.value,
                          })
                        }
                        disabled={step > 2}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      placeholder="6-digit pincode"
                      value={shippingAddress.pincode}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          pincode: e.target.value,
                        })
                      }
                      disabled={step > 2}
                    />
                  </div>
                  {step === 2 && (
                    <div className="flex space-x-3">
                      <Button variant="outline" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button
                        onClick={() => {
                          if (validateStep2()) setStep(3);
                        }}
                        className="bg-wellness-green hover:bg-wellness-green-dark"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment Method */}
            {step >= 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-wellness-green text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      3
                    </span>
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) =>
                      setPaymentMethod(value as PaymentMethod)
                    }
                  >
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted">
                      <RadioGroupItem value={PaymentMethod.upi} id="upi" />
                      <Label
                        htmlFor="upi"
                        className="flex items-center cursor-pointer flex-1"
                      >
                        <Smartphone className="mr-3 h-5 w-5 text-wellness-green" />
                        <div>
                          <p className="font-semibold">UPI</p>
                          <p className="text-sm text-muted-foreground">
                            Pay using UPI apps
                          </p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted">
                      <RadioGroupItem value={PaymentMethod.card} id="card" />
                      <Label
                        htmlFor="card"
                        className="flex items-center cursor-pointer flex-1"
                      >
                        <CreditCard className="mr-3 h-5 w-5 text-wellness-green" />
                        <div>
                          <p className="font-semibold">Credit/Debit Card</p>
                          <p className="text-sm text-muted-foreground">
                            Visa, Mastercard, RuPay
                          </p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted">
                      <RadioGroupItem
                        value={PaymentMethod.netbanking}
                        id="netbanking"
                      />
                      <Label
                        htmlFor="netbanking"
                        className="flex items-center cursor-pointer flex-1"
                      >
                        <Building2 className="mr-3 h-5 w-5 text-wellness-green" />
                        <div>
                          <p className="font-semibold">Net Banking</p>
                          <p className="text-sm text-muted-foreground">
                            All Indian banks
                          </p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted">
                      <RadioGroupItem value={PaymentMethod.cod} id="cod" />
                      <Label
                        htmlFor="cod"
                        className="flex items-center cursor-pointer flex-1"
                      >
                        <Banknote className="mr-3 h-5 w-5 text-wellness-green" />
                        <div>
                          <p className="font-semibold">Cash on Delivery</p>
                          <p className="text-sm text-muted-foreground">
                            Pay when you receive
                          </p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                  <div className="flex space-x-3 pt-4">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isCreating}
                      className="flex-1 bg-wellness-green hover:bg-wellness-green-dark"
                      size="lg"
                    >
                      {isCreating ? "Placing Order..." : "Place Order"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.product.name} x {Number(item.quantity)}
                      </span>
                      <span className="font-semibold">
                        ₹{Number(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-wellness-green">
                      ₹{total}
                    </span>
                  </div>
                </div>
                {subtotal < 500 && (
                  <p className="text-sm text-muted-foreground">
                    Add ₹{500 - subtotal} more for free shipping!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
