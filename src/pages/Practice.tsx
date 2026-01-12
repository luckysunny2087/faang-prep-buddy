import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { TechnologySelector } from '@/components/practice/TechnologySelector';
import { RoleSelector } from '@/components/practice/RoleSelector';
import { LevelSelector } from '@/components/practice/LevelSelector';
import { DomainSelector } from '@/components/practice/DomainSelector';
import { CompanySelector } from '@/components/practice/CompanySelector';
import { QuestionTypeSelector } from '@/components/practice/QuestionTypeSelector';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '@/contexts/InterviewContext';
import { QuestionType } from '@/types/interview';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Practice() {
  const navigate = useNavigate();
  const {
    selectedTechnology,
    selectedRole,
    selectedLevel,
    selectedCompany,
    selectedDomain,
    selectedQuestionTypes,
    setSelectedTechnology,
    setSelectedRole,
    setSelectedLevel,
    setSelectedCompany,
    setSelectedDomain,
    setSelectedQuestionTypes,
    startSession,
  } = useInterview();

  const handleToggleQuestionType = (type: QuestionType) => {
    if (selectedQuestionTypes.includes(type)) {
      setSelectedQuestionTypes(selectedQuestionTypes.filter(t => t !== type));
    } else {
      setSelectedQuestionTypes([...selectedQuestionTypes, type]);
    }
  };

  const canStartSession = selectedTechnology && selectedRole && selectedLevel;

  const handleStartSession = () => {
    startSession();
    navigate('/interview');
  };

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Setup Your Practice Session</h1>
          <p className="text-muted-foreground">Customize your interview practice experience</p>
        </div>

        <div className="space-y-6">
          <TechnologySelector 
            selectedTechnology={selectedTechnology} 
            onSelect={setSelectedTechnology} 
          />
          <RoleSelector 
            selectedRole={selectedRole} 
            onSelect={setSelectedRole} 
          />
          <LevelSelector 
            selectedLevel={selectedLevel} 
            onSelect={setSelectedLevel} 
          />
          <DomainSelector 
            selectedDomain={selectedDomain} 
            onSelect={setSelectedDomain} 
          />
          <CompanySelector 
            selectedCompany={selectedCompany} 
            onSelect={setSelectedCompany} 
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
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
