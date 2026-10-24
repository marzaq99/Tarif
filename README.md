# Tarif XI

Application web : rapport des mesures, conditions, certificats et notes d'un code
douanier à 10 chiffres, d'après l'API UK Trade Tariff (tarif Irlande du Nord, XI).

- `public/index.html` : l'application
- `netlify/functions/tariff.mjs` : relais vers les API (évite les blocages CORS)
- `netlify.toml` / `package.json` : configuration Netlify

Aucune clé API ni variable d'environnement n'est nécessaire.
