import { Layout } from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    CreditCard,
    Lock,
    ShieldCheck,
    ChevronLeft,
    CheckCircle2,
    AlertCircle,
    Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { processMockPayment } from "@/lib/payments";

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);

    const planName = queryParams.get("plan") || "Monthly Pro";
    const price = queryParams.get("price") || "29";
    const period = queryParams.get("period") || "/month";

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        cardNumber: "",
        expiry: "",
        cvv: ""
    });

    useEffect(() => {
        // Scroll to top on mount
        window.scrollTo(0, 0);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const result = await processMockPayment(formData);

            if (result.success) {
                setIsSuccess(true);
                toast.success("Payment successful! Welcome to the Elite club.");
                // Update user subscription state here in a real app
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <Layout>
                <div className="min-h-[80vh] flex items-center justify-center bg-background py-20 px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full text-center"
                    >
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-500 mb-6">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <h1 className="text-3xl font-display font-bold mb-4">Payment Successful!</h1>
                        <p className="text-muted-foreground mb-8">
                            Your account has been upgraded to <strong>{planName}</strong>.
                            You now have full access to all premium features.
                        </p>
                        <div className="space-y-4">
                            <Button onClick={() => navigate("/dashboard")} className="w-full h-12 text-lg">
                                Go to Dashboard
                            </Button>
                            <Button variant="ghost" onClick={() => navigate("/practice")} className="w-full">
                                Start a Practice Session
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-muted/30 py-12 md:py-20">
                <div className="container px-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="mb-8 group"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to Plans
                    </Button>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
                        {/* Summary Column */}
                        <div className="lg:col-span-5 order-2 lg:order-1">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <h2 className="text-2xl font-display font-bold mb-6">Order Summary</h2>
                                <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-xl">{planName}</CardTitle>
                                        <CardDescription>Premium Interview Preparation</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex justify-between items-center py-4 border-y border-border/50">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span className="font-semibold">${price}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xl font-bold">
                                            <span>Total due today</span>
                                            <span className="text-primary">${price}</span>
                                        </div>

                                        <div className="bg-primary/5 rounded-lg p-4 space-y-3">
                                            <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                                <Lock className="h-4 w-4" />
                                                <span>What happens next?</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                Upon successful payment, your account will be instantly upgraded.
                                                You'll receive a confirmation email with your receipt and onboarding guide.
                                            </p>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex-col gap-4 border-t border-border/50 bg-muted/20">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <ShieldCheck className="h-4 w-4 text-green-500" />
                                            <span>30-day money-back guarantee</span>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Payment Column */}
                        <div className="lg:col-span-7 order-1 lg:order-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <h1 className="text-3xl font-display font-bold mb-2">Checkout</h1>
                                <p className="text-muted-foreground mb-8 text-lg">Securely complete your subscription.</p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <Card className="border-border/50">
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg">Payment Details</CardTitle>
                                                <div className="flex gap-2">
                                                    <div className="h-6 w-10 bg-muted rounded animate-pulse" />
                                                    <div className="h-6 w-10 bg-muted rounded animate-pulse" />
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Cardholder Name</Label>
                                                <Input
                                                    id="name"
                                                    placeholder="John Doe"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cardNumber">Card Number</Label>
                                                <div className="relative">
                                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="cardNumber"
                                                        placeholder="0000 0000 0000 0000"
                                                        className="pl-10"
                                                        required
                                                        value={formData.cardNumber}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="expiry">Expiry Date</Label>
                                                    <Input
                                                        id="expiry"
                                                        placeholder="MM/YY"
                                                        required
                                                        value={formData.expiry}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="cvv">CVV</Label>
                                                    <Input
                                                        id="cvv"
                                                        placeholder="123"
                                                        required
                                                        value={formData.cvv}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="flex flex-col gap-4">
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20"
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Processing Payment...
                                                </>
                                            ) : (
                                                <>
                                                    Pay ${price} Securely
                                                </>
                                            )}
                                        </Button>
                                        <p className="text-center text-xs text-muted-foreground">
                                            By clicking pay, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Cancellation Policy</a>.
                                        </p>
                                    </div>
                                </form>

                                {/* Mock Warning */}
                                <div className="mt-8 p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg flex gap-3 items-start">
                                    <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Mock Checkout Enabled</p>
                                        <p className="text-xs text-amber-600/80 dark:text-amber-500/80">
                                            This is a demonstration environment. No real money will be charged.
                                            You can use any mock details to test the flow.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Checkout;
