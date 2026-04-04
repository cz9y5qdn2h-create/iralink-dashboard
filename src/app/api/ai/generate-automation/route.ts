import { NextRequest, NextResponse } from "next/server";
import { generateAutomation } from "@/lib/ai-agent";

export async function POST(request: NextRequest) {
  try {
    const { name, description, integrations } = await request.json();

    if (!name || !description) {
      return NextResponse.json(
        { error: "Nom et description requis" },
        { status: 400 }
      );
    }

    const result = await generateAutomation(
      name,
      description,
      integrations || []
    );
    return NextResponse.json(result);
  } catch (err) {
    console.error("AI generate automation error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la generation" },
      { status: 500 }
    );
  }
}
