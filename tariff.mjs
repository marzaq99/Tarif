// Fonction Netlify : relais (proxy) vers les API de tarif, pour eviter les blocages CORS.
//  - GET /api/commodity?code=8201100000[&as_of=AAAA-MM-JJ]
//        -> UK Trade Tariff API, tarif Irlande du Nord (XI), version 2
//  - GET /api/suggest?term=pelles[&year=2026][&lang=fr]
//        -> tariffnumber.com (suggestions de codes, comme dans l'outil VBA)
// Aucune cle API n'est necessaire.

const UA = "bellereaux-tarif-xi/1.0";
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
    return reply({ error: "Service distant injoignable. Réessayez dans un instant." }, 502);
  }
  const text = await up.text();
  if (up.ok) return reply(text, 200, okCache);
  const msg =
    up.status === 404 ? "Code introuvable ou non déclarable (il faut un code à 10 chiffres déclarable)."
    : up.status === 429 ? "Trop de requêtes, patientez quelques secondes."
    : "Erreur du service distant (" + up.status + ").";
  return reply({ error: msg }, up.status === 404 || up.status === 429 ? up.status : 502);
}

export default async (req) => {
  if (req.method !== "GET") return reply({ error: "Méthode non autorisée." }, 405);
  const u = new URL(req.url);

  if (u.pathname.endsWith("/commodity")) {
    const code = (u.searchParams.get("code") || "").trim();
    if (!/^\d{10}$/.test(code)) return reply({ error: "Le code doit comporter exactement 10 chiffres." }, 400);
    const asOf = (u.searchParams.get("as_of") || "").trim();
    if (asOf && !/^\d{4}-\d{2}-\d{2}$/.test(asOf)) return reply({ error: "Date invalide (AAAA-MM-JJ)." }, 400);
    return relay(XI_BASE + code + (asOf ? "?as_of=" + asOf : ""), "public, max-age=3600");
  }

  if (u.pathname.endsWith("/suggest")) {
    const term = (u.searchParams.get("term") || "").trim().slice(0, 100);
    if (term.length < 2) return reply({ error: "Saisissez au moins 2 caractères." }, 400);
    const thisYear = new Date().getFullYear();
    let year = parseInt(u.searchParams.get("year") || thisYear, 10);
    if (!(year >= 2013 && year <= thisYear + 1)) year = thisYear;
    let lang = (u.searchParams.get("lang") || "fr").toLowerCase();
    if (!["de", "en", "fr", "es"].includes(lang)) lang = "fr";
    const url = SUGGEST_BASE + "?term=" + encodeURIComponent(term) + "&year=" + year + "&lang=" + lang;
    return relay(url, "public, max-age=600");
  }

  return reply({ error: "Route inconnue." }, 404);
};

export const config = { path: ["/api/commodity", "/api/suggest"] };
