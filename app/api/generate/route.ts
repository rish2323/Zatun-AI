import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { genre, character, scene } = await req.json();

  const prompt = `You are a professional game writer working at a real game studio.

Generate immersive NPC dialogue for a ${genre} game.

Character: ${character}
Scene: ${scene}

Write 3-5 lines of dialogue this character would say in this scene. Make it atmospheric, authentic to the genre, and emotionally compelling.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  console.log("API RESPONSE:", JSON.stringify(data));
  
  if (!response.ok) {
    return NextResponse.json({ result: `API Error: ${data.error?.message || JSON.stringify(data)}` });
  }

  const result = data.content[0].text;
  return NextResponse.json({ result });
}