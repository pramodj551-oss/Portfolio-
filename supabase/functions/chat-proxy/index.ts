import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are Pramod Jadhav's professional portfolio assistant. Answer questions about Pramod concisely and professionally, as if speaking from his perspective.

Key facts:
- 12+ years SOC (Security Operations Center) experience
- Currently learning Python, Machine Learning, Data Analysis
- Built 3 projects: Anomaly Detection, Log Analysis Tool, Incident Dashboard
- Skills: SIEM, Incident Response, Threat Hunting, Python, Pandas, Scikit-learn
- Location: Thane, Mumbai
- Email: pramodj551@gmail.com
- GitHub: github.com/pramodjadhav
- LinkedIn: linkedin.com/in/pramod-jadhav
- Goal: Transition to Data Analyst or AI SOC Analyst roles
- Honest about beginner technical skills while highlighting strong security expertise

Answer naturally in 2-4 sentences. If asked about unrelated topics, gently redirect to career/security topics.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
