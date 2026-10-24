# TARIF SCHEDULE

**Measures, Certificates and Conditions** for a European tariff schedule commodity code.

Enter a 10-digit commodity code and get a complete, structured report of everything the
tariff schedule says about that code: its description and position in the nomenclature, duty
rates and preferences by country, import and export controls, the documents and conditions
attached to each measure, certificates, legal footnotes, and a summary of the customs control
attention points.

---

## Contents

1. [Features](#features)
2. [How to use it](#how-to-use-it)
3. [Understanding the report](#understanding-the-report)
4. [Reading measure conditions](#reading-measure-conditions)
5. [Downloaded text report format](#downloaded-text-report-format)
6. [Project structure](#project-structure)
7. [How it works](#how-it-works)
8. [Deployment (GitHub + Netlify)](#deployment-github--netlify)
9. [Troubleshooting](#troubleshooting)
10. [Data source and notes](#data-source-and-notes)

---

## Features

- **Report by commodity code**: type a 10-digit code and the full report appears, organized in
  nine numbered sections.
- **Keyword and partial-code suggestions**: type a word (for example `spades`) or the beginning
  of a code to get a list of matching codes, then pick one.
- **Measure details on demand**: click any import or export measure to see its full detail
  (country or area, excluded countries, additional code, quota, validity, legal basis,
  footnotes and conditions).
- **Live filter**: narrow the import and export measures by type, country, duty or measure ID.
- **Quick navigation**: shortcut chips jump to each of the nine sections.
- **Copy, download, print**: copy the whole report, download it as a `.txt` file, or print it.
- **Shareable link**: after a search the code is added to the page address
  (for example `...#8201100000`), so a report can be bookmarked or sent to a colleague.
- **No account, no API key, no configuration**.

---

## How to use it

1. Open the site.
2. In the search field, enter:
   - a **10-digit commodity code** (for example `8201100000`), then press **Enter** or click
     **Search** to load the report; or
   - a **keyword** or the **beginning of a code** (at least 2 characters or digits) to get
     suggestions.
3. If you used suggestions, click a code:
   - a 10-digit code opens the report immediately;
   - a shorter code is copied into the search field. Complete it to 10 digits (for example
     `8201` becomes `8201100000`) and press **Enter**.
4. Read the report. Use the chips under the toolbar to jump between sections.
5. Use **Copy Report**, **Download (.txt)** or **Print** as needed.

Only **declarable** commodity codes (10 digits, with no sub-codes below them) return a report.
Headings and sub-headings are not declarable and will return "Code not found or not
declarable".

---

## Understanding the report

The report always has the same nine sections, in the same order.

### 1. COMMODITY

The identity of the commodity code.

| Field | Meaning |
|---|---|
| **Item ID** | The 10-digit commodity code. |
| **Description** | The official description of the goods. |
| **Declarable** | `true` when the code can be used on a declaration (no codes below it). |
| **Meursing code** | Indicates whether the code involves Meursing duty calculation (complex agri-food products whose duty depends on the sugar, flour, milk fat and milk protein content). |
| **Productline suffix** | Structural suffix of the nomenclature entry. `80` means the code is declarable; other values (`10`, `20`, ...) are structural headings only. |
| **Number of indents** | Depth of the code in the nomenclature hierarchy. `0` is a chapter or heading; the value increases by one for each level below. |

### 2. ANCESTORS (heading, chapter, section)

Where the commodity sits in the nomenclature tree: its **section**, **chapter**, **heading** and
any intermediate parent codes ("ancestors"). The section is left empty when no hierarchy data
is returned for the code.

### 3. META / DUTY CALCULATOR

Flags used to decide how duties are calculated for this commodity.

| Field | Meaning |
|---|---|
| **Source** | The tariff schedule the data comes from. |
| **Trade defence** | `true` when trade defence measures (anti-dumping, countervailing duties and similar) apply to the code. |
| **Zero MFN duty** | `true` when the standard third-country (MFN) duty is zero. |
| **Entry price system** | `true` when the code is subject to the entry price system (certain fruit and vegetables). |
| **Meursing code** | `true` when Meursing duty components apply. |
| **VAT options** | The VAT rate options applicable to the commodity, shown as JSON (`{}` when none are returned). |

### 4. IMPORT MEASURES

Every measure that applies when the goods are **imported**. Each row has:

| Column | Meaning |
|---|---|
| **Measure ID** | Unique identifier of the measure. |
| **Type** | The kind of measure, for example *Third country duty*, *Tariff preference*, *Supplementary unit*, *Import control*, *Customs Union Duty*, *Suspension*. |
| **Geo** | The country, group of countries or agreement the measure applies to (`ERGA OMNES` means all countries). |
| **Duty / Rate** | The duty expression, for example `1.70 %`, `3.00 EUR` or a supplementary unit such as `p/st`. When a measure has no duty but has conditions, it shows `(none - see conditions)`; with neither, `(none)`. |
| **Cond** | Number of conditions attached to the measure. |

On screen, **click a row** to expand it. The detail shows:

- the detailed duty and the country or area;
- **excluded countries** (countries exempted from a group measure);
- the **additional code** (a 4-character code that refines the commodity, when required);
- the **quota order number**, for measures linked to a tariff quota;
- the **validity** period (start date and end date, or "no end date");
- the **legal basis** (regulations behind the measure);
- the **footnotes** that apply;
- the full list of **conditions**, with their class, condition code, document code, action
  code and requirement text.

Commonly seen measure types:

| Type | What it is |
|---|---|
| Third country duty | The standard duty for countries without a trade agreement. |
| Tariff preference | A reduced or zero duty under a trade agreement or preferential scheme, usually subject to a proof of origin. |
| Customs Union Duty | The duty applied to countries in a customs union with the territory. |
| Suspension | A temporary duty suspension, often for goods intended for a specific use. |
| Supplementary unit | The additional unit (for example number of items) required on the declaration. |
| Import control | A prohibition or restriction on entry, often with document conditions. |
| Low-value consignment customs duty | A flat duty on low-value consignments. |

### 5. EXPORT MEASURES

Same columns and behavior as section 4, for measures that apply when the goods are
**exported** (for example export prohibitions or restrictions to certain destinations).
Some measures, such as supplementary units, apply to both imports and exports and therefore
appear in both sections.

### 6. MEASURE CONDITIONS (all condition objects in scope)

All the conditions attached to the measures listed in sections 4 and 5, each shown once.

| Column | Meaning |
|---|---|
| **Cond ID** | Unique identifier of the condition. |
| **Code** | Condition code (a letter such as `B`, `C`, `H`, `Y`). Conditions with the same code are alternatives; see [Reading measure conditions](#reading-measure-conditions). |
| **Class** | `document` (a certificate, licence or proof is required), `exemption` (a waiver or particular provision), `threshold` (a quantity or value limit), `negative` (the trade is blocked when no condition is met), or `unknown`. |
| **Doc Code** | The document, certificate or waiver code to present (for example `U088`, `N954`), when applicable. |
| **Action** | The action code that results when the condition is met or not met. |
| **Requirement** | A description of what has to be provided or satisfied. `null` appears when the condition has no text. |

### 7. CERTIFICATES REFERENCED BY THIS COMMODITY

Certificate objects returned for the commodity, with **Cert ID**, **Type**, **Code** and
**Description**. Shows `(none)` when no certificate objects are returned. Document codes
required by conditions still appear in section 6.

### 8. FOOTNOTES

The legal and explanatory notes that apply to the commodity or to its measures: each footnote
has a **code** (for example `TN701`, `CD500`, `TM510`) and its text. Footnotes typically explain
eligibility rules, prohibitions linked to sanctions regulations, or special provisions of the
nomenclature.

### 9. CUSTOMS CONTROL - ATTENTION POINTS

A quick summary to spot what needs checking before a declaration.

| Indicator | What it counts |
|---|---|
| **Measures with document requirements** | Measures that have at least one condition of class `document`. |
| **Measures with exemption conditions** | Measures with at least one `exemption` condition. |
| **Measures with threshold conditions** | Measures with at least one `threshold` condition. |
| **Measures with negative conditions** | Measures with at least one `negative` condition. |
| **Measures linked to a quota order number** | Measures tied to a tariff quota. |
| **Distinct measure_condition objects** | Number of different conditions (rows of section 6). |
| **Distinct certificate objects** | Number of certificate objects (rows of section 7). |
| **Distinct footnote objects** | Number of footnotes (rows of section 8). |

The line **Total measures printed** under the section is the number of rows in sections 4 and
5 together.

---

## Reading measure conditions

Conditions follow two simple rules:

1. **Conditions with the same condition code are alternatives (OR).** The trader only has to
   meet one of them.
2. **When a measure has conditions with different condition codes, the groups combine with
   AND.** One requirement from each code group has to be met.

Examples:

- A tariff preference with condition code `B` listing several proofs of origin (for example an
  origin declaration, a movement certificate, an invoice declaration): present **any one** of
  them to benefit from the preference.
- A measure whose conditions are all `negative` and `exemption` / `document` entries: the goods
  are blocked unless one of the listed documents or exemptions applies.
- A `threshold` condition (a maximum quantity or value) together with an exemption (for example
  personal use) can form an AND combination.

The **Cond** column in sections 4 and 5 tells you at a glance how many conditions to look at;
expand the row to read them in context.

---

## Downloaded text report format

**Copy Report** and **Download (.txt)** produce a plain, fixed-width text version of the
report with the same nine sections, convenient to paste into an email or a file note. In this
text version, long values are shortened with `...`:

| Value | Limit |
|---|---|
| Measure type | 33 characters |
| Geographic area | 23 characters |
| Duty / Rate | 23 characters |
| Condition requirement | 73 characters |
| Footnote text | 113 characters |

The on-screen report always shows the full text. The downloaded file is named
`tarif-schedule-report-<code>.txt`.

---

## Project structure

```
.
├── public/
│   └── index.html            The whole application (page, styles, report engine)
├── netlify/
│   └── functions/
│       └── tariff.mjs        Server function that relays requests to the tariff APIs
├── netlify.toml              Netlify configuration (publish folder, functions folder)
├── package.json              Project metadata
├── .gitignore
└── README.md
```

The folders **must keep this exact layout**. The site is served from `public`, and the
function is deployed from `netlify/functions`.

---

## How it works

1. The page sends the code to its own server function at `/api/commodity?code=<10 digits>`.
2. The function validates the code (exactly 10 digits), requests the commodity from the tariff
   API and returns the response unchanged.
3. The page reads the response, resolves every reference (measure types, geographic areas,
   duty expressions, conditions, footnotes, certificates) and builds the nine sections.
4. Suggestions work the same way through `/api/suggest?term=<text>`, which returns matching
   codes for the current year in English.

Why a server function? Browsers block direct calls to other websites unless those sites allow
it. Routing through the function avoids that restriction, and results are cached briefly
(1 hour for reports, 10 minutes for suggestions) to keep the app fast and light on the source.

| Endpoint | Purpose | Input rules |
|---|---|---|
| `GET /api/commodity` | Returns the commodity data used for the report | `code`: exactly 10 digits |
| `GET /api/suggest` | Returns code suggestions | `term`: 2 to 100 characters |

---

## Deployment (GitHub + Netlify)

No build step, no API key and no environment variable are needed.

### 1. GitHub

1. Create a repository (for example `Tarif`).
2. Add the files with the exact layout shown in [Project structure](#project-structure).
   When creating a file on GitHub, type the folder in the file name: `public/index.html`,
   `netlify/functions/tariff.mjs`.
3. Commit to the `main` branch.

### 2. Netlify

1. In Netlify choose **Add new project**, then **Import an existing project**, then **GitHub**,
   and select the repository. If it is not listed, grant the Netlify app access to it in
   GitHub under **Settings > Applications > Netlify > Configure > Repository access**.
2. Use these settings (they come from `netlify.toml`):

   | Setting | Value |
   |---|---|
   | Branch to deploy | `main` |
   | Base directory | empty |
   | Build command | empty |
   | Publish directory | `public` |
   | Functions directory | `netlify/functions` |
   | Environment variables | none |

3. Click **Deploy**. Every later commit to `main` redeploys the site automatically.

### Updating the site

Edit or replace the file on GitHub (pencil icon, or **Add file > Upload files**) and commit to
`main`. Netlify redeploys within about a minute. Reload the page with **Ctrl+F5** to see the
new version.

---

## Troubleshooting

| Message or symptom | Cause and fix |
|---|---|
| Deploy fails with *Deploy directory 'public' does not exist* | The `public` folder is missing from the repository. Create `public/index.html` on GitHub (type `public/index.html` as the file name), then trigger a new deploy with **Clear cache and deploy site**. |
| *Service unreachable: check your connection, or that the Netlify function is deployed.* | The server function is not deployed. Check that `netlify/functions/tariff.mjs` exists in the repository and look at the **Functions** tab in Netlify. |
| *Code not found or not declarable (a declarable 10-digit code is required).* | The code does not exist, is not 10 digits, or is a heading or sub-heading rather than a declarable code. Use the suggestions to find a full code. |
| *The code must have exactly 10 digits.* | Complete the code to 10 digits. |
| *Too many requests, please wait a few seconds.* | The source limited the number of requests. Wait a moment and search again. |
| *Remote service unreachable / Remote service error* | The source is temporarily unavailable. Try again shortly. |
| The page looks unchanged after an update | Reload with **Ctrl+F5** to bypass the browser cache. |
| A section shows "No data" or `(none)` | The source returned nothing for that section for this code; this is normal for many codes (for example, few commodities have certificate objects). |

---

## Data source and notes

- Data comes from the official **UK Trade Tariff API** (no authentication required), version 2,
  using the European tariff schedule data set. The tariff is updated daily by the source.
- The data is published under the **Open Government Licence v3.0**.
- This tool is a **reading aid**. Always verify measures, duties and requirements against the
  official tariff and the applicable legislation before making a declaration or a customs
  decision.
