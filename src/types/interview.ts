export type TechnologyCategory = 'microsoft' | 'aws' | 'gcp' | 'programming' | 'devops' | 'data-ai';

export type Role = 
  | 'software-engineer'
  | 'devops-engineer'
  | 'project-manager'
  | 'data-scientist'
  | 'qa-analyst'
  | 'business-analyst';

export type Domain = 
  | 'finance-fintech'
  | 'technology-it'
  | 'pharma-healthcare'
  | 'retail-ecommerce'
  | 'supply-chain-logistics'
  | 'automotive'
  | 'telecommunications'
  | 'government-public-sector';

export type ExperienceLevel = 'l1' | 'l2' | 'l3' | 'l4' | 'l5';

export type QuestionType = 
  | 'technical'
  | 'behavioral'
  | 'system-design'
  | 'domain-knowledge';

// Company is now a flexible string to support any company globally
export type Company = string;

export interface Technology {
  id: string;
  name: string;
  category: TechnologyCategory;
  icon: string;
  description: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  type: QuestionType;
  difficulty: ExperienceLevel;
  technology?: string;
  company?: Company;
  hints?: string[];
}

export interface InterviewAnswer {
  questionId: string;
  answer: string;
  feedback?: string;
  score?: number;
  strengths?: string[];
  improvements?: string[];
}

export interface InterviewSession {
  id: string;
  userId?: string;
  technologies: TechnologyCategory[];
  role: Role;
  level: ExperienceLevel;
  company?: Company;
  questionTypes: QuestionType[];
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  overallScore?: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  preferredRole?: Role;
  preferredLevel?: ExperienceLevel;
  preferredTechnologies?: TechnologyCategory[];
  totalSessions: number;
  averageScore: number;
  streakDays: number;
  achievements: string[];
  createdAt: Date;
}

export interface PerformanceMetrics {
  totalQuestions: number;
  questionsAnswered: number;
  averageScore: number;
  scoreByType: Record<QuestionType, number>;
  scoreByCompany: Record<Company, number>;
  strongAreas: string[];
  weakAreas: string[];
  readinessLevel: 'beginner' | 'developing' | 'ready' | 'expert';
}

export interface StudyPlan {
  id: string;
  userId: string;
  targetDate: Date;
  targetCompany?: Company;
  dailyGoal: number;
  weeklyTopics: string[];
  completedTopics: string[];
  createdAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  target: number;
}
