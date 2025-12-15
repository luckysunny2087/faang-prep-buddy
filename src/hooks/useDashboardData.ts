import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalSessions: number;
  averageScore: number;
  currentStreak: number;
  longestStreak: number;
  questionsAnswered: number;
  hoursSpent: number;
}

interface Session {
  id: string;
  date: string;
  type: string;
  company: string | null;
  score: number;
}

interface SkillData {
  skill: string;
  value: number;
  fullMark: number;
}

interface PerformanceData {
  date: string;
  score: number;
}

interface CompanyReadiness {
  company: string;
  readiness: number;
}

export function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalSessions: 0,
    averageScore: 0,
    currentStreak: 0,
    longestStreak: 0,
    questionsAnswered: 0,
    hoursSpent: 0,
  });
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [skillsData, setSkillsData] = useState<SkillData[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [companyReadiness, setCompanyReadiness] = useState<CompanyReadiness[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile data
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      // Fetch sessions
      const { data: sessions } = await supabase
        .from("interview_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (profile) {
        const totalQuestions = profile.total_questions || 0;
        const avgScore = sessions && sessions.length > 0
          ? Math.round(sessions.reduce((acc, s) => acc + s.score, 0) / sessions.length)
          : 0;
        
        // Estimate hours (assuming ~3 mins per question)
        const hoursSpent = Math.round((totalQuestions * 3) / 60);

        setStats({
          totalSessions: profile.total_sessions || 0,
          averageScore: avgScore,
          currentStreak: profile.current_streak || 0,
          longestStreak: profile.longest_streak || 0,
          questionsAnswered: totalQuestions,
          hoursSpent,
        });
      }

      if (sessions && sessions.length > 0) {
        // Recent sessions (last 5)
        const recent = sessions.slice(0, 5).map(s => ({
          id: s.id,
          date: new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          type: s.question_types?.[0] || "Technical",
          company: s.company,
          score: s.score,
        }));
        setRecentSessions(recent);

        // Skills data by question type
        const typeScores: Record<string, { total: number; count: number }> = {
          Technical: { total: 0, count: 0 },
          Behavioral: { total: 0, count: 0 },
          "System Design": { total: 0, count: 0 },
          Domain: { total: 0, count: 0 },
        };

        sessions.forEach(s => {
          s.question_types?.forEach((type: string) => {
            if (typeScores[type]) {
              typeScores[type].total += s.score;
              typeScores[type].count += 1;
            }
          });
        });

        const skills = Object.entries(typeScores).map(([skill, data]) => ({
          skill,
          value: data.count > 0 ? Math.round(data.total / data.count) : 0,
          fullMark: 100,
        }));
        setSkillsData(skills);

        // Performance trend (last 6 sessions grouped by week)
        const weeklyScores: Record<string, { total: number; count: number }> = {};
        sessions.slice(0, 20).reverse().forEach(s => {
          const weekStart = getWeekStart(new Date(s.created_at));
          const weekKey = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          if (!weeklyScores[weekKey]) {
            weeklyScores[weekKey] = { total: 0, count: 0 };
          }
          weeklyScores[weekKey].total += s.score;
          weeklyScores[weekKey].count += 1;
        });

        const performance = Object.entries(weeklyScores).map(([date, data]) => ({
          date,
          score: Math.round(data.total / data.count),
        })).slice(-6);
        setPerformanceData(performance);

        // Company readiness
        const companyScores: Record<string, { total: number; count: number }> = {};
        sessions.forEach(s => {
          if (s.company) {
            if (!companyScores[s.company]) {
              companyScores[s.company] = { total: 0, count: 0 };
            }
            companyScores[s.company].total += s.score;
            companyScores[s.company].count += 1;
          }
        });

        const companies = Object.entries(companyScores)
          .map(([company, data]) => ({
            company,
            readiness: Math.round(data.total / data.count),
          }))
          .sort((a, b) => b.readiness - a.readiness)
          .slice(0, 6);
        setCompanyReadiness(companies);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    stats,
    recentSessions,
    skillsData,
    performanceData,
    companyReadiness,
  };
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}
