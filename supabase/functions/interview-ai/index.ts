import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const MODELS = [
  "gpt-4o-mini",
  "gpt-4o",
  "openai/gpt-4o-mini",
  "openai/gpt-4o",
  "google/gemini-2.0-flash",
];

async function callAIWithValidation(systemPrompt: string, userPrompt: string, maxRetries = 2): Promise<any> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

  if (!LOVABLE_API_KEY && !OPENAI_API_KEY) {
    console.error("No API keys found (LOVABLE_API_KEY or OPENAI_API_KEY)");
    throw new Error("AI service is not configured (API keys missing)");
  }

  let lastError: Error | null = null;

  for (const model of MODELS) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`Calling AI with model ${model}, attempt ${attempt + 1}`);

        const isDirectOpenAI = OPENAI_API_KEY && model.startsWith("gpt");
        const url = isDirectOpenAI
          ? "https://api.openai.com/v1/chat/completions"
          : "https://ai.gateway.lovable.dev/v1/chat/completions";

        const apiKey = isDirectOpenAI ? OPENAI_API_KEY : LOVABLE_API_KEY;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: isDirectOpenAI ? model.replace("openai/", "") : model,
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

        // More robust JSON extraction: find the first { and the last }
        const firstBrace = cleanedContent.indexOf('{');
        const lastBrace = cleanedContent.lastIndexOf('}');

        if (firstBrace === -1 || lastBrace === -1) {
          console.error(`No JSON block found in content from ${model}:`, content.substring(0, 100));
          throw new Error("No JSON object found in AI response");
        }

        const jsonString = cleanedContent.substring(firstBrace, lastBrace + 1);

        try {
          // Pre-cleaning
          const sanitizedJson = jsonString
            .replace(/,\s*([}\]])/g, '$1') // remove trailing commas
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // remove control characters
            .replace(/[\u201C\u201D]/g, '"') // replace smart quotes
            .replace(/(?<=: \".*)\n(?=.*\"[,}])/, " "); // remove newlines inside strings

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

        // If it's a structural error (not a network/gateway error), try next model
        if (lastError.message.includes("JSON") || lastError.message.includes("object found") || lastError.message.includes("content")) {
          continue; // Try next attempt/model
        }
      }
    }
  }

  throw lastError || new Error("All models failed to return valid JSON");
}

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
      systemPrompt = `You are an expert FAANG interview coach. Generate interview questions for ${technologies} technology stack, for a ${context.role} at ${context.level} level.${context.company ? ` Focus on ${context.company}-style questions.` : ''}${context.domain ? ` The questions should be relevant to the ${context.domain} industry domain.` : ''} Question types to include: ${Array.isArray(context.questionTypes) ? context.questionTypes.join(', ') : 'technical'}.`;
      userPrompt = `Generate ONE new interview question. ${context.previousQuestions?.length ? `Avoid these previous questions: ${context.previousQuestions.join('; ')}` : ''} Return JSON only: {"question": "the question text", "type": "technical|behavioral|system-design|domain-knowledge"}`;
    } else if (action === 'evaluate-answer') {
      systemPrompt = `You are an expert FAANG interviewer evaluating a ${context.level} ${context.role} candidate's answer.${context.domain ? ` Consider the ${context.domain} industry context.` : ''}`;
      userPrompt = `Question: ${context.question}\n\nCandidate's Answer: ${context.answer}\n\nEvaluate this answer. Return JSON only: {"score": 1-10, "feedback": "detailed feedback", "strengths": ["strength1", "strength2"], "improvements": ["area1", "area2"]}`;
    } else if (action === 'generate-learning-path') {
      const { expertiseLevel, learningFocus, targetRole, targetCompany, timeline } = context;
      systemPrompt = `You are an elite FAANG interview coach and technical mentor. 
      Your task is to create a highly personalized, expert-level learning roadmap for a candidate.
      
      Candidate Profile:
      - Current Level: ${expertiseLevel}
      - Primary Focus: ${learningFocus}
      ${targetRole ? `- Target Role: ${targetRole}` : ''}
      ${targetCompany ? `- Target Company: ${targetCompany}` : ''}
      ${timeline ? `- Preparation Timeline: ${timeline}` : ''}
      
      The roadmap should be practical, prioritized, and specifically tailored to the nuances of ${targetCompany || 'top-tier tech companies'}.`;

      userPrompt = `Create a structured learning path with 4-5 high-impact stages. 
      For each stage, provide:
      1. A professional title.
      2. A concise, strategic description of why this stage is critical for ${targetRole || 'their career'}.
      3. A list of 4-6 specific, advanced topics or skills to master.
      
      Respond ONLY with valid JSON.
      Format: {"title": "The Master Roadmap", "description": "High-level strategy", "stages": [{"title": "Stage 1", "description": "Why this matters", "topics": ["specific topic 1", "topic 2"]}]}`;
    } else if (action === 'ask-faq') {
      systemPrompt = `You are the InterviewPrep AI Support Assistant. 
      Your goal is to help users understand how this platform works.
      
      Platform Information:
      - App Name: InterviewPrep (formerly FAANG Prep Buddy)
      - Key Features: AI-powered interview practice, real-time feedback with scores, technical/behavioral/system design questions, company-specific tracks (Amazon, Google, Meta, Apple, Netflix, Microsoft), progress tracking/dashboard, resource library.
      - How it works: Users select their role, level, and tech stack. The AI generates a tailored 10-question interview. Users type answers and get 1-10 scores with detailed feedback.
      - Pricing: Free tier available, Pro tier ($29/month) for unlimited interviews and advanced analytics.
      - FAQ Context: You should be polite, encouraging, and helpful. If you don't know the answer, tell them to contact support.
      
      Respond in a conversational but professional tone. Keep answers concise (1-3 sentences).
      You MUST return your answer in a JSON object with the key "answer".`;

      userPrompt = `Answer the following user question about InterviewPrep.
      Return strictly valid JSON: {"answer": "your answer text here"}
      
      User Question: ${context.question}`;
    }

    const result = await callAIWithValidation(systemPrompt, userPrompt);

    // Safety check: if result is an object but doesn't have "answer", 
    // try to find any string property to use as the answer
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
