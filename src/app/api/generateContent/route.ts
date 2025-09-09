import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Missing title" }, { status: 400 });
    }

    const prompt = `You are a creative blog writer. Write a 50-word blog post about the title: ${title}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a creative blog writer." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log("OpenAI API response:", data);

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    if (!data.choices || !data.choices[0]?.message?.content) {
      return NextResponse.json(
        { error: "No content returned" },
        { status: 500 }
      );
    }

    return NextResponse.json({ content: data.choices[0].message.content });
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return NextResponse.json(
      { error: "Request failed", details: String(error) },
      { status: 500 }
    );
  }
}
