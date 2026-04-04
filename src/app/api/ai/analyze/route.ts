import { NextRequest, NextResponse } from "next/server";
import { analyzeDocument, analyzeProcesses } from "@/lib/ai-agent";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.type === "document") {
      const result = await analyzeDocument(
        body.document_text,
        body.company_context || ""
      );
      return NextResponse.json(result);
    }

    if (body.type === "processes") {
      const result = await analyzeProcesses(
        body.process_description,
        body.industry || "General",
        body.team_size || 10
      );
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: "Type d'analyse invalide. Utilisez 'document' ou 'processes'." },
      { status: 400 }
    );
  } catch (err) {
    console.error("AI analyze error:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'analyse" },
      { status: 500 }
    );
  }
}
