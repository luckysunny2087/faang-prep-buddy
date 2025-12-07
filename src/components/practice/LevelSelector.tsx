import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExperienceLevel } from '@/types/interview';
import { experienceLevels } from '@/data/technologies';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelSelectorProps {
  selectedLevel: ExperienceLevel | null;
  onSelect: (level: ExperienceLevel) => void;
}

export function LevelSelector({ selectedLevel, onSelect }: LevelSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Select Experience Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {experienceLevels.map((level, index) => {
              const isSelected = selectedLevel === level.id;
              
              return (
                <button
                  key={level.id}
                  onClick={() => onSelect(level.id as ExperienceLevel)}
                  className={cn(
                    "flex flex-col items-center p-6 rounded-lg border-2 text-center transition-all",
                    isSelected 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center mb-3 text-lg font-bold",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    L{index + 3}
                  </div>
                  <h4 className="font-semibold">{level.name}</h4>
                  <p className="text-sm text-muted-foreground">{level.years}</p>
                  <p className="text-xs text-muted-foreground mt-1">{level.description}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
