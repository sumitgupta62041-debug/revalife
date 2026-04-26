import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Edit,
  Lock,
  Package,
  PlusCircle,
  Star,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Product, ProductCategory, ProductInput } from "../backend";
import { useActor } from "../hooks/useActor";
import { useAdmin } from "../hooks/useAdmin";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "ayurvedicCare" as ProductCategory, label: "Ayurvedic Care" },
  { value: "immunity" as ProductCategory, label: "Immunity" },
  {
    value: "digestiveHealth" as ProductCategory,
    label: "Digestive Health",
  },
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

export default function Admin() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
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
    // Show a clear login-required card for unauthenticated / non-admin visitors
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
                onClick={login}
                data-ocid="admin.login_button"
                className="bg-wellness-green hover:bg-wellness-green-dark text-white w-full"
                size="lg"
              >
                Login with Internet Identity
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
        {/* Stats */}
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

        {/* Products Tab */}
        <Tabs defaultValue="products" data-ocid="admin.tabs">
          <TabsList>
            <TabsTrigger value="products" data-ocid="admin.products_tab">
              <Package className="h-4 w-4 mr-1.5" />
              Products
            </TabsTrigger>
          </TabsList>

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
        </Tabs>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="admin.add_product_dialog"
        >
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            initial={EMPTY_FORM}
            onSubmit={(data) => createMutation.mutate(data)}
            onCancel={() => setShowAddDialog(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog
        open={!!editProduct}
        onOpenChange={(o) => !o && setEditProduct(null)}
      >
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="admin.edit_product_dialog"
        >
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
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
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent data-ocid="admin.delete_confirm_dialog">
          <DialogHeader>
            <DialogTitle>Delete Product?</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            This action cannot be undone. The product will be permanently
            removed from your store.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              data-ocid="admin.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
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
