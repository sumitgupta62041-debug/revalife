import { CheckCircle, Microscope, Shield } from "lucide-react";

export default function Science() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Our Science</h1>

        <div className="space-y-12">
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Microscope className="h-8 w-8 text-wellness-green" />
              <h2 className="text-2xl font-bold">Ingredient Research</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Every ingredient in our products is selected based on rigorous
              scientific research. We review clinical studies, traditional usage
              data, and modern nutritional science to identify ingredients that
              are both safe and effective. Our research team evaluates
              bioavailability, optimal dosages, and potential interactions to
              ensure that each formulation delivers real health benefits.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We prioritize ingredients with strong scientific backing and
              proven efficacy. Whether it's vitamins, minerals, herbal extracts,
              or probiotics, every component is chosen for its ability to
              support specific health goals. We stay updated with the latest
              research to continuously improve our formulations and bring you
              the most effective wellness solutions.
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-8 w-8 text-wellness-green" />
              <h2 className="text-2xl font-bold">Safety Standards</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Safety is our top priority. All our products are manufactured in
              facilities that follow Good Manufacturing Practices (GMP) and
              comply with Indian regulatory standards. We work only with
              certified suppliers who meet our stringent quality requirements.
              Every batch is tested for purity, potency, and contamination to
              ensure that what reaches you is safe and effective.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our safety protocols include testing for heavy metals, microbial
              contamination, and adulterants. We maintain detailed documentation
              of every step in the supply chain, from raw material sourcing to
              final packaging. This traceability ensures accountability and
              allows us to maintain the highest safety standards consistently.
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-8 w-8 text-wellness-green" />
              <h2 className="text-2xl font-bold">Testing & Quality Checks</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our quality control process is comprehensive and rigorous. Every
              product undergoes multiple rounds of testing at different stages
              of production. We test raw materials upon arrival, monitor
              in-process quality during manufacturing, and conduct final product
              testing before release. This multi-stage approach ensures
              consistent quality and safety.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mt-4">
              <h3 className="font-semibold mb-3">
                Our Testing Process Includes:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-wellness-green mr-2 mt-0.5 flex-shrink-0" />
                  <span>Identity verification of all ingredients</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-wellness-green mr-2 mt-0.5 flex-shrink-0" />
                  <span>Potency testing to ensure correct dosages</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-wellness-green mr-2 mt-0.5 flex-shrink-0" />
                  <span>Purity analysis for contaminants and adulterants</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-wellness-green mr-2 mt-0.5 flex-shrink-0" />
                  <span>Stability testing for shelf life determination</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-wellness-green mr-2 mt-0.5 flex-shrink-0" />
                  <span>Microbiological testing for safety</span>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
