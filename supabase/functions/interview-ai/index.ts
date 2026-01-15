import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MODELS = [
  "google/gemini-2.5-flash-lite",
  "google/gemini-2.5-flash",
  "openai/gpt-5-nano",
];

async function callAIWithRetry(systemPrompt: string, userPrompt: string, maxRetries = 3): Promise<Response> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

  let lastError: Error | null = null;
  
  for (let modelIndex = 0; modelIndex < MODELS.length; modelIndex++) {
    const model = MODELS[modelIndex];
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model,
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
          }),
        });

        if (response.ok) {
          return response;
        }

        if (response.status === 429) {
          console.log(`Rate limited on ${model}, attempt ${attempt + 1}/${maxRetries}`);
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        if (response.status === 402) {
          throw new Error("Payment required");
        }

        const errorText = await response.text();
        console.error(`AI gateway error: ${response.status} ${errorText}`);
        lastError = new Error(`AI gateway error: ${response.status}`);
        break; // Try next model for non-rate-limit errors
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`Error with ${model}:`, lastError.message);
      }
    }
    
    console.log(`Switching from ${model} to next model...`);
  }

  throw lastError || new Error("All models failed");
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, context } = await req.json();

    let systemPrompt = "";
    let userPrompt = "";

    if (action === 'generate-question') {
      systemPrompt = `You are an expert FAANG interview coach. Generate interview questions for ${context.technology} technology stack, for a ${context.role} at ${context.level} level.${context.company ? ` Focus on ${context.company}-style questions.` : ''}${context.domain ? ` The questions should be relevant to the ${context.domain} industry domain.` : ''} Question types to include: ${context.questionTypes.join(', ')}.`;
      userPrompt = `Generate ONE new interview question. ${context.previousQuestions?.length ? `Avoid these previous questions: ${context.previousQuestions.join('; ')}` : ''} Return JSON only: {"question": "the question text", "type": "technical|behavioral|system-design|domain-knowledge"}`;
    } else if (action === 'evaluate-answer') {
      systemPrompt = `You are an expert FAANG interviewer evaluating a ${context.level} ${context.role} candidate's answer.${context.domain ? ` Consider the ${context.domain} industry context.` : ''}`;
      userPrompt = `Question: ${context.question}\n\nCandidate's Answer: ${context.answer}\n\nEvaluate this answer. Return JSON only: {"score": 1-10, "feedback": "detailed feedback", "strengths": ["strength1", "strength2"], "improvements": ["area1", "area2"]}`;
    }

    const response = await callAIWithRetry(systemPrompt, userPrompt);
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Failed to parse response" };

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error: unknown) {
    console.error("Error in interview-ai function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const isRateLimit = errorMessage.includes("rate") || errorMessage.includes("429");
    return new Response(
      JSON.stringify({ error: isRateLimit ? "Service is busy, please try again in a moment" : errorMessage }), 
      { status: isRateLimit ? 503 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
