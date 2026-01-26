import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Timer, TimerOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerSelectorProps {
  selectedDuration: number | null;
  onSelect: (duration: number | null) => void;
}

const timerOptions = [
  { id: null, label: 'No Timer', description: 'Practice at your own pace', icon: TimerOff },
  { id: 30, label: '30 Minutes', description: 'Quick focused session', icon: Timer },
  { id: 60, label: '60 Minutes', description: 'Full interview simulation', icon: Clock },
];

export function TimerSelector({ selectedDuration, onSelect }: TimerSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            Interview Timer (Optional)
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Set a time limit to simulate real interview pressure
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {timerOptions.map((option) => {
              const isSelected = selectedDuration === option.id;
              const Icon = option.icon;
              
              return (
                <button
                  key={option.id ?? 'none'}
                  onClick={() => onSelect(option.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                    isSelected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <Icon className={cn(
                    "h-6 w-6",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className="font-medium text-sm">{option.label}</span>
                  <span className="text-xs text-muted-foreground text-center">
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
