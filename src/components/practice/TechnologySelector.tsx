import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TechnologyCategory } from '@/types/interview';
import { technologies } from '@/data/technologies';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Cloud, Server, Code, Database, Zap, Users, Building, FileCode, GitBranch, HardDrive, Box, Globe, Brain, Flame, Play, Coffee, Shield, Atom, Terminal, Layers, Settings, Activity, Table, MessageSquare, BarChart, Container, ClipboardCheck, X } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Cloud, Server, Code, Database, Zap, Users, Building, FileCode, GitBranch, HardDrive, Box, Globe, Brain, Flame, Play, Coffee, Shield, Atom, Terminal, Layers, Settings, Activity, Table, MessageSquare, BarChart, Container, ClipboardCheck,
};

interface TechnologySelectorProps {
  selectedTechnologies: TechnologyCategory[];
  onToggle: (tech: TechnologyCategory) => void;
}

const categoryConfig: { id: TechnologyCategory; name: string; icon: string; color: string }[] = [
  { id: 'microsoft', name: 'Microsoft', icon: 'M', color: 'bg-sky-500' },
  { id: 'aws', name: 'AWS', icon: 'A', color: 'bg-orange-500' },
  { id: 'gcp', name: 'GCP', icon: 'G', color: 'bg-blue-500' },
  { id: 'programming', name: 'Programming', icon: '<>', color: 'bg-green-500' },
  { id: 'devops', name: 'DevOps', icon: '⚙', color: 'bg-purple-500' },
  { id: 'data-ai', name: 'Data & AI', icon: '🧠', color: 'bg-pink-500' },
];

export function TechnologySelector({ selectedTechnologies, onToggle }: TechnologySelectorProps) {
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
            <Badge variant="outline" className="ml-2 font-normal">Optional</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select one or more technology areas, or skip to practice general interview skills
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="microsoft" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6 h-auto gap-1">
              {categoryConfig.map((cat) => {
                const isSelected = selectedTechnologies.includes(cat.id);
                return (
                  <TabsTrigger 
                    key={cat.id}
                    value={cat.id}
                    className={`flex flex-col items-center gap-1 py-2 px-1 text-xs relative ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                  >
                    <div className={`h-5 w-5 ${cat.color} rounded text-white flex items-center justify-center text-[10px] font-bold`}>
                      {cat.icon}
                    </div>
                    <span className="truncate max-w-full">{cat.name}</span>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-[10px] text-primary-foreground">✓</span>
                      </div>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {categoryConfig.map((cat) => {
              const catTech = technologies.filter(t => t.category === cat.id);
              const isSelected = selectedTechnologies.includes(cat.id);
              return (
                <TabsContent key={cat.id} value={cat.id} className="mt-0">
                  <div className="mb-4 flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={`cat-${cat.id}`}
                        checked={isSelected}
                        onCheckedChange={() => onToggle(cat.id)}
                      />
                      <label 
                        htmlFor={`cat-${cat.id}`} 
                        className="text-sm font-medium cursor-pointer"
                      >
                        Include {cat.name} questions in your interview
                      </label>
                    </div>
                    {isSelected && (
                      <Badge className="bg-primary">Selected</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {catTech.map((tech) => {
                      const Icon = iconMap[tech.icon] || Code;
                      return (
                        <div
                          key={tech.id}
                          className="flex flex-col items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
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

          {selectedTechnologies.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Selected:</span>
              {selectedTechnologies.map(techId => {
                const cat = categoryConfig.find(c => c.id === techId);
                return (
                  <Badge 
                    key={techId} 
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => onToggle(techId)}
                  >
                    {cat?.name}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                );
              })}
            </div>
          )}

          {selectedTechnologies.length === 0 && (
            <div className="mt-4 p-3 rounded-lg border border-dashed border-muted-foreground/25 text-center">
              <p className="text-sm text-muted-foreground">
                No technologies selected — interview will focus on general skills for your role
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
