import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useInterview } from '@/contexts/InterviewContext';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';
import {
  Route,
  Loader2,
  Lock,
  Sparkles,
  Clock,
  BookOpen,
  Rocket,
  Target,
  Award,
  ExternalLink,
  Crown,
  Lightbulb,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface RoadmapSkill {
  skill: string;
  priority: number;
  importance: string;
  currentLevel: string;
  targetLevel: string;
  timeToLearn: string;
  resources: Array<{
    type: string;
    name: string;
    url?: string;
    isFree: boolean;
  }>;
  practiceProjects: string[];
  certifications: string[];
}

interface LearningRoadmapResult {
  overallTimeEstimate: string;
  priorityLevel: string;
  roadmap: RoadmapSkill[];
  quickWins: string[];
  advice: string;
}

export function LearningRoadmap() {
  const { resumeText, jobDescription, selectedCompany, selectedLevel } = useInterview();
  const { isPremium, isLoading: subLoading } = useSubscription();
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<LearningRoadmapResult | null>(null);
  const [isCareerSwitch, setIsCareerSwitch] = useState(false);
  const [expandedSkills, setExpandedSkills] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const generateRoadmap = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description first');
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('resume-analyzer', {
        body: {
          action: 'generate-learning-roadmap',
          resumeText: resumeText || '',
          jobDescription,
          company: selectedCompany,
          experienceLevel: selectedLevel,
          isCareerSwitch,
        }
      });

      if (error) throw error;
      
      if (data.error) {
        toast.error(data.error);
        return;
      }

      setRoadmap(data);
      toast.success('Learning roadmap generated!');
    } catch (err: any) {
      console.error('Roadmap generation error:', err);
      toast.error('Failed to generate roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSkillExpanded = (index: number) => {
    setExpandedSkills(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'none': return 'text-red-500';
      case 'beginner': return 'text-orange-500';
      case 'intermediate': return 'text-yellow-500';
      case 'advanced': return 'text-green-500';
      case 'expert': return 'text-blue-500';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return 'bg-red-500';
    if (priority <= 4) return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  if (subLoading) {
    return (
      <Card className="border-border">
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isPremium) {
    return (
      <Card className="border-border bg-gradient-to-br from-primary/5 to-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Skills Learning Roadmap
            <Badge variant="secondary" className="ml-2">Premium</Badge>
          </CardTitle>
          <CardDescription>
            Get a personalized learning path to bridge your skill gaps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Lock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">
              Upgrade to Monthly Pro or Yearly Elite to unlock personalized learning roadmaps
            </p>
            <Button onClick={() => navigate('/pricing')} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Upgrade Now
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5 text-primary" />
          Skills Learning Roadmap
          <Badge className="ml-2 bg-gradient-to-r from-yellow-500 to-orange-500">Premium</Badge>
        </CardTitle>
        <CardDescription>
          Get a personalized learning path based on the job requirements and your current skills
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!roadmap ? (
          <div className="space-y-4">
            {/* Career Switch Toggle */}
            <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
              <Switch
                id="career-switch"
                checked={isCareerSwitch}
                onCheckedChange={setIsCareerSwitch}
              />
              <Label htmlFor="career-switch" className="text-sm">
                I'm making a career switch to this field
              </Label>
            </div>

            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-4">
                {!jobDescription 
                  ? 'Enter a job description to generate your learning roadmap'
                  : 'Ready to create your personalized learning path'}
              </p>
              <Button 
                onClick={generateRoadmap} 
                disabled={isGenerating || !jobDescription}
                className="gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing Skills...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Learning Roadmap
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Estimated Time</p>
                <p className="font-semibold">{roadmap.overallTimeEstimate}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Priority Level</p>
                <Badge className={
                  roadmap.priorityLevel === 'critical' ? 'bg-red-500' :
                  roadmap.priorityLevel === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                }>
                  {roadmap.priorityLevel}
                </Badge>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Skills to Learn</p>
                <p className="font-semibold">{roadmap.roadmap.length} skills</p>
              </div>
            </div>

            {/* Quick Wins */}
            {roadmap.quickWins.length > 0 && (
              <Alert className="border-green-500/50 bg-green-500/10">
                <Zap className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-700 dark:text-green-400">Quick Wins</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    {roadmap.quickWins.map((win, i) => (
                      <li key={i}>{win}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Skills Roadmap */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Route className="h-4 w-4" />
                Learning Path
              </h3>
              
              {roadmap.roadmap.map((skill, index) => (
                <Card key={index} className="border-border/50">
                  <CardHeader 
                    className="cursor-pointer py-4"
                    onClick={() => toggleSkillExpanded(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${getPriorityColor(skill.priority)}`}>
                          {skill.priority}
                        </div>
                        <div>
                          <CardTitle className="text-base">{skill.skill}</CardTitle>
                          <CardDescription className="text-xs">
                            <span className={getLevelColor(skill.currentLevel)}>{skill.currentLevel}</span>
                            {' → '}
                            <span className={getLevelColor(skill.targetLevel)}>{skill.targetLevel}</span>
                            {' • '}
                            {skill.timeToLearn}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline">{expandedSkills.has(index) ? 'Less' : 'More'}</Badge>
                    </div>
                  </CardHeader>
                  
                  {expandedSkills.has(index) && (
                    <CardContent className="pt-0 space-y-4">
                      <p className="text-sm text-muted-foreground">{skill.importance}</p>
                      
                      {/* Resources */}
                      {skill.resources.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Learning Resources:</p>
                          <div className="space-y-2">
                            {skill.resources.map((resource, ri) => (
                              <div key={ri} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                                  <span>{resource.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {resource.type}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  {resource.isFree && <Badge variant="secondary" className="text-xs">Free</Badge>}
                                  {resource.url && (
                                    <a href={resource.url.startsWith('http') ? resource.url : `https://${resource.url}`} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-4 w-4 text-primary" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Practice Projects */}
                      {skill.practiceProjects.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Practice Projects:</p>
                          <ul className="space-y-1">
                            {skill.practiceProjects.map((project, pi) => (
                              <li key={pi} className="flex items-start gap-2 text-sm">
                                <Rocket className="h-4 w-4 text-primary mt-0.5" />
                                {project}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Certifications */}
                      {skill.certifications.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Recommended Certifications:</p>
                          <div className="flex flex-wrap gap-2">
                            {skill.certifications.map((cert, ci) => (
                              <Badge key={ci} variant="outline" className="gap-1">
                                <Award className="h-3 w-3" />
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            {/* Personalized Advice */}
            {roadmap.advice && (
              <Alert className="border-blue-500/50 bg-blue-500/10">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-700 dark:text-blue-400">Personalized Advice</AlertTitle>
                <AlertDescription className="text-sm">
                  {roadmap.advice}
                </AlertDescription>
              </Alert>
            )}

            {/* Regenerate Button */}
            <div className="text-center pt-4">
              <Button variant="outline" onClick={() => setRoadmap(null)}>
                Generate New Roadmap
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
