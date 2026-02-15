import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-bold">Vault<span className="text-primary">Learn</span></span>
          </div>
          <p className="text-sm text-muted-foreground">
            The most secure micro SaaS platform for course delivery
          </p>
          <p className="text-xs text-muted-foreground/50">© 2026 VaultLearn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
