import { Button } from "@/components/ui/button";
import { ShieldCheck, Sparkles, X, Zap } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const TRUST_POINTS = [
  { icon: ShieldCheck, text: "No password needed — fully secure" },
  { icon: Zap, text: "Fast, one-click login experience" },
  { icon: Sparkles, text: "No personal data shared externally" },
];

export function LoginModal({ open, onClose }: LoginModalProps) {
  const { login } = useInternetIdentity();

  const handleLogin = () => {
    onClose();
    login();
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay backdrop — plain div, NOT dialog */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: overlay close on click is standard UX */}
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel — plain div, centered, NOT HTML dialog (dialog element has browser-centering that breaks fixed positioning) */}
      <div
        aria-modal="true"
        aria-labelledby="login-modal-title"
        data-ocid="login_modal.dialog"
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
      >
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation for modal inner clicks */}
        <div
          className="relative w-full max-w-sm bg-card rounded-2xl shadow-elevated border border-border/60 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close login modal"
            data-ocid="login_modal.close_button"
            className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="px-6 pt-8 pb-6">
            {/* Brand header */}
            <div className="flex flex-col items-center gap-1 pb-5 text-center">
              <div className="h-14 w-14 rounded-full bg-wellness-green/10 flex items-center justify-center mb-2">
                <span className="text-2xl">🌿</span>
              </div>
              <span className="text-2xl font-bold text-wellness-green font-display tracking-tight">
                revAlife
              </span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Health &amp; Wellness, Delivered
              </p>
            </div>

            {/* Title */}
            <div className="text-center mb-5">
              <h2
                id="login-modal-title"
                className="text-xl font-bold text-foreground font-display"
              >
                Sign in to your account
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                Login securely without a password. Fast, safe, and private.
              </p>
            </div>

            {/* Trust bullets */}
            <ul className="space-y-2.5 mb-6">
              {TRUST_POINTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm">
                  <span className="h-7 w-7 rounded-full bg-wellness-green/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-3.5 w-3.5 text-wellness-green" />
                  </span>
                  <span className="text-foreground">{text}</span>
                </li>
              ))}
            </ul>

            {/* CTA buttons */}
            <div className="space-y-2.5">
              <Button
                onClick={handleLogin}
                data-ocid="login_modal.continue_button"
                className="w-full bg-wellness-green hover:bg-wellness-green-dark text-white font-semibold h-11 rounded-xl shadow-card hover:shadow-card-hover transition-all"
                size="lg"
              >
                Continue to Sign In
              </Button>
              <Button
                variant="ghost"
                onClick={onClose}
                data-ocid="login_modal.cancel_button"
                className="w-full text-muted-foreground hover:text-foreground h-10"
              >
                Cancel
              </Button>
            </div>

            <p className="text-center text-[11px] text-muted-foreground mt-4 leading-relaxed">
              By continuing, you agree to our{" "}
              <a href="/terms" className="underline hover:text-foreground">
                Terms
              </a>{" "}
              &amp;{" "}
              <a href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
