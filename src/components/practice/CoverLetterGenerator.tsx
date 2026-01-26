import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useInterview } from '@/contexts/InterviewContext';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';
import {
  FileEdit,
  Loader2,
  Copy,
  Download,
  Sparkles,
  Lock,
  CheckCircle,
  Lightbulb,
  Crown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CoverLetterResult {
  coverLetter: string;
  highlights: string[];
  tips: string[];
}

export function CoverLetterGenerator() {
  const { resumeText, jobDescription, selectedCompany } = useInterview();
  const { isPremium, isLoading: subLoading } = useSubscription();
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState<CoverLetterResult | null>(null);
  const navigate = useNavigate();

  const generateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description first');
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('resume-analyzer', {
        body: {
          action: 'generate-cover-letter',
          resumeText: resumeText || '',
          jobDescription,
          company: selectedCompany,
        }
      });

      if (error) throw error;
      
      if (data.error) {
        toast.error(data.error);
        return;
      }

      setCoverLetter(data);
      toast.success('Cover letter generated!');
    } catch (err: any) {
      console.error('Cover letter generation error:', err);
      toast.error('Failed to generate cover letter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (coverLetter?.coverLetter) {
      navigator.clipboard.writeText(coverLetter.coverLetter);
      toast.success('Cover letter copied to clipboard!');
    }
  };

  const downloadAsTxt = () => {
    if (coverLetter?.coverLetter) {
      const blob = new Blob([coverLetter.coverLetter], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cover-letter-${selectedCompany || 'application'}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Cover letter downloaded!');
    }
  };

  if (subLoading) {
    return (
      <Card className="border-border">
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isPremium) {
    return (
      <Card className="border-border bg-gradient-to-br from-primary/5 to-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Cover Letter Generator
            <Badge variant="secondary" className="ml-2">Premium</Badge>
          </CardTitle>
          <CardDescription>
            Generate personalized cover letters tailored to your target company and role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Lock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">
              Upgrade to Monthly Pro or Yearly Elite to unlock AI-powered cover letter generation
            </p>
            <Button onClick={() => navigate('/pricing')} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Upgrade Now
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileEdit className="h-5 w-5 text-primary" />
          Cover Letter Generator
          <Badge className="ml-2 bg-gradient-to-r from-yellow-500 to-orange-500">Premium</Badge>
        </CardTitle>
        <CardDescription>
          Generate a tailored cover letter based on your resume and the job description
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!coverLetter ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">
              {!jobDescription 
                ? 'Enter a job description in the tab above to generate a cover letter'
                : 'Ready to generate your personalized cover letter'}
            </p>
            <Button 
              onClick={generateCoverLetter} 
              disabled={isGenerating || !jobDescription}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Cover Letter
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={downloadAsTxt}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCoverLetter(null)}>
                Generate New
              </Button>
            </div>

            {/* Cover Letter Content */}
            <Textarea 
              value={coverLetter.coverLetter} 
              readOnly 
              className="min-h-[300px] font-mono text-sm"
            />

            {/* Highlights */}
            {coverLetter.highlights.length > 0 && (
              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-700 dark:text-green-400">Key Highlights</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    {coverLetter.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Tips */}
            {coverLetter.tips.length > 0 && (
              <Alert className="border-blue-500/50 bg-blue-500/10">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-700 dark:text-blue-400">Customization Tips</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    {coverLetter.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
