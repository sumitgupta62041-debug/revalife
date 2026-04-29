import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  CheckCircle,
  Heart,
  Leaf,
  Shield,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

const PILLARS = [
  {
    icon: Leaf,
    title: "Purity",
    description:
      "We use only clean, natural ingredients — no fillers, artificial colours, or harmful additives. Every batch is verified for purity before it reaches you.",
    badge: "100% Natural",
  },
  {
    icon: Sparkles,
    title: "Science",
    description:
      "Each formulation is backed by clinical evidence. We combine traditional Ayurvedic wisdom with modern nutritional science to create supplements that actually work.",
    badge: "Research-Backed",
  },
  {
    icon: Shield,
    title: "Transparency",
    description:
      "Full ingredient disclosure on every label. No proprietary blends, no hidden quantities. You know exactly what you're putting into your body.",
    badge: "Full Disclosure",
  },
  {
    icon: Award,
    title: "Quality",
    description:
      "Manufactured in GMP-certified facilities. Every product passes multi-stage quality checks — raw material testing, in-process monitoring, and final release testing.",
    badge: "GMP Certified",
  },
];

const TRUST_BADGES = [
  { icon: CheckCircle, label: "Lab Tested" },
  { icon: Leaf, label: "No Artificial Additives" },
  { icon: Star, label: "100% Natural" },
  { icon: Shield, label: "FSSAI Compliant" },
  { icon: Award, label: "GMP Certified" },
];

const TEAM = [
  {
    name: "Sumit Gupta",
    role: "Founder & CEO",
    bio: "Health enthusiast and wellness entrepreneur passionate about bringing science-backed Indian wellness to every student at LPU.",
  },
  {
    name: "Wellness Research Team",
    role: "Product Development",
    bio: "A dedicated team of nutrition scientists and Ayurvedic practitioners who formulate, test, and refine every product in our range.",
  },
  {
    name: "Quality Assurance",
    role: "Safety & Testing",
    bio: "Our QA team ensures every batch meets our strict standards for purity, potency, and safety before any product reaches your hands.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen" data-ocid="about.page">
      {/* Hero */}
      <section className="bg-card border-b py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-wellness-green/10 text-wellness-green border-wellness-green/20 font-medium">
            Our Story
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-6 leading-tight">
            Wellness Rooted in{" "}
            <span className="text-wellness-green">Truth &amp; Science</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            revAlife was founded with a single mission: to make trustworthy,
            science-backed wellness accessible to every student and
            health-conscious Indian. We believe you deserve supplements that are
            safe, honest, and effective — nothing more, nothing less.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border shadow-card">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-xl bg-wellness-green/10 flex items-center justify-center mb-5">
                  <Heart className="h-6 w-6 text-wellness-green" />
                </div>
                <h2 className="text-xl font-bold font-display text-foreground mb-3">
                  Our Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To bridge the gap between ancient Indian wellness wisdom and
                  modern clinical science — delivering supplements that
                  genuinely support your health journey, backed by evidence and
                  built on trust. No exaggerated claims, no shortcuts.
                </p>
              </CardContent>
            </Card>
            <Card className="border shadow-card">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-xl bg-wellness-green/10 flex items-center justify-center mb-5">
                  <Users className="h-6 w-6 text-wellness-green" />
                </div>
                <h2 className="text-xl font-bold font-display text-foreground mb-3">
                  Our Vision
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  A healthier India, one student at a time. We envision a
                  generation of health-conscious young Indians who make informed
                  wellness choices and achieve their best physical and mental
                  performance — naturally.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="py-16 px-4 bg-muted/30 border-y">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display text-foreground mb-3">
              What We Stand For
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Four uncompromising commitments that guide every product we create
              and every decision we make.
            </p>
          </div>
          <div
            className="grid sm:grid-cols-2 gap-6"
            data-ocid="about.pillars.list"
          >
            {PILLARS.map((pillar, i) => (
              <Card
                key={pillar.title}
                data-ocid={`about.pillar.item.${i + 1}`}
                className="border shadow-card hover:shadow-card-hover transition-smooth"
              >
                <CardContent className="p-7">
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 rounded-lg bg-wellness-green/10 flex items-center justify-center flex-shrink-0">
                      <pillar.icon className="h-5 w-5 text-wellness-green" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-bold text-foreground font-display">
                          {pillar.title}
                        </h3>
                        <Badge className="text-xs bg-wellness-green/10 text-wellness-green border-wellness-green/20">
                          {pillar.badge}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <div
            className="flex flex-wrap justify-center gap-4"
            data-ocid="about.trust_badges"
          >
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border bg-card shadow-subtle"
              >
                <Icon className="h-4 w-4 text-wellness-green" />
                <span className="text-sm font-semibold text-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 bg-muted/30 border-t">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display text-foreground mb-3">
              The People Behind revAlife
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A small, passionate team dedicated to your health and wellness.
            </p>
          </div>
          <div
            className="grid sm:grid-cols-3 gap-6"
            data-ocid="about.team.list"
          >
            {TEAM.map((member, i) => (
              <Card
                key={member.name}
                data-ocid={`about.team.item.${i + 1}`}
                className="border shadow-card text-center"
              >
                <CardContent className="p-7">
                  <div className="h-14 w-14 rounded-full bg-wellness-green/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-7 w-7 text-wellness-green" />
                  </div>
                  <h3 className="font-bold text-foreground font-display mb-1">
                    {member.name}
                  </h3>
                  <p className="text-xs text-wellness-green font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Promise */}
      <section className="py-16 px-4 bg-background border-t">
        <div className="container mx-auto max-w-4xl">
          <Card className="border shadow-card bg-card">
            <CardContent className="p-10 text-center">
              <h2 className="text-2xl font-bold font-display text-foreground mb-4">
                Our Quality Promise
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-6">
                We only sell products that we would give to our own families.
                Every ingredient is carefully sourced and verified. Every
                product undergoes multiple quality checks. If we wouldn't take
                it ourselves, it doesn't make it to your doorstep.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  "No Artificial Colours",
                  "No Proprietary Blends",
                  "Full Ingredient Disclosure",
                  "Third-Party Tested",
                ].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-wellness-green/10 text-wellness-green text-sm font-medium"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    {item}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
