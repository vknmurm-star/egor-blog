import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const siteUrl = process.env.SITE_URL || req.nextUrl.origin;
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const redirectUri = `${siteUrl}/api/callback`;

  const params = new URLSearchParams({
    client_id: clientId || "",
    redirect_uri: redirectUri,
    scope: "repo,user",
  });

  return NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );
}
