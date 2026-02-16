import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UpgradeBannerProps {
  currentPlan?: string | null;
  variant?: "dashboard" | "pricing";
}

const UpgradeBanner = ({ currentPlan, variant = "dashboard" }: UpgradeBannerProps) => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  // Don't show if user is on Elite or if dismissed
  if (dismissed || currentPlan === "elite") return null;

  const isBasic = !currentPlan || currentPlan === "basic";
  const isPro = currentPlan === "pro";

  const title = isBasic
    ? "Unlock unlimited interviews & premium features"
    : "Level up to Elite for the ultimate prep experience";

  const description = isBasic
    ? "Upgrade to Pro for unlimited AI mock interviews, timed simulations, detailed analytics, and more."
    : "Get personalized roadmaps, AI resume review, voice practice, PDF reports & priority support.";

  const ctaText = isBasic ? "Upgrade to Pro" : "Upgrade to Elite";
  const ctaPlan = isBasic
    ? { plan: "Pro", price: "14.99", period: "/month" }
    : { plan: "Elite", price: "19.99", period: "/month" };

  const handleUpgrade = () => {
    const params = new URLSearchParams(ctaPlan);
    navigate(`/checkout?${params.toString()}`);
  };

  if (variant === "pricing") {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-xl border border-primary/30 bg-primary/5 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 max-w-6xl mx-auto"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">
                You're on the <span className="text-primary capitalize">{isBasic ? "Basic" : "Pro"}</span> plan
              </p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          <Button onClick={handleUpgrade} size="sm" className="shrink-0 gap-1">
            {ctaText} <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative"
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={() => setDismissed(true)}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
        <div className="flex items-center gap-3 pr-8">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button onClick={handleUpgrade} size="sm" className="gap-1">
            {ctaText} <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/pricing")}>
            Compare Plans
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpgradeBanner;
