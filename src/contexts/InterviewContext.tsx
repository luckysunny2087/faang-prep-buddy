import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  TechnologyCategory, 
  Role, 
  ExperienceLevel, 
  QuestionType, 
  Company,
  CompanyDetails,
  Domain,
  InterviewSession,
  InterviewQuestion,
  InterviewAnswer 
} from '@/types/interview';

interface ResumeAnalysis {
  gaps: string[];
  suggestions: string[];
  matchScore: number;
  keySkillsFound: string[];
  missingSkills: string[];
}

interface InterviewContextType {
  // Setup state
  selectedTechnologies: TechnologyCategory[];
  selectedRole: Role | null;
  selectedLevel: ExperienceLevel | null;
  selectedCompany: Company | null;
  selectedCompanyDetails: CompanyDetails | null;
  selectedDomain: Domain | null;
  selectedQuestionTypes: QuestionType[];
  selectedTimerDuration: number | null;
  
  // Resume & JD state
  resumeText: string;
  jobDescription: string;
  resumeAnalysis: ResumeAnalysis | null;
  
  // Session state
  currentSession: InterviewSession | null;
  currentQuestionIndex: number;
  isLoading: boolean;
  
  // Actions
  setSelectedTechnologies: (techs: TechnologyCategory[]) => void;
  toggleTechnology: (tech: TechnologyCategory) => void;
  setSelectedRole: (role: Role | null) => void;
  setSelectedLevel: (level: ExperienceLevel | null) => void;
  setSelectedCompany: (company: Company | null, details?: CompanyDetails | null) => void;
  setSelectedDomain: (domain: Domain | null) => void;
  setSelectedQuestionTypes: (types: QuestionType[]) => void;
  setSelectedTimerDuration: (duration: number | null) => void;
  setResumeText: (text: string) => void;
  setJobDescription: (text: string) => void;
  setResumeAnalysis: (analysis: ResumeAnalysis | null) => void;
  startSession: () => void;
  setCurrentSession: (session: InterviewSession | null) => void;
  addQuestion: (question: InterviewQuestion) => void;
  addAnswer: (answer: InterviewAnswer) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  endSession: () => void;
  resetSetup: () => void;
  setIsLoading: (loading: boolean) => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export function InterviewProvider({ children }: { children: ReactNode }) {
  // Setup state
  const [selectedTechnologies, setSelectedTechnologies] = useState<TechnologyCategory[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | null>(null);
  const [selectedCompany, setSelectedCompanyState] = useState<Company | null>(null);
  const [selectedCompanyDetails, setSelectedCompanyDetails] = useState<CompanyDetails | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<QuestionType[]>([]);
  const [selectedTimerDuration, setSelectedTimerDuration] = useState<number | null>(null);
  
  // Wrapper to set both company and details
  const setSelectedCompany = useCallback((company: Company | null, details?: CompanyDetails | null) => {
    setSelectedCompanyState(company);
    setSelectedCompanyDetails(details ?? null);
  }, []);
  
  // Resume & JD state
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);

  const toggleTechnology = useCallback((tech: TechnologyCategory) => {
    setSelectedTechnologies(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  }, []);
  
  // Session state
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const startSession = useCallback(() => {
    if (!selectedRole || !selectedLevel) return;
    
    const session: InterviewSession = {
      id: crypto.randomUUID(),
      technologies: selectedTechnologies,
      role: selectedRole,
      level: selectedLevel,
      company: selectedCompany || undefined,
      companyDetails: selectedCompanyDetails || undefined,
      timerDuration: selectedTimerDuration || undefined,
      questionTypes: selectedQuestionTypes.length > 0 ? selectedQuestionTypes : ['technical', 'behavioral', 'system-design', 'domain-knowledge'],
      questions: [],
      answers: [],
      createdAt: new Date(),
      // Include resume and JD context
      resumeText: resumeText || undefined,
      jobDescription: jobDescription || undefined,
    };
    
    setCurrentSession(session);
    setCurrentQuestionIndex(0);
  }, [selectedTechnologies, selectedRole, selectedLevel, selectedCompany, selectedCompanyDetails, selectedTimerDuration, selectedQuestionTypes, resumeText, jobDescription]);

  const addQuestion = useCallback((question: InterviewQuestion) => {
    setCurrentSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        questions: [...prev.questions, question],
      };
    });
  }, []);

  const addAnswer = useCallback((answer: InterviewAnswer) => {
    setCurrentSession(prev => {
      if (!prev) return prev;
      const existingIndex = prev.answers.findIndex(a => a.questionId === answer.questionId);
      const newAnswers = existingIndex >= 0 
        ? prev.answers.map((a, i) => i === existingIndex ? answer : a)
        : [...prev.answers, answer];
      return {
        ...prev,
        answers: newAnswers,
      };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex(prev => prev + 1);
  }, []);

  const previousQuestion = useCallback(() => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  }, []);

  const endSession = useCallback(() => {
    setCurrentSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        completedAt: new Date(),
      };
    });
  }, []);

  const resetSetup = useCallback(() => {
    setSelectedTechnologies([]);
    setSelectedRole(null);
    setSelectedLevel(null);
    setSelectedCompany(null);
    setSelectedDomain(null);
    setSelectedQuestionTypes([]);
    setSelectedTimerDuration(null);
    setResumeText('');
    setJobDescription('');
    setResumeAnalysis(null);
    setCurrentSession(null);
    setCurrentQuestionIndex(0);
  }, [setSelectedCompany]);

  return (
    <InterviewContext.Provider
      value={{
        selectedTechnologies,
        selectedRole,
        selectedLevel,
        selectedCompany,
        selectedCompanyDetails,
        selectedDomain,
        selectedQuestionTypes,
        selectedTimerDuration,
        resumeText,
        jobDescription,
        resumeAnalysis,
        currentSession,
        currentQuestionIndex,
        isLoading,
        setSelectedTechnologies,
        toggleTechnology,
        setSelectedRole,
        setSelectedLevel,
        setSelectedCompany,
        setSelectedDomain,
        setSelectedQuestionTypes,
        setSelectedTimerDuration,
        setResumeText,
        setJobDescription,
        setResumeAnalysis,
        startSession,
        setCurrentSession,
        addQuestion,
        addAnswer,
        nextQuestion,
        previousQuestion,
        endSession,
        resetSetup,
        setIsLoading,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
}
