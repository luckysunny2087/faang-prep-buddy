import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  TechnologyCategory, 
  Role, 
  ExperienceLevel, 
  QuestionType, 
  Company,
  InterviewSession,
  InterviewQuestion,
  InterviewAnswer 
} from '@/types/interview';

interface InterviewContextType {
  // Setup state
  selectedTechnology: TechnologyCategory | null;
  selectedRole: Role | null;
  selectedLevel: ExperienceLevel | null;
  selectedCompany: Company | null;
  selectedQuestionTypes: QuestionType[];
  
  // Session state
  currentSession: InterviewSession | null;
  currentQuestionIndex: number;
  isLoading: boolean;
  
  // Actions
  setSelectedTechnology: (tech: TechnologyCategory | null) => void;
  setSelectedRole: (role: Role | null) => void;
  setSelectedLevel: (level: ExperienceLevel | null) => void;
  setSelectedCompany: (company: Company | null) => void;
  setSelectedQuestionTypes: (types: QuestionType[]) => void;
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
  const [selectedTechnology, setSelectedTechnology] = useState<TechnologyCategory | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<QuestionType[]>([]);
  
  // Session state
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const startSession = useCallback(() => {
    if (!selectedTechnology || !selectedRole || !selectedLevel) return;
    
    const session: InterviewSession = {
      id: crypto.randomUUID(),
      technology: selectedTechnology,
      role: selectedRole,
      level: selectedLevel,
      company: selectedCompany || undefined,
      questionTypes: selectedQuestionTypes.length > 0 ? selectedQuestionTypes : ['technical', 'behavioral', 'system-design', 'domain-knowledge'],
      questions: [],
      answers: [],
      createdAt: new Date(),
    };
    
    setCurrentSession(session);
    setCurrentQuestionIndex(0);
  }, [selectedTechnology, selectedRole, selectedLevel, selectedCompany, selectedQuestionTypes]);

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
    setSelectedTechnology(null);
    setSelectedRole(null);
    setSelectedLevel(null);
    setSelectedCompany(null);
    setSelectedQuestionTypes([]);
    setCurrentSession(null);
    setCurrentQuestionIndex(0);
  }, []);

  return (
    <InterviewContext.Provider
      value={{
        selectedTechnology,
        selectedRole,
        selectedLevel,
        selectedCompany,
        selectedQuestionTypes,
        currentSession,
        currentQuestionIndex,
        isLoading,
        setSelectedTechnology,
        setSelectedRole,
        setSelectedLevel,
        setSelectedCompany,
        setSelectedQuestionTypes,
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
