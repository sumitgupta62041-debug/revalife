export default function Terms() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-3">1. Usage Rules</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using the revAlife website, you agree to comply
              with these terms of service. You must be at least 18 years old to
              make purchases on our website. You agree to provide accurate
              information when creating an account and placing orders. You are
              responsible for maintaining the confidentiality of your account
              credentials and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">2. Orders & Pricing</h2>
            <p className="text-gray-700 leading-relaxed">
              All orders are subject to acceptance and availability. We reserve
              the right to refuse or cancel any order for any reason, including
              product availability, errors in pricing or product information, or
              suspected fraud. Prices are listed in Indian Rupees (INR) and are
              subject to change without notice. We strive to display accurate
              pricing, but errors may occur. If we discover a pricing error
              after you have placed an order, we will notify you and give you
              the option to proceed at the correct price or cancel your order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">3. Product Information</h2>
            <p className="text-gray-700 leading-relaxed">
              We make every effort to provide accurate product descriptions,
              ingredients, and usage information. However, we do not warrant
              that product descriptions or other content on our website is
              accurate, complete, or error-free. The products sold on our
              website are dietary supplements and are not intended to diagnose,
              treat, cure, or prevent any disease. Always consult with a
              healthcare professional before starting any new supplement
              regimen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">4. Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              revAlife shall not be liable for any indirect, incidental,
              special, or consequential damages arising out of or related to
              your use of our website or products. Our total liability for any
              claim arising out of or relating to these terms shall not exceed
              the amount you paid for the product giving rise to the claim. We
              are not responsible for delays or failures in delivery caused by
              circumstances beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">
              5. Intellectual Property
            </h2>
            <p className="text-gray-700 leading-relaxed">
              All content on the revAlife website, including text, graphics,
              logos, images, and software, is the property of revAlife and is
              protected by Indian and international copyright laws. You may not
              reproduce, distribute, or create derivative works from our content
              without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">6. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These terms of service are governed by the laws of India. Any
              disputes arising out of or relating to these terms shall be
              subject to the exclusive jurisdiction of the courts in Punjab,
              India. By using our website, you consent to the jurisdiction and
              venue of such courts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">7. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms of service at any time.
              Changes will be effective immediately upon posting to our website.
              Your continued use of our website after changes are posted
              constitutes your acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">8. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these terms of service, please
              contact us at revalife171@gmail.com or call +91 8942932189 or +91
              8700829733.
            </p>
          </section>

          <p className="text-sm text-gray-600 mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
