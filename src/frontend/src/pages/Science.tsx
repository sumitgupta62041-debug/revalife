import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  CheckCircle,
  FlaskConical,
  Leaf,
  Microscope,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

const INGREDIENTS = [
  {
    name: "Ashwagandha KSM-66",
    latin: "Withania somnifera",
    icon: Zap,
    color: "text-amber-600",
    bg: "bg-amber-50",
    claims: [
      "Clinically studied root extract with standardised withanolide content",
      "Supports healthy stress response and promotes calmness",
      "May support physical endurance and energy levels",
      "Promotes healthy sleep quality",
    ],
    badge: "KSM-66® Patented Extract",
  },
  {
    name: "Moringa",
    latin: "Moringa oleifera",
    icon: Leaf,
    color: "text-green-600",
    bg: "bg-green-50",
    claims: [
      "Rich in vitamins C, A, and B-complex naturally occurring",
      "Contains iron, calcium, and potassium",
      "Traditional use for overall vitality and nourishment",
      "Supports healthy inflammatory response",
    ],
    badge: "Superfood Green",
  },
  {
    name: "Triphala",
    latin: "Emblica officinalis, Terminalia chebula, T. bellirica",
    icon: Sparkles,
    color: "text-purple-600",
    bg: "bg-purple-50",
    claims: [
      "Classical Ayurvedic tri-fruit formulation",
      "Supports healthy digestive function",
      "Natural antioxidant properties",
      "Traditional use for gut wellness and regularity",
    ],
    badge: "Ancient Ayurvedic Blend",
  },
  {
    name: "Curcumin (BCM-95®)",
    latin: "Curcuma longa",
    icon: FlaskConical,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    claims: [
      "Enhanced bioavailability versus standard curcumin",
      "Supports healthy inflammatory balance",
      "Powerful antioxidant properties",
      "May support joint comfort and mobility",
    ],
    badge: "BCM-95® Enhanced Bioavailability",
  },
  {
    name: "Shilajit",
    latin: "Asphaltum punjabianum",
    icon: Microscope,
    color: "text-stone-600",
    bg: "bg-stone-50",
    claims: [
      "Natural mineral-rich resin from Himalayan mountains",
      "Rich in fulvic acid and 80+ trace minerals",
      "Traditional Ayurvedic adaptogen",
      "Supports energy and vitality",
    ],
    badge: "Himalayan Origin",
  },
  {
    name: "Brahmi",
    latin: "Bacopa monnieri",
    icon: Shield,
    color: "text-blue-600",
    bg: "bg-blue-50",
    claims: [
      "Traditional Ayurvedic herb for cognitive wellness",
      "Supports memory and concentration",
      "Bacosides A and B — key active compounds",
      "May support mental clarity and focus",
    ],
    badge: "Cognitive Wellness",
  },
];

const STANDARDS = [
  {
    icon: Award,
    title: "GMP Certified",
    description:
      "All manufacturing facilities follow Good Manufacturing Practices (GMP), ensuring consistent quality and safety in every batch.",
  },
  {
    icon: CheckCircle,
    title: "FSSAI Compliant",
    description:
      "All products meet Food Safety and Standards Authority of India (FSSAI) regulations for dietary supplements.",
  },
  {
    icon: FlaskConical,
    title: "Third-Party Tested",
    description:
      "Independent lab testing for identity, potency, purity, and microbial safety. Results verified before any product is released.",
  },
  {
    icon: Shield,
    title: "Heavy Metal Free",
    description:
      "All batches tested for arsenic, cadmium, lead, and mercury. We publish test results and maintain complete traceability.",
  },
];

const TESTING_STEPS = [
  "Identity verification of all raw materials using HPLC and spectroscopy",
  "Active compound standardisation to guaranteed potency levels",
  "Purity analysis — contaminants, adulterants, pesticide residues",
  "Microbial safety testing (yeast, mould, coliforms, pathogens)",
  "Heavy metal screening (As, Cd, Pb, Hg) per USP standards",
  "Stability testing to confirm shelf life and label accuracy",
  "Final batch release sign-off by quality assurance team",
];

export default function Science() {
  return (
    <div className="min-h-screen" data-ocid="science.page">
      {/* Hero */}
      <section className="bg-card border-b py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-wellness-green/10 text-wellness-green border-wellness-green/20 font-medium">
            Science &amp; Research
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-6 leading-tight">
            Every Ingredient.{" "}
            <span className="text-wellness-green">Every Claim. Backed.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            We don't rely on tradition alone — or science alone. revAlife brings
            together the best of Ayurvedic wisdom and modern evidence-based
            nutrition to create supplements you can trust completely.
          </p>
        </div>
      </section>

      {/* Key Ingredients */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display text-foreground mb-3">
              Key Ingredients &amp; Their Science
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Each ingredient is chosen based on clinical evidence, traditional
              use data, and safety profiles — then carefully sourced and
              standardised to deliver consistent results.
            </p>
          </div>
          <div className="space-y-5" data-ocid="science.ingredients.list">
            {INGREDIENTS.map((ing, i) => (
              <Card
                key={ing.name}
                data-ocid={`science.ingredient.item.${i + 1}`}
                className="border shadow-card hover:shadow-card-hover transition-smooth"
              >
                <CardContent className="p-7">
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div
                      className={`h-12 w-12 rounded-xl ${ing.bg} flex items-center justify-center flex-shrink-0`}
                    >
                      <ing.icon className={`h-6 w-6 ${ing.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground font-display">
                          {ing.name}
                        </h3>
                        <Badge className="text-xs bg-muted text-muted-foreground border-border">
                          {ing.badge}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground italic mb-3">
                        {ing.latin}
                      </p>
                      <ul className="space-y-1.5">
                        {ing.claims.map((claim) => (
                          <li
                            key={claim}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <CheckCircle className="h-3.5 w-3.5 text-wellness-green mt-0.5 flex-shrink-0" />
                            <span>{claim}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground text-center max-w-2xl mx-auto">
            * These statements are general wellness information and have not
            been evaluated by any regulatory authority. Our products are not
            intended to diagnose, treat, cure, or prevent any disease. Consult
            your healthcare provider before starting any supplement.
          </p>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="py-16 px-4 bg-muted/30 border-y">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display text-foreground mb-3">
              Quality Standards
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We hold ourselves to the highest quality benchmarks in Indian
              supplement manufacturing.
            </p>
          </div>
          <div
            className="grid sm:grid-cols-2 gap-5"
            data-ocid="science.standards.list"
          >
            {STANDARDS.map((std, i) => (
              <Card
                key={std.title}
                data-ocid={`science.standard.item.${i + 1}`}
                className="border shadow-card"
              >
                <CardContent className="p-7">
                  <div className="flex gap-4">
                    <div className="h-11 w-11 rounded-xl bg-wellness-green/10 flex items-center justify-center flex-shrink-0">
                      <std.icon className="h-5 w-5 text-wellness-green" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground font-display mb-2">
                        {std.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {std.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testing Process */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display text-foreground mb-3">
              Our Testing Process
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every batch undergoes a rigorous multi-stage quality process
              before it earns the revAlife seal.
            </p>
          </div>
          <Card
            className="border shadow-card"
            data-ocid="science.testing_steps"
          >
            <CardContent className="p-8">
              <ol className="space-y-4">
                {TESTING_STEPS.map((step, i) => (
                  <li key={step} className="flex items-start gap-4">
                    <div className="h-7 w-7 rounded-full bg-wellness-green flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-muted-foreground leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
