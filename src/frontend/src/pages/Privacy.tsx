export default function Privacy() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-3">1. Data Collection</h2>
            <p className="text-gray-700 leading-relaxed">
              revAlife collects personal information that you provide when
              creating an account, placing orders, or contacting us. This
              includes your name, email address, phone number, and shipping
              addresses. We collect this information to process your orders,
              communicate with you, and improve our services. We also collect
              order history and product preferences to provide you with a
              personalized shopping experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">2. Payment Safety</h2>
            <p className="text-gray-700 leading-relaxed">
              Your payment information is handled securely. We use
              industry-standard encryption and security measures to protect your
              financial data during checkout. Payment processing is handled by
              trusted third-party payment processors who comply with PCI DSS
              standards. We do not store complete credit card information on our
              servers. All transactions are encrypted and secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">3. Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar technologies to enhance your browsing
              experience, remember your preferences, and analyze site traffic.
              Cookies help us understand how you use our website and allow us to
              improve our services. You can control cookie settings through your
              browser, but disabling cookies may affect some features of our
              website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">4. Data Usage</h2>
            <p className="text-gray-700 leading-relaxed">
              We use your personal information to process orders, provide
              customer support, send order updates, and improve our products and
              services. We may also use your information to send promotional
              communications, but you can opt out at any time. We do not sell or
              rent your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">5. Indian IT Compliance</h2>
            <p className="text-gray-700 leading-relaxed">
              revAlife complies with the Information Technology Act, 2000 and
              related rules governing data protection in India. We are committed
              to protecting your privacy and handling your personal information
              in accordance with Indian law. We maintain appropriate technical
              and organizational measures to safeguard your data against
              unauthorized access, loss, or misuse.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">6. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed">
              You have the right to access, correct, or delete your personal
              information. You can update your profile information at any time
              through your account settings. If you wish to delete your account
              or have questions about your data, please contact us at
              revalife171@gmail.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">7. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions or concerns about our privacy practices,
              please contact us at revalife171@gmail.com or call us at +91
              8942932189 or +91 8700829733.
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
