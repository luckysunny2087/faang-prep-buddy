import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Domain } from '@/types/interview';
import { domains } from '@/data/technologies';
import { 
  Landmark, 
  Monitor, 
  Heart, 
  ShoppingCart, 
  Truck, 
  Car, 
  Radio, 
  Building2,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Landmark, Monitor, Heart, ShoppingCart, Truck, Car, Radio, Building2,
};

interface DomainSelectorProps {
  selectedDomain: Domain | null;
  onSelect: (domain: Domain | null) => void;
}

export function DomainSelector({ selectedDomain, onSelect }: DomainSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Select Industry Domain
            <span className="text-sm font-normal text-muted-foreground">(Optional)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {domains.map((domain) => {
              const Icon = iconMap[domain.icon] || Globe;
              const isSelected = selectedDomain === domain.id;
              
              return (
                <button
                  key={domain.id}
                  onClick={() => onSelect(isSelected ? null : domain.id)}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border-2 text-left transition-all",
                    isSelected 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div className={cn(
                    "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{domain.name}</h4>
                    <p className="text-xs text-muted-foreground">{domain.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
