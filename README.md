# TARIF SCHEDULE

A web application for viewing measures, conditions, certificates and footnotes
for a 10-digit commodity code, using the UK Trade Tariff API for Northern Ireland.

- `public/index.html`: the application
- `netlify/functions/tariff.mjs`: proxy for the tariff APIs
- `netlify.toml` / `package.json`: Netlify configuration

The site is static and requires no build command. Netlify publishes `public`
and deploys functions from `netlify/functions`, as configured in `netlify.toml`.

The interface and reports are in English. Suggestions use the current year and English automatically. Searches use current
tariff data, and reports open directly in the formatted view.

No API key or environment variable is required.
