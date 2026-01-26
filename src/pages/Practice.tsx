import { Layout } from '@/components/layout/Layout';
import { TechnologySelector } from '@/components/practice/TechnologySelector';
import { RoleSelector } from '@/components/practice/RoleSelector';
import { LevelSelector } from '@/components/practice/LevelSelector';
import { DomainSelector } from '@/components/practice/DomainSelector';
import { CompanySelector } from '@/components/practice/CompanySelector';
import { QuestionTypeSelector } from '@/components/practice/QuestionTypeSelector';
import { ResumeJobDescriptionInput } from '@/components/practice/ResumeJobDescriptionInput';
import { CoverLetterGenerator } from '@/components/practice/CoverLetterGenerator';
import { LearningRoadmap } from '@/components/practice/LearningRoadmap';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '@/contexts/InterviewContext';
import { QuestionType } from '@/types/interview';
import { ArrowRight, Sparkles, Crown } from 'lucide-react';

export default function Practice() {
  const navigate = useNavigate();
  const {
    selectedTechnologies,
    selectedRole,
    selectedLevel,
    selectedCompany,
    selectedDomain,
    selectedQuestionTypes,
    toggleTechnology,
    setSelectedRole,
    setSelectedLevel,
    setSelectedCompany,
    setSelectedDomain,
    setSelectedQuestionTypes,
    startSession,
    jobDescription,
    resumeAnalysis,
  } = useInterview();

  const handleToggleQuestionType = (type: QuestionType) => {
    if (selectedQuestionTypes.includes(type)) {
      setSelectedQuestionTypes(selectedQuestionTypes.filter(t => t !== type));
    } else {
      setSelectedQuestionTypes([...selectedQuestionTypes, type]);
    }
  };

  const canStartSession = selectedRole && selectedLevel;

  const handleStartSession = () => {
    startSession();
    navigate('/interview');
  };

  // Show premium features if user has analyzed their resume/JD
  const showPremiumFeatures = jobDescription && resumeAnalysis;

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Setup Your Practice Session</h1>
          <p className="text-muted-foreground">Customize your interview practice experience</p>
        </div>

        <div className="space-y-6">
          {/* Resume & Job Description - Moved to top for priority */}
          <ResumeJobDescriptionInput />
          
          {/* Premium Features Section - Show after gap analysis */}
          {showPremiumFeatures && (
            <>
              <Separator className="my-8" />
              <div className="text-center mb-6">
                <h2 className="font-display text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Premium Career Tools
                </h2>
                <p className="text-sm text-muted-foreground">
                  Unlock AI-powered tools to accelerate your career preparation
                </p>
              </div>
              
              <CoverLetterGenerator />
              <LearningRoadmap />
              
              <Separator className="my-8" />
            </>
          )}
          
          <CompanySelector 
            selectedCompany={selectedCompany} 
            onSelect={setSelectedCompany} 
          />
          <RoleSelector 
            selectedRole={selectedRole} 
            onSelect={setSelectedRole} 
          />
          <LevelSelector 
            selectedLevel={selectedLevel} 
            onSelect={setSelectedLevel} 
          />
          <TechnologySelector 
            selectedTechnologies={selectedTechnologies} 
            onToggle={toggleTechnology} 
          />
          <DomainSelector 
            selectedDomain={selectedDomain} 
            onSelect={setSelectedDomain} 
          />
          <QuestionTypeSelector 
            selectedTypes={selectedQuestionTypes} 
            onToggle={handleToggleQuestionType} 
          />

          <div className="flex justify-center pt-4">
            <Button 
              size="lg" 
              onClick={handleStartSession}
              disabled={!canStartSession}
              className="h-12 px-8"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Start Interview Session
              {jobDescription && ' (with JD context)'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
