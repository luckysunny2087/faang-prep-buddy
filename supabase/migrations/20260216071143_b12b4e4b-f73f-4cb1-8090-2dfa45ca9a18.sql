
CREATE TABLE public.user_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  resource_name TEXT NOT NULL,
  resource_category TEXT NOT NULL,
  resource_link TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'saved_for_later')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, resource_name)
);

ALTER TABLE public.user_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resources"
  ON public.user_resources FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resources"
  ON public.user_resources FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resources"
  ON public.user_resources FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resources"
  ON public.user_resources FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_user_resources_updated_at
  BEFORE UPDATE ON public.user_resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
