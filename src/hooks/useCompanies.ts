import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { featuredCompanies, CompanyInfo, CompanyCategory } from '@/data/technologies';

export function useCompanies() {
  const [dbCompanies, setDbCompanies] = useState<CompanyInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching companies:', error);
          return;
        }

        if (data) {
          // Convert DB companies to CompanyInfo format
          const convertedCompanies: CompanyInfo[] = data.map((company) => ({
            id: company.id,
            name: company.name,
            category: company.category as CompanyCategory,
            description: company.description || '',
            interviewFocus: company.interview_focus || undefined,
          }));
          setDbCompanies(convertedCompanies);
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Merge featured companies with DB companies, avoiding duplicates
  const allCompanies = useMemo(() => {
    const featuredIds = new Set(featuredCompanies.map((c) => c.id.toLowerCase()));
    const featuredNames = new Set(featuredCompanies.map((c) => c.name.toLowerCase()));

    // Filter out DB companies that already exist in featured list (by id or name)
    const uniqueDbCompanies = dbCompanies.filter(
      (c) => !featuredIds.has(c.id.toLowerCase()) && !featuredNames.has(c.name.toLowerCase())
    );

    return [...featuredCompanies, ...uniqueDbCompanies];
  }, [dbCompanies]);

  return { allCompanies, isLoading };
}
