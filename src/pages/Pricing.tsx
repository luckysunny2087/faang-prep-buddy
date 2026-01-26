import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Flame, Star, Rocket, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

import { useNavigate } from "react-router-dom";

const plans = [
    {
        id: "trial",
        name: "7-Day Trial",
        price: "0",
        period: "",
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
        name: "Monthly Pro",
        price: "29",
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
        buttonText: "Go Monthly",
        highlight: true,
        icon: Flame,
        color: "text-orange-500",
        bg: "bg-orange-500/10"
    },
    {
        id: "yearly",
        name: "Yearly Elite",
        price: "199",
        period: "/year",
        description: "Best value for long-term career growth and mastery.",
        features: [
            "Everything in Monthly Pro",
            "Save 43% (vs. monthly billing)",
            "Personalized learning roadmaps",
            "AI-powered resume review & tips",
            "Exclusive expert interview guides",
            "Early access to new features",
            "Voice interview practice mode",
            "Export detailed PDF reports",
            "Priority email support"
        ],
        buttonText: "Get Yearly Plan",
        highlight: false,
        icon: Star,
        color: "text-purple-500",
        bg: "bg-purple-500/10"
    }
];

const Pricing = () => {
    const navigate = useNavigate();

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

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className={`relative h-full flex flex-col hover-lift border-border/50 group overflow-hidden ${plan.highlight ? 'border-primary ring-1 ring-primary/20 shadow-xl scale-105 z-10' : ''
                                    }`}>
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
                                            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                                What's included:
                                            </p>
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
                                            className={`w-full h-12 text-md font-semibold ${plan.highlight ? 'bg-primary hover:bg-primary/90' : 'variant-outline'
                                                }`}
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

                    {/* FAQ Mini Section */}
                    <div className="mt-24 max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl font-display font-bold mb-8">Frequently Asked Questions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-foreground">Can I cancel my trial?</h3>
                                <p className="text-sm text-muted-foreground">Yes, you can cancel your 7-day trial at any time during the trial period and you won't be charged.</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-foreground">Is it billed annually?</h3>
                                <p className="text-sm text-muted-foreground">The Yearly Elite plan is billed in one upfront payment of $290, which works out to about $24/month.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Pricing;
