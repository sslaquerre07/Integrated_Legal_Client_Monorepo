import { GoogleAuth } from 'google-auth-library';

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

// These headers belong to the browser-to-Next connection, not the new upstream connection.
const requestHeadersToOmit = [
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
];
// Fetch may decompress the upstream body; Next.js will frame the response to the browser.
const responseHeadersToOmit = [
  "connection",
  "content-encoding",
  "content-length",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
];

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const auth = new GoogleAuth();
// Cache clients per target audience so tokens are reused and auto-refreshed
const clients = new Map<string, Awaited<ReturnType<GoogleAuth['getIdTokenClient']>>>();

async function getIdTokenHeader(targetAudience: string): Promise<string> {
  let client = clients.get(targetAudience);
  if (!client) {
    client = await auth.getIdTokenClient(targetAudience);
    clients.set(targetAudience, client);
  }

  // idTokenProvider returns a fresh/cached ID token string for the audience
  const token = await client.idTokenProvider.fetchIdToken(targetAudience);
  return `Bearer ${token}`;
}

// Keep backend addressing and Cloud Run credentials on the server side.
async function proxy(request: Request, { params }: RouteContext) {
  const apiUrl =
    process.env.API_URL?.trim() ||
    (process.env.NODE_ENV === "development" ? "http://localhost:3001" : "");

  if (!apiUrl) {
    console.error("Failed to proxy request: API_URL is not configured");
    return Response.json({ message: "API_URL is not configured" }, { status: 500 });
  }

  const { path } = await params;
  const requestUrl = new URL(request.url);
  let destination: URL;
  let audience: string;
  let shouldUseCloudRunAuth: boolean;

  try {
    const baseUrl = new URL(`${apiUrl.replace(/\/+$/, "")}/`);
    if (baseUrl.protocol !== "http:" && baseUrl.protocol !== "https:") {
      throw new Error("API_URL must use HTTP or HTTPS");
    }

    destination = new URL(
      `${path.map((segment) => encodeURIComponent(segment)).join("/")}${requestUrl.search}`,
      baseUrl,
    );
    audience = process.env.API_AUDIENCE?.trim() || baseUrl.origin;
    // Local development APIs do not require a Cloud Run invoker token.
    shouldUseCloudRunAuth = !(
      process.env.NODE_ENV === "development" &&
      ["localhost", "127.0.0.1", "[::1]"].includes(baseUrl.hostname)
    );
  } catch (error) {
    console.error("Failed to proxy request: invalid API_URL", error);
    return Response.json({ message: "API_URL must be a valid HTTP(S) URL" }, { status: 500 });
  }

  const headers = new Headers(request.headers);
  requestHeadersToOmit.forEach((header) => headers.delete(header));

  if (shouldUseCloudRunAuth) {
    try {
      // Replace any browser Authorization header with the frontend service identity.
      headers.set("Authorization", await getIdTokenHeader(audience));
    } catch (error) {
      console.error(`Failed to acquire an ID token for API audience ${audience}`, error);
      return Response.json({ message: "Failed to authenticate with API" }, { status: 500 });
    }
  }

  try {
    const fetchOptions: RequestInit & { duplex: "half" } = {
      method: request.method,
      headers,
      // Stream uploads instead of buffering their full body in frontend memory.
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : request.body,
      cache: "no-store",
      duplex: "half",
      redirect: "manual",
    };
    const upstreamResponse = await fetch(destination, fetchOptions);

    const responseHeaders = new Headers(upstreamResponse.headers);
    responseHeadersToOmit.forEach((header) => responseHeaders.delete(header));

    return new Response(
      request.method === "HEAD" ||
        upstreamResponse.status === 204 ||
        upstreamResponse.status === 304
        ? null
        : upstreamResponse.body,
      {
        status: upstreamResponse.status,
        statusText: upstreamResponse.statusText,
        headers: responseHeaders,
      },
    );
  } catch (error) {
    console.error(`Failed to proxy ${request.method} ${destination.pathname}`, error);
    return Response.json({ message: "Failed to reach API" }, { status: 502 });
  }
}

export const GET = proxy;
export const HEAD = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
