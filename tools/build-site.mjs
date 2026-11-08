// Builds the launch folder for Netlify from the draft page.
// The draft (page/staging.html) is written for the claude.ai artifact, which supplies the <html>/<head> skeleton;
// here we add that skeleton ourselves, plus the WhatsApp/social preview tags, and copy only the files the page uses.
// Run: node tools/build-site.mjs   (set SITE_URL once the real address is known)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = (process.env.SITE_URL || 'https://bamatmifgash.netlify.app').replace(/\/$/, '');
const TITLE = 'במת מפגש | תיאטרון פלייבק';
const DESC = 'תיאטרון פלייבק לארגונים, למוסדות חינוך, לקהילות ולאירועים משפחתיים. אנשים. תוכן. יצירה.';

const src = fs.readFileSync(path.join(root, 'page/staging.html'), 'utf8');
const cut = src.indexOf('</style>') + '</style>'.length;
let head = src.slice(0, cut), body = src.slice(cut);
head = head.replace(/<title>[^<]*<\/title>/, `<title>${TITLE}</title>`)
           .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${DESC}">`)
           .replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '');

const html = `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
${head.split('\n')[0]}
<meta property="og:type" content="website">
<meta property="og:locale" content="he_IL">
<meta property="og:site_name" content="במת מפגש">
<meta property="og:title" content="${TITLE}">
<meta property="og:description" content="${DESC}">
<meta property="og:url" content="${SITE_URL}/">
<meta property="og:image" content="${SITE_URL}/assets/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#272262">
<link rel="icon" href="assets/favicon.png">
<style>body{margin:0}img{max-width:100%}:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}</style>
${head.split('\n').slice(1).join('\n')}
<script>window.BM_LIVE=true</script>
</head>
<body>
${body.trim()}
</body>
</html>
`;

const out = path.join(root, 'site');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'assets'), { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);

// copy every asset the page references, plus the preview image and icon
const used = new Set([...html.matchAll(/assets\/([\w.-]+)/g)].map(m => m[1]));
for (const f of used) {
  const from = path.join(root, 'page/assets', f);
  if (fs.existsSync(from)) fs.copyFileSync(from, path.join(out, 'assets', f));
  else console.warn('missing asset:', f);
}
console.log(`site/ built for ${SITE_URL}: index.html + ${fs.readdirSync(path.join(out, 'assets')).length} assets`);
