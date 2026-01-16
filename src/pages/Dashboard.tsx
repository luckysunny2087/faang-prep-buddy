import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDashboardData } from "@/hooks/useDashboardData";
import {
  Target,
  TrendingUp,
  Calendar,
  Award,
  Flame,
  Brain,
  Code,
  Users,
  Lightbulb,
  ChevronRight,
  Trophy,
  Star
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
} from "recharts";

const defaultSkillsData = [
  { skill: "Technical", value: 0, fullMark: 100 },
  { skill: "Behavioral", value: 0, fullMark: 100 },
  { skill: "System Design", value: 0, fullMark: 100 },
  { skill: "Domain", value: 0, fullMark: 100 },
];

const achievements = [
  { id: 1, name: "First Interview", icon: Trophy, threshold: 1, description: "Complete your first practice session" },
  { id: 2, name: "Week Warrior", icon: Flame, threshold: 7, description: "7-day practice streak" },
  { id: 3, name: "Tech Master", icon: Code, threshold: 90, description: "Score 90%+ on technical questions" },
  { id: 4, name: "FAANG Ready", icon: Star, threshold: 6, description: "Practice with all FAANG companies" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { loading, stats, recentSessions, skillsData, performanceData, companyReadiness } = useDashboardData();

  const displaySkills = skillsData.length > 0 ? skillsData : defaultSkillsData;

  // Calculate achievement status
  const getAchievementStatus = (id: number) => {
    switch (id) {
      case 1: return stats.totalSessions >= 1;
      case 2: return stats.currentStreak >= 7;
      case 3: return skillsData.find(s => s.skill === "Technical")?.value >= 90;
      case 4: return companyReadiness.length >= 6;
      default: return false;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold font-display text-foreground mb-2">
              Progress Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track your interview preparation journey
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
          >
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-foreground">{stats.totalSessions}</p>
                <p className="text-xs text-muted-foreground">Sessions</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold text-foreground">{stats.averageScore}%</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
              <CardContent className="p-4 text-center">
                <Flame className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                <p className="text-2xl font-bold text-foreground">{stats.currentStreak}</p>
                <p className="text-xs text-muted-foreground">Day Streak 🔥</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold text-foreground">{stats.longestStreak}</p>
                <p className="text-xs text-muted-foreground">Best Streak</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <Brain className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold text-foreground">{stats.questionsAnswered}</p>
                <p className="text-xs text-muted-foreground">Questions</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <Award className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold text-foreground">{stats.hoursSpent}h</p>
                <p className="text-xs text-muted-foreground">Practice Time</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Performance Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-card border-border h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-display">Performance Trend</CardTitle>
                  <CardDescription>Your score progression over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {performanceData.length === 0 ? (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                      Complete sessions to see your progress trend
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis domain={[0, 100]} className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="hsl(var(--primary))"
                          strokeWidth={3}
                          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Skills Radar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-card border-border h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-display">Skills Breakdown</CardTitle>
                  <CardDescription>Performance by question type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={displaySkills}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="skill" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Radar
                        name="Score"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Company Readiness & Recent Sessions */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Company Readiness */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-display">Company Readiness</CardTitle>
                  <CardDescription>Your preparation level for each company</CardDescription>
                </CardHeader>
                <CardContent>
                  {companyReadiness.length === 0 ? (
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      Practice with companies to see readiness scores
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={companyReadiness} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis type="number" domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis dataKey="company" type="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} width={70} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="readiness" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-display">Recent Sessions</CardTitle>
                  <CardDescription>Your latest practice interviews</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentSessions.length === 0 ? (
                      <p className="text-center text-muted-foreground py-6">No sessions yet. Start practicing!</p>
                    ) : (
                      recentSessions.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              {session.type === "Technical" && <Code className="w-5 h-5 text-primary" />}
                              {session.type === "System Design" && <Lightbulb className="w-5 h-5 text-primary" />}
                              {session.type === "Behavioral" && <Users className="w-5 h-5 text-primary" />}
                              {!["Technical", "System Design", "Behavioral"].includes(session.type) && <Brain className="w-5 h-5 text-primary" />}
                            </div>
                            <div>
                              <p className="font-medium text-sm text-foreground">{session.type}</p>
                              <p className="text-xs text-muted-foreground">{session.company || "General"} • {session.date}</p>
                            </div>
                          </div>
                          <Badge variant={session.score >= 80 ? "default" : "secondary"}>
                            {session.score}%
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                  <Button variant="ghost" className="w-full mt-4" size="sm">
                    View All Sessions <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-display">Achievements</CardTitle>
                <CardDescription>Milestones you've reached</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {achievements.map((achievement) => {
                    const unlocked = getAchievementStatus(achievement.id);
                    return (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-lg text-center transition-all ${unlocked
                            ? "bg-primary/10 border border-primary/30"
                            : "bg-muted/50 opacity-50"
                          }`}
                      >
                        <achievement.icon
                          className={`w-8 h-8 mx-auto mb-2 ${unlocked ? "text-primary" : "text-muted-foreground"
                            }`}
                        />
                        <p className="font-medium text-sm text-foreground">{achievement.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA Row */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-gradient-to-br from-primary/10 to-blue-500/10 border-primary/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Lightbulb className="w-24 h-24 text-primary" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-display">Custom Roadmap</CardTitle>
                  <CardDescription>Generate a tailored learning path based on your goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => navigate("/learning-path")} className="w-full">
                    Generate My Path <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-card border-border overflow-hidden relative">
                <CardHeader>
                  <CardTitle className="text-xl font-display">New Practice</CardTitle>
                  <CardDescription>Start a new AI-powered interview session</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" onClick={() => navigate("/practice")} className="w-full">
                    Start Interviewing <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
