import { NextRequest, NextResponse } from "next/server";

const OAUTH_CONFIGS: Record<string, { authUrl: string; clientIdEnv: string; scopes: string; docUrl: string }> = {
  google: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    clientIdEnv: "GOOGLE_CLIENT_ID",
    scopes: "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/calendar.readonly",
    docUrl: "https://console.cloud.google.com/apis/credentials",
  },
  notion: {
    authUrl: "https://api.notion.com/v1/oauth/authorize",
    clientIdEnv: "NOTION_CLIENT_ID",
    scopes: "",
    docUrl: "https://www.notion.so/my-integrations",
  },
  slack: {
    authUrl: "https://slack.com/oauth/v2/authorize",
    clientIdEnv: "SLACK_CLIENT_ID",
    scopes: "channels:read,chat:write,users:read",
    docUrl: "https://api.slack.com/apps",
  },
  hubspot: {
    authUrl: "https://app.hubspot.com/oauth/authorize",
    clientIdEnv: "HUBSPOT_CLIENT_ID",
    scopes: "contacts crm.objects.contacts.read",
    docUrl: "https://developers.hubspot.com/get-started",
  },
  make: {
    authUrl: "",
    clientIdEnv: "MAKE_WEBHOOK_URL",
    scopes: "",
    docUrl: "https://www.make.com/en/api-documentation",
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const provider = params.provider.toLowerCase();
  const config = OAUTH_CONFIGS[provider];

  if (!config) {
    return NextResponse.json({ error: "unknown_provider" }, { status: 400 });
  }

  const clientId = process.env[config.clientIdEnv];

  if (!clientId) {
    return NextResponse.json({
      error: "not_configured",
      provider,
      docUrl: config.docUrl,
      envVar: config.clientIdEnv,
    }, { status: 200 });
  }

  // Make/Zapier webhook-based
  if (provider === "make") {
    return NextResponse.json({ error: "not_configured", provider: "make", docUrl: config.docUrl, envVar: "MAKE_WEBHOOK_URL" }, { status: 200 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const redirectUri = `${appUrl}/api/integrations/oauth/callback/${provider}`;
  const state = Buffer.from(JSON.stringify({ provider, ts: Date.now() })).toString("base64");

  const url = new URL(config.authUrl);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("state", state);
  if (config.scopes) url.searchParams.set("scope", config.scopes);
  if (provider === "notion") url.searchParams.set("owner", "user");

  return NextResponse.redirect(url.toString());
}
