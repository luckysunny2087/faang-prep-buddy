import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useInterview } from "@/contexts/InterviewContext";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Target, 
  ThumbsUp, 
  ThumbsDown, 
  Lightbulb,
  RotateCcw,
  Home,
  BarChart3,
  CheckCircle,
  XCircle,
  ArrowRight
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

export default function Results() {
  const navigate = useNavigate();
  const { currentSession, resetSetup } = useInterview();

  const questions = currentSession?.questions || [];
  const answers = currentSession?.answers || [];

  // Calculate results
  const totalQuestions = questions.length;
  const answeredQuestions = answers.length;
  const averageScore = answers.length > 0 
    ? Math.round(answers.reduce((acc, a) => acc + (a.score || 0), 0) / answers.length)
    : 0;

  // Group scores by question type
  const scoresByType = answers.reduce<Record<string, { total: number; count: number }>>((acc, answer) => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question) {
      if (!acc[question.type]) {
        acc[question.type] = { total: 0, count: 0 };
      }
      acc[question.type].total += answer.score || 0;
      acc[question.type].count += 1;
    }
    return acc;
  }, {});

  const radarData = Object.entries(scoresByType).map(([type, data]) => ({
    type: type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    score: Math.round(data.total / data.count),
    fullMark: 100
  }));

  // Collect all strengths and improvements
  const allStrengths = answers.flatMap(a => a.strengths || []).filter((s): s is string => Boolean(s));
  const allImprovements = answers.flatMap(a => a.improvements || []).filter((s): s is string => Boolean(s));

  // Determine readiness level
  const getReadinessLevel = (score: number) => {
    if (score >= 85) return { level: "Expert", color: "text-green-500", bg: "bg-green-500/10" };
    if (score >= 70) return { level: "Ready", color: "text-blue-500", bg: "bg-blue-500/10" };
    if (score >= 50) return { level: "Developing", color: "text-yellow-500", bg: "bg-yellow-500/10" };
    return { level: "Beginner", color: "text-red-500", bg: "bg-red-500/10" };
  };

  const readiness = getReadinessLevel(averageScore);

  const handleRetry = () => {
    resetSetup();
    navigate("/practice");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold font-display text-foreground mb-2">
              Interview Complete!
            </h1>
            <p className="text-muted-foreground">
              Here's how you performed in your practice session
            </p>
          </motion.div>

          {/* Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card border-border mb-6">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  {/* Overall Score */}
                  <div className="md:col-span-1">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="hsl(var(--muted))"
                          strokeWidth="12"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray={`${(averageScore / 100) * 352} 352`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-foreground">{averageScore}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Overall Score</p>
                  </div>

                  {/* Stats */}
                  <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold text-foreground">{answeredQuestions}/{totalQuestions}</p>
                      <p className="text-xs text-muted-foreground">Questions Completed</p>
                    </div>
                    <div className={`p-4 rounded-lg ${readiness.bg}`}>
                      <div className={`w-6 h-6 mx-auto mb-2 rounded-full ${readiness.bg} flex items-center justify-center`}>
                        {averageScore >= 70 ? (
                          <CheckCircle className={`w-5 h-5 ${readiness.color}`} />
                        ) : (
                          <XCircle className={`w-5 h-5 ${readiness.color}`} />
                        )}
                      </div>
                      <p className={`text-2xl font-bold ${readiness.color}`}>{readiness.level}</p>
                      <p className="text-xs text-muted-foreground">Readiness Level</p>
                    </div>
                    {currentSession?.company && (
                      <div className="col-span-2 p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Prepared for</p>
                        <p className="text-lg font-semibold text-foreground capitalize">{currentSession.company}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Skills Breakdown */}
          {radarData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-card border-border mb-6">
                <CardHeader>
                  <CardTitle className="text-lg font-display">Performance by Category</CardTitle>
                  <CardDescription>How you performed across different question types</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="type" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Strengths & Improvements */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Strengths */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-card border-border h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-display flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5 text-green-500" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {allStrengths.length > 0 ? (
                    <ul className="space-y-2">
                      {[...new Set(allStrengths)].slice(0, 5).map((strength, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-sm">Complete more questions to see your strengths</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Areas for Improvement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-card border-border h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-display flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    Areas to Improve
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {allImprovements.length > 0 ? (
                    <ul className="space-y-2">
                      {[...new Set(allImprovements)].slice(0, 5).map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-sm">Complete more questions to see improvement areas</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Question-by-Question Review */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-card border-border mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-display">Question Review</CardTitle>
                <CardDescription>Detailed breakdown of each question</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questions.map((question, index) => {
                    const answer = answers.find(a => a.questionId === question.id);
                    return (
                      <div key={question.id} className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                Q{index + 1}
                              </Badge>
                              <Badge variant="secondary" className="text-xs capitalize">
                                {question.type.replace('-', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium text-foreground">{question.question}</p>
                          </div>
                          {answer?.score !== undefined && (
                            <Badge variant={answer.score >= 70 ? "default" : "secondary"}>
                              {answer.score}%
                            </Badge>
                          )}
                        </div>
                        {answer?.feedback && (
                          <p className="text-sm text-muted-foreground mt-2 pl-4 border-l-2 border-primary/30">
                            {answer.feedback}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="outline" size="lg" onClick={() => navigate("/")}>
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/dashboard")}>
              <BarChart3 className="w-4 h-4 mr-2" />
              View Dashboard
            </Button>
            <Button size="lg" onClick={handleRetry}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Practice Again
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
