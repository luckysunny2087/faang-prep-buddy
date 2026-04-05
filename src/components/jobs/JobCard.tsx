import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, ChevronDown, ChevronUp, Briefcase, ExternalLink } from "lucide-react";

export interface Job {
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  description: string;
  requirements: string[];
  matchScore: number;
  type: string;
  postedDaysAgo: number;
}

function getScoreColor(score: number) {
  if (score >= 80) return "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30";
  if (score >= 60) return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30";
  return "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30";
}

export function JobCard({ job }: { job: Job }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight">{job.title}</h3>
            <p className="text-muted-foreground font-medium">{job.company}</p>
          </div>
          <Badge className={`shrink-0 ${getScoreColor(job.matchScore)} border`} variant="outline">
            {job.matchScore}% Match
          </Badge>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground pt-1">
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
          <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{job.salaryRange}</span>
          <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{job.type}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{job.postedDaysAgo}d ago</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <p className={`text-sm text-muted-foreground ${!expanded ? "line-clamp-2" : ""}`}>
          {job.description}
        </p>

        {expanded && (
          <div className="flex flex-wrap gap-1.5">
            {job.requirements.map((req, i) => (
              <Badge key={i} variant="secondary" className="text-xs">{req}</Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {expanded ? "Less" : "More"}
          </Button>
          <Button size="sm" variant="outline">
            <ExternalLink className="h-4 w-4 mr-1" /> Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
