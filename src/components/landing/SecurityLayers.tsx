import { motion } from "framer-motion";
import { Shield, Lock, Key, Fingerprint, Eye, Droplets, Activity, Bot, Search } from "lucide-react";

const layers = [
  { icon: Lock, title: "Encrypted Streaming", desc: "AES-256 + HLS streaming only" },
  { icon: Shield, title: "DRM Protection", desc: "Widevine + FairPlay enforced" },
  { icon: Key, title: "Signed URL Expiry", desc: "URLs expire in 30–60 seconds" },
  { icon: Fingerprint, title: "Device Lock", desc: "One email = one active device" },
  { icon: Key, title: "OTP Authentication", desc: "No password sharing possible" },
  { icon: Droplets, title: "Dynamic Watermark", desc: "Name, email, phone overlay" },
  { icon: Activity, title: "Session Monitoring", desc: "Real-time anomaly detection" },
  { icon: Bot, title: "Bot & WAF Protection", desc: "Rate limiting + CAPTCHA" },
  { icon: Search, title: "Forensic Leak Tracking", desc: "Trace any leaked content" },
];

const SecurityLayers = () => {
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-accent text-glow-accent">9</span> Security Layers
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Enterprise-grade protection stack that makes piracy virtually impossible
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="gradient-card border-glow rounded-lg p-6 hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <layer.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-mono text-xs text-muted-foreground mb-1">LAYER {i + 1}</div>
                  <h3 className="font-semibold text-foreground mb-1">{layer.title}</h3>
                  <p className="text-sm text-muted-foreground">{layer.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecurityLayers;
