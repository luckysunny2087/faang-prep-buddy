import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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

// Mock data for demonstration
const performanceData = [
  { date: "Week 1", score: 65 },
  { date: "Week 2", score: 72 },
  { date: "Week 3", score: 68 },
  { date: "Week 4", score: 78 },
  { date: "Week 5", score: 82 },
  { date: "Week 6", score: 85 },
];

const skillsData = [
  { skill: "Technical", value: 78, fullMark: 100 },
  { skill: "Behavioral", value: 85, fullMark: 100 },
  { skill: "System Design", value: 65, fullMark: 100 },
  { skill: "Domain", value: 72, fullMark: 100 },
];

const companyReadiness = [
  { company: "Amazon", readiness: 75 },
  { company: "Google", readiness: 68 },
  { company: "Meta", readiness: 72 },
  { company: "Apple", readiness: 60 },
  { company: "Netflix", readiness: 65 },
  { company: "Microsoft", readiness: 82 },
];

const recentSessions = [
  { id: 1, date: "Dec 8, 2024", type: "Technical", company: "Amazon", score: 85 },
  { id: 2, date: "Dec 7, 2024", type: "System Design", company: "Google", score: 72 },
  { id: 3, date: "Dec 6, 2024", type: "Behavioral", company: "Meta", score: 90 },
];

const achievements = [
  { id: 1, name: "First Interview", icon: Trophy, unlocked: true, description: "Complete your first practice session" },
  { id: 2, name: "Week Warrior", icon: Flame, unlocked: true, description: "7-day practice streak" },
  { id: 3, name: "Tech Master", icon: Code, unlocked: true, description: "Score 90%+ on technical questions" },
  { id: 4, name: "FAANG Ready", icon: Star, unlocked: false, description: "Pass mock interviews for all FAANG companies" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Mock user stats
  const stats = {
    totalSessions: 24,
    averageScore: 78,
    currentStreak: 5,
    longestStreak: 12,
    questionsAnswered: 186,
    hoursSpent: 18,
  };

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
                    <RadarChart data={skillsData}>
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
                    {recentSessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {session.type === "Technical" && <Code className="w-5 h-5 text-primary" />}
                            {session.type === "System Design" && <Lightbulb className="w-5 h-5 text-primary" />}
                            {session.type === "Behavioral" && <Users className="w-5 h-5 text-primary" />}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{session.type}</p>
                            <p className="text-xs text-muted-foreground">{session.company} • {session.date}</p>
                          </div>
                        </div>
                        <Badge variant={session.score >= 80 ? "default" : "secondary"}>
                          {session.score}%
                        </Badge>
                      </div>
                    ))}
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
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg text-center transition-all ${
                        achievement.unlocked 
                          ? "bg-primary/10 border border-primary/30" 
                          : "bg-muted/50 opacity-50"
                      }`}
                    >
                      <achievement.icon 
                        className={`w-8 h-8 mx-auto mb-2 ${
                          achievement.unlocked ? "text-primary" : "text-muted-foreground"
                        }`} 
                      />
                      <p className="font-medium text-sm text-foreground">{achievement.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-center"
          >
            <Button size="lg" onClick={() => navigate("/practice")} className="font-semibold">
              Start New Practice Session
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
