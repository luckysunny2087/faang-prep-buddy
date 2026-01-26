import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useInterview } from '@/contexts/InterviewContext';
import { toast } from 'sonner';
import {
  Upload,
  FileText,
  Briefcase,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Target,
  TrendingUp,
  XCircle,
} from 'lucide-react';

export function ResumeJobDescriptionInput() {
  const { 
    resumeText, 
    setResumeText, 
    jobDescription, 
    setJobDescription,
    resumeAnalysis,
    setResumeAnalysis,
    selectedCompany,
  } = useInterview();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOC, DOCX, or TXT file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to upload your resume');
        return;
      }

      // For text files, read content directly
      if (file.type === 'text/plain') {
        const text = await file.text();
        setResumeText(text);
        toast.success('Resume text extracted successfully');
        return;
      }

      // Upload file to storage for processing
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Call edge function to parse resume
      const { data, error } = await supabase.functions.invoke('resume-analyzer', {
        body: {
          action: 'parse-resume',
          filePath,
          fileName: file.name,
        }
      });

      if (error) throw error;
      
      if (data.text) {
        setResumeText(data.text);
        toast.success('Resume parsed successfully');
      } else if (data.error) {
        // If parsing fails, allow manual input
        toast.warning('Could not parse file. Please paste your resume text manually.');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error('Failed to process resume. Please paste text manually.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const analyzeGaps = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description first');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('resume-analyzer', {
        body: {
          action: 'analyze-gaps',
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

      setResumeAnalysis(data);
      toast.success('Analysis complete!');
    } catch (err: any) {
      console.error('Analysis error:', err);
      toast.error('Failed to analyze. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Resume & Job Description
        </CardTitle>
        <CardDescription>
          Upload your resume and paste the job description for personalized interview questions and gap analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="resume" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resume" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Resume
            </TabsTrigger>
            <TabsTrigger value="job" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Job Description
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="resume" className="space-y-4 mt-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex-shrink-0"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Resume
                    </>
                  )}
                </Button>
                <span className="text-sm text-muted-foreground">
                  PDF, DOC, DOCX, or TXT (max 5MB)
                </span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="resume-text">Or paste your resume text</Label>
                <Textarea
                  id="resume-text"
                  placeholder="Paste your resume content here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
                {resumeText && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Resume loaded ({resumeText.length.toLocaleString()} characters)
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="job" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Paste the job description here. Include requirements, responsibilities, and preferred qualifications..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px]"
              />
              {jobDescription && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Job description loaded ({jobDescription.length.toLocaleString()} characters)
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Analyze Button */}
        {jobDescription && (
          <div className="flex justify-center">
            <Button 
              onClick={analyzeGaps} 
              disabled={isAnalyzing}
              className="w-full md:w-auto"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Target className="mr-2 h-4 w-4" />
                  Analyze Resume vs Job Description
                </>
              )}
            </Button>
          </div>
        )}

        {/* Analysis Results */}
        {resumeAnalysis && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Gap Analysis Results
              </h3>
              <Badge variant={resumeAnalysis.matchScore >= 70 ? 'default' : 'secondary'}>
                {resumeAnalysis.matchScore}% Match
              </Badge>
            </div>
            
            <Progress value={resumeAnalysis.matchScore} className="h-3" />

            {/* Skills Found */}
            {resumeAnalysis.keySkillsFound.length > 0 && (
              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-700 dark:text-green-400">Skills Found in Your Resume</AlertTitle>
                <AlertDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {resumeAnalysis.keySkillsFound.map((skill, i) => (
                      <Badge key={i} variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Missing Skills */}
            {resumeAnalysis.missingSkills.length > 0 && (
              <Alert className="border-yellow-500/50 bg-yellow-500/10">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-700 dark:text-yellow-400">Missing Skills</AlertTitle>
                <AlertDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {resumeAnalysis.missingSkills.map((skill, i) => (
                      <Badge key={i} variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Gaps */}
            {resumeAnalysis.gaps.length > 0 && (
              <Alert className="border-red-500/50 bg-red-500/10">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-700 dark:text-red-400">Gaps to Address</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    {resumeAnalysis.gaps.map((gap, i) => (
                      <li key={i}>{gap}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Suggestions */}
            {resumeAnalysis.suggestions.length > 0 && (
              <Alert className="border-blue-500/50 bg-blue-500/10">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-700 dark:text-blue-400">Suggestions to Improve Your Resume</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    {resumeAnalysis.suggestions.map((suggestion, i) => (
                      <li key={i}>{suggestion}</li>
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
