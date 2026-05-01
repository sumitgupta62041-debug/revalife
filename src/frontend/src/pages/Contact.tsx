import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";

const CONTACT_ITEMS = [
  {
    icon: Mail,
    title: "Email Us",
    content: "revalife171@gmail.com",
    href: "mailto:revalife171@gmail.com",
    linkLabel: "revalife171@gmail.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    content: null,
    numbers: [
      { label: "+91 8942932189", href: "tel:+918942932189" },
      { label: "+91 8700829733", href: "tel:+918700829733" },
      { label: "+91 884 037 8589", href: "tel:+918840378589" },
      { label: "+91 93364 57006", href: "tel:+919336457006" },
    ],
    href: null,
    linkLabel: null,
  },
  {
    icon: MapPin,
    title: "Location",
    content: "Lovely Professional University\nPhagwara, Punjab, India — 144411",
    href: null,
    linkLabel: null,
  },
  {
    icon: Clock,
    title: "Business Hours",
    content:
      "Morning: 6:00 AM – 8:00 AM (IST)\nEvening: 4:00 PM – 6:00 PM (IST)",
    href: null,
    linkLabel: null,
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    // Simulate submission — open email client as fallback
    await new Promise((r) => setTimeout(r, 800));
    const subject = encodeURIComponent(`revAlife Inquiry from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`,
    );
    window.open(
      `mailto:revalife171@gmail.com?subject=${subject}&body=${body}`,
      "_blank",
    );
    toast.success("Opening your email client to send the message!");
    setForm({ name: "", email: "", message: "" });
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen" data-ocid="contact.page">
      {/* Hero */}
      <section className="bg-card border-b py-14 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-wellness-green/10 text-wellness-green border-wellness-green/20 font-medium">
            Get in Touch
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-4 leading-tight">
            We're Here to Help
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Questions about your order, our products, or just want to say hello?
            Reach out via any channel below — we'll get back to you quickly.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <Card
                className="border shadow-card"
                data-ocid="contact.form_card"
              >
                <CardContent className="p-8">
                  <h2 className="text-xl font-bold font-display text-foreground mb-6">
                    Send Us a Message
                  </h2>
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    data-ocid="contact.form"
                  >
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-name">Your Name</Label>
                      <Input
                        id="contact-name"
                        data-ocid="contact.name_input"
                        placeholder="e.g. Rahul Sharma"
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-email">Email Address</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        data-ocid="contact.email_input"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-message">Message</Label>
                      <Textarea
                        id="contact-message"
                        data-ocid="contact.message_textarea"
                        placeholder="How can we help you today?"
                        rows={5}
                        value={form.message}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, message: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={submitting}
                      data-ocid="contact.submit_button"
                      className="w-full bg-wellness-green hover:bg-wellness-green-dark text-white"
                      size="lg"
                    >
                      {submitting ? (
                        "Sending…"
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div
              className="lg:col-span-2 space-y-4"
              data-ocid="contact.info_section"
            >
              {CONTACT_ITEMS.map((item) => (
                <Card key={item.title} className="border shadow-card">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-wellness-green/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-5 w-5 text-wellness-green" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground font-display mb-1">
                          {item.title}
                        </h3>
                        {item.content && (
                          <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                            {item.content}
                          </p>
                        )}
                        {item.href && item.linkLabel && (
                          <a
                            href={item.href}
                            className="text-sm text-wellness-green hover:underline"
                          >
                            {item.linkLabel}
                          </a>
                        )}
                        {item.numbers?.map((num) => (
                          <a
                            key={num.href}
                            href={num.href}
                            className="block text-sm text-wellness-green hover:underline"
                          >
                            {num.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-12 px-4 bg-muted/30 border-t">
        <div className="container mx-auto max-w-4xl">
          <Card
            className="bg-wellness-green border-0 shadow-elevated"
            data-ocid="contact.whatsapp_cta"
          >
            <CardContent className="p-10 text-center">
              <SiWhatsapp className="h-12 w-12 text-white mx-auto mb-4" />
              <h2 className="text-2xl font-bold font-display text-white mb-2">
                Need Instant Help?
              </h2>
              <p className="text-white/85 mb-7 max-w-sm mx-auto">
                Chat with us directly on WhatsApp for quick answers about your
                order, products, or delivery.
              </p>
              <a
                href="https://wa.me/918942932189?text=Hi%20revAlife%2C%20I%20need%20help%20with%20my%20revAlife%20order"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="contact.whatsapp_button"
                className="inline-flex items-center gap-2 bg-white text-wellness-green px-8 py-3.5 rounded-xl font-semibold hover:bg-white/90 transition-smooth shadow-card"
              >
                <SiWhatsapp className="h-5 w-5" />
                Start WhatsApp Chat
              </a>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {[
                  { num: "+91 8942932189", tel: "918942932189" },
                  { num: "+91 884 037 8589", tel: "918840378589" },
                  { num: "+91 93364 57006", tel: "919336457006" },
                ].map(({ num, tel }) => (
                  <a
                    key={tel}
                    href={`https://wa.me/${tel}?text=Hi%20revAlife%2C%20I%20need%20help`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white/20 text-white border border-white/30 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-smooth"
                  >
                    <SiWhatsapp className="h-3.5 w-3.5" />
                    {num}
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
