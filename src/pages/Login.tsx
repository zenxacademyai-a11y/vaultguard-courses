import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Link } from "react-router-dom";

const Login = () => {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-background grid-pattern flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 justify-center mb-10">
          <Shield className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold">
            Vault<span className="text-primary">Learn</span>
          </span>
        </Link>

        <div className="gradient-card border-glow rounded-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
            {step === "email" ? "Secure Login" : "Enter OTP"}
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8">
            {step === "email"
              ? "No passwords. OTP-only authentication."
              : `We sent a code to ${email}`}
          </p>

          {step === "email" ? (
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10 bg-secondary border-border"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button
                className="w-full glow-primary"
                onClick={() => email && setStep("otp")}
              >
                Send OTP <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center">
                <InputOTP maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button className="w-full glow-primary" asChild>
                <Link to="/dashboard">
                  Verify & Login <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <button
                onClick={() => setStep("email")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-center"
              >
                Use a different email
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
              <Shield className="w-3 h-3 text-primary" />
              One email = one device. Sessions are monitored.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
