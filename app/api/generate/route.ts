import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { genre, character, scene } = await req.json();

  const prompt = `You are an expert game writer at Zatun, Gujarat's oldest game studio with 19 years of experience.

Generate immersive NPC dialogue for a ${genre} game.

Character: ${character}
Scene: ${scene}

Instructions:
- Write 3 to 5 natural, emotionally compelling spoken lines.
- Include 2–4 action/expression tags like **[Voice shaky, eyes darting]** or **[Clutches weapon defensively]**.
- Make it atmospheric, authentic to the genre, and full of subtext.
- End with a short "**Notes for implementation:**" section (3–5 bullet points) with useful suggestions for devs (branching, animation, voice direction, story hooks, etc.).
- Keep total output concise and game-ready. Total under 400 tokens.
- No extra explanations outside the requested format.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",   // As per your Claude instruction
      max_tokens: 400,                      // Cost-efficient
      temperature: 0.75,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  console.log("Anthropic Response:", JSON.stringify(data, null, 2));

  if (!response.ok) {
    return NextResponse.json({ 
      result: `API Error: ${data.error?.message || "Unknown error"}` 
    });
  }

  const result = data.content[0].text;
  return NextResponse.json({ result });
}