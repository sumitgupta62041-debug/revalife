import { Award, Heart, Shield } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">About revAlife</h1>

        <div className="space-y-12">
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="h-8 w-8 text-wellness-green" />
              <h2 className="text-2xl font-bold">Our Mission</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              At revAlife, our mission is to provide trustworthy, science-backed
              wellness solutions tailored for Indian customers. We believe that
              everyone deserves access to high-quality health supplements that
              are safe, effective, and transparent. Our commitment is to bridge
              the gap between traditional wellness wisdom and modern scientific
              research, bringing you products that truly make a difference in
              your health journey.
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-8 w-8 text-wellness-green" />
              <h2 className="text-2xl font-bold">Indian Wellness Focus</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We understand the unique health needs and lifestyles of Indian
              customers. Our products are carefully selected to address common
              wellness concerns in India, from immunity support to digestive
              health. We respect traditional Indian wellness practices while
              incorporating modern nutritional science to create formulations
              that work for Indian bodies and lifestyles. Every product is
              designed with the Indian consumer in mind, ensuring relevance,
              efficacy, and cultural appropriateness.
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Award className="h-8 w-8 text-wellness-green" />
              <h2 className="text-2xl font-bold">Quality Promise</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Quality is at the heart of everything we do at revAlife. We are
              committed to safety, rigorous testing, and complete transparency.
              Every ingredient is carefully sourced and verified. Every product
              undergoes multiple quality checks before reaching you. We maintain
              the highest standards of manufacturing and storage to ensure that
              what you receive is pure, potent, and safe. Our quality promise is
              simple: we only sell products that we would give to our own
              families.
            </p>
          </section>

          <section className="bg-gray-50 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Why Choose revAlife?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <h3 className="font-semibold mb-2">Trustworthy</h3>
                <p className="text-sm text-gray-600">
                  Transparent ingredients and honest claims
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Scientific</h3>
                <p className="text-sm text-gray-600">
                  Research-backed formulations
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Safe</h3>
                <p className="text-sm text-gray-600">
                  Rigorous quality control
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
