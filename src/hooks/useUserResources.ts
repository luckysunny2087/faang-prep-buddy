import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

export type ResourceStatus = 'completed' | 'saved_for_later';

export interface UserResource {
  id: string;
  user_id: string;
  resource_name: string;
  resource_category: string;
  resource_link: string;
  status: ResourceStatus;
  created_at: string;
  updated_at: string;
}

export interface ResourceInput {
  name: string;
  category: string;
  link: string;
}

export function useUserResources() {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUserId(data.session?.user?.id ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const { data: userResources = [], isLoading } = useQuery({
    queryKey: ['user-resources', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('user_resources')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data as UserResource[];
    },
    enabled: !!userId,
  });

  const getStatus = (resourceName: string): ResourceStatus | null => {
    return userResources.find(r => r.resource_name === resourceName)?.status ?? null;
  };

  const upsertResource = useMutation({
    mutationFn: async ({ resource, status }: { resource: ResourceInput; status: ResourceStatus }) => {
      if (!userId) throw new Error('Not authenticated');
      const existing = userResources.find(r => r.resource_name === resource.name);
      if (existing) {
        if (existing.status === status) {
          // Toggle off
          const { error } = await supabase.from('user_resources').delete().eq('id', existing.id);
          if (error) throw error;
          return null;
        }
        // Update status
        const { error } = await supabase.from('user_resources').update({ status }).eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('user_resources').insert({
          user_id: userId,
          resource_name: resource.name,
          resource_category: resource.category,
          resource_link: resource.link,
          status,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user-resources'] }),
  });

  const markCompleted = (resource: ResourceInput) =>
    upsertResource.mutate({ resource, status: 'completed' });

  const saveForLater = (resource: ResourceInput) =>
    upsertResource.mutate({ resource, status: 'saved_for_later' });

  return {
    userResources,
    isLoading,
    isLoggedIn: !!userId,
    getStatus,
    markCompleted,
    saveForLater,
  };
}
