# Gallera

**A quiet gallery for people who love paintings.**

Gallera is a mobile-first art discovery app — think Pinterest, but only paintings.
You flick through a deck of masterworks one at a time; when one stops you, tap it to
open the full work with its story, facts and estimated value; and you keep the ones
you love in **Favorites** and in **albums** you curate yourself.

It's a dependency-free progressive web app: plain HTML, CSS and JavaScript. No build
step, no framework.

---

## Features

- **Flick-through deck** on Home — swipe left/right through a stack of paintings with
  live drag physics; tap to open; a shuffle button for "surprise me".
- **Reading view** for each work — large image, artist, year, movement, medium,
  dimensions, where it lives, an estimated value, a short essay and quick facts.
- **Favorites** — tap the heart anywhere; saved works land in a masonry grid.
- **Albums** — create collections and drop works into them from any painting.
- **Two typographies** — a *Calligraphic* mode (Playfair Display + Cormorant Garamond
  + a formal script) and a clean *Modern* mode, switchable in Profile.
- **Light / dark / auto** themes.
- Works offline as an installable PWA (app shell is cached by a service worker).
- Everything you save is stored locally in the browser.

## The collection

Twelve public-domain masterworks ship with the app — van Gogh, Vermeer, Klimt,
Hokusai, Botticelli, Munch, Monet, Rembrandt, Seurat, Renoir and more — with real
catalogue details. Images are pulled live from Wikimedia Commons; if an image can't
load (for example inside a sandboxed preview that blocks external images), each card
falls back to its own hand-tuned colour field so the layout stays intact.

Add your own by editing [`data.js`](./data.js).

## Run it

It's static — any web server works. For example:

```bash
# Python
python3 -m http.server 8080
# or Node
npx serve .
```

Then open <http://localhost:8080>. On a phone, use **Add to Home Screen** to install it.

## Project layout

```
index.html              app shell (standalone PWA entry)
styles.css              design system + all screens
app.js                  router, deck physics, views, state
data.js                 the collection (edit to add works)
manifest.webmanifest    PWA manifest
sw.js                   service worker (offline app shell)
icons/                  app icons
tools/build-artifact.js bundles everything into one file for an online preview
```

## Design notes

- **Palette:** a warm gallery-wall off-white with a single oxblood accent; a full
  dark theme keyed to the same tokens.
- **Type:** display in Playfair Display, body in Cormorant Garamond, artist names in
  a formal calligraphic script — all swappable to Inter in Modern mode.
- Animations are spring-based and respect `prefers-reduced-motion`.

---

*Public-domain artwork images courtesy of Wikimedia Commons.*
