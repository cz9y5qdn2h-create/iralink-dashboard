import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";

const TOKEN_ENDPOINTS: Record<string, { tokenUrl: string; clientIdEnv: string; clientSecretEnv: string }> = {
  google: {
    tokenUrl: "https://oauth2.googleapis.com/token",
    clientIdEnv: "GOOGLE_CLIENT_ID",
    clientSecretEnv: "GOOGLE_CLIENT_SECRET",
  },
  notion: {
    tokenUrl: "https://api.notion.com/v1/oauth/token",
    clientIdEnv: "NOTION_CLIENT_ID",
    clientSecretEnv: "NOTION_CLIENT_SECRET",
  },
  slack: {
    tokenUrl: "https://slack.com/api/oauth.v2.access",
    clientIdEnv: "SLACK_CLIENT_ID",
    clientSecretEnv: "SLACK_CLIENT_SECRET",
  },
  hubspot: {
    tokenUrl: "https://api.hubapi.com/oauth/v1/token",
    clientIdEnv: "HUBSPOT_CLIENT_ID",
    clientSecretEnv: "HUBSPOT_CLIENT_SECRET",
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const provider = params.provider.toLowerCase();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const redirectBase = `${appUrl}/integrations`;

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${redirectBase}?error=${error ?? "no_code"}`);
  }

  const tokenConfig = TOKEN_ENDPOINTS[provider];
  if (!tokenConfig) {
    return NextResponse.redirect(`${redirectBase}?error=unknown_provider`);
  }

  const clientId = process.env[tokenConfig.clientIdEnv];
  const clientSecret = process.env[tokenConfig.clientSecretEnv];

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${redirectBase}?error=not_configured&provider=${provider}`);
  }

  try {
    const redirectUri = `${appUrl}/api/integrations/oauth/callback/${provider}`;

    let tokenResponse: Response;
    if (provider === "notion") {
      tokenResponse = await fetch(tokenConfig.tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        },
        body: JSON.stringify({ grant_type: "authorization_code", code, redirect_uri: redirectUri }),
      });
    } else {
      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      });
      tokenResponse = await fetch(tokenConfig.tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
    }

    const tokenData = await tokenResponse.json() as Record<string, unknown>;

    if (!tokenResponse.ok || tokenData.error) {
      return NextResponse.redirect(`${redirectBase}?error=token_exchange_failed&provider=${provider}`);
    }

    // Save to DB - need user from cookie
    const supabase = createSupabaseAdmin();
    const token = request.cookies.get("sb-access-token")?.value;
    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        await supabase.from("integrations").upsert({
          user_id: user.id,
          name: provider.charAt(0).toUpperCase() + provider.slice(1),
          type: provider,
          status: "connected",
          config: { token: tokenData.access_token ?? tokenData.access_token, raw: tokenData },
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id,type" });
      }
    }

    return NextResponse.redirect(`${redirectBase}?connected=${provider}`);
  } catch {
    return NextResponse.redirect(`${redirectBase}?error=unexpected&provider=${provider}`);
  }
}
