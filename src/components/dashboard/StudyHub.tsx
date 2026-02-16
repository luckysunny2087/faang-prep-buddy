import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserResources, UserResource } from '@/hooks/useUserResources';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Bookmark, CheckCircle2, ExternalLink, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

function ResourceRow({ resource }: { resource: UserResource }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          {resource.status === 'completed' ? (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          ) : (
            <Bookmark className="w-4 h-4 text-amber-500" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-sm text-foreground truncate">{resource.resource_name}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {resource.resource_category}
            </Badge>
            <span>{format(new Date(resource.updated_at), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </div>
      <a href={resource.resource_link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors shrink-0 ml-2">
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
}

function EmptyState({ type }: { type: 'completed' | 'saved' }) {
  const navigate = useNavigate();
  return (
    <div className="text-center py-8">
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
        {type === 'completed' ? <CheckCircle2 className="w-5 h-5 text-muted-foreground" /> : <Bookmark className="w-5 h-5 text-muted-foreground" />}
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        {type === 'completed' ? "No completed resources yet" : "No saved resources yet"}
      </p>
      <Button variant="ghost" size="sm" onClick={() => navigate('/resources')}>
        Browse Resources <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}

export default function StudyHub() {
  const { userResources, isLoading } = useUserResources();
  const navigate = useNavigate();

  const completed = userResources.filter(r => r.status === 'completed');
  const saved = userResources.filter(r => r.status === 'saved_for_later');

  if (isLoading) return null;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            My Study Hub
          </CardTitle>
          <CardDescription>Your tracked learning resources</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="completed">
          <TabsList className="w-full">
            <TabsTrigger value="completed" className="flex-1">
              Completed ({completed.length})
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex-1">
              Saved for Later ({saved.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="completed">
            <div className="space-y-2 mt-2">
              {completed.length === 0 ? <EmptyState type="completed" /> : completed.slice(0, 5).map(r => <ResourceRow key={r.id} resource={r} />)}
            </div>
            {completed.length > 5 && (
              <Button variant="ghost" size="sm" className="w-full mt-3" onClick={() => navigate('/resources?filter=completed')}>
                View All ({completed.length}) <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </TabsContent>
          <TabsContent value="saved">
            <div className="space-y-2 mt-2">
              {saved.length === 0 ? <EmptyState type="saved" /> : saved.slice(0, 5).map(r => <ResourceRow key={r.id} resource={r} />)}
            </div>
            {saved.length > 5 && (
              <Button variant="ghost" size="sm" className="w-full mt-3" onClick={() => navigate('/resources?filter=saved_for_later')}>
                View All ({saved.length}) <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
