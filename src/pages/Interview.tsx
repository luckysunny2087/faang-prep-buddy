import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useInterview } from '@/contexts/InterviewContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, Loader2, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

export default function Interview() {
  const navigate = useNavigate();
  const { currentSession, currentQuestionIndex, addQuestion, addAnswer, nextQuestion, endSession, setIsLoading, isLoading } = useInterview();
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ score: number; feedback: string; strengths: string[]; improvements: string[] } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const startTimeRef = useRef<Date>(new Date());

  useEffect(() => {
    if (!currentSession) {
      navigate('/practice');
      return;
    }
    startTimeRef.current = new Date();
    if (currentSession.questions.length === 0) {
      generateQuestion();
    }
  }, [currentSession]);

  const generateQuestion = async () => {
    if (!currentSession) return;
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('interview-ai', {
        body: {
          action: 'generate-question',
          context: {
            technology: currentSession.technology,
            role: currentSession.role,
            level: currentSession.level,
            company: currentSession.company,
            questionTypes: currentSession.questionTypes,
            previousQuestions: currentSession.questions.map(q => q.question),
          }
        }
      });
      if (error) throw error;
      addQuestion({ id: crypto.randomUUID(), question: data.question, type: data.type, difficulty: currentSession.level });
    } catch (err) {
      toast.error('Failed to generate question');
    } finally {
      setIsGenerating(false);
    }
  };

  const submitAnswer = async () => {
    if (!currentSession || !userAnswer.trim()) return;
    const currentQuestion = currentSession.questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('interview-ai', {
        body: {
          action: 'evaluate-answer',
          context: {
            question: currentQuestion.question,
            answer: userAnswer,
            type: currentQuestion.type,
            level: currentSession.level,
            role: currentSession.role,
          }
        }
      });
      if (error) throw error;
      setFeedback(data);
      addAnswer({ questionId: currentQuestion.id, answer: userAnswer, ...data });
    } catch (err) {
      toast.error('Failed to evaluate answer');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSessionToDatabase = async () => {
    if (!currentSession) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const totalQuestions = currentSession.answers.length;
      const avgScore = totalQuestions > 0 
        ? Math.round(currentSession.answers.reduce((sum, a) => sum + (a.score || 0), 0) / totalQuestions)
        : 0;
      const correctAnswers = currentSession.answers.filter(a => (a.score || 0) >= 7).length;
      const durationMinutes = Math.round((new Date().getTime() - startTimeRef.current.getTime()) / 60000);

      // Save interview session
      await supabase.from('interview_sessions').insert({
        user_id: user.id,
        technology: currentSession.technology,
        role: currentSession.role,
        level: currentSession.level,
        company: currentSession.company || null,
        question_types: currentSession.questionTypes,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        score: avgScore,
        duration_minutes: durationMinutes,
      });

      // Update profile stats
      const today = new Date().toISOString().split('T')[0];
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_sessions, total_questions, current_streak, longest_streak, last_practice_date')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        const lastPractice = profile.last_practice_date;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const newStreak = lastPractice === yesterday ? (profile.current_streak || 0) + 1 
          : lastPractice === today ? (profile.current_streak || 0) 
          : 1;

        await supabase.from('profiles').update({
          total_sessions: (profile.total_sessions || 0) + 1,
          total_questions: (profile.total_questions || 0) + totalQuestions,
          current_streak: newStreak,
          longest_streak: Math.max(profile.longest_streak || 0, newStreak),
          last_practice_date: today,
        }).eq('user_id', user.id);
      }
    } catch (err) {
      console.error('Failed to save session:', err);
    }
  };

  const handleNext = async () => {
    setUserAnswer('');
    setFeedback(null);
    if (currentQuestionIndex < 9) {
      nextQuestion();
      generateQuestion();
    } else {
      await saveSessionToDatabase();
      endSession();
      navigate('/results');
    }
  };

  if (!currentSession) return null;
  const currentQuestion = currentSession.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / 10) * 100;

  return (
    <Layout showFooter={false}>
      <div className="container py-8 max-w-3xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of 10</span>
            <Badge variant="secondary">{currentSession.technology.toUpperCase()}</Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {isGenerating ? (
          <Card><CardContent className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></CardContent></Card>
        ) : currentQuestion ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge>{currentQuestion.type}</Badge>
                </div>
                <CardTitle className="text-xl leading-relaxed">{currentQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Type your answer here..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="min-h-[200px]"
                  disabled={!!feedback}
                />
                {!feedback && (
                  <Button onClick={submitAnswer} disabled={isLoading || !userAnswer.trim()} className="mt-4">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Submit Answer
                  </Button>
                )}
              </CardContent>
            </Card>

            {feedback && (
              <Card className="border-primary/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-warning" />
                    Feedback - Score: {feedback.score}/10
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{feedback.feedback}</p>
                  {feedback.strengths?.length > 0 && (
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 text-success"><CheckCircle className="h-4 w-4" />Strengths</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">{feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                    </div>
                  )}
                  {feedback.improvements?.length > 0 && (
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 text-warning"><XCircle className="h-4 w-4" />Areas to Improve</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">{feedback.improvements.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
                    </div>
                  )}
                  <Button onClick={handleNext} className="w-full">
                    {currentQuestionIndex < 9 ? 'Next Question' : 'View Results'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
