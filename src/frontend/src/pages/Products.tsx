import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCategory } from "../backend";
import { useProducts } from "../hooks/useProducts";

const categoryLabels: Record<ProductCategory, string> = {
  [ProductCategory.multivitamins]: "Multivitamins",
  [ProductCategory.herbalSupplements]: "Herbal Supplements",
  [ProductCategory.fitness]: "Protein & Fitness",
  [ProductCategory.immunity]: "Immunity Boosters",
  [ProductCategory.ayurvedicCare]: "Ayurvedic Care",
  [ProductCategory.digestiveHealth]: "Digestive Health",
};

export default function Products() {
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null);
  const { data: products = [], isLoading } =
    useProducts.useListProducts(selectedCategory);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Our Products</h1>

        <div className="mb-8">
          <Select
            value={selectedCategory || "all"}
            onValueChange={(value) =>
              setSelectedCategory(
                value === "all" ? null : (value as ProductCategory),
              )
            }
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No products found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <Badge className="mb-2 bg-wellness-green">
                    {categoryLabels[product.category]}
                  </Badge>
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {product.shortDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-wellness-green">
                      ₹{Number(product.price)}
                    </span>
                    <Link to="/products/$id" params={{ id: product.id }}>
                      <Button className="bg-wellness-green hover:bg-wellness-green-dark">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
