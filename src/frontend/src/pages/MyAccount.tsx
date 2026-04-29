import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronUp,
  LogIn,
  MapPin,
  Package,
  RotateCcw,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLoginModal } from "../App";
import {
  type Address,
  type Order,
  OrderStatus,
  type ReturnReason,
} from "../backend";
import {
  OrderActionModal,
  type OrderActionType,
} from "../components/OrderActionModal";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCancelOrder,
  useGetUserOrders,
  useRequestReplace,
  useRequestReturn,
} from "../hooks/useOrders";
import { useProfile } from "../hooks/useProfile";

// ── Status badge helper ─────────────────────────────────────────────────────

function getStatusBadge(status: OrderStatus) {
  const map: Record<OrderStatus, { label: string; className: string }> = {
    [OrderStatus.pending]: {
      label: "Pending",
      className: "bg-amber-100 text-amber-800 border border-amber-200",
    },
    [OrderStatus.confirmed]: {
      label: "Confirmed",
      className: "bg-blue-100 text-blue-800 border border-blue-200",
    },
    [OrderStatus.shipped]: {
      label: "Shipped",
      className: "bg-violet-100 text-violet-800 border border-violet-200",
    },
    [OrderStatus.delivered]: {
      label: "Delivered",
      className: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    },
    [OrderStatus.cancelled]: {
      label: "Cancelled",
      className: "bg-red-100 text-red-800 border border-red-200",
    },
  };
  return (
    map[status] ?? {
      label: String(status),
      className: "bg-muted text-muted-foreground border-border",
    }
  );
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function isWithinReturnWindow(order: Order): boolean {
  if (!order.deliveredAt) return false;
  const deliveredMs = Number(order.deliveredAt) / 1_000_000;
  return Date.now() - deliveredMs <= SEVEN_DAYS_MS;
}

// ── Not-logged-in prompt ────────────────────────────────────────────────────

function LoginPrompt() {
  const { openLoginModal } = useLoginModal();
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border/60 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold font-display">
            My Account
          </h1>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="h-20 w-20 rounded-full bg-muted border border-border/40 flex items-center justify-center mx-auto mb-6">
          <User className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <h2 className="text-xl font-bold font-display mb-2">
          Sign in to view your account
        </h2>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-8">
          Access your orders, profile, and saved addresses by signing in.
        </p>
        <Button
          onClick={openLoginModal}
          className="bg-wellness-green hover:bg-wellness-green-dark rounded-full px-8 shadow-card transition-all"
          data-ocid="account.login_button"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </Button>
      </div>
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────

export default function MyAccount() {
  const { identity } = useInternetIdentity();

  // Show login prompt if not authenticated
  if (!identity) {
    return <LoginPrompt />;
  }

  return <MyAccountContent />;
}

function MyAccountContent() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const initialTab = searchParams.get("tab") || "profile";

  const {
    profile,
    isLoading: profileLoading,
    updateProfile,
    addAddress,
    deleteAddress,
    isUpdating,
  } = useProfile();
  const { data: orders = [], isLoading: ordersLoading } = useGetUserOrders();

  const cancelOrderMutation = useCancelOrder();
  const requestReturnMutation = useRequestReturn();
  const requestReplaceMutation = useRequestReplace();

  const [editMode, setEditMode] = useState(false);
  // Start with empty strings — they will be populated by the useEffect below
  // once the profile query resolves. Never derive initial state from profile
  // directly (it's undefined at mount time while the query is in-flight).
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Sync form fields whenever the fetched profile data changes.
  // This fires when: actor becomes ready, identity changes, or profile is refetched.
  // Using profile as a stable dependency — works for both null (no profile yet)
  // and a real UserProfile object.
  useEffect(() => {
    if (profile != null) {
      setProfileData({
        name: profile.name ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
      });
    }
  }, [profile]);

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [actionModal, setActionModal] = useState<{
    orderId: string;
    type: OrderActionType;
  } | null>(null);
  const [newAddress, setNewAddress] = useState<Address>({
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(
        profileData.name,
        profileData.email,
        profileData.phone,
      );
      toast.success("Profile updated successfully");
      setEditMode(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleAddAddress = async () => {
    if (
      !newAddress.line1 ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.pincode
    ) {
      toast.error("Please fill all address fields");
      return;
    }
    try {
      await addAddress(newAddress);
      toast.success("Address added successfully");
      setNewAddress({ line1: "", line2: "", city: "", state: "", pincode: "" });
      setShowAddressForm(false);
    } catch {
      toast.error("Failed to add address");
    }
  };

  const handleDeleteAddress = async (index: number) => {
    try {
      await deleteAddress(BigInt(index));
      toast.success("Address deleted");
    } catch {
      toast.error("Failed to delete address");
    }
  };

  const handleOrderAction = async (reason: string) => {
    if (!actionModal) return;
    const { orderId, type } = actionModal;
    try {
      if (type === "cancel") {
        await cancelOrderMutation.mutateAsync({
          orderId,
          reason: reason || undefined,
        });
        toast.success("Order cancelled successfully");
      } else if (type === "return") {
        await requestReturnMutation.mutateAsync({
          orderId,
          reason: reason as ReturnReason,
        });
        toast.success("Return request submitted");
      } else {
        await requestReplaceMutation.mutateAsync({
          orderId,
          reason: reason as ReturnReason,
        });
        toast.success("Replace request submitted");
      }
      setActionModal(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    }
  };

  const selectedOrderData = orders.find((o) => o.orderId === selectedOrder);
  const actionOrderData = actionModal
    ? orders.find((o) => o.orderId === actionModal.orderId)
    : null;
  const isActionSubmitting =
    cancelOrderMutation.isPending ||
    requestReturnMutation.isPending ||
    requestReplaceMutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-card border-b border-border/60 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold font-display">
            My Account
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your profile, orders, and saved addresses
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue={initialTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-10">
            <TabsTrigger value="profile" data-ocid="account.profile.tab">
              <User className="h-3.5 w-3.5 mr-1.5" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" data-ocid="account.orders.tab">
              <Package className="h-3.5 w-3.5 mr-1.5" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="addresses" data-ocid="account.addresses.tab">
              <MapPin className="h-3.5 w-3.5 mr-1.5" />
              Addresses
            </TabsTrigger>
          </TabsList>

          {/* ── Profile Tab ── */}
          <TabsContent value="profile">
            <Card className="border border-border/50 shadow-card rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileLoading ? (
                  // Loading skeleton — shown while profile query is in-flight
                  <div className="space-y-4" data-ocid="profile.loading_state">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-12 rounded" />
                        <Skeleton className="h-9 w-full rounded-lg" />
                      </div>
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-12 rounded" />
                        <Skeleton className="h-9 w-full rounded-lg" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-12 rounded" />
                      <Skeleton className="h-9 w-full rounded-lg" />
                    </div>
                    <Skeleton className="h-9 w-28 rounded-full" />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="pname" className="text-sm font-medium">
                          Name
                        </Label>
                        <Input
                          id="pname"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                          disabled={!editMode}
                          className="rounded-lg"
                          data-ocid="profile.name.input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="pemail" className="text-sm font-medium">
                          Email
                        </Label>
                        <Input
                          id="pemail"
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              email: e.target.value,
                            })
                          }
                          disabled={!editMode}
                          className="rounded-lg"
                          data-ocid="profile.email.input"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pphone" className="text-sm font-medium">
                        Phone
                      </Label>
                      <Input
                        id="pphone"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                        disabled={!editMode}
                        className="rounded-lg"
                        data-ocid="profile.phone.input"
                      />
                    </div>
                    <div className="flex gap-3 pt-1">
                      {editMode ? (
                        <>
                          <Button
                            onClick={handleUpdateProfile}
                            disabled={isUpdating}
                            className="bg-wellness-green hover:bg-wellness-green-dark rounded-full px-6"
                            data-ocid="profile.save_button"
                          >
                            {isUpdating ? "Saving…" : "Save Changes"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditMode(false)}
                            className="rounded-full"
                            data-ocid="profile.cancel_button"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => setEditMode(true)}
                          variant="outline"
                          className="rounded-full"
                          data-ocid="profile.edit_button"
                        >
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Orders Tab ── */}
          <TabsContent value="orders">
            <Card className="border border-border/50 shadow-card rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-3" data-ocid="orders.loading_state">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-24 rounded-xl bg-muted animate-pulse"
                      />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div
                    className="flex flex-col items-center py-16 text-center"
                    data-ocid="orders.empty_state"
                  >
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Package className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                    <p className="font-semibold text-foreground mb-1">
                      No orders yet
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your order history will appear here
                    </p>
                    <Button
                      onClick={() => navigate({ to: "/products" })}
                      className="bg-wellness-green hover:bg-wellness-green-dark rounded-full px-6 text-sm"
                    >
                      Shop Now
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3" data-ocid="orders.list">
                    {orders.map((order, idx) => {
                      const canCancel =
                        order.orderStatus === OrderStatus.pending ||
                        order.orderStatus === OrderStatus.confirmed;
                      const canReturn =
                        order.orderStatus === OrderStatus.delivered;
                      const withinWindow = isWithinReturnWindow(order);
                      const statusBadge = getStatusBadge(order.orderStatus);
                      const isExpanded = expandedOrder === order.orderId;

                      return (
                        <div
                          key={order.orderId}
                          className="border border-border/50 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-200"
                          data-ocid={`orders.item.${idx + 1}`}
                        >
                          {/* Order header row */}
                          <div className="flex items-start justify-between gap-3 p-4">
                            <div className="min-w-0">
                              <p className="font-semibold font-mono text-sm text-foreground">
                                #{order.orderId.slice(0, 12).toUpperCase()}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {new Date(
                                  Number(order.createdAt) / 1_000_000,
                                ).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {order.items.length} item
                                {order.items.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                              <p className="font-bold text-base text-wellness-green">
                                ₹
                                {Number(order.totalAmount).toLocaleString(
                                  "en-IN",
                                )}
                              </p>
                              <Badge
                                className={`text-xs ${statusBadge.className}`}
                              >
                                {statusBadge.label}
                              </Badge>
                            </div>
                          </div>

                          {/* Expandable items */}
                          {isExpanded && (
                            <div className="bg-muted/30 border-t border-border/30 px-4 py-3 space-y-2">
                              {order.items.map((item, itemIdx) => (
                                <div
                                  key={`${item.product.id}-${itemIdx}`}
                                  className="flex justify-between text-sm gap-3"
                                >
                                  <span className="text-foreground line-clamp-1 flex-1 min-w-0">
                                    {item.product.name} ×{Number(item.quantity)}
                                  </span>
                                  <span className="font-semibold text-wellness-green shrink-0">
                                    ₹
                                    {Number(item.price).toLocaleString("en-IN")}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Action buttons */}
                          <div className="flex flex-wrap items-center gap-2 px-4 pb-4 pt-2 border-t border-border/30">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedOrder(
                                  isExpanded ? null : order.orderId,
                                )
                              }
                              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                              data-ocid={`orders.expand_button.${idx + 1}`}
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="h-3 w-3" /> Hide items
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-3 w-3" /> View items
                                </>
                              )}
                            </button>

                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full text-xs h-7 px-3"
                              onClick={() => setSelectedOrder(order.orderId)}
                              data-ocid={`orders.view_button.${idx + 1}`}
                            >
                              Details
                            </Button>

                            {canCancel && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full text-xs h-7 px-3 border-destructive/40 text-destructive hover:bg-destructive/8"
                                onClick={() =>
                                  setActionModal({
                                    orderId: order.orderId,
                                    type: "cancel",
                                  })
                                }
                                data-ocid={`orders.cancel_button.${idx + 1}`}
                              >
                                <X className="h-3 w-3 mr-1" />
                                Cancel
                              </Button>
                            )}

                            {canReturn && withinWindow && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-full text-xs h-7 px-3 border-amber-400/50 text-amber-700 hover:bg-amber-50"
                                  onClick={() =>
                                    setActionModal({
                                      orderId: order.orderId,
                                      type: "return",
                                    })
                                  }
                                  data-ocid={`orders.return_button.${idx + 1}`}
                                >
                                  <RotateCcw className="h-3 w-3 mr-1" />
                                  Return
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-full text-xs h-7 px-3 border-wellness-green/40 text-wellness-green hover:bg-wellness-green/8"
                                  onClick={() =>
                                    setActionModal({
                                      orderId: order.orderId,
                                      type: "replace",
                                    })
                                  }
                                  data-ocid={`orders.replace_button.${idx + 1}`}
                                >
                                  Replace
                                </Button>
                              </>
                            )}

                            {canReturn && !withinWindow && (
                              <span className="text-xs text-muted-foreground">
                                Return window expired
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Addresses Tab ── */}
          <TabsContent value="addresses">
            <Card className="border border-border/50 shadow-card rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">
                  Saved Addresses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile?.savedAddresses &&
                profile.savedAddresses.length > 0 ? (
                  <div className="space-y-3">
                    {profile.savedAddresses.map((address, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: addresses have no id
                      <div
                        key={`addr-${address.line1}-${index}`}
                        className="border border-border/50 rounded-xl p-4 flex items-start justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-foreground">
                            {address.line1}
                          </p>
                          {address.line2 && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {address.line2}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {address.city}, {address.state} — {address.pincode}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full text-xs h-8 shrink-0 border-destructive/40 text-destructive hover:bg-destructive/8"
                          onClick={() => handleDeleteAddress(index)}
                          data-ocid={`address.delete_button.${index + 1}`}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    className="text-muted-foreground text-sm"
                    data-ocid="addresses.empty_state"
                  >
                    No saved addresses yet
                  </p>
                )}

                {showAddressForm ? (
                  <div className="border border-border/50 rounded-xl p-5 space-y-3 bg-muted/20">
                    <h3 className="font-semibold text-sm">Add New Address</h3>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">
                        Address Line 1
                      </Label>
                      <Input
                        value={newAddress.line1}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            line1: e.target.value,
                          })
                        }
                        className="rounded-lg"
                        data-ocid="address.line1.input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">
                        Address Line 2
                      </Label>
                      <Input
                        value={newAddress.line2}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            line2: e.target.value,
                          })
                        }
                        className="rounded-lg"
                        data-ocid="address.line2.input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">City</Label>
                        <Input
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              city: e.target.value,
                            })
                          }
                          className="rounded-lg"
                          data-ocid="address.city.input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">State</Label>
                        <Input
                          value={newAddress.state}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              state: e.target.value,
                            })
                          }
                          className="rounded-lg"
                          data-ocid="address.state.input"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Pincode</Label>
                      <Input
                        value={newAddress.pincode}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            pincode: e.target.value,
                          })
                        }
                        className="rounded-lg"
                        data-ocid="address.pincode.input"
                      />
                    </div>
                    <div className="flex gap-3 pt-1">
                      <Button
                        onClick={handleAddAddress}
                        disabled={isUpdating}
                        className="bg-wellness-green hover:bg-wellness-green-dark rounded-full px-6"
                        data-ocid="address.add_button"
                      >
                        Add Address
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={() => setShowAddressForm(false)}
                        data-ocid="address.cancel_button"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowAddressForm(true)}
                    variant="outline"
                    className="rounded-full"
                    data-ocid="address.new_address_button"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ── Order Details Sheet (right side) ── */}
        <Sheet
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        >
          <SheetContent
            side="right"
            className="w-full sm:max-w-lg"
            data-ocid="order_details.dialog"
          >
            <SheetHeader>
              <SheetTitle>Order Details</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
              {selectedOrderData && (
                <div className="space-y-5 pr-2">
                  <div className="bg-muted/40 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Order ID
                        </p>
                        <p className="font-mono font-semibold text-sm">
                          {selectedOrderData.orderId}
                        </p>
                      </div>
                      <Badge
                        className={`text-xs ${getStatusBadge(selectedOrderData.orderStatus).className}`}
                      >
                        {getStatusBadge(selectedOrderData.orderStatus).label}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                      Items
                    </p>
                    <div className="space-y-2 rounded-xl border border-border/50 overflow-hidden">
                      {selectedOrderData.items.map((item, index) => (
                        <div
                          key={`${item.product.id}-${index}`}
                          className="flex justify-between text-sm px-4 py-2.5 border-b last:border-0"
                        >
                          <span className="text-foreground">
                            {item.product.name} ×{Number(item.quantity)}
                          </span>
                          <span className="font-semibold text-wellness-green">
                            ₹{Number(item.price).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold px-4 py-2.5 bg-muted/30">
                        <span>Total</span>
                        <span className="text-wellness-green">
                          ₹
                          {Number(selectedOrderData.totalAmount).toLocaleString(
                            "en-IN",
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                      Shipping Address
                    </p>
                    <div className="text-sm bg-muted/40 rounded-xl p-4 leading-relaxed text-muted-foreground">
                      {selectedOrderData.shippingAddress.line1}
                      {selectedOrderData.shippingAddress.line2 &&
                        `, ${selectedOrderData.shippingAddress.line2}`}
                      <br />
                      {selectedOrderData.shippingAddress.city},{" "}
                      {selectedOrderData.shippingAddress.state} —{" "}
                      {selectedOrderData.shippingAddress.pincode}
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* ── Order Action Modal ── */}
        {actionModal && actionOrderData && (
          <OrderActionModal
            isOpen={!!actionModal}
            onClose={() => setActionModal(null)}
            actionType={actionModal.type}
            order={actionOrderData}
            onSubmit={handleOrderAction}
            isSubmitting={isActionSubmitting}
          />
        )}
      </div>
    </div>
  );
}
