import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-salon-blush" />
              <span className="font-display text-lg font-bold text-foreground">
                Yas Nails
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Slay all day with stunning nails. Premium nail art and care services.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "Gallery", path: "/gallery" },
                { label: "Book Now", path: "/book" },
                { label: "Calendar", path: "/calendar" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-muted-foreground hover:text-salon-blush transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Contact</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>[ysmbelo25@gmail.com]</span>
              <span>+63 909 736 0854</span>
              <span>Valenzuela, Philippines</span>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
          © 2026 Yas Nails: Slay All Day. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
