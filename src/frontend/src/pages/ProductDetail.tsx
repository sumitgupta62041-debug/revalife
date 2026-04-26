import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { AlertCircle, CreditCard, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { ProductCategory } from "../backend";
import { useCart } from "../hooks/useCart";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useProducts } from "../hooks/useProducts";

const categoryLabels: Record<ProductCategory, string> = {
  [ProductCategory.multivitamins]: "Multivitamins",
  [ProductCategory.herbalSupplements]: "Herbal Supplements",
  [ProductCategory.fitness]: "Protein & Fitness",
  [ProductCategory.immunity]: "Immunity Boosters",
  [ProductCategory.ayurvedicCare]: "Ayurvedic Care",
  [ProductCategory.digestiveHealth]: "Digestive Health",
};

export default function ProductDetail() {
  const { id } = useParams({ from: "/products/$id" });
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { data: product, isLoading } = useProducts.useGetProduct(id);
  const { addToCart, isAddingToCart } = useCart();

  const isAuthenticated = !!identity;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      login();
      return;
    }

    try {
      await addToCart(id, BigInt(1));
      toast.success("Added to cart successfully!");
    } catch (_error) {
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to proceed");
      login();
      return;
    }

    try {
      await addToCart(id, BigInt(1));
      navigate({ to: "/checkout" });
    } catch (_error) {
      toast.error("Failed to proceed to checkout");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Product not found</p>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full rounded-2xl shadow-lg"
            />
          </div>

          <div>
            <Badge className="mb-4 bg-wellness-green">
              {categoryLabels[product.category]}
            </Badge>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-wellness-green mb-6">
              ₹{Number(product.price)}
            </p>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {product.fullDescription}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {product.ingredients.map((ingredient, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static list
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Benefits</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
                {product.benefits.map((benefit, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static list
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  These statements have not been evaluated. This product is not
                  intended to diagnose, treat, cure or prevent any disease.
                </AlertDescription>
              </Alert>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">How to Use</h2>
              <p className="text-gray-700">{product.howToUse}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Safety Information</h2>
              <p className="text-gray-700">{product.safetyInfo}</p>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !product.inStock}
                className="flex-1 bg-wellness-green hover:bg-wellness-green-dark"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={isAddingToCart || !product.inStock}
                variant="outline"
                className="flex-1 border-wellness-green text-wellness-green hover:bg-wellness-green hover:text-white"
                size="lg"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Buy Now
              </Button>
            </div>

            {!product.inStock && (
              <p className="text-red-600 mt-4 text-center">
                Currently out of stock
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
