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
import { ArrowRight, Loader2, CheckCircle, XCircle, Lightbulb, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Interview() {
  const navigate = useNavigate();
  const { currentSession, currentQuestionIndex, addQuestion, addAnswer, nextQuestion, endSession, setIsLoading, isLoading } = useInterview();
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ score: number; feedback: string; strengths: string[]; improvements: string[] } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<{ type: 'rate-limit' | 'general'; message: string; action: 'generate' | 'evaluate' } | null>(null);
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
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('interview-ai', {
        body: {
          action: 'generate-question',
          context: {
            technologies: currentSession.technologies,
            role: currentSession.role,
            level: currentSession.level,
            company: currentSession.company,
            questionTypes: currentSession.questionTypes,
            previousQuestions: currentSession.questions.map(q => q.question),
          }
        }
      });
      if (error) throw error;
      if (data.error) {
        const isRateLimit = data.error.toLowerCase().includes('rate') || data.error.toLowerCase().includes('busy');
        setError({
          type: isRateLimit ? 'rate-limit' : 'general',
          message: data.error,
          action: 'generate'
        });
        return;
      }
      addQuestion({ id: crypto.randomUUID(), question: data.question, type: data.type, difficulty: currentSession.level });
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to generate question';
      const isRateLimit = errorMsg.toLowerCase().includes('rate') || err?.status === 429;
      setError({
        type: isRateLimit ? 'rate-limit' : 'general',
        message: isRateLimit ? 'Service is busy. Please wait a moment and try again.' : errorMsg,
        action: 'generate'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const submitAnswer = async () => {
    if (!currentSession || !userAnswer.trim()) return;
    const currentQuestion = currentSession.questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    setIsLoading(true);
    setError(null);
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
      if (data.error) {
        const isRateLimit = data.error.toLowerCase().includes('rate') || data.error.toLowerCase().includes('busy');
        setError({
          type: isRateLimit ? 'rate-limit' : 'general',
          message: data.error,
          action: 'evaluate'
        });
        return;
      }
      setFeedback(data);
      addAnswer({ questionId: currentQuestion.id, answer: userAnswer, ...data });
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to evaluate answer';
      const isRateLimit = errorMsg.toLowerCase().includes('rate') || err?.status === 429;
      setError({
        type: isRateLimit ? 'rate-limit' : 'general',
        message: isRateLimit ? 'Service is busy. Please wait a moment and try again.' : errorMsg,
        action: 'evaluate'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (error?.action === 'generate') {
      generateQuestion();
    } else if (error?.action === 'evaluate') {
      submitAnswer();
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
        technology: currentSession.technologies.join(',') || 'general',
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
    setError(null);
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

  const LoadingCard = ({ message }: { message: string }) => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="absolute inset-0 h-12 w-12 animate-ping opacity-20 rounded-full bg-primary" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">{message}</p>
          <p className="text-sm text-muted-foreground">This may take a few seconds...</p>
        </div>
      </CardContent>
    </Card>
  );

  const ErrorCard = () => (
    <Card className="border-destructive/50">
      <CardContent className="py-8">
        <Alert variant={error?.type === 'rate-limit' ? 'default' : 'destructive'} className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {error?.type === 'rate-limit' ? 'Service Temporarily Busy' : 'Something went wrong'}
          </AlertTitle>
          <AlertDescription>
            {error?.message || 'An unexpected error occurred. Please try again.'}
          </AlertDescription>
        </Alert>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleRetry} className="flex-1">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" onClick={() => navigate('/practice')} className="flex-1">
            Back to Setup
          </Button>
        </div>
        {error?.type === 'rate-limit' && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            Tip: Wait 5-10 seconds before retrying for best results
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Layout showFooter={false}>
      <div className="container py-8 max-w-3xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of 10</span>
            <Badge variant="secondary">
              {currentSession.technologies.length > 0 
                ? currentSession.technologies.map(t => t.toUpperCase()).join(', ') 
                : 'General'}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {error ? (
          <ErrorCard />
        ) : isGenerating ? (
          <LoadingCard message="Generating your question..." />
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
                  disabled={!!feedback || isLoading}
                />
                {!feedback && (
                  <Button onClick={submitAnswer} disabled={isLoading || !userAnswer.trim()} className="mt-4">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Evaluating your answer...
                      </>
                    ) : (
                      'Submit Answer'
                    )}
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
