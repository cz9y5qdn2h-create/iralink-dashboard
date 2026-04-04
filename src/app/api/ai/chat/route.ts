import { NextRequest, NextResponse } from "next/server";
import { chat, type AIMessage } from "@/lib/ai-agent";

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = (await request.json()) as {
      messages: AIMessage[];
      context?: string;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages requis" },
        { status: 400 }
      );
    }

    const response = await chat(messages, context);
    return NextResponse.json({ response });
  } catch (err) {
    console.error("AI chat error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la communication avec l'IA" },
      { status: 500 }
    );
  }
}
