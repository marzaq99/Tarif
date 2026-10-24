# TARIF SCHEDULE

Web app: measures, certificates and conditions report for a 10-digit commodity code,
based on the UK Trade Tariff API (Northern Ireland / XI tariff).

- `public/index.html`: the application
- `netlify/functions/tariff.mjs`: relay to the tariff APIs (avoids browser CORS restrictions)
- `netlify.toml` / `package.json`: Netlify configuration

No API key and no environment variable are required.

Netlify publishes `public` and deploys functions from `netlify/functions`, as
configured in `netlify.toml`. This static site does not require a build command.
