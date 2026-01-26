import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const MODELS = [
  "google/gemini-3-flash-preview",
  "google/gemini-2.5-flash",
  "openai/gpt-5-nano",
];

// Rich company context for better question generation
const companyContextMap: Record<string, { interviewStyle: string; cultureValues: string[]; questionFocus: string[] }> = {
  amazon: {
    interviewStyle: 'Heavily behavioral with Leadership Principles focus. Expect "Tell me about a time" questions using STAR method.',
    cultureValues: ['Customer Obsession', 'Ownership', 'Invent and Simplify', 'Bias for Action', 'Earn Trust', 'Dive Deep', 'Have Backbone', 'Deliver Results'],
    questionFocus: ['Leadership Principles stories', 'Scalability and distributed systems', 'Data-driven decision making', 'Ownership and accountability'],
  },
  google: {
    interviewStyle: 'Strong focus on algorithms, data structures, and system design. Values "Googleyness" - intellectual humility and collaboration.',
    cultureValues: ['Focus on the user', 'Intellectual humility', 'Collaborative problem-solving', 'Comfort with ambiguity'],
    questionFocus: ['Algorithm optimization', 'Large-scale system design', 'Code quality and testing', 'Cross-functional collaboration'],
  },
  meta: {
    interviewStyle: 'Fast-paced coding rounds with emphasis on product sense. Values shipping fast and learning from metrics.',
    cultureValues: ['Move Fast', 'Be Bold', 'Focus on Impact', 'Be Open', 'Build Social Value'],
    questionFocus: ['Efficient coding under time pressure', 'Product thinking', 'Scaling for billions of users', 'A/B testing mindset'],
  },
  apple: {
    interviewStyle: 'Team-specific interviews with deep technical dives. Strong emphasis on craftsmanship and attention to detail.',
    cultureValues: ['Excellence in craft', 'User privacy', 'Simplicity', 'Innovation', 'Attention to detail'],
    questionFocus: ['Deep technical expertise', 'Design sensibility', 'Privacy considerations', 'Quality over quantity'],
  },
  netflix: {
    interviewStyle: 'Culture-heavy interviews focused on freedom and responsibility. Expects senior-level judgment from all candidates.',
    cultureValues: ['Judgment', 'Selflessness', 'Courage', 'Communication', 'Inclusion', 'Integrity', 'Passion', 'Innovation', 'Curiosity'],
    questionFocus: ['Independent decision-making', 'Giving and receiving feedback', 'Context over control', 'High performance expectations'],
  },
  microsoft: {
    interviewStyle: 'Growth mindset focused with collaborative problem-solving. Values learning from failure and cross-team collaboration.',
    cultureValues: ['Growth Mindset', 'Customer obsession', 'Diversity and inclusion', 'One Microsoft', 'Making a difference'],
    questionFocus: ['Learning from mistakes', 'Collaboration across teams', 'Customer impact', 'Technical breadth and depth'],
  },
  mckinsey: {
    interviewStyle: 'Rigorous case interviews testing structured problem-solving. Also evaluates personal experience and leadership.',
    cultureValues: ['Client impact', 'Analytical rigor', 'Obligation to dissent', 'Professional development'],
    questionFocus: ['Case structuring', 'Quantitative analysis', 'Synthesis and recommendation', 'Leadership presence'],
  },
  'goldman-sachs': {
    interviewStyle: 'Technical coding with finance domain questions. Values commercial awareness and teamwork.',
    cultureValues: ['Client Service', 'Excellence', 'Integrity', 'Teamwork'],
    questionFocus: ['Algorithmic problem-solving', 'Financial markets knowledge', 'Risk assessment', 'Team collaboration'],
  },
  jpmorgan: {
    interviewStyle: 'Technical interviews with behavioral components. Strong focus on risk awareness and regulatory understanding.',
    cultureValues: ['Integrity', 'Fairness', 'Responsibility', 'Excellence'],
    questionFocus: ['Coding proficiency', 'System design for finance', 'Risk management', 'Regulatory compliance'],
  },
  tcs: {
    interviewStyle: 'Technical fundamentals focus with aptitude testing. Values adaptability and communication skills.',
    cultureValues: ['Customer focus', 'Integrity', 'Learning', 'Excellence', 'Teamwork'],
    questionFocus: ['Core programming concepts', 'Database fundamentals', 'Logical reasoning', 'Communication skills'],
  },
  infosys: {
    interviewStyle: 'Aptitude-based screening followed by technical interviews. Values logical reasoning and learning ability.',
    cultureValues: ['Learning', 'Integrity', 'Excellence', 'Respect', 'Fairness'],
    questionFocus: ['Programming basics', 'Problem-solving', 'Database queries', 'Communication'],
  },
};

function getCompanyContext(company: string | null | undefined, companyDetails?: { description?: string; interviewFocus?: string; category?: string }): string {
  if (!company) return '';
  
  const normalized = company.toLowerCase().replace(/\s+/g, '-');
  const staticContext = companyContextMap[normalized];
  
  // If we have static company context, use it
  if (staticContext) {
    return `
COMPANY CONTEXT for ${company}:
- Interview Style: ${staticContext.interviewStyle}
- Culture Values: ${staticContext.cultureValues.join(', ')}
- Question Focus Areas: ${staticContext.questionFocus.join(', ')}

Generate questions that SPECIFICALLY align with ${company}'s interview style and culture.
For behavioral questions, structure them around their core values.
For technical questions, focus on their typical interview patterns.
`;
  }
  
  // Use database-provided company details if available
  if (companyDetails && (companyDetails.description || companyDetails.interviewFocus)) {
    let context = `\nCOMPANY CONTEXT for ${company}:\n`;
    
    if (companyDetails.category) {
      context += `- Industry: ${companyDetails.category}\n`;
    }
    if (companyDetails.description) {
      context += `- Company Description: ${companyDetails.description}\n`;
    }
    if (companyDetails.interviewFocus) {
      context += `- Interview Focus Areas: ${companyDetails.interviewFocus}\n`;
    }
    
    context += `\nGenerate interview questions that are specifically tailored to ${company}'s industry, business focus, and the interview topics they emphasize.\n`;
    return context;
  }
  
  // For custom/unknown companies without details
  return `
Generate professional interview questions tailored for ${company}.
Focus on industry-relevant technical skills and professional behavioral competencies.
`;
}

async function callAIWithValidation(systemPrompt: string, userPrompt: string, maxRetries = 2): Promise<any> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

  if (!LOVABLE_API_KEY) {
    console.error("LOVABLE_API_KEY not found");
    throw new Error("AI service is not configured");
  }

  let lastError: Error | null = null;

  for (const model of MODELS) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`Calling AI with model ${model}, attempt ${attempt + 1}`);

        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 2000,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`AI gateway error (${model}): ${response.status} ${errorText}`);
          if (response.status === 429) {
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          throw new Error(`AI Gateway status ${response.status}`);
        }

        const rawText = await response.text();
        console.log(`Raw AI response from ${model}:`, rawText.substring(0, 200));

        let content = "";
        try {
          const data = JSON.parse(rawText);
          content = data.choices?.[0]?.message?.content || "";
        } catch (e: any) {
          console.error(`Failed to parse AI response as JSON from ${model}:`, e.message);
          throw new Error(`Invalid JSON response from ${model}`);
        }

        if (!content) {
          throw new Error(`Empty content from ${model}`);
        }

        // Clean markdown and find JSON block
        let cleanedContent = content.replace(/```json\s?/, "").replace(/```\s?$/, "").trim();

        const firstBrace = cleanedContent.indexOf('{');
        const lastBrace = cleanedContent.lastIndexOf('}');

        if (firstBrace === -1 || lastBrace === -1) {
          console.error(`No JSON block found in content from ${model}:`, content.substring(0, 100));
          throw new Error("No JSON object found in AI response");
        }

        const jsonString = cleanedContent.substring(firstBrace, lastBrace + 1);

        try {
          const sanitizedJson = jsonString
            .replace(/,\s*([}\]])/g, '$1')
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
            .replace(/[\u201C\u201D]/g, '"')
            .replace(/(?<=: \".*)\n(?=.*\"[,}])/, " ");

          return JSON.parse(sanitizedJson);
        } catch (e) {
          console.warn(`Initial JSON parse failed for ${model}, trying aggressive cleaning...`);
          const superCleaned = jsonString
            .replace(/\\n/g, " ")
            .replace(/\n/g, " ")
            .replace(/\r/g, " ")
            .trim();
          return JSON.parse(superCleaned);
        }

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`Attempt failed with ${model}:`, lastError.message);

        if (lastError.message.includes("JSON") || lastError.message.includes("object found") || lastError.message.includes("content")) {
          continue;
        }
      }
    }
  }

  throw lastError || new Error("All models failed to return valid JSON");
}

// Level descriptions for better question calibration
const levelDescriptions: Record<string, string> = {
  l1: "Entry-level (0-2 years): Focus on fundamentals, basic problem-solving, and learning ability",
  l2: "Mid-level (2-5 years): Expects solid technical skills, some project experience, independent contributor",
  l3: "Senior (5-7 years): Deep expertise, mentoring ability, architectural thinking",
  l4: "Staff/Lead (7-10 years): Technical leadership, cross-team impact, strategic decisions",
  l5: "Principal/Distinguished (10+ years): Industry expertise, organization-wide impact, innovation",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, context } = await req.json();
    console.log(`Processing action: ${action}`, context);

    let systemPrompt = "";
    let userPrompt = "";

    if (action === 'generate-question') {
      const technologies = Array.isArray(context.technologies) ? context.technologies.join(', ') : context.technology || 'General';
      const levelDesc = levelDescriptions[context.level] || "Professional level";
      
      // Get company context - use provided companyDetails if available
      const companyContext = getCompanyContext(context.company, context.companyDetails);
      
      // Build context sections with priority: Company > Job Description > Resume
      let prioritizedContext = '';
      
      // HIGHEST PRIORITY: Company profile and culture
      if (companyContext) {
        prioritizedContext += `\n\n=== HIGHEST PRIORITY: COMPANY CONTEXT ===\n${companyContext}`;
      }
      
      // HIGH PRIORITY: Job Description requirements
      if (context.jobDescription) {
        prioritizedContext += `\n\n=== HIGH PRIORITY: JOB DESCRIPTION ===
Focus questions on these specific requirements from the job posting:
${context.jobDescription.substring(0, 2000)}
${context.jobDescription.length > 2000 ? '...[truncated]' : ''}

Generate questions that directly test the skills and competencies mentioned in this job description.`;
      }
      
      // SUPPORTING CONTEXT: Resume (use to personalize, but don't over-rely)
      if (context.resumeText) {
        prioritizedContext += `\n\n=== SUPPORTING CONTEXT: CANDIDATE RESUME ===
Use this to tailor questions to the candidate's background, but prioritize testing job requirements:
${context.resumeText.substring(0, 1500)}
${context.resumeText.length > 1500 ? '...[truncated]' : ''}`;
      }
      
      systemPrompt = `You are an expert interview coach specializing in technical and behavioral interviews for top-tier companies worldwide.

CANDIDATE PROFILE:
- Technologies: ${technologies}
- Role: ${context.role}
- Experience Level: ${context.level} - ${levelDesc}
- Question Types Required: ${Array.isArray(context.questionTypes) ? context.questionTypes.join(', ') : 'technical'}
${context.domain ? `- Industry Domain: ${context.domain}` : ''}
${prioritizedContext}

QUESTION GENERATION PRIORITIES (STRICTLY FOLLOW THIS ORDER):
1. COMPANY INTERVIEW STYLE - If company is specified, match their known interview patterns and values
2. JOB DESCRIPTION - Questions MUST test skills/competencies from the JD if provided
3. CANDIDATE BACKGROUND - Personalize based on resume, but focus on JD requirements
4. GENERAL BEST PRACTICES - Only fall back to general questions if no JD/company context

QUESTION QUALITY GUIDELINES:
1. Questions should be calibrated to the exact experience level (this is HARD/EXPERT level - make it challenging)
2. For behavioral questions: Use "Tell me about a time..." format with specific scenarios related to JD requirements
3. For technical questions: Include context and real-world applicability from the JD
4. For system design: Scale appropriately for the level and reference systems the company actually uses
5. Questions should be specific, not generic - reference the technology stack and JD requirements`;

      userPrompt = `Generate ONE highly relevant interview question that:
1. Aligns with the company's interview culture (if specified)
2. Tests a specific requirement from the job description (if provided)
3. Is appropriately challenging for the experience level

${context.previousQuestions?.length ? `AVOID these topics already covered: ${context.previousQuestions.slice(-3).join('; ')}` : ''}

Return ONLY valid JSON: {"question": "the complete question text", "type": "technical|behavioral|system-design|domain-knowledge"}`;
    } else if (action === 'evaluate-answer') {
      const levelDesc = levelDescriptions[context.level] || "Professional level";
      
      systemPrompt = `You are an expert interviewer evaluating a ${context.level} ${context.role} candidate's answer.
Experience Level Context: ${levelDesc}
${context.domain ? `Industry Domain: ${context.domain}` : ''}

Evaluate fairly based on what's expected at this experience level. Be encouraging but honest.
Provide actionable feedback that helps the candidate improve.`;

      userPrompt = `Question: ${context.question}

Candidate's Answer: ${context.answer}

Evaluate this answer considering the candidate's experience level.
Return JSON only: {"score": 1-10, "feedback": "2-3 sentences of specific feedback", "strengths": ["strength1", "strength2"], "improvements": ["specific improvement1", "specific improvement2"]}`;
    } else if (action === 'generate-learning-path') {
      const { expertiseLevel, learningFocus, targetRole, targetCompany, timeline } = context;
      systemPrompt = `You are an elite interview coach and technical mentor. 
      Create a highly personalized learning roadmap.
      
      Candidate Profile:
      - Current Level: ${expertiseLevel}
      - Primary Focus: ${learningFocus}
      ${targetRole ? `- Target Role: ${targetRole}` : ''}
      ${targetCompany ? `- Target Company: ${targetCompany}` : ''}
      ${timeline ? `- Preparation Timeline: ${timeline}` : ''}`;

      userPrompt = `Create a structured learning path with 4-5 high-impact stages. 
      For each stage, provide:
      1. A professional title
      2. A concise, strategic description
      3. A list of 4-6 specific topics to master
      
      Respond ONLY with valid JSON.
      Format: {"title": "The Master Roadmap", "description": "High-level strategy", "stages": [{"title": "Stage 1", "description": "Why this matters", "topics": ["topic 1", "topic 2"]}]}`;
    } else if (action === 'ask-faq') {
      systemPrompt = `You are the InterviewPrep AI Support Assistant. 
      Help users understand how this platform works.
      
      Platform: InterviewPrep - AI-powered interview practice with real-time feedback
      Key Features: Technical/behavioral/system design questions, company-specific tracks (70+ companies), progress tracking
      
      Respond in a conversational but professional tone. Keep answers concise (1-3 sentences).
      Return your answer in JSON: {"answer": "your answer text here"}`;

      userPrompt = `User Question: ${context.question}
Return strictly valid JSON: {"answer": "your answer text here"}`;
    }

    const result = await callAIWithValidation(systemPrompt, userPrompt);

    if (action === 'ask-faq' && result && !result.answer) {
      const firstStringKey = Object.keys(result).find(key => typeof result[key] === 'string');
      if (firstStringKey) {
        result.answer = result[firstStringKey];
      }
    }

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error: unknown) {
    console.error("Error in interview-ai function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const isRateLimit = errorMessage.includes("rate") || errorMessage.includes("429") || errorMessage.includes("busy");

    return new Response(
      JSON.stringify({ error: isRateLimit ? "Service is busy, please try again in a moment" : errorMessage }),
      {
        status: isRateLimit ? 503 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});