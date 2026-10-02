#!/usr/bin/env node
/* Builds a single self-contained HTML file for publishing as a claude.ai
   Artifact (which has no build step and blocks most external resources).
   It inlines styles.css + data.js + app.js into one file with the Google
   Fonts link kept external (that host is allowed by the Artifact CSP).

   Usage: node tools/build-artifact.js [outfile]
*/
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');

const css = read('styles.css');
const data = read('data.js');
const app = read('app.js');

const FONTS =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500' +
  '&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400' +
  '&family=Petit+Formal+Script&family=Inter:wght@400;500;600;700&display=swap';

const html = `<meta charset="utf-8">
<title>Gallera</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<style>
${css}
</style>

<div class="app" id="app">
  <div class="stage" id="stage">
    <div class="screen" id="screen"></div>
  </div>
  <nav class="tabbar" id="tabbar"></nav>
  <div class="scrim" id="scrim"></div>
  <div class="sheet" id="sheet"></div>
  <div class="toast" id="toast"></div>
</div>

<script>
${data}
${app}
</script>
`;

const out = process.argv[2] || path.join(root, 'dist', 'gallera.html');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log('wrote', out, '(' + Math.round(html.length / 1024) + ' KB)');
