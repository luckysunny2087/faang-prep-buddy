import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Check, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface CheckoutUpsellProps {
  currentPlan: string;
}

const CheckoutUpsell = ({ currentPlan }: CheckoutUpsellProps) => {
  const navigate = useNavigate();

  // Only show upsell for Pro checkout
  if (currentPlan.toLowerCase() !== "pro") return null;

  const handleUpgradeToElite = () => {
    const params = new URLSearchParams({
      plan: "Elite",
      price: "19.99",
      period: "/month",
    });
    navigate(`/checkout?${params.toString()}`, { replace: true });
  };

  return (
    <Card className="border-purple-500/30 bg-purple-500/5 mt-6">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
            <Star className="h-4.5 w-4.5 text-purple-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-sm text-foreground">Upgrade to Elite</p>
              <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                +$5/mo
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Get everything in Pro plus personalized roadmaps, AI resume review, voice practice & PDF reports.
            </p>
            <ul className="space-y-1.5 mb-3">
              {[
                "Personalized learning roadmaps",
                "AI resume review & tips",
                "Voice interview practice",
                "Export PDF reports",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-foreground/80">
                  <Check className="h-3 w-3 text-purple-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 border-purple-500/30 hover:bg-purple-500/10 text-purple-600 dark:text-purple-400"
              onClick={handleUpgradeToElite}
            >
              Switch to Elite <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutUpsell;
