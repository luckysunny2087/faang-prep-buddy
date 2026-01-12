import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TechnologyCategory } from '@/types/interview';
import { technologies } from '@/data/technologies';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cloud, Server, Code, Database, Zap, Users, Building, FileCode, GitBranch, HardDrive, Box, Globe, Brain, Flame, Play, Coffee, Shield, Atom, Terminal, Layers, Settings, Activity, Table, MessageSquare, BarChart, Container, ClipboardCheck } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Cloud, Server, Code, Database, Zap, Users, Building, FileCode, GitBranch, HardDrive, Box, Globe, Brain, Flame, Play, Coffee, Shield, Atom, Terminal, Layers, Settings, Activity, Table, MessageSquare, BarChart, Container, ClipboardCheck,
};

interface TechnologySelectorProps {
  selectedTechnology: TechnologyCategory | null;
  onSelect: (tech: TechnologyCategory) => void;
}

const categoryConfig: { id: TechnologyCategory; name: string; icon: string; color: string }[] = [
  { id: 'microsoft', name: 'Microsoft', icon: 'M', color: 'bg-sky-500' },
  { id: 'aws', name: 'AWS', icon: 'A', color: 'bg-orange-500' },
  { id: 'gcp', name: 'GCP', icon: 'G', color: 'bg-blue-500' },
  { id: 'programming', name: 'Programming', icon: '<>', color: 'bg-green-500' },
  { id: 'devops', name: 'DevOps', icon: '⚙', color: 'bg-purple-500' },
  { id: 'data-ai', name: 'Data & AI', icon: '🧠', color: 'bg-pink-500' },
];

export function TechnologySelector({ selectedTechnology, onSelect }: TechnologySelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" />
            Select Technology Ecosystem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={selectedTechnology || 'microsoft'} className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6 h-auto gap-1">
              {categoryConfig.map((cat) => (
                <TabsTrigger 
                  key={cat.id}
                  value={cat.id}
                  onClick={() => onSelect(cat.id)}
                  className={`flex flex-col items-center gap-1 py-2 px-1 text-xs ${selectedTechnology === cat.id ? 'bg-primary text-primary-foreground' : ''}`}
                >
                  <div className={`h-5 w-5 ${cat.color} rounded text-white flex items-center justify-center text-[10px] font-bold`}>
                    {cat.icon}
                  </div>
                  <span className="truncate max-w-full">{cat.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {categoryConfig.map((cat) => {
              const catTech = technologies.filter(t => t.category === cat.id);
              return (
                <TabsContent key={cat.id} value={cat.id} className="mt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {catTech.map((tech) => {
                      const Icon = iconMap[tech.icon] || Code;
                      return (
                        <div
                          key={tech.id}
                          className="flex flex-col items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                        >
                          <Icon className={`h-6 w-6 mb-2 ${
                            cat.id === 'microsoft' ? 'text-sky-500' :
                            cat.id === 'aws' ? 'text-orange-500' :
                            cat.id === 'gcp' ? 'text-blue-500' :
                            cat.id === 'programming' ? 'text-green-500' :
                            cat.id === 'devops' ? 'text-purple-500' :
                            'text-pink-500'
                          }`} />
                          <span className="text-sm font-medium text-center">{tech.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>

          {selectedTechnology && (
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="secondary">
                Selected: {categoryConfig.find(c => c.id === selectedTechnology)?.name}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
