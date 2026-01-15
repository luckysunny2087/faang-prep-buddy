
import { supabase } from "@/integrations/supabase/client";

export interface PaymentSession {
    id: string;
    url?: string;
}

export const createCheckoutSession = async (planName: string, price: string): Promise<PaymentSession> => {
    // In a real app, this would call a Supabase Edge Function or your backend
    // which would then interact with Stripe to create a session.

    console.log(`Creating checkout session for ${planName} at $${price}`);

    // Mocking an API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock successful session creation
    return {
        id: "mock_session_" + Math.random().toString(36).substr(2, 9),
        url: "/checkout/success" // In real Stripe, this would be a checkout.stripe.com URL
    };
};

export const processMockPayment = async (cardDetails: any): Promise<{ success: boolean; error?: string }> => {
    console.log("Processing mock payment with details:", cardDetails);

    // Mocking an API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 90% success rate for the mock
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
        return { success: true };
    } else {
        return { success: false, error: "Your card was declined. Please try another payment method." };
    }
};
