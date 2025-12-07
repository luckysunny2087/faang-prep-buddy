import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TechnologyCategory } from '@/types/interview';
import { technologies } from '@/data/technologies';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cloud, Server, Code, Database, Zap, Users, Building, FileCode, GitBranch, HardDrive, Box, Globe, Brain } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Cloud, Server, Code, Database, Zap, Users, Building, FileCode, GitBranch, HardDrive, Box, Globe, Brain,
};

interface TechnologySelectorProps {
  selectedTechnology: TechnologyCategory | null;
  onSelect: (tech: TechnologyCategory) => void;
}

export function TechnologySelector({ selectedTechnology, onSelect }: TechnologySelectorProps) {
  const microsoftTech = technologies.filter(t => t.category === 'microsoft');
  const awsTech = technologies.filter(t => t.category === 'aws');

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
          <Tabs defaultValue="microsoft" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger 
                value="microsoft" 
                onClick={() => onSelect('microsoft')}
                className={selectedTechnology === 'microsoft' ? 'bg-primary text-primary-foreground' : ''}
              >
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-sky-500 rounded text-white flex items-center justify-center text-xs font-bold">M</div>
                  Microsoft
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="aws"
                onClick={() => onSelect('aws')}
                className={selectedTechnology === 'aws' ? 'bg-primary text-primary-foreground' : ''}
              >
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-orange-500 rounded text-white flex items-center justify-center text-xs font-bold">A</div>
                  AWS
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="microsoft" className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {microsoftTech.map((tech) => {
                  const Icon = iconMap[tech.icon] || Code;
                  return (
                    <div
                      key={tech.id}
                      className="flex flex-col items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <Icon className="h-6 w-6 text-sky-500 mb-2" />
                      <span className="text-sm font-medium text-center">{tech.name}</span>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="aws" className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {awsTech.map((tech) => {
                  const Icon = iconMap[tech.icon] || Code;
                  return (
                    <div
                      key={tech.id}
                      className="flex flex-col items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <Icon className="h-6 w-6 text-orange-500 mb-2" />
                      <span className="text-sm font-medium text-center">{tech.name}</span>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>

          {selectedTechnology && (
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="secondary">
                Selected: {selectedTechnology === 'microsoft' ? 'Microsoft' : 'AWS'}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
