# במת מפגש: landing page

Landing page for the playback theatre group במת מפגש (Hebrew, right-to-left).

- `page/staging.html`: the page itself, written for the claude.ai draft link. Edit this one.
- `page/assets/`: web-ready images, the logo, the hand paintings and the hero video loop.
- `tools/build-site.mjs`: builds `site/` (the full page with its head, social preview tags and only the assets it uses).
- `site/`: what Netlify publishes (see `netlify.toml`). Don't edit it by hand; rebuild it.

## Updating the live site

```bash
node tools/build-site.mjs
git add -A && git commit -m "..." && git push
```

Netlify deploys every push to `main`. Once the real address is known, build with it so the WhatsApp preview points to it:

```bash
SITE_URL=https://www.example.co.il node tools/build-site.mjs
```

## Contact form

The form uses Netlify Forms (`data-netlify="true"`, form name `contact`). Submissions show up in the Netlify site under
Forms, and email notifications are set there (Forms > Form notifications). Inside the claude.ai draft link the form only
shows a message, because it can't send anywhere from there.

## Hidden review panel

Opening the page with `#review` at the end of the address turns on the panel for comparing versions, colors and fonts, in
that browser only.
