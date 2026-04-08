import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseAdmin();
    const token = request.cookies.get("sb-access-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json() as { provider?: string; webhookUrl?: string };
    const { provider, webhookUrl } = body;

    if (!provider || !webhookUrl) {
      return NextResponse.json({ error: "provider and webhookUrl required" }, { status: 400 });
    }

    const name = provider.charAt(0).toUpperCase() + provider.slice(1);

    const { data, error } = await supabase
      .from("integrations")
      .upsert({
        user_id: user.id,
        name,
        type: provider,
        status: "connected",
        config: { webhookUrl },
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,type" })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ integration: data });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown" }, { status: 500 });
  }
}
