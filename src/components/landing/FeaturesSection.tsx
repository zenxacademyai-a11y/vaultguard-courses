import { motion } from "framer-motion";
import { MonitorX, UserX, Fingerprint, AlertTriangle } from "lucide-react";

const features = [
  {
    icon: MonitorX,
    title: "Download Prevention",
    desc: "No direct file URLs, disabled right-click, DevTools detection, hotlink protection, and cache blocking. 99% effective.",
    stats: "99% blocked",
  },
  {
    icon: UserX,
    title: "Screen Recording Shield",
    desc: "Detect OBS & Bandicam, pause on tab switch, black screen on minimize, blur on DevTools. Multi-layer deterrent.",
    stats: "90%+ detection",
  },
  {
    icon: Fingerprint,
    title: "Device Lock & Auth",
    desc: "One email = one device. Hardware fingerprint, IP tracking, OTP-only login, JWT short expiry, 24h re-auth cycle.",
    stats: "95% prevention",
  },
  {
    icon: AlertTriangle,
    title: "Forensic Watermarking",
    desc: "Visible rotating watermark with name, email, phone. Invisible steganographic ID per session. 100% traceable leaks.",
    stats: "100% traceable",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Stop Revenue Leaks</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Every layer works together to create an impenetrable defense
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="gradient-card border-glow rounded-xl p-8 hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:glow-primary transition-shadow">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="font-mono text-xs text-accent">{f.stats}</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
