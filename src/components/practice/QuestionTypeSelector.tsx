import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { QuestionType } from '@/types/interview';
import { questionTypes } from '@/data/technologies';
import { ListChecks, Code, MessageSquare, Network, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code, MessageSquare, Network, BookOpen,
};

interface QuestionTypeSelectorProps {
  selectedTypes: QuestionType[];
  onToggle: (type: QuestionType) => void;
}

export function QuestionTypeSelector({ selectedTypes, onToggle }: QuestionTypeSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" />
            Question Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questionTypes.map((type) => {
              const Icon = iconMap[type.icon] || Code;
              const isSelected = selectedTypes.includes(type.id);
              
              return (
                <label
                  key={type.id}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                    isSelected 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggle(type.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{type.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </label>
              );
            })}
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            {selectedTypes.length === 0 
              ? 'All question types will be included by default'
              : `${selectedTypes.length} type(s) selected`
            }
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
