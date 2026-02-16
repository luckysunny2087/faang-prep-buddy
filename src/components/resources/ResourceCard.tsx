import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Globe, CheckCircle2, Bookmark } from 'lucide-react';
import { ResourceStatus } from '@/hooks/useUserResources';
import { toast } from '@/hooks/use-toast';

interface ResourceCardProps {
  resource: { name: string; description: string; link: string; type: string };
  category: string;
  status: ResourceStatus | null;
  isLoggedIn: boolean;
  onMarkCompleted: () => void;
  onSaveForLater: () => void;
}

export default function ResourceCard({ resource, category, status, isLoggedIn, onMarkCompleted, onSaveForLater }: ResourceCardProps) {
  const handleAction = (action: () => void) => {
    if (!isLoggedIn) {
      toast({ title: 'Sign in required', description: 'Please sign in to track your resources.', variant: 'destructive' });
      return;
    }
    action();
  };

  return (
    <Card className="h-full hover-lift border-border/50 group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-muted text-muted-foreground border border-border/50">
            {resource.type}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleAction(onMarkCompleted)}
              className={`p-1 rounded-md transition-colors ${status === 'completed' ? 'text-green-500 bg-green-500/10' : 'text-muted-foreground hover:text-green-500 hover:bg-green-500/10'}`}
              title="Mark as completed"
            >
              <CheckCircle2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleAction(onSaveForLater)}
              className={`p-1 rounded-md transition-colors ${status === 'saved_for_later' ? 'text-amber-500 bg-amber-500/10' : 'text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10'}`}
              title="Save for later"
            >
              <Bookmark className="h-4 w-4" />
            </button>
            <a href={resource.link} target="_blank" rel="noopener noreferrer" className="p-1 text-muted-foreground hover:text-primary transition-colors">
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
        <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
          {resource.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{resource.description}</p>
        <Button variant="ghost" className="w-full text-xs h-9 justify-between group-hover:bg-primary/5 group-hover:text-primary" asChild>
          <a href={resource.link} target="_blank" rel="noopener noreferrer">
            Explore Resource
            <Globe className="h-3.5 w-3.5 opacity-50" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
