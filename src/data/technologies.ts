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

// Company categories for organized display
export type CompanyCategory = 'big-tech' | 'consulting' | 'finance' | 'indian-it' | 'enterprise' | 'retail' | 'automotive';

export interface CompanyInfo {
  id: Company;
  name: string;
  category: CompanyCategory;
  description: string;
  interviewFocus?: string;
}

// Featured companies organized by category
export const featuredCompanies: CompanyInfo[] = [
  // Big Tech (FAANG+)
  { id: 'amazon', name: 'Amazon', category: 'big-tech', description: 'E-commerce & cloud computing giant', interviewFocus: 'Leadership principles, behavioral questions' },
  { id: 'google', name: 'Google', category: 'big-tech', description: 'Search & technology leader', interviewFocus: 'Algorithms, system design, Googleyness' },
  { id: 'meta', name: 'Meta', category: 'big-tech', description: 'Social media & metaverse', interviewFocus: 'Product sense, scaling, coding' },
  { id: 'apple', name: 'Apple', category: 'big-tech', description: 'Consumer electronics & software', interviewFocus: 'Design thinking, quality, attention to detail' },
  { id: 'netflix', name: 'Netflix', category: 'big-tech', description: 'Streaming entertainment', interviewFocus: 'Culture fit, autonomy, impact' },
  { id: 'microsoft', name: 'Microsoft', category: 'big-tech', description: 'Software & cloud services', interviewFocus: 'Growth mindset, collaboration, technical depth' },
  { id: 'salesforce', name: 'Salesforce', category: 'big-tech', description: 'CRM & enterprise cloud', interviewFocus: 'Customer success, platform knowledge' },
  { id: 'oracle', name: 'Oracle', category: 'big-tech', description: 'Database & enterprise software', interviewFocus: 'Technical expertise, problem-solving' },
  { id: 'adobe', name: 'Adobe', category: 'big-tech', description: 'Creative & document software', interviewFocus: 'Creativity, user experience, technical skills' },
  { id: 'intel', name: 'Intel', category: 'big-tech', description: 'Semiconductor manufacturing', interviewFocus: 'Hardware/software integration, deep technical' },
  { id: 'cisco', name: 'Cisco', category: 'big-tech', description: 'Networking & communications', interviewFocus: 'Networking fundamentals, collaboration' },
  { id: 'ibm', name: 'IBM', category: 'big-tech', description: 'Enterprise technology & consulting', interviewFocus: 'Innovation, enterprise solutions' },
  
  // Consulting
  { id: 'accenture', name: 'Accenture', category: 'consulting', description: 'Global consulting & services', interviewFocus: 'Case studies, client management' },
  { id: 'deloitte', name: 'Deloitte', category: 'consulting', description: 'Professional services firm', interviewFocus: 'Case studies, behavioral, domain expertise' },
  { id: 'mckinsey', name: 'McKinsey', category: 'consulting', description: 'Management consulting', interviewFocus: 'Case interviews, problem structuring' },
  { id: 'bcg', name: 'BCG', category: 'consulting', description: 'Boston Consulting Group', interviewFocus: 'Case studies, analytical thinking' },
  { id: 'bain', name: 'Bain & Company', category: 'consulting', description: 'Strategy consulting', interviewFocus: 'Case interviews, experience interviews' },
  { id: 'pwc', name: 'PwC', category: 'consulting', description: 'Audit & assurance services', interviewFocus: 'Technical skills, case studies' },
  { id: 'ey', name: 'EY', category: 'consulting', description: 'Ernst & Young', interviewFocus: 'Behavioral, technical competency' },
  { id: 'kpmg', name: 'KPMG', category: 'consulting', description: 'Audit & tax services', interviewFocus: 'Case studies, industry knowledge' },
  { id: 'capgemini', name: 'Capgemini', category: 'consulting', description: 'Technology consulting', interviewFocus: 'Technical skills, project experience' },
  { id: 'cognizant', name: 'Cognizant', category: 'consulting', description: 'IT services & consulting', interviewFocus: 'Technical aptitude, communication' },
  
  // Finance
  { id: 'jpmorgan', name: 'JPMorgan Chase', category: 'finance', description: 'Global financial services', interviewFocus: 'Technical coding, finance domain' },
  { id: 'goldman-sachs', name: 'Goldman Sachs', category: 'finance', description: 'Investment banking', interviewFocus: 'Technical excellence, problem-solving' },
  { id: 'morgan-stanley', name: 'Morgan Stanley', category: 'finance', description: 'Financial services', interviewFocus: 'Quantitative skills, market knowledge' },
  { id: 'citi', name: 'Citigroup', category: 'finance', description: 'Banking & financial services', interviewFocus: 'Technical skills, global perspective' },
  { id: 'bofa', name: 'Bank of America', category: 'finance', description: 'Banking corporation', interviewFocus: 'Leadership, technical competency' },
  { id: 'wells-fargo', name: 'Wells Fargo', category: 'finance', description: 'Financial services', interviewFocus: 'Customer focus, risk management' },
  { id: 'hsbc', name: 'HSBC', category: 'finance', description: 'Global banking', interviewFocus: 'International experience, technical skills' },
  { id: 'barclays', name: 'Barclays', category: 'finance', description: 'Investment bank', interviewFocus: 'Technical aptitude, market awareness' },
  { id: 'visa', name: 'Visa', category: 'finance', description: 'Payment technology', interviewFocus: 'System design, scalability' },
  { id: 'mastercard', name: 'Mastercard', category: 'finance', description: 'Payment solutions', interviewFocus: 'Innovation, technical skills' },
  
  // Indian IT
  { id: 'tcs', name: 'TCS', category: 'indian-it', description: 'Tata Consultancy Services', interviewFocus: 'Technical fundamentals, aptitude' },
  { id: 'infosys', name: 'Infosys', category: 'indian-it', description: 'IT services & consulting', interviewFocus: 'Technical skills, logical reasoning' },
  { id: 'wipro', name: 'Wipro', category: 'indian-it', description: 'IT & business services', interviewFocus: 'Technical aptitude, communication' },
  { id: 'hcl', name: 'HCL Technologies', category: 'indian-it', description: 'IT services company', interviewFocus: 'Technical skills, project experience' },
  { id: 'tech-mahindra', name: 'Tech Mahindra', category: 'indian-it', description: 'IT services & solutions', interviewFocus: 'Domain knowledge, technical skills' },
  { id: 'ltimindtree', name: 'LTIMindtree', category: 'indian-it', description: 'Digital solutions company', interviewFocus: 'Technical aptitude, problem-solving' },
  
  // Enterprise Tech
  { id: 'sap', name: 'SAP', category: 'enterprise', description: 'Enterprise software', interviewFocus: 'ERP knowledge, technical depth' },
  { id: 'servicenow', name: 'ServiceNow', category: 'enterprise', description: 'Cloud computing company', interviewFocus: 'Platform expertise, problem-solving' },
  { id: 'workday', name: 'Workday', category: 'enterprise', description: 'HR & finance software', interviewFocus: 'Product knowledge, technical skills' },
  { id: 'vmware', name: 'VMware', category: 'enterprise', description: 'Virtualization software', interviewFocus: 'Infrastructure knowledge, technical depth' },
  { id: 'splunk', name: 'Splunk', category: 'enterprise', description: 'Data platform', interviewFocus: 'Data skills, technical problem-solving' },
  { id: 'snowflake', name: 'Snowflake', category: 'enterprise', description: 'Cloud data platform', interviewFocus: 'Data engineering, system design' },
  { id: 'databricks', name: 'Databricks', category: 'enterprise', description: 'Data & AI company', interviewFocus: 'Big data, machine learning' },
  { id: 'palantir', name: 'Palantir', category: 'enterprise', description: 'Data analytics', interviewFocus: 'Problem-solving, coding, system design' },
  
  // Retail & E-commerce
  { id: 'walmart', name: 'Walmart', category: 'retail', description: 'Retail corporation', interviewFocus: 'Scale, logistics, customer focus' },
  { id: 'target', name: 'Target', category: 'retail', description: 'Retail chain', interviewFocus: 'Customer experience, technical skills' },
  { id: 'shopify', name: 'Shopify', category: 'retail', description: 'E-commerce platform', interviewFocus: 'Entrepreneurial mindset, coding' },
  { id: 'ebay', name: 'eBay', category: 'retail', description: 'Online marketplace', interviewFocus: 'Marketplace dynamics, technical' },
  { id: 'uber', name: 'Uber', category: 'retail', description: 'Ride-sharing & delivery', interviewFocus: 'System design, real-time systems' },
  { id: 'airbnb', name: 'Airbnb', category: 'retail', description: 'Vacation rentals platform', interviewFocus: 'Product sense, coding, culture' },
  { id: 'doordash', name: 'DoorDash', category: 'retail', description: 'Food delivery platform', interviewFocus: 'Logistics, real-time systems' },
  { id: 'instacart', name: 'Instacart', category: 'retail', description: 'Grocery delivery', interviewFocus: 'Operations, technical skills' },
  
  // Automotive & Industrial
  { id: 'tesla', name: 'Tesla', category: 'automotive', description: 'Electric vehicles & energy', interviewFocus: 'Innovation, first principles, technical' },
  { id: 'toyota', name: 'Toyota', category: 'automotive', description: 'Automotive manufacturer', interviewFocus: 'Lean methodology, quality focus' },
  { id: 'ford', name: 'Ford', category: 'automotive', description: 'Automotive company', interviewFocus: 'Innovation, manufacturing knowledge' },
  { id: 'gm', name: 'General Motors', category: 'automotive', description: 'Automotive manufacturer', interviewFocus: 'Technical skills, industry knowledge' },
  { id: 'bosch', name: 'Bosch', category: 'automotive', description: 'Engineering & technology', interviewFocus: 'Engineering fundamentals, innovation' },
  { id: 'siemens', name: 'Siemens', category: 'automotive', description: 'Industrial technology', interviewFocus: 'Domain expertise, technical depth' },
];

// Legacy companies array for backward compatibility
export const companies: { id: Company; name: string; color: string; description: string }[] = [
  { id: 'amazon', name: 'Amazon', color: 'amazon', description: 'Leadership principles focused' },
  { id: 'google', name: 'Google', color: 'google-blue', description: 'Algorithm and design focused' },
  { id: 'meta', name: 'Meta', color: 'meta', description: 'Product and scaling focused' },
  { id: 'apple', name: 'Apple', color: 'apple', description: 'Design and quality focused' },
  { id: 'netflix', name: 'Netflix', color: 'netflix', description: 'Culture and autonomy focused' },
  { id: 'microsoft', name: 'Microsoft', color: 'microsoft', description: 'Growth mindset focused' },
];

// Company category labels
export const companyCategoryLabels: Record<CompanyCategory, string> = {
  'big-tech': 'Big Tech',
  'consulting': 'Consulting',
  'finance': 'Finance & Banking',
  'indian-it': 'Indian IT',
  'enterprise': 'Enterprise Tech',
  'retail': 'Retail & E-commerce',
  'automotive': 'Automotive & Industrial',
};

// Get company info by ID
export function getCompanyInfo(companyId: string): CompanyInfo | undefined {
  return featuredCompanies.find(c => c.id === companyId);
}

// Search companies by name
export function searchCompanies(query: string): CompanyInfo[] {
  const lowerQuery = query.toLowerCase();
  return featuredCompanies.filter(c => 
    c.name.toLowerCase().includes(lowerQuery) ||
    c.description.toLowerCase().includes(lowerQuery)
  );
}

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
