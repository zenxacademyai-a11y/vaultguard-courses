import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "₹999",
    period: "/month",
    features: ["5 courses", "Basic watermark", "Device lock", "OTP authentication", "Email support"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹2,999",
    period: "/month",
    features: ["Unlimited courses", "Advanced watermark", "DRM enabled", "Forensic tracking", "Priority support", "Analytics dashboard"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["Dedicated DRM server", "API access", "Custom branding", "SLA guarantee", "Dedicated support", "White-label option"],
    highlight: false,
  },
];

const PricingSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-muted-foreground text-lg">Protect your content at every scale</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl p-8 border transition-all ${
                plan.highlight
                  ? "border-primary/50 glow-primary gradient-card"
                  : "border-border gradient-card hover:border-primary/30"
              }`}
            >
              {plan.highlight && (
                <div className="text-xs font-mono text-primary mb-4 uppercase tracking-wider">Most Popular</div>
              )}
              <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-success flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${plan.highlight ? "glow-primary" : ""}`}
                variant={plan.highlight ? "default" : "outline"}
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
