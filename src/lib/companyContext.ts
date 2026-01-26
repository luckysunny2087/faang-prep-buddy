// Rich company context for AI question generation

export interface CompanyContext {
  name: string;
  interviewStyle: string;
  cultureValues: string[];
  questionFocus: string[];
  tips: string;
}

// Detailed interview context for known companies
const companyContextMap: Record<string, CompanyContext> = {
  // Big Tech
  amazon: {
    name: 'Amazon',
    interviewStyle: 'Heavily behavioral with Leadership Principles focus. Expect "Tell me about a time" questions using STAR method.',
    cultureValues: ['Customer Obsession', 'Ownership', 'Invent and Simplify', 'Bias for Action', 'Earn Trust', 'Dive Deep', 'Have Backbone', 'Deliver Results'],
    questionFocus: ['Leadership Principles stories', 'Scalability and distributed systems', 'Data-driven decision making', 'Ownership and accountability'],
    tips: 'Prepare 2-3 stories for each Leadership Principle. Use metrics and specific outcomes.',
  },
  google: {
    name: 'Google',
    interviewStyle: 'Strong focus on algorithms, data structures, and system design. Values "Googleyness" - intellectual humility and collaboration.',
    cultureValues: ['Focus on the user', 'Intellectual humility', 'Collaborative problem-solving', 'Comfort with ambiguity'],
    questionFocus: ['Algorithm optimization', 'Large-scale system design', 'Code quality and testing', 'Cross-functional collaboration'],
    tips: 'Think out loud during coding. Discuss trade-offs extensively in system design.',
  },
  meta: {
    name: 'Meta',
    interviewStyle: 'Fast-paced coding rounds with emphasis on product sense. Values shipping fast and learning from metrics.',
    cultureValues: ['Move Fast', 'Be Bold', 'Focus on Impact', 'Be Open', 'Build Social Value'],
    questionFocus: ['Efficient coding under time pressure', 'Product thinking', 'Scaling for billions of users', 'A/B testing mindset'],
    tips: 'Practice coding speed. Be ready to discuss product decisions and their impact.',
  },
  apple: {
    name: 'Apple',
    interviewStyle: 'Team-specific interviews with deep technical dives. Strong emphasis on craftsmanship and attention to detail.',
    cultureValues: ['Excellence in craft', 'User privacy', 'Simplicity', 'Innovation', 'Attention to detail'],
    questionFocus: ['Deep technical expertise', 'Design sensibility', 'Privacy considerations', 'Quality over quantity'],
    tips: 'Know Apple products well. Demonstrate passion for quality and user experience.',
  },
  netflix: {
    name: 'Netflix',
    interviewStyle: 'Culture-heavy interviews focused on freedom and responsibility. Expects senior-level judgment from all candidates.',
    cultureValues: ['Judgment', 'Selflessness', 'Courage', 'Communication', 'Inclusion', 'Integrity', 'Passion', 'Innovation', 'Curiosity'],
    questionFocus: ['Independent decision-making', 'Giving and receiving feedback', 'Context over control', 'High performance expectations'],
    tips: 'Read the Netflix Culture Memo. Prepare examples of exercising judgment independently.',
  },
  microsoft: {
    name: 'Microsoft',
    interviewStyle: 'Growth mindset focused with collaborative problem-solving. Values learning from failure and cross-team collaboration.',
    cultureValues: ['Growth Mindset', 'Customer obsession', 'Diversity and inclusion', 'One Microsoft', 'Making a difference'],
    questionFocus: ['Learning from mistakes', 'Collaboration across teams', 'Customer impact', 'Technical breadth and depth'],
    tips: 'Show growth mindset - discuss what you learned from failures. Emphasize collaboration.',
  },
  
  // Consulting
  mckinsey: {
    name: 'McKinsey',
    interviewStyle: 'Rigorous case interviews testing structured problem-solving. Also evaluates personal experience and leadership.',
    cultureValues: ['Client impact', 'Analytical rigor', 'One firm', 'Obligation to dissent', 'Professional development'],
    questionFocus: ['Case structuring', 'Quantitative analysis', 'Synthesis and recommendation', 'Leadership presence'],
    tips: 'Practice case frameworks but adapt them. Lead the case proactively. Synthesize clearly.',
  },
  bcg: {
    name: 'BCG',
    interviewStyle: 'Case interviews with emphasis on creativity and insight. Values diverse thinking and intellectual curiosity.',
    cultureValues: ['Insight', 'Impact', 'Trust', 'Diversity', 'Social impact'],
    questionFocus: ['Creative problem-solving', 'Data interpretation', 'Client communication', 'Analytical thinking'],
    tips: 'Show unique insights beyond standard frameworks. Demonstrate intellectual curiosity.',
  },
  
  // Finance
  'goldman-sachs': {
    name: 'Goldman Sachs',
    interviewStyle: 'Technical coding with finance domain questions. Values commercial awareness and teamwork.',
    cultureValues: ['Client Service', 'Excellence', 'Integrity', 'Teamwork'],
    questionFocus: ['Algorithmic problem-solving', 'Financial markets knowledge', 'Risk assessment', 'Team collaboration'],
    tips: 'Know current market trends. Demonstrate understanding of financial products.',
  },
  jpmorgan: {
    name: 'JPMorgan Chase',
    interviewStyle: 'Technical interviews with behavioral components. Strong focus on risk awareness and regulatory understanding.',
    cultureValues: ['Integrity', 'Fairness', 'Responsibility', 'Excellence'],
    questionFocus: ['Coding proficiency', 'System design for finance', 'Risk management', 'Regulatory compliance'],
    tips: 'Understand banking regulations basics. Show awareness of security and compliance.',
  },
  
  // Indian IT
  tcs: {
    name: 'TCS',
    interviewStyle: 'Technical fundamentals focus with aptitude testing. Values adaptability and communication skills.',
    cultureValues: ['Customer focus', 'Integrity', 'Learning', 'Excellence', 'Teamwork'],
    questionFocus: ['Core programming concepts', 'Database fundamentals', 'Logical reasoning', 'Communication skills'],
    tips: 'Review CS fundamentals thoroughly. Practice aptitude questions.',
  },
  infosys: {
    name: 'Infosys',
    interviewStyle: 'Aptitude-based screening followed by technical interviews. Values logical reasoning and learning ability.',
    cultureValues: ['Learning', 'Integrity', 'Excellence', 'Respect', 'Fairness'],
    questionFocus: ['Programming basics', 'Problem-solving', 'Database queries', 'Communication'],
    tips: 'Strong aptitude preparation. Clear communication is valued highly.',
  },
};

export function getCompanyContext(companyId: string): CompanyContext | null {
  const normalized = companyId.toLowerCase().replace(/\s+/g, '-');
  return companyContextMap[normalized] || null;
}

export function buildCompanyPromptContext(companyId: string | null | undefined): string {
  if (!companyId) {
    return 'Generate professional interview questions suitable for top-tier technology companies.';
  }

  const context = getCompanyContext(companyId);
  
  if (context) {
    return `
Company: ${context.name}
Interview Style: ${context.interviewStyle}
Culture Values: ${context.cultureValues.join(', ')}
Question Focus Areas: ${context.questionFocus.join(', ')}
Interview Tips: ${context.tips}

Generate questions that align with ${context.name}'s specific interview style and culture.
For behavioral questions, structure them around their core values.
For technical questions, focus on their typical interview patterns.
`;
  }

  // For custom/unknown companies, provide general professional context
  return `
Company: ${companyId}
Generate professional interview questions tailored for this company.
Research typical interview patterns for companies in similar industries.
Focus on industry-relevant technical skills and professional behavioral competencies.
`;
}
