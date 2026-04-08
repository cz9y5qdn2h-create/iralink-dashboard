import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseAdmin();

    const token = request.cookies.get("sb-access-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json() as { fileId?: string };
    const { fileId } = body;
    if (!fileId) {
      return NextResponse.json({ error: "fileId required" }, { status: 400 });
    }

    const { data: fileRecord, error: fetchError } = await supabase
      .from("files")
      .select("*")
      .eq("id", fileId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !fileRecord) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Mark as processing
    await supabase.from("files").update({ analysis_status: "processing" }).eq("id", fileId);

    // Get file content from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("documents")
      .download(fileRecord.storage_path);

    if (downloadError || !fileData) {
      await supabase.from("files").update({ analysis_status: "error" }).eq("id", fileId);
      return NextResponse.json({ error: "Could not download file" }, { status: 500 });
    }

    let textContent = "";
    const fileType = (fileRecord.type as string).toLowerCase();

    if (fileType === "txt" || fileType === "csv") {
      textContent = await fileData.text();
    } else if (fileType === "pdf") {
      // Read raw text from PDF buffer (basic extraction)
      const buffer = await fileData.arrayBuffer();
      const raw = Buffer.from(buffer).toString("latin1");
      // Extract visible text strings between parentheses (PDF stream text)
      const matches = raw.match(/\(([^\)]{3,})\)/g) ?? [];
      textContent = matches
        .map((m) => m.slice(1, -1))
        .filter((s) => /[a-zA-ZÀ-ÿ]{3,}/.test(s))
        .join(" ")
        .slice(0, 8000);
    } else {
      // For docx/xlsx: try plain text extraction
      const buffer = await fileData.arrayBuffer();
      const raw = Buffer.from(buffer).toString("utf8", 0, 50000);
      textContent = raw.replace(/[^\x20-\x7E\u00C0-\u017E\n]/g, " ").slice(0, 8000);
    }

    if (!textContent || textContent.trim().length < 20) {
      textContent = `Fichier: ${fileRecord.name}\nType: ${fileRecord.type}\nTaille: ${fileRecord.size} bytes`;
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Analyse ce document professionnel et identifie: 1) Les processus métier clés, 2) Les opportunités d'automatisation, 3) Les inefficacités détectées. Réponds UNIQUEMENT en JSON valide sans markdown: {"processes": string[], "automations": string[], "inefficiencies": string[], "summary": string}\n\nContenu du document:\n${textContent}`,
        },
      ],
    });

    const rawText = message.content[0].type === "text" ? message.content[0].text : "{}";

    let analysisResult: Record<string, unknown>;
    try {
      analysisResult = JSON.parse(rawText) as Record<string, unknown>;
    } catch {
      analysisResult = { processes: [], automations: [], inefficiencies: [], summary: rawText };
    }

    await supabase.from("files").update({
      analysis_status: "done",
      analysis_result: analysisResult,
    }).eq("id", fileId);

    return NextResponse.json({ result: analysisResult });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
