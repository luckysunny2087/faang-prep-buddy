import { Technology, Role, Company, QuestionType, Domain } from '@/types/interview';

export const domains: { id: Domain; name: string; description: string; icon: string }[] = [
  { id: 'finance-fintech', name: 'Finance / Fintech', description: 'Banking, payments, trading, insurance', icon: 'Landmark' },
  { id: 'technology-it', name: 'Technology / IT', description: 'Software, SaaS, tech consulting', icon: 'Monitor' },
  { id: 'pharma-healthcare', name: 'Pharma / Healthcare', description: 'Pharmaceuticals, medical devices, health systems', icon: 'Heart' },
  { id: 'retail-ecommerce', name: 'Retail & E-Commerce', description: 'Online shopping, retail operations', icon: 'ShoppingCart' },
  { id: 'supply-chain-logistics', name: 'Supply Chain & Logistics', description: 'Shipping, warehousing, distribution', icon: 'Truck' },
  { id: 'automotive', name: 'Automotive', description: 'Vehicle manufacturing, mobility solutions', icon: 'Car' },
  { id: 'telecommunications', name: 'Telecommunications', description: 'Networks, mobile, communications', icon: 'Radio' },
  { id: 'government-public-sector', name: 'Government / Public Sector', description: 'Government agencies, public services', icon: 'Building2' },
];

export const technologies: Technology[] = [
  // Microsoft Technologies
  { id: 'azure', name: 'Microsoft Azure', category: 'microsoft', icon: 'Cloud', description: 'Cloud computing platform and services' },
  { id: 'dotnet', name: '.NET / C#', category: 'microsoft', icon: 'Code', description: 'Application development framework' },
  { id: 'power-platform', name: 'Power Platform', category: 'microsoft', icon: 'Zap', description: 'Low-code/no-code business solutions' },
  { id: 'dynamics-365', name: 'Dynamics 365', category: 'microsoft', icon: 'Building', description: 'Business applications suite' },
  { id: 'teams', name: 'Microsoft Teams', category: 'microsoft', icon: 'Users', description: 'Collaboration platform' },
  { id: 'sql-server', name: 'SQL Server', category: 'microsoft', icon: 'Database', description: 'Relational database management' },
  { id: 'azure-devops', name: 'Azure DevOps', category: 'microsoft', icon: 'GitBranch', description: 'CI/CD and project management' },
  { id: 'typescript', name: 'TypeScript', category: 'microsoft', icon: 'FileCode', description: 'Typed JavaScript superset' },
  
  // AWS Technologies
  { id: 'ec2', name: 'Amazon EC2', category: 'aws', icon: 'Server', description: 'Virtual servers in the cloud' },
  { id: 'lambda', name: 'AWS Lambda', category: 'aws', icon: 'Zap', description: 'Serverless compute service' },
  { id: 's3', name: 'Amazon S3', category: 'aws', icon: 'HardDrive', description: 'Object storage service' },
  { id: 'dynamodb', name: 'DynamoDB', category: 'aws', icon: 'Database', description: 'NoSQL database service' },
  { id: 'rds', name: 'Amazon RDS', category: 'aws', icon: 'Database', description: 'Managed relational database' },
  { id: 'eks', name: 'Amazon EKS', category: 'aws', icon: 'Box', description: 'Managed Kubernetes service' },
  { id: 'cloudfront', name: 'CloudFront', category: 'aws', icon: 'Globe', description: 'Content delivery network' },
  { id: 'sagemaker', name: 'SageMaker', category: 'aws', icon: 'Brain', description: 'Machine learning platform' },

  // Google Cloud Platform
  { id: 'gce', name: 'Compute Engine', category: 'gcp', icon: 'Server', description: 'Virtual machines on Google Cloud' },
  { id: 'gke', name: 'Google Kubernetes Engine', category: 'gcp', icon: 'Box', description: 'Managed Kubernetes service' },
  { id: 'bigquery', name: 'BigQuery', category: 'gcp', icon: 'Database', description: 'Serverless data warehouse' },
  { id: 'cloud-functions', name: 'Cloud Functions', category: 'gcp', icon: 'Zap', description: 'Serverless compute service' },
  { id: 'cloud-storage', name: 'Cloud Storage', category: 'gcp', icon: 'HardDrive', description: 'Object storage service' },
  { id: 'firebase', name: 'Firebase', category: 'gcp', icon: 'Flame', description: 'App development platform' },
  { id: 'vertex-ai', name: 'Vertex AI', category: 'gcp', icon: 'Brain', description: 'Machine learning platform' },
  { id: 'cloud-run', name: 'Cloud Run', category: 'gcp', icon: 'Play', description: 'Serverless containers' },

  // General Programming Languages
  { id: 'python', name: 'Python', category: 'programming', icon: 'Code', description: 'General-purpose programming language' },
  { id: 'java', name: 'Java', category: 'programming', icon: 'Coffee', description: 'Object-oriented programming language' },
  { id: 'javascript', name: 'JavaScript', category: 'programming', icon: 'FileCode', description: 'Web development language' },
  { id: 'go', name: 'Go', category: 'programming', icon: 'Code', description: 'Systems programming language' },
  { id: 'rust', name: 'Rust', category: 'programming', icon: 'Shield', description: 'Memory-safe systems language' },
  { id: 'react', name: 'React', category: 'programming', icon: 'Atom', description: 'JavaScript UI library' },
  { id: 'nodejs', name: 'Node.js', category: 'programming', icon: 'Server', description: 'JavaScript runtime' },
  { id: 'sql', name: 'SQL', category: 'programming', icon: 'Database', description: 'Database query language' },

  // DevOps & Infrastructure
  { id: 'kubernetes', name: 'Kubernetes', category: 'devops', icon: 'Box', description: 'Container orchestration platform' },
  { id: 'docker', name: 'Docker', category: 'devops', icon: 'Container', description: 'Container platform' },
  { id: 'terraform', name: 'Terraform', category: 'devops', icon: 'Layers', description: 'Infrastructure as Code' },
  { id: 'jenkins', name: 'Jenkins', category: 'devops', icon: 'GitBranch', description: 'CI/CD automation server' },
  { id: 'github-actions', name: 'GitHub Actions', category: 'devops', icon: 'GitBranch', description: 'CI/CD workflows' },
  { id: 'ansible', name: 'Ansible', category: 'devops', icon: 'Settings', description: 'Configuration management' },
  { id: 'prometheus', name: 'Prometheus', category: 'devops', icon: 'Activity', description: 'Monitoring and alerting' },
  { id: 'linux', name: 'Linux', category: 'devops', icon: 'Terminal', description: 'Operating system' },

  // Data & AI
  { id: 'tensorflow', name: 'TensorFlow', category: 'data-ai', icon: 'Brain', description: 'Machine learning framework' },
  { id: 'pytorch', name: 'PyTorch', category: 'data-ai', icon: 'Brain', description: 'Deep learning framework' },
  { id: 'spark', name: 'Apache Spark', category: 'data-ai', icon: 'Zap', description: 'Big data processing' },
  { id: 'pandas', name: 'Pandas', category: 'data-ai', icon: 'Table', description: 'Data analysis library' },
  { id: 'llm', name: 'LLMs & GPT', category: 'data-ai', icon: 'MessageSquare', description: 'Large language models' },
  { id: 'mlops', name: 'MLOps', category: 'data-ai', icon: 'GitBranch', description: 'ML operations and pipelines' },
  { id: 'data-engineering', name: 'Data Engineering', category: 'data-ai', icon: 'Database', description: 'Data pipelines and ETL' },
  { id: 'power-bi', name: 'Power BI', category: 'data-ai', icon: 'BarChart', description: 'Business intelligence tool' },
];

export const roles: { id: Role; name: string; description: string; icon: string }[] = [
  { id: 'software-engineer', name: 'Software Engineer', description: 'Frontend, Backend, or Full Stack development', icon: 'Code' },
  { id: 'devops-engineer', name: 'DevOps/Cloud Engineer', description: 'Infrastructure, CI/CD, and cloud architecture', icon: 'Server' },
  { id: 'project-manager', name: 'Project Manager', description: 'Scrum Master, Agile Coach, PM roles', icon: 'Users' },
  { id: 'data-scientist', name: 'Data Scientist', description: 'ML Engineer, Data Analyst roles', icon: 'BarChart' },
  { id: 'qa-analyst', name: 'QA/Analyst', description: 'Manual Testing, Automation, Quality Assurance', icon: 'ClipboardCheck' },
  { id: 'business-analyst', name: 'Business Analyst', description: 'Requirements gathering, process analysis, stakeholder management', icon: 'Briefcase' },
];

export const experienceLevels: { id: string; name: string; years: string; description: string; level: string }[] = [
  { id: 'l1', name: 'L1', years: '0-2 years', description: 'Entry level, learning fundamentals', level: '1' },
  { id: 'l2', name: 'L2', years: '2-5 years', description: 'Growing expertise, independent contributor', level: '2' },
  { id: 'l3', name: 'L3', years: '5-7 years', description: 'Solid experience, mentoring others', level: '3' },
  { id: 'l4', name: 'L4', years: '7-10 years', description: 'Technical leadership, architecture decisions', level: '4' },
  { id: 'l5', name: 'L5', years: '10+ years', description: 'Principal/Staff level, strategic impact', level: '5' },
];

export const companies: { id: Company; name: string; color: string; description: string }[] = [
  { id: 'amazon', name: 'Amazon', color: 'amazon', description: 'Leadership principles focused' },
  { id: 'google', name: 'Google', color: 'google-blue', description: 'Algorithm and design focused' },
  { id: 'meta', name: 'Meta', color: 'meta', description: 'Product and scaling focused' },
  { id: 'apple', name: 'Apple', color: 'apple', description: 'Design and quality focused' },
  { id: 'netflix', name: 'Netflix', color: 'netflix', description: 'Culture and autonomy focused' },
  { id: 'microsoft', name: 'Microsoft', color: 'microsoft', description: 'Growth mindset focused' },
];

export const questionTypes: { id: QuestionType; name: string; description: string; icon: string }[] = [
  { id: 'technical', name: 'Technical/Coding', description: 'Data structures, algorithms, coding problems', icon: 'Code' },
  { id: 'behavioral', name: 'Behavioral', description: 'STAR method, past experiences, soft skills', icon: 'MessageSquare' },
  { id: 'system-design', name: 'System Design', description: 'Architecture, scalability, trade-offs', icon: 'Network' },
  { id: 'domain-knowledge', name: 'Domain Knowledge', description: 'Technology-specific expertise', icon: 'BookOpen' },
];

export const achievements = [
  { id: 'first-session', name: 'First Steps', description: 'Complete your first interview session', icon: '🎯', target: 1 },
  { id: 'ten-sessions', name: 'Dedicated Learner', description: 'Complete 10 interview sessions', icon: '📚', target: 10 },
  { id: 'perfect-score', name: 'Perfect Answer', description: 'Get a perfect score on a question', icon: '⭐', target: 1 },
  { id: 'all-types', name: 'Well-Rounded', description: 'Answer all question types', icon: '🌟', target: 4 },
  { id: 'week-streak', name: 'Consistent', description: 'Practice for 7 days in a row', icon: '🔥', target: 7 },
  { id: 'company-master', name: 'Company Expert', description: 'Complete all company-specific tracks', icon: '🏆', target: 6 },
];
