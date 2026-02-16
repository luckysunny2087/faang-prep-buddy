import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Flame, Star, Rocket, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ComparisonTable from "@/components/pricing/ComparisonTable";
import PlanSwitcher from "@/components/pricing/PlanSwitcher";
import PricingFAQ from "@/components/pricing/PricingFAQ";
import PricingChat from "@/components/pricing/PricingChat";
import { useNavigate } from "react-router-dom";

const plans = [
    {
        id: "trial",
        name: "Basic",
        price: "0",
        period: "/7 days",
        description: "Test drive our AI-powered interview prep platform.",
        features: [
            "5 AI mock interviews per day",
            "Access to 20+ featured companies",
            "Technical & behavioral questions",
            "Basic performance feedback",
            "No timer mode only",
            "Community Q&A access"
        ],
        buttonText: "Start Free Trial",
        highlight: false,
        icon: Rocket,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        id: "monthly",
        name: "Pro",
        price: "14.99",
        period: "/month",
        description: "Full access for serious job seekers ready to land offers.",
        features: [
            "Unlimited AI mock interviews",
            "All 70+ companies + custom companies",
            "System design & domain questions",
            "Timed interview simulations (30/60 min)",
            "Detailed performance analytics",
            "Resume & JD tailored questions",
            "Cover letter generator",
            "Priority AI response speed",
            "Interview history & progress tracking"
        ],
        buttonText: "Go Pro",
        highlight: true,
        icon: Flame,
        color: "text-orange-500",
        bg: "bg-orange-500/10"
    },
    {
        id: "yearly",
        name: "Elite",
        price: "19.99",
        period: "/month",
        description: "Best value for long-term career growth and mastery.",
        features: [
            "Everything in Pro",
            "Personalized learning roadmaps",
            "AI-powered resume review & tips",
            "Exclusive expert interview guides",
            "Early access to new features",
            "Voice interview practice mode",
            "Export detailed PDF reports",
            "Priority email support"
        ],
        buttonText: "Go Elite",
        highlight: false,
        icon: Star,
        color: "text-purple-500",
        bg: "bg-purple-500/10"
    }
];

const Pricing = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("all");

    const filteredPlans = activeTab === "all" ? plans : plans.filter(p => p.id === activeTab);

    const handlePlanSelection = (plan: typeof plans[0]) => {
        const params = new URLSearchParams({
            plan: plan.name,
            price: plan.price,
            period: plan.period
        });
        navigate(`/checkout?${params.toString()}`);
    };

    return (
        <Layout>
            <div className="min-h-screen bg-background py-20">
                <div className="container px-4">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Badge variant="outline" className="mb-4 py-1 px-4 border-primary/20 bg-primary/5 text-primary">
                                Pricing Plans
                            </Badge>
                            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                                Invest in your <span className="gradient-text">Future Career</span>
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Choose the plan that fits your preparation speed. All plans include
                                our state-of-the-art AI interviewer.
                            </p>
                        </motion.div>
                    </div>

                    {/* Plan Switcher */}
                    <PlanSwitcher value={activeTab} onChange={setActiveTab} />

                    {/* Pricing Cards */}
                    <div className={`grid grid-cols-1 ${filteredPlans.length === 1 ? 'max-w-md' : filteredPlans.length === 2 ? 'md:grid-cols-2 max-w-4xl' : 'md:grid-cols-3 max-w-6xl'} gap-8 mx-auto`}>
                        {filteredPlans.map((plan, index) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                layout
                            >
                                <Card className={`relative h-full flex flex-col hover-lift border-border/50 group overflow-hidden ${plan.highlight ? 'border-primary ring-1 ring-primary/20 shadow-xl scale-105 z-10' : ''}`}>
                                    {plan.highlight && (
                                        <div className="absolute top-0 right-0">
                                            <div className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-bl-lg">
                                                Most Popular
                                            </div>
                                        </div>
                                    )}
                                    <CardHeader>
                                        <div className={`h-12 w-12 rounded-xl ${plan.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                                            <plan.icon className={`h-6 w-6 ${plan.color}`} />
                                        </div>
                                        <CardTitle className="text-2xl font-display">{plan.name}</CardTitle>
                                        <CardDescription className="min-h-[40px]">{plan.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <div className="mb-8">
                                            <span className="text-4xl font-bold">${plan.price}</span>
                                            {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">What's included:</p>
                                            {plan.features.map((feature) => (
                                                <div key={feature} className="flex items-start gap-3">
                                                    <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                                                        <Check className="h-3 w-3" />
                                                    </div>
                                                    <span className="text-sm text-foreground/80">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-8">
                                        <Button
                                            className={`w-full h-12 text-md font-semibold ${plan.highlight ? 'bg-primary hover:bg-primary/90' : ''}`}
                                            variant={plan.highlight ? "default" : "outline"}
                                            onClick={() => handlePlanSelection(plan)}
                                        >
                                            {plan.buttonText}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Security Badge */}
                    <div className="mt-16 flex items-center justify-center gap-4 text-muted-foreground text-sm opacity-70">
                        <ShieldCheck className="h-5 w-5" />
                        <span>Secure payment processing via Stripe. Cancel anytime.</span>
                    </div>

                    {/* Comparison Table */}
                    <ComparisonTable />

                    {/* FAQ Section */}
                    <PricingFAQ />
                </div>
            </div>

            {/* AI Chat Widget */}
            <PricingChat />
        </Layout>
    );
};

export default Pricing;
