import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Company } from '@/types/interview';
import { companies } from '@/data/technologies';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompanySelectorProps {
  selectedCompany: Company | null;
  onSelect: (company: Company | null) => void;
}

export function CompanySelector({ selectedCompany, onSelect }: CompanySelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Target Company (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {companies.map((company) => {
              const isSelected = selectedCompany === company.id;
              
              return (
                <button
                  key={company.id}
                  onClick={() => onSelect(isSelected ? null : company.id)}
                  className={cn(
                    "flex flex-col items-center p-4 rounded-lg border-2 text-center transition-all",
                    isSelected 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center mb-2 text-sm font-bold",
                    company.id === 'amazon' ? 'bg-orange-500/10 text-orange-500' :
                    company.id === 'google' ? 'bg-blue-500/10 text-blue-500' :
                    company.id === 'meta' ? 'bg-blue-600/10 text-blue-600' :
                    company.id === 'apple' ? 'bg-gray-500/10 text-gray-700 dark:text-gray-300' :
                    company.id === 'netflix' ? 'bg-red-600/10 text-red-600' :
                    'bg-sky-500/10 text-sky-500'
                  )}>
                    {company.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{company.name}</span>
                </button>
              );
            })}
          </div>
          
          {selectedCompany && (
            <button 
              onClick={() => onSelect(null)}
              className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear selection
            </button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
