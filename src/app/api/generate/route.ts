import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    const apiKey = process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({ apiKey, baseURL: "https://api.deepseek.com/v1" });
    const completion = await client.chat.completions.create({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], temperature: 0.7 });
    return NextResponse.json({ result: completion.choices[0]?.message?.content || "No output" });
  } catch (err: any) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}
