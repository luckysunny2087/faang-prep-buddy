-- Create companies table for user-added companies
CREATE TABLE public.companies (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'enterprise',
    description TEXT,
    interview_focus TEXT,
    added_by UUID,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(name)
);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Everyone can view companies (they're public data)
CREATE POLICY "Companies are viewable by everyone" 
ON public.companies 
FOR SELECT 
USING (true);

-- Authenticated users can add companies
CREATE POLICY "Authenticated users can add companies" 
ON public.companies 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();