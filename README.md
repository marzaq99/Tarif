# TARIF SCHEDULE

Web app: measures, certificates and conditions report for a 10-digit commodity code,
based on the UK Trade Tariff API (Northern Ireland / XI tariff).

- `public/index.html`: the application
- `netlify/functions/tariff.mjs`: relay to the tariff APIs (avoids browser CORS restrictions)
- `netlify.toml` / `package.json`: Netlify configuration

No API key and no environment variable are required.

Netlify publishes `public/` directly; no build command is needed. The API relay
deploys from `netlify/functions/` and serves `/api/commodity` and `/api/suggest`.
