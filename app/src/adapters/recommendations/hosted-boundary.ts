import { isLocalRequest } from "./local-boundary";
// Exact server-configured origin; forwarding headers never grant access.
export function isRecommendationRequest(request: Request, requireOrigin: boolean, origin = process.env.RECOMMENDATION_PUBLIC_ORIGIN) {
  if (!origin) return isLocalRequest(request, requireOrigin);
  try {
    const allowed = new URL(origin);
    if (allowed.protocol !== "https:" || allowed.origin !== origin || allowed.username || allowed.password) return false;
    // Next start constructs request.url with its internal bind hostname behind Caddy.
    // Authenticate the explicit public Host and browser Origin, never a forwarded alias.
    if (request.headers.get("host") !== allowed.host) return false;
    if (request.headers.has("forwarded")) return false;
    const supplied = request.headers.get("origin");
    if (supplied ? supplied !== origin : requireOrigin) return false;
    const site = request.headers.get("sec-fetch-site");
    return !site || site === "same-origin" || (!requireOrigin && site === "none");
  } catch { return false; }
}
