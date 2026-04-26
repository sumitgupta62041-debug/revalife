import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { type Address, OrderStatus } from "../backend";
import { useOrders } from "../hooks/useOrders";
import { useProfile } from "../hooks/useProfile";

const orderStatusColors: Record<OrderStatus, string> = {
  [OrderStatus.pending]: "bg-yellow-500",
  [OrderStatus.confirmed]: "bg-blue-500",
  [OrderStatus.shipped]: "bg-purple-500",
  [OrderStatus.delivered]: "bg-green-500",
  [OrderStatus.cancelled]: "bg-red-500",
};

export default function MyAccount() {
  const _router = useRouter();
  const searchParams = new URLSearchParams(window.location.search);
  const initialTab = searchParams.get("tab") || "profile";

  const { profile, updateProfile, addAddress, deleteAddress, isUpdating } =
    useProfile();
  const { data: orders = [], isLoading: ordersLoading } =
    useOrders.useGetUserOrders();

  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
  });

  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
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
    } catch (_error) {
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
    } catch (_error) {
      toast.error("Failed to add address");
    }
  };

  const handleDeleteAddress = async (index: number) => {
    try {
      await deleteAddress(BigInt(index));
      toast.success("Address deleted successfully");
    } catch (_error) {
      toast.error("Failed to delete address");
    }
  };

  const selectedOrderData = orders.find((o) => o.orderId === selectedOrder);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-bold mb-8">My Account</h1>

        <Tabs defaultValue={initialTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    disabled={!editMode}
                  />
                </div>
                <div className="flex space-x-3">
                  {editMode ? (
                    <>
                      <Button
                        onClick={handleUpdateProfile}
                        disabled={isUpdating}
                        className="bg-wellness-green hover:bg-wellness-green-dark"
                      >
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setEditMode(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <p>Loading orders...</p>
                ) : orders.length === 0 ? (
                  <p className="text-gray-600">No orders yet</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.orderId}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold">
                              Order #{order.orderId}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(
                                Number(order.createdAt) / 1000000,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              ₹{Number(order.totalAmount)}
                            </p>
                            <Badge
                              className={orderStatusColors[order.orderStatus]}
                            >
                              {order.orderStatus}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order.orderId)}
                        >
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <CardTitle>Saved Addresses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile?.savedAddresses &&
                profile.savedAddresses.length > 0 ? (
                  <div className="space-y-3">
                    {profile.savedAddresses.map((address, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: addresses have no stable id
                      <div key={index} className="border rounded-lg p-4">
                        <p className="font-semibold mb-1">{address.line1}</p>
                        {address.line2 && (
                          <p className="text-sm text-gray-600">
                            {address.line2}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleDeleteAddress(index)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No saved addresses</p>
                )}

                {showAddressForm ? (
                  <div className="border rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold">Add New Address</h3>
                    <div>
                      <Label>Address Line 1</Label>
                      <Input
                        value={newAddress.line1}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            line1: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Address Line 2</Label>
                      <Input
                        value={newAddress.line2}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            line2: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>City</Label>
                        <Input
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              city: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>State</Label>
                        <Input
                          value={newAddress.state}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              state: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Pincode</Label>
                      <Input
                        value={newAddress.pincode}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            pincode: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        onClick={handleAddAddress}
                        disabled={isUpdating}
                        className="bg-wellness-green hover:bg-wellness-green-dark"
                      >
                        Add Address
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddressForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => setShowAddressForm(true)}>
                    Add New Address
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Order Details Modal */}
        <Dialog
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrderData && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold">{selectedOrderData.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge
                    className={orderStatusColors[selectedOrderData.orderStatus]}
                  >
                    {selectedOrderData.orderStatus}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Items</p>
                  <div className="space-y-2">
                    {selectedOrderData.items.map((item, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: order items have no stable id
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.product.name} x {Number(item.quantity)}
                        </span>
                        <span className="font-semibold">
                          ₹{Number(item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-wellness-green">
                      ₹{Number(selectedOrderData.totalAmount)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Shipping Address</p>
                  <p className="text-sm">
                    {selectedOrderData.shippingAddress.line1}
                    {selectedOrderData.shippingAddress.line2 &&
                      `, ${selectedOrderData.shippingAddress.line2}`}
                    <br />
                    {selectedOrderData.shippingAddress.city},{" "}
                    {selectedOrderData.shippingAddress.state} -{" "}
                    {selectedOrderData.shippingAddress.pincode}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
