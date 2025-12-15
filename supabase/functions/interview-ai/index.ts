import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (action === 'generate-question') {
      systemPrompt = `You are an expert FAANG interview coach. Generate interview questions for ${context.technology} technology stack, for a ${context.role} at ${context.level} level.${context.company ? ` Focus on ${context.company}-style questions.` : ''} Question types to include: ${context.questionTypes.join(', ')}.`;
      userPrompt = `Generate ONE new interview question. ${context.previousQuestions?.length ? `Avoid these previous questions: ${context.previousQuestions.join('; ')}` : ''} Return JSON only: {"question": "the question text", "type": "technical|behavioral|system-design|domain-knowledge"}`;
    } else if (action === 'evaluate-answer') {
      systemPrompt = `You are an expert FAANG interviewer evaluating a ${context.level} ${context.role} candidate's answer.`;
      userPrompt = `Question: ${context.question}\n\nCandidate's Answer: ${context.answer}\n\nEvaluate this answer. Return JSON only: {"score": 1-10, "feedback": "detailed feedback", "strengths": ["strength1", "strength2"], "improvements": ["area1", "area2"]}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Failed to parse response" };

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error: unknown) {
    console.error("Error in interview-ai function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
