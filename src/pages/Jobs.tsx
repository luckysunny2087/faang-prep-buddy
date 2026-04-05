import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { JobCard, type Job } from "@/components/jobs/JobCard";
import { Search, X, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SKILL_SUGGESTIONS = [
  "React", "TypeScript", "Python", "Java", "AWS", "Azure", "Docker", "Kubernetes",
  "Node.js", "SQL", "MongoDB", "GraphQL", "CI/CD", "Terraform", "Go", "Rust",
  "Machine Learning", "Data Science", "DevOps", "Agile", "Scrum", "System Design",
];

export default function Jobs() {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("mid");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) => setSkills((prev) => prev.filter((s) => s !== skill));

  const handleSearch = async () => {
    if (skills.length === 0) {
      toast({ title: "Add at least one skill", variant: "destructive" });
      return;
    }
    setLoading(true);
    setSearched(true);

    try {
      const { data, error } = await supabase.functions.invoke("job-search", {
        body: {
          skills,
          experienceLevel,
          role: role || undefined,
          location: location || undefined,
        },
      });

      if (error) throw error;
      setJobs(data?.jobs ?? []);
    } catch (e: any) {
      console.error(e);
      toast({ title: "Search failed", description: e.message || "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredSuggestions = SKILL_SUGGESTIONS.filter(
    (s) => !skills.includes(s) && s.toLowerCase().includes(skillInput.toLowerCase())
  );

  return (
    <Layout>
      <div className="container max-w-3xl py-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold">Job Search Agent</h1>
          <p className="text-muted-foreground">AI-powered job discovery based on your skills and experience.</p>
        </div>

        {/* Search Form */}
        <div className="rounded-lg border bg-card p-5 space-y-4">
          {/* Skills */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Skills</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {skills.map((s) => (
                <Badge key={s} variant="secondary" className="gap-1 pr-1">
                  {s}
                  <button onClick={() => removeSkill(s)} className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="relative">
              <Input
                placeholder="Type a skill and press Enter..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill(skillInput);
                  }
                }}
              />
              {skillInput && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full max-h-36 overflow-auto rounded-md border bg-popover p-1 shadow-md">
                  {filteredSuggestions.slice(0, 6).map((s) => (
                    <button
                      key={s}
                      onClick={() => addSkill(s)}
                      className="w-full text-left px-3 py-1.5 text-sm rounded hover:bg-accent"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Level + Role + Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Experience</label>
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="lead">Lead / Staff</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Role (optional)</label>
              <Input placeholder="e.g. Frontend Engineer" value={role} onChange={(e) => setRole(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Location (optional)</label>
              <Input placeholder="e.g. Remote, NYC" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          </div>

          <Button onClick={handleSearch} disabled={loading} className="w-full sm:w-auto">
            <Search className="h-4 w-4 mr-2" />
            {loading ? "Searching..." : "Search Jobs"}
          </Button>
        </div>

        {/* Results */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border p-5 space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ))}
          </div>
        )}

        {!loading && searched && jobs.length === 0 && (
          <div className="text-center py-12 space-y-3">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">No jobs found. Try adjusting your skills or filters.</p>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{jobs.length} jobs found</p>
            {jobs.map((job, i) => (
              <JobCard key={i} job={job} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
