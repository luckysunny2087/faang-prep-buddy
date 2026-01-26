import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, resumeText, jobDescription, company, experienceLevel, isCareerSwitch } = await req.json();
    console.log(`Resume analyzer action: ${action}`);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    if (action === 'parse-resume') {
      return new Response(
        JSON.stringify({ 
          error: 'direct-parse-not-supported',
          message: 'Please paste your resume text manually for best results'
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === 'analyze-gaps') {
      const systemPrompt = `You are an expert career coach and resume analyst. Analyze the gap between a candidate's resume and a job description.

IMPORTANT PRIORITIES (in order):
1. JOB DESCRIPTION REQUIREMENTS - Focus heavily on what the job requires
2. COMPANY PROFILE & CULTURE - If a company is specified, consider their interview style
3. RESUME CONTENT - Identify matching skills and gaps

Be specific, actionable, and encouraging. Focus on practical improvements.`;

      const userPrompt = `Analyze the following:

${company ? `TARGET COMPANY: ${company}` : ''}

JOB DESCRIPTION:
${jobDescription}

${resumeText ? `CANDIDATE RESUME:
${resumeText}` : 'NO RESUME PROVIDED - Focus analysis on job description requirements only.'}

Provide a comprehensive gap analysis. Return ONLY valid JSON in this exact format:
{
  "matchScore": <number 0-100 representing how well resume matches JD>,
  "keySkillsFound": ["skill1", "skill2", ...],
  "missingSkills": ["skill1", "skill2", ...],
  "gaps": ["specific gap 1", "specific gap 2", ...],
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2", ...]
}

If no resume is provided, set matchScore to 0, keySkillsFound to [], and focus on what skills would be needed.`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
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
        console.error("AI gateway error:", response.status, errorText);
        throw new Error(`AI service error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";

      let cleanedContent = content.replace(/```json\s?/, "").replace(/```\s?$/, "").trim();
      const firstBrace = cleanedContent.indexOf('{');
      const lastBrace = cleanedContent.lastIndexOf('}');

      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error("No JSON found in response");
      }

      const jsonString = cleanedContent.substring(firstBrace, lastBrace + 1);
      const result = JSON.parse(jsonString);

      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // PREMIUM FEATURE: Generate Cover Letter
    if (action === 'generate-cover-letter') {
      const systemPrompt = `You are an expert career coach and professional cover letter writer. Create compelling, personalized cover letters that:
- Are tailored specifically to the company and role
- Highlight relevant skills from the resume that match the job requirements
- Show genuine enthusiasm and knowledge about the company
- Are professional yet personable
- Follow modern cover letter best practices (concise, impactful, 3-4 paragraphs)`;

      const userPrompt = `Create a professional cover letter for:

TARGET COMPANY: ${company || 'the company'}
POSITION TYPE: Full-time position

JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUME:
${resumeText || 'No resume provided - create a general template'}

Generate a compelling cover letter that:
1. Opens with a strong hook mentioning the specific role and company
2. Highlights 2-3 key achievements/skills that directly relate to the job requirements
3. Shows knowledge of the company's culture and values
4. Ends with a confident call to action

Return ONLY valid JSON in this exact format:
{
  "coverLetter": "Full cover letter text with proper formatting and line breaks",
  "highlights": ["Key point 1 emphasized", "Key point 2 emphasized", "Key point 3 emphasized"],
  "tips": ["Tip for customization 1", "Tip for customization 2"]
}`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 3000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI gateway error:", response.status, errorText);
        throw new Error(`AI service error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";

      let cleanedContent = content.replace(/```json\s?/, "").replace(/```\s?$/, "").trim();
      const firstBrace = cleanedContent.indexOf('{');
      const lastBrace = cleanedContent.lastIndexOf('}');

      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error("No JSON found in response");
      }

      const jsonString = cleanedContent.substring(firstBrace, lastBrace + 1);
      const result = JSON.parse(jsonString);

      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // PREMIUM FEATURE: Generate Skills Learning Roadmap
    if (action === 'generate-learning-roadmap') {
      const systemPrompt = `You are an expert career mentor specializing in skill development and career transitions. Create detailed, actionable learning roadmaps that:
- Prioritize skills by importance and impact on the target role
- Include specific resources (courses, projects, certifications)
- Account for the candidate's current experience level
- Consider if this is a career switch scenario
- Provide realistic timelines for each skill`;

      const userPrompt = `Create a personalized skills learning roadmap for:

TARGET COMPANY: ${company || 'the target company'}
EXPERIENCE LEVEL: ${experienceLevel || 'Not specified'}
CAREER SWITCH: ${isCareerSwitch ? 'Yes - candidate is transitioning from a different field' : 'No - staying in same field'}

JOB DESCRIPTION:
${jobDescription}

CURRENT SKILLS (from resume):
${resumeText || 'No resume provided - assume starting from basics'}

Generate a comprehensive learning roadmap that:
1. Identifies the top skills gaps in priority order
2. Provides specific learning resources for each skill
3. Includes milestones and timeline estimates
4. Suggests practical projects to demonstrate skills
5. Recommends certifications where applicable

Return ONLY valid JSON in this exact format:
{
  "overallTimeEstimate": "X-Y months",
  "priorityLevel": "critical" | "high" | "moderate",
  "roadmap": [
    {
      "skill": "Skill name",
      "priority": 1,
      "importance": "Why this skill matters for the role",
      "currentLevel": "beginner" | "intermediate" | "advanced" | "none",
      "targetLevel": "intermediate" | "advanced" | "expert",
      "timeToLearn": "X weeks/months",
      "resources": [
        { "type": "course" | "book" | "tutorial" | "practice", "name": "Resource name", "url": "optional url or platform", "isFree": true/false }
      ],
      "practiceProjects": ["Project idea 1", "Project idea 2"],
      "certifications": ["Certification name if applicable"]
    }
  ],
  "quickWins": ["Easy skill/project that can show immediate progress"],
  "advice": "Personalized advice for this learning journey"
}`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI gateway error:", response.status, errorText);
        throw new Error(`AI service error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";

      let cleanedContent = content.replace(/```json\s?/, "").replace(/```\s?$/, "").trim();
      const firstBrace = cleanedContent.indexOf('{');
      const lastBrace = cleanedContent.lastIndexOf('}');

      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error("No JSON found in response");
      }

      const jsonString = cleanedContent.substring(firstBrace, lastBrace + 1);
      const result = JSON.parse(jsonString);

      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in resume-analyzer:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
