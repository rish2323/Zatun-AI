import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { genre, character, scene } = await req.json();

  const prompt = `You are a veteran game writer with 15 years experience at studios like Naughty Dog and CD Projekt Red.

Write NPC dialogue for a ${genre} game.
Character: ${character}
Scene: ${scene}

Rules:
- Write like a human, not an AI
- Use interruptions, hesitations, contractions
- Characters trail off, contradict themselves, speak imperfectly
- No purple prose, no dramatic monologuing
- Max 3-4 lines of actual dialogue
- Format each line as "CHARACTER NAME: dialogue" on a single line, never split across lines
- Keep total output concise and game-ready. Total under 400 tokens.
- End with a short "**Notes for implementation:**" section (3–5 bullet points) with useful suggestions for devs (branching, animation, voice direction, story hooks, etc.).


Avoid: "I must", "Indeed", "Perhaps", overly poetic language`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",   // As per your Claude instruction
      max_tokens: 600,                      // Cost-efficient
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