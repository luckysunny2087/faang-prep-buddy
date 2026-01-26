import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'trial' | 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired';
  started_at: string;
  expires_at: string | null;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching subscription:', error);
        }

        if (data) {
          // Check if subscription is not expired
          const isExpired = data.expires_at && new Date(data.expires_at) < new Date();
          if (!isExpired) {
            setSubscription(data as Subscription);
            // Monthly and yearly are premium, trial can access some features
            setIsPremium(data.plan_type === 'monthly' || data.plan_type === 'yearly');
          }
        }
      } catch (err) {
        console.error('Subscription fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();

    // Listen for auth changes
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(() => {
      fetchSubscription();
    });

    return () => authSub.unsubscribe();
  }, []);

  return { subscription, isLoading, isPremium };
}
