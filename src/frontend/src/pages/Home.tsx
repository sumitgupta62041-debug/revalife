import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Award, Shield, Truck } from "lucide-react";
import { useProducts } from "../hooks/useProducts";

// Tagline options for revAlife:
// 1. "Science-Backed Wellness for India"
// 2. "Trust in Every Supplement"
// 3. "Premium Health, Proven Results"
// 4. "Your Partner in Natural Wellness"
// 5. "Quality You Can Trust, Results You Can Feel"

export default function Home() {
  const { data: featuredProducts = [], isLoading } =
    useProducts.useFeaturedProducts();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center py-24 md:py-32"
        style={{
          backgroundImage: "url(/assets/generated/hero-bg.dim_1920x1080.png)",
        }}
      >
        <div className="absolute inset-0 bg-white/80" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Science-Backed Wellness for India
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Premium health supplements backed by science, crafted for Indian
              wellness needs
            </p>
            <Link to="/products">
              <Button
                size="lg"
                className="bg-wellness-green hover:bg-wellness-green-dark text-lg px-8 py-6"
              >
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <img
                src="/assets/generated/badge-secure.dim_120x120.png"
                alt="Secure Payment"
                className="h-20 w-20 mb-4"
              />
              <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
              <p className="text-muted-foreground">
                Safe and encrypted transactions
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <img
                src="/assets/generated/badge-quality.dim_120x120.png"
                alt="Quality Tested"
                className="h-20 w-20 mb-4"
              />
              <h3 className="font-semibold text-lg mb-2">Quality Tested</h3>
              <p className="text-muted-foreground">
                Rigorous quality control standards
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <img
                src="/assets/generated/badge-delivery.dim_120x120.png"
                alt="India-wide Delivery"
                className="h-20 w-20 mb-4"
              />
              <h3 className="font-semibold text-lg mb-2">
                India-wide Delivery
              </h3>
              <p className="text-muted-foreground">
                Fast delivery across all states
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Products
          </h2>
          {isLoading ? (
            <div className="text-center">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.slice(0, 6).map((product) => (
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
                    <h3 className="font-semibold text-lg mb-2">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {product.shortDescription}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-wellness-green">
                        ₹{Number(product.price)}
                      </span>
                      <Link to="/products/$id" params={{ id: product.id }}>
                        <Button
                          variant="outline"
                          className="border-wellness-green text-wellness-green hover:bg-wellness-green hover:text-white"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/products">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why revAlife */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why revAlife?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="h-12 w-12 text-wellness-green mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-3">Trustworthy</h3>
              <p className="text-muted-foreground">
                Every product is carefully selected and tested to meet the
                highest safety standards
              </p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 text-wellness-green mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-3">Science-Backed</h3>
              <p className="text-muted-foreground">
                Our formulations are based on scientific research and proven
                ingredients
              </p>
            </div>
            <div className="text-center">
              <Truck className="h-12 w-12 text-wellness-green mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-3">Quality Assured</h3>
              <p className="text-muted-foreground">
                Rigorous quality control ensures you receive only the best
                products
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Science-Backed Approach */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Our Science-Backed Approach
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              At revAlife, we believe in the power of science to improve health.
              Every ingredient is carefully researched, every formula is tested,
              and every product is designed with your wellness in mind. We
              combine traditional Indian wellness wisdom with modern scientific
              research to bring you supplements you can trust.
            </p>
            <Link to="/science">
              <Button variant="outline" size="lg">
                Learn More About Our Science
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
