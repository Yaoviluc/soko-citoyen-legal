// Build privacy.html + terms.html from the canonical Markdown sources
// in C:/Users/lucho/soko/docs/legal/. SOKO branded shell + shared CSS.
import { readFileSync, writeFileSync } from "node:fs";
import { marked } from "marked";

const SRC_DIR = "../docs/legal";
const OUT_DIR = "./";

const docs = [
  { md: "privacy.md", html: "privacy.html", title: "Politique de confidentialité", subtitle: "Comment SOKO traite vos données" },
  { md: "terms.md",   html: "terms.html",   title: "Conditions d'utilisation",      subtitle: "Les règles d'usage de SOKO Citoyen" },
];

const LOGO_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2 L19 7 V17 L12 22 L5 17 V7 Z"/><path d="M12 2 V22"/></svg>`;

function shell({ title, subtitle, body, canonical }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
<meta name="theme-color" content="#1B5E20" />
<title>${title} — SOKO Citoyen</title>
<meta name="description" content="${subtitle}. SOKO Citoyen — application multi-services pour 21 pays CEDEAO + CEMAC." />
<link rel="canonical" href="https://yaoviluc.github.io/soko-citoyen-legal/${canonical}" />
<link rel="stylesheet" href="legal-style.css" />
</head>
<body>
<div class="topbar">
  <a class="back" href="index.html">← Documents légaux</a>
  <span class="crumb">SOKO Citoyen / ${title}</span>
</div>
<header class="doc">
  <div class="logo">${LOGO_SVG} SOKO CITOYEN</div>
  <h1>${title}</h1>
  <div class="meta">${subtitle} · <strong>Version 1.0</strong> · 14 mai 2026</div>
</header>
<article>
${body}
</article>
</body>
</html>
`;
}

for (const d of docs) {
  const md = readFileSync(`${SRC_DIR}/${d.md}`, "utf8");
  const trimmed = md
    .replace(/^# .+\n+/, "")
    .replace(/^\*\*Dernière mise à jour.+\n+/m, "")
    .replace(/^\*\*Version.+\n+/m, "")
    .replace(/^\*\*Langues.+\n+/m, "");
  const body = marked.parse(trimmed, { breaks: false, gfm: true });
  writeFileSync(`${OUT_DIR}/${d.html}`, shell({ title: d.title, subtitle: d.subtitle, body, canonical: d.html }));
  console.log(`✓ ${d.html} (${body.length} chars)`);
}
