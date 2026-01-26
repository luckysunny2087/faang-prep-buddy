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
    const { action, resumeText, jobDescription, company, filePath, fileName } = await req.json();
    console.log(`Resume analyzer action: ${action}`);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    if (action === 'parse-resume') {
      // For now, return a message that parsing requires manual input
      // In production, you would integrate with a document parsing service
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

      // Parse JSON from response
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
