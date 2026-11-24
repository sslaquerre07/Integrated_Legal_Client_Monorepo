type RouteContext = {
  params: Promise<{ path: string[] }>;
};

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

  try {
    const baseUrl = new URL(`${apiUrl.replace(/\/+$/, "")}/`);
    if (baseUrl.protocol !== "http:" && baseUrl.protocol !== "https:") {
      throw new Error("API_URL must use HTTP or HTTPS");
    }

    destination = new URL(
      `${path.map((segment) => encodeURIComponent(segment)).join("/")}${requestUrl.search}`,
      baseUrl,
    );
  } catch (error) {
    console.error("Failed to proxy request: invalid API_URL", error);
    return Response.json({ message: "API_URL must be a valid HTTP(S) URL" }, { status: 500 });
  }

  const headers = new Headers(request.headers);
  requestHeadersToOmit.forEach((header) => headers.delete(header));

  try {
    const fetchOptions: RequestInit & { duplex: "half" } = {
      method: request.method,
      headers,
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
