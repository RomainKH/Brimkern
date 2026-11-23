# Brimkern SDK — Ready-to-run starters

Three minimal, zero-build examples demonstrating `brimkern` running 100% on the visitor's GPU (WebGPU, no server, no API key):

1. **[docs-qa](docs-qa/index.html)** — Drop-in Q&A widget for any static docs site (Astro, Docusaurus, Nextra). Automatically indexes `<section>` headings & text from the page into `knowledge`, with clickable `showSources: true`.
2. **[offline-shop](offline-shop/index.html)** — Offline e-commerce assistant with product knowledge cards, built-in `calc` tool, and persistent `localStorage` thread history.
3. **[structured-extract](structured-extract/index.html)** — Local JSON extraction & ticket classifier using `Brimkern.generateJson({ schema, prompt })` with automatic schema validation.

## Run locally

Serve the repository root (or any example folder) over HTTP so WebGPU & the script tag load cleanly:

```bash
npx serve .
# then open http://localhost:3000/examples/docs-qa/
```

Each HTML file uses `/sdk.js` when served from the Brimkern repo, or you can point the `<script>` tag to `https://brimkern.com/sdk.js` (or `npm i brimkern` in a Vite / Next.js app).
