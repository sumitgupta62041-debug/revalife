import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Edit,
  Eye,
  IndianRupee,
  Lock,
  MapPin,
  Package,
  PlusCircle,
  RefreshCw,
  Search,
  ShoppingBag,
  ShoppingCart,
  Star,
  Trash2,
  TrendingUp,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { useLoginModal } from "../App";
import type { Order, Product, ProductCategory, ProductInput } from "../backend";
import { OrderStatus } from "../backend";
import { useActor } from "../hooks/useActor";
import { useAdmin } from "../hooks/useAdmin";
import {
  useAnalyticsSummary,
  useOrdersByDay,
  useOrdersByStatus,
  usePaymentMethodBreakdown,
  useRevenueByDay,
  useTopSellingProducts,
} from "../hooks/useAnalytics";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetAllOrders, useUpdateOrderStatus } from "../hooks/useOrders";

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "ayurvedicCare" as ProductCategory, label: "Ayurvedic Care" },
  { value: "immunity" as ProductCategory, label: "Immunity" },
  { value: "digestiveHealth" as ProductCategory, label: "Digestive Health" },
  { value: "fitness" as ProductCategory, label: "Fitness" },
  { value: "multivitamins" as ProductCategory, label: "Multivitamins" },
  {
    value: "herbalSupplements" as ProductCategory,
    label: "Herbal Supplements",
  },
];

const EMPTY_FORM: ProductInput = {
  name: "",
  description: "",
  howToUse: "",
  stock: BigInt(0),
  imageUrl: "",
  isFeatured: false,
  category: "ayurvedicCare" as ProductCategory,
  benefits: "",
  safetyInfo: "",
  price: BigInt(0),
  ingredients: "",
};

// Chart colors using CSS custom properties resolved at runtime
const PIE_COLORS = [
  "oklch(0.62 0.16 152)",
  "oklch(0.72 0.14 152)",
  "oklch(0.55 0.13 184)",
  "oklch(0.65 0.14 130)",
  "oklch(0.72 0.12 70)",
  "oklch(0.50 0.12 250)",
];

function formatINR(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

// ─── Product Form ─────────────────────────────────────────────────────────────

function ProductForm({
  initial,
  onSubmit,
  onCancel,
  isLoading,
}: {
  initial: ProductInput;
  onSubmit: (data: ProductInput) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState<ProductInput>(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const set = <K extends keyof ProductInput>(k: K, v: ProductInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            data-ocid="admin.product_form.name_input"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Ashwagandha Premium Extract"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="category">Category</Label>
          <Select
            value={form.category as string}
            onValueChange={(v) => set("category", v as ProductCategory)}
          >
            <SelectTrigger
              id="category"
              data-ocid="admin.product_form.category_select"
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            type="number"
            data-ocid="admin.product_form.price_input"
            value={Number(form.price)}
            onChange={(e) =>
              set("price", BigInt(Math.round(Number(e.target.value))))
            }
            placeholder="1499"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            type="number"
            data-ocid="admin.product_form.stock_input"
            value={Number(form.stock)}
            onChange={(e) =>
              set("stock", BigInt(Math.round(Number(e.target.value))))
            }
            placeholder="100"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          data-ocid="admin.product_form.image_input"
          value={form.imageUrl}
          onChange={(e) => set("imageUrl", e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Full Description</Label>
        <Textarea
          id="description"
          data-ocid="admin.product_form.description_input"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          placeholder="Detailed product description..."
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="benefits">
          Benefits{" "}
          <span className="text-muted-foreground text-xs">
            (pipe-separated)
          </span>
        </Label>
        <Input
          id="benefits"
          data-ocid="admin.product_form.benefits_input"
          value={form.benefits}
          onChange={(e) => set("benefits", e.target.value)}
          placeholder="Reduces stress|Improves sleep|Boosts energy"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ingredients">
          Ingredients{" "}
          <span className="text-muted-foreground text-xs">
            (pipe-separated)
          </span>
        </Label>
        <Input
          id="ingredients"
          data-ocid="admin.product_form.ingredients_input"
          value={form.ingredients}
          onChange={(e) => set("ingredients", e.target.value)}
          placeholder="Ashwagandha Root Extract|Black Pepper|Turmeric"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="howToUse">How to Use</Label>
        <Input
          id="howToUse"
          data-ocid="admin.product_form.how_to_use_input"
          value={form.howToUse}
          onChange={(e) => set("howToUse", e.target.value)}
          placeholder="Take 1 capsule twice daily with water"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="safetyInfo">Safety Information</Label>
        <Input
          id="safetyInfo"
          data-ocid="admin.product_form.safety_input"
          value={form.safetyInfo}
          onChange={(e) => set("safetyInfo", e.target.value)}
          placeholder="Keep out of reach of children..."
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="isFeatured"
          data-ocid="admin.product_form.featured_switch"
          checked={form.isFeatured}
          onCheckedChange={(v) => set("isFeatured", v)}
        />
        <Label htmlFor="isFeatured">Feature on homepage</Label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onCancel}
          data-ocid="admin.product_form.cancel_button"
        >
          Cancel
        </Button>
        <Button
          onClick={() => onSubmit(form)}
          disabled={isLoading || !form.name || !form.price}
          data-ocid="admin.product_form.submit_button"
          className="bg-wellness-green hover:bg-wellness-green-dark text-white"
        >
          {isLoading ? "Saving..." : "Save Product"}
        </Button>
      </div>
    </div>
  );
}

// ─── Product Row ──────────────────────────────────────────────────────────────

function ProductRow({
  product,
  index,
  onEdit,
  onDelete,
  onToggleFeatured,
}: {
  product: Product;
  index: number;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
}) {
  return (
    <div
      data-ocid={`admin.product.item.${index}`}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border rounded-xl bg-card hover:shadow-card transition-smooth"
    >
      <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Package className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-foreground truncate">
            {product.name}
          </p>
          {product.featured && (
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Featured
            </Badge>
          )}
          <Badge
            variant={product.inStock ? "outline" : "destructive"}
            className={
              product.inStock
                ? "text-wellness-green border-wellness-green text-xs"
                : "text-xs"
            }
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          {product.category}
        </p>
        <p className="text-sm font-semibold text-wellness-green mt-1">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          data-ocid={`admin.product.featured_toggle.${index}`}
          onClick={() => onToggleFeatured(product.id, !product.featured)}
          title={product.featured ? "Unfeature" : "Feature"}
        >
          <Star
            className={`h-4 w-4 ${product.featured ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
          />
        </Button>
        <Button
          variant="outline"
          size="sm"
          data-ocid={`admin.product.edit_button.${index}`}
          onClick={() => onEdit(product)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          data-ocid={`admin.product.delete_button.${index}`}
          onClick={() => onDelete(product.id)}
          className="text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
}

// ─── Order Helpers ────────────────────────────────────────────────────────────

const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: OrderStatus.pending, label: "Pending" },
  { value: OrderStatus.confirmed, label: "Confirmed" },
  { value: OrderStatus.shipped, label: "Shipped" },
  { value: OrderStatus.delivered, label: "Delivered" },
  { value: OrderStatus.cancelled, label: "Cancelled" },
];

function statusBadgeClass(status: OrderStatus) {
  switch (status) {
    case OrderStatus.pending:
      return "bg-amber-100 text-amber-700 border-amber-200";
    case OrderStatus.confirmed:
      return "bg-blue-100 text-blue-700 border-blue-200";
    case OrderStatus.shipped:
      return "bg-purple-100 text-purple-700 border-purple-200";
    case OrderStatus.delivered:
      return "bg-green-100 text-green-700 border-green-200";
    case OrderStatus.cancelled:
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

function statusLabel(status: OrderStatus) {
  return ORDER_STATUSES.find((s) => s.value === status)?.label ?? status;
}

function paymentLabel(method: string) {
  const map: Record<string, string> = {
    upi: "UPI",
    card: "Card",
    netbanking: "Netbanking",
    cod: "Cash on Delivery",
  };
  return map[method] ?? method;
}

function formatDate(time: bigint) {
  return new Date(Number(time) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function shortOrderId(id: string) {
  return `#${id.slice(0, 8).toUpperCase()}`;
}

// ─── Order Detail Modal ───────────────────────────────────────────────────────

function OrderDetailDialog({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  const [newStatus, setNewStatus] = useState<OrderStatus>(order.orderStatus);
  const updateStatus = useUpdateOrderStatus();

  const handleSave = () => {
    updateStatus.mutate(
      { orderId: order.orderId, newStatus },
      {
        onSuccess: () => {
          toast.success("Order status updated!");
          onClose();
        },
        onError: (e: Error) => toast.error(e.message),
      },
    );
  };

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto"
        data-ocid="admin.orders.detail_dialog"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Order {shortOrderId(order.orderId)}
            <Badge className={`text-xs ${statusBadgeClass(order.orderStatus)}`}>
              {statusLabel(order.orderStatus)}
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-5 mt-4">
          {/* Items */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Package className="h-4 w-4 text-wellness-green" />
              Ordered Items
            </h4>
            <div className="rounded-xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-semibold text-muted-foreground">
                      Product
                    </th>
                    <th className="text-right p-3 font-semibold text-muted-foreground">
                      Qty
                    </th>
                    <th className="text-right p-3 font-semibold text-muted-foreground">
                      Price
                    </th>
                    <th className="text-right p-3 font-semibold text-muted-foreground">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => (
                    <tr
                      key={`${item.product.id}-${i}`}
                      className="border-t"
                      data-ocid={`admin.orders.detail.item.${i + 1}`}
                    >
                      <td className="p-3 font-medium text-foreground">
                        {item.product.name}
                      </td>
                      <td className="p-3 text-right text-muted-foreground">
                        {Number(item.quantity)}
                      </td>
                      <td className="p-3 text-right text-muted-foreground">
                        {formatINR(Number(item.price))}
                      </td>
                      <td className="p-3 text-right font-semibold text-wellness-green">
                        {formatINR(Number(item.price) * Number(item.quantity))}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t bg-muted/30">
                    <td
                      colSpan={3}
                      className="p-3 text-right font-bold text-foreground"
                    >
                      Total
                    </td>
                    <td className="p-3 text-right font-bold text-wellness-green text-base">
                      {formatINR(Number(order.totalAmount))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer + Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border p-4 space-y-2">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <User className="h-4 w-4 text-wellness-green" />
                Customer Details
              </h4>
              <p className="text-sm font-medium text-foreground">
                {order.customerDetails.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {order.customerDetails.email}
              </p>
              <p className="text-xs text-muted-foreground">
                {order.customerDetails.phone}
              </p>
            </div>
            <div className="rounded-xl border p-4 space-y-2">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-wellness-green" />
                Shipping Address
              </h4>
              <p className="text-sm text-foreground leading-relaxed">
                {order.shippingAddress.line1}
                {order.shippingAddress.line2
                  ? `, ${order.shippingAddress.line2}`
                  : ""}
              </p>
              <p className="text-xs text-muted-foreground">
                {order.shippingAddress.city}, {order.shippingAddress.state} –{" "}
                {order.shippingAddress.pincode}
              </p>
            </div>
          </div>

          {/* Payment + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground mb-1">
                Payment Method
              </p>
              <p className="text-sm font-semibold text-foreground">
                {paymentLabel(order.paymentMethod as unknown as string)}
              </p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground mb-1">Order Date</p>
              <p className="text-sm font-semibold text-foreground">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          {/* Status Update */}
          <div className="rounded-xl border p-4 space-y-3">
            <h4 className="text-sm font-semibold text-foreground">
              Update Order Status
            </h4>
            <Select
              value={newStatus}
              onValueChange={(v) => setNewStatus(v as OrderStatus)}
            >
              <SelectTrigger data-ocid="admin.orders.detail.status_select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="gap-2 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="admin.orders.detail.cancel_button"
          >
            Close
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateStatus.isPending || newStatus === order.orderStatus}
            data-ocid="admin.orders.detail.save_button"
            className="bg-wellness-green hover:bg-wellness-green-dark text-white"
          >
            {updateStatus.isPending ? "Saving..." : "Save Status"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────

function OrdersTab() {
  const {
    data: orders = [],
    isLoading,
    refetch,
    isFetching,
  } = useGetAllOrders();
  const { actor } = useActor();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Auto-refetch when actor becomes available but orders are still empty
  useEffect(() => {
    if (actor && !isLoading && orders.length === 0) {
      refetch();
    }
  }, [actor, isLoading, orders.length, refetch]);

  const filtered = orders.filter((o) => {
    const matchSearch =
      search === "" ||
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.customerDetails.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customerDetails.phone.includes(search);
    const matchStatus =
      statusFilter === "all" ||
      (o.orderStatus as unknown as string) === statusFilter;
    return matchSearch && matchStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="admin.orders.loading_state">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4" data-ocid="admin.orders.section">
      {/* Filters */}
      <Card className="border shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by order ID, name, or phone..."
                data-ocid="admin.orders.search_input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                className="sm:w-48"
                data-ocid="admin.orders.status_filter"
              >
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {ORDER_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              disabled={isFetching}
              data-ocid="admin.orders.refresh_button"
              title="Refresh orders"
              className="flex-shrink-0"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div
          data-ocid="admin.orders.empty_state"
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="h-20 w-20 rounded-full bg-wellness-green/10 flex items-center justify-center mb-4">
            <ShoppingBag className="h-10 w-10 text-wellness-green" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            {orders.length === 0 ? "No orders yet" : "No orders match"}
          </h3>
          <p className="text-muted-foreground max-w-sm leading-relaxed mb-4">
            {orders.length === 0
              ? "Orders will appear here once customers start purchasing."
              : "Try adjusting your search or filter."}
          </p>
          {orders.length === 0 && (
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isFetching}
              data-ocid="admin.orders.empty_refresh_button"
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              {isFetching ? "Loading..." : "Refresh Orders"}
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order, idx) => (
            <Card
              key={order.orderId}
              data-ocid={`admin.orders.item.${idx + 1}`}
              className="border shadow-card hover:shadow-md transition-smooth"
            >
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* Left: Order info */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-foreground font-mono text-sm">
                        {shortOrderId(order.orderId)}
                      </span>
                      <Badge
                        className={`text-xs px-2 py-0.5 ${statusBadgeClass(order.orderStatus)}`}
                      >
                        {statusLabel(order.orderStatus)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      <span className="flex items-center gap-1 text-foreground font-medium">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        {order.customerDetails.name}
                      </span>
                      <span className="text-muted-foreground">
                        {order.customerDetails.phone}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} –{" "}
                        {order.shippingAddress.pincode}
                      </span>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"} ·{" "}
                      {paymentLabel(order.paymentMethod as unknown as string)}
                    </div>
                  </div>

                  {/* Right: Amount + action */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1.5 flex-shrink-0">
                    <p className="text-lg font-bold text-wellness-green">
                      {formatINR(Number(order.totalAmount))}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedOrder(order)}
                      data-ocid={`admin.orders.view_button.${idx + 1}`}
                      className="text-xs"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedOrder && (
        <OrderDetailDialog
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

// ─── Analytics Dashboard ──────────────────────────────────────────────────────

function AnalyticsDashboard() {
  const { data: summary, isLoading: summaryLoading } = useAnalyticsSummary();
  const { data: revenueByDay = [], isLoading: revenueLoading } =
    useRevenueByDay(30);
  const { data: ordersByDay = [], isLoading: ordersLoading } =
    useOrdersByDay(30);
  const { data: ordersByStatus = [], isLoading: statusLoading } =
    useOrdersByStatus();
  const { data: topProducts = [], isLoading: topLoading } =
    useTopSellingProducts(10);
  const { data: paymentBreakdown = [], isLoading: paymentLoading } =
    usePaymentMethodBreakdown();

  const hasData = (summary?.totalOrders ?? 0) > 0;
  const isLoading =
    summaryLoading ||
    revenueLoading ||
    ordersLoading ||
    statusLoading ||
    topLoading ||
    paymentLoading;

  if (isLoading) {
    return (
      <div className="space-y-6" data-ocid="admin.analytics.loading_state">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div
        data-ocid="admin.analytics.empty_state"
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="h-20 w-20 rounded-full bg-wellness-green/10 flex items-center justify-center mb-4">
          <TrendingUp className="h-10 w-10 text-wellness-green" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          No orders yet
        </h3>
        <p className="text-muted-foreground max-w-sm leading-relaxed">
          Start selling to see your analytics! Revenue trends, top products, and
          payment breakdowns will appear here once orders come in.
        </p>
      </div>
    );
  }

  const kpiCards = [
    {
      label: "Total Revenue",
      value: formatINR(summary?.totalRevenue ?? 0),
      icon: IndianRupee,
      color: "text-wellness-green",
      bg: "bg-wellness-green/10",
    },
    {
      label: "Total Orders",
      value: summary?.totalOrders ?? 0,
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Avg Order Value",
      value: formatINR(summary?.avgOrderValue ?? 0),
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Total Products",
      value: summary?.totalProducts ?? 0,
      icon: Package,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6" data-ocid="admin.analytics.section">
      {/* KPI Cards */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        data-ocid="admin.analytics.kpi_cards"
      >
        {kpiCards.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="border shadow-card">
            <CardContent className="p-4">
              <div
                className={`h-10 w-10 rounded-lg ${bg} flex items-center justify-center mb-3`}
              >
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground leading-tight">
                {value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row 1: Revenue + Orders trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card
          className="border shadow-card"
          data-ocid="admin.analytics.revenue_chart"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Revenue Trend (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueByDay.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No revenue data available
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={revenueByDay}
                  margin={{ top: 4, right: 12, left: 0, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
                    width={52}
                  />
                  <Tooltip
                    formatter={(v: number) => [formatINR(v), "Revenue"]}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="oklch(0.62 0.16 152)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card
          className="border shadow-card"
          data-ocid="admin.analytics.orders_chart"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Orders Trend (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ordersByDay.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No order data available
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={ordersByDay}
                  margin={{ top: 4, right: 12, left: 0, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    allowDecimals={false}
                    width={36}
                  />
                  <Tooltip
                    formatter={(v: number) => [v, "Orders"]}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="oklch(0.55 0.18 250)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2: Status + Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card
          className="border shadow-card"
          data-ocid="admin.analytics.status_chart"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Orders by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ordersByStatus.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No status data available
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={ordersByStatus}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 60, bottom: 4 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="status"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    width={60}
                  />
                  <Tooltip
                    formatter={(v: number) => [v, "Orders"]}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="oklch(0.62 0.16 152)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card
          className="border shadow-card"
          data-ocid="admin.analytics.payment_chart"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Payment Method Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paymentBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No payment data available
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={paymentBreakdown}
                    dataKey="count"
                    nameKey="method"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({
                      method,
                      percent,
                    }: { method: string; percent: number }) =>
                      `${method} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {paymentBreakdown.map((entry, i) => (
                      <Cell
                        key={entry.method}
                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number, name: string) => [v, name]}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={10}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Products Table */}
      <Card
        className="border shadow-card"
        data-ocid="admin.analytics.top_products"
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Top Selling Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No sales data available
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-semibold text-muted-foreground w-12">
                      #
                    </th>
                    <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">
                      Product Name
                    </th>
                    <th className="text-right py-2 font-semibold text-muted-foreground">
                      Units Sold
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product) => (
                    <tr
                      key={product.id}
                      data-ocid={`admin.analytics.top_products.item.${product.rank}`}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                            product.rank === 1
                              ? "bg-amber-100 text-amber-700"
                              : product.rank === 2
                                ? "bg-muted text-foreground"
                                : product.rank === 3
                                  ? "bg-orange-50 text-orange-600"
                                  : "bg-muted/50 text-muted-foreground"
                          }`}
                        >
                          {product.rank}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-medium text-foreground">
                        {product.name}
                      </td>
                      <td className="py-3 text-right font-semibold text-wellness-green">
                        {product.unitsSold.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Admin Component ─────────────────────────────────────────────────────

export default function Admin() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { openLoginModal } = useLoginModal();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Auth guard — redirect non-admin users after check resolves
  useEffect(() => {
    if (!adminLoading && identity && !isAdmin) {
      toast.error("You don't have permission to access the admin panel.");
      navigate({ to: "/" });
    }
  }, [adminLoading, identity, isAdmin, navigate]);

  const { data: products = [], isLoading: productsLoading } = useQuery<
    Product[]
  >({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllProductsAdmin();
    },
    enabled: !!actor && isAdmin,
  });

  const createMutation = useMutation({
    mutationFn: async (input: ProductInput) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.createProduct(input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["featuredProducts"] });
      toast.success("Product created successfully!");
      setShowAddDialog(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: ProductInput }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.updateProduct(id, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["featuredProducts"] });
      toast.success("Product updated successfully!");
      setEditProduct(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.deleteProduct(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["featuredProducts"] });
      toast.success("Product deleted.");
      setDeleteId(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const featuredMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.setFeatured(id, featured);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["featuredProducts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toProductInput = (p: Product): ProductInput => ({
    name: p.name,
    description: p.fullDescription,
    howToUse: p.howToUse,
    stock: BigInt(100),
    imageUrl: p.imageUrl,
    isFeatured: p.featured,
    category: p.category,
    benefits: p.benefits.join("|"),
    safetyInfo: p.safetyInfo,
    price: p.price,
    ingredients: p.ingredients.join("|"),
  });

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.inStock).length,
    featured: products.filter((p) => p.featured).length,
  };

  if (adminLoading) {
    return (
      <div
        className="min-h-screen bg-background"
        data-ocid="admin.loading_state"
      >
        <div className="container mx-auto px-4 py-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!identity || !isAdmin) {
    const isNotLoggedIn = !identity;
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center px-4"
        data-ocid="admin.auth_required_state"
      >
        <Card className="w-full max-w-md shadow-lg border">
          <CardContent className="pt-10 pb-8 flex flex-col items-center text-center gap-5">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">
                {isNotLoggedIn ? "Login Required" : "Access Denied"}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {isNotLoggedIn
                  ? "You need to log in with an admin account to access the Admin Panel."
                  : "Your account does not have admin privileges."}
              </p>
            </div>
            {isNotLoggedIn && (
              <Button
                onClick={openLoginModal}
                data-ocid="admin.login_button"
                className="bg-wellness-green hover:bg-wellness-green-dark text-white w-full"
                size="lg"
              >
                Login
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/" })}
              data-ocid="admin.back_home_button"
              className="w-full"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-ocid="admin.page">
      {/* Admin header bar */}
      <div className="bg-card border-b px-4 py-4">
        <div className="container mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">
              Admin Panel
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your revAlife store
            </p>
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            data-ocid="admin.add_product_button"
            className="bg-wellness-green hover:bg-wellness-green-dark text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Product Stats */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          data-ocid="admin.stats.section"
        >
          {[
            { label: "Total Products", value: stats.total, icon: Package },
            { label: "In Stock", value: stats.inStock, icon: BarChart3 },
            { label: "Featured", value: stats.featured, icon: Star },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label} className="border shadow-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-wellness-green/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-wellness-green" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs: Products + Analytics */}
        <Tabs defaultValue="products" data-ocid="admin.tabs">
          <TabsList>
            <TabsTrigger value="products" data-ocid="admin.products_tab">
              <Package className="h-4 w-4 mr-1.5" />
              Products
            </TabsTrigger>
            <TabsTrigger value="analytics" data-ocid="admin.analytics_tab">
              <TrendingUp className="h-4 w-4 mr-1.5" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="orders" data-ocid="admin.orders_tab">
              <ShoppingBag className="h-4 w-4 mr-1.5" />
              Orders
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="mt-4">
            <Card className="border shadow-card">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <CardTitle className="text-lg">Manage Products</CardTitle>
                  <Input
                    placeholder="Search products..."
                    data-ocid="admin.search_input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="sm:w-64"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div
                    className="space-y-3"
                    data-ocid="admin.products.loading_state"
                  >
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full rounded-xl" />
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div
                    data-ocid="admin.products.empty_state"
                    className="text-center py-12"
                  >
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground font-medium">
                      No products found
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {search
                        ? "Try a different search term"
                        : "Add your first product to get started"}
                    </p>
                    {!search && (
                      <Button
                        className="mt-4 bg-wellness-green hover:bg-wellness-green-dark text-white"
                        onClick={() => setShowAddDialog(true)}
                        data-ocid="admin.empty_add_button"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filtered.map((product, idx) => (
                      <ProductRow
                        key={product.id}
                        product={product}
                        index={idx + 1}
                        onEdit={(p) => setEditProduct(p)}
                        onDelete={(id) => setDeleteId(id)}
                        onToggleFeatured={(id, featured) =>
                          featuredMutation.mutate({ id, featured })
                        }
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-4">
            <AnalyticsDashboard />
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-4">
            <OrdersTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Product Sheet */}
      <Sheet open={showAddDialog} onOpenChange={setShowAddDialog}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl overflow-y-auto"
          data-ocid="admin.add_product_dialog"
        >
          <SheetHeader>
            <SheetTitle>Add New Product</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <ProductForm
              initial={EMPTY_FORM}
              onSubmit={(data) => createMutation.mutate(data)}
              onCancel={() => setShowAddDialog(false)}
              isLoading={createMutation.isPending}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Product Sheet */}
      <Sheet
        open={!!editProduct}
        onOpenChange={(o) => !o && setEditProduct(null)}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl overflow-y-auto"
          data-ocid="admin.edit_product_dialog"
        >
          <SheetHeader>
            <SheetTitle>Edit Product</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {editProduct && (
              <ProductForm
                initial={toProductInput(editProduct)}
                onSubmit={(data) =>
                  updateMutation.mutate({ id: editProduct.id, input: data })
                }
                onCancel={() => setEditProduct(null)}
                isLoading={updateMutation.isPending}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent
          className="sm:max-w-sm"
          data-ocid="admin.delete_confirm_dialog"
        >
          <DialogHeader>
            <DialogTitle>Delete Product?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The product will be permanently
              removed from your store.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2 flex-row">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setDeleteId(null)}
              data-ocid="admin.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              disabled={deleteMutation.isPending}
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              data-ocid="admin.delete.confirm_button"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
