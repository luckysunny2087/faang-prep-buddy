import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { skills, experienceLevel, role, location } = await req.json();

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return new Response(JSON.stringify({ error: "skills array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a job search agent for PrepGenius. Given a candidate's skills, experience level, and preferences, generate realistic and relevant job listings that match their profile. Each job should be grounded in current market knowledge with realistic companies, salary ranges, and requirements. Generate 8-12 diverse job listings.`;

    const userPrompt = `Find jobs for a candidate with:
- Skills: ${skills.join(", ")}
- Experience Level: ${experienceLevel || "Mid-level"}
${role ? `- Preferred Role: ${role}` : ""}
${location ? `- Preferred Location: ${location}` : "- Location: Remote/Flexible"}

Generate relevant job listings with realistic details.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_job_listings",
              description: "Return a list of job listings matching the candidate profile.",
              parameters: {
                type: "object",
                properties: {
                  jobs: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Job title" },
                        company: { type: "string", description: "Company name" },
                        location: { type: "string", description: "Job location" },
                        salaryRange: { type: "string", description: "Salary range e.g. $120k - $160k" },
                        description: { type: "string", description: "Job description (2-3 sentences)" },
                        requirements: {
                          type: "array",
                          items: { type: "string" },
                          description: "Key requirements/skills",
                        },
                        matchScore: {
                          type: "number",
                          description: "How well this job matches the candidate (0-100)",
                        },
                        type: {
                          type: "string",
                          enum: ["Full-time", "Part-time", "Contract", "Remote"],
                          description: "Employment type",
                        },
                        postedDaysAgo: {
                          type: "number",
                          description: "How many days ago the job was posted",
                        },
                      },
                      required: [
                        "title",
                        "company",
                        "location",
                        "salaryRange",
                        "description",
                        "requirements",
                        "matchScore",
                        "type",
                        "postedDaysAgo",
                      ],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["jobs"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_job_listings" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to generate job listings" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      return new Response(JSON.stringify({ error: "No job listings generated" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const jobs = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(jobs), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("job-search error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
