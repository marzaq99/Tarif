// Netlify function: relay (proxy) to the tariff APIs, to avoid browser CORS restrictions.
//  - GET /api/commodity?code=8201100000
//        -> UK Trade Tariff API, Northern Ireland (XI) tariff, version 2, current data
//  - GET /api/suggest?term=spades
//        -> tariffnumber.com code suggestions (current year, English)
// No API key is required.

const UA = "tarif-schedule/1.0";
const XI_BASE = "https://www.trade-tariff.service.gov.uk/xi/api/v2/commodities/";
const SUGGEST_BASE = "https://www.tariffnumber.com/api/v1/cnSuggest";

const reply = (body, status = 200, cache = "no-store") =>
  new Response(typeof body === "string" ? body : JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": cache },
  });

async function relay(url, okCache) {
  let up;
  try {
    up = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": UA },
      signal: AbortSignal.timeout(25000),
    });
  } catch {
    return reply({ error: "Remote service unreachable. Please try again shortly." }, 502);
  }
  const text = await up.text();
  if (up.ok) return reply(text, 200, okCache);
  const msg =
    up.status === 404 ? "Code not found or not declarable (a declarable 10-digit code is required)."
    : up.status === 429 ? "Too many requests, please wait a few seconds."
    : "Remote service error (" + up.status + ").";
  return reply({ error: msg }, up.status === 404 || up.status === 429 ? up.status : 502);
}

export default async (req) => {
  if (req.method !== "GET") return reply({ error: "Method not allowed." }, 405);
  const u = new URL(req.url);

  if (u.pathname.endsWith("/commodity")) {
    const code = (u.searchParams.get("code") || "").trim();
    if (!/^\d{10}$/.test(code)) return reply({ error: "The code must have exactly 10 digits." }, 400);
    return relay(XI_BASE + code, "public, max-age=3600");
  }

  if (u.pathname.endsWith("/suggest")) {
    const term = (u.searchParams.get("term") || "").trim().slice(0, 100);
    if (term.length < 2) return reply({ error: "Enter at least 2 characters." }, 400);
    const url = SUGGEST_BASE + "?term=" + encodeURIComponent(term) + "&year=" + new Date().getFullYear() + "&lang=en";
    return relay(url, "public, max-age=600");
  }

  return reply({ error: "Unknown route." }, 404);
};

export const config = { path: ["/api/commodity", "/api/suggest"] };
