# Evelin B. Eilmess — Portfolio

A dark, cinematic one-page portfolio + freelance services site. Pure static HTML/CSS/JS — no build step, no dependencies. Drops straight onto GitHub Pages.

## Files
```
index.html     — the whole page (structure + content)
styles.css     — design system + all styling
main.js        — scroll reveals, parallax, marquee, nav, mobile menu
```

## Run locally
Just open `index.html` in a browser. (Or run any static server, e.g. `python3 -m http.server`.)

## Deploy to GitHub Pages
1. Create a repo and push these three files (plus this README).
2. Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch**, pick `main` / root.
3. Your site goes live at `https://<username>.github.io/<repo>/`.

### Custom domain (evelineilmess.com)
1. In **Settings → Pages → Custom domain**, enter `www.evelineilmess.com` and save (this creates a `CNAME` file).
2. At your domain registrar, add a **CNAME** record for `www` → `<username>.github.io`, and the four GitHub Pages **A records** for the apex domain (see GitHub's "Managing a custom domain" docs).
3. Tick **Enforce HTTPS** once the cert provisions.

## Swapping the gradient covers for real project images
Each work tile currently uses a generated gradient "cover". To use a real image, replace the `<div class="field" ...>` inside a card's `.cover` with an `<img>`:

```html
<!-- before -->
<div class="field" style="--h:282" data-parallax="0.06"></div>

<!-- after -->
<img class="field" src="images/quorso.jpg" alt="Quorso dashboard UI" data-parallax="0.06">
```
The `.field` styling already handles `object-fit`-style sizing via `position:absolute; inset:0` — add `style="object-fit:cover"` to the img if needed. Keep the `data-parallax` attribute for the scroll effect.

The **portrait** in the About section works the same way — swap `<div class="field">` for your photo.

## Editing content
Everything is plain HTML in `index.html`:
- **Hero headline / lede** — top of file.
- **Work tiles** — the `#work` section. Title, categories, and `--h` (hue, 0–360) per card.
- **Services / Process / Contact / Footer** — clearly commented sections.

## Notes
- Respects `prefers-reduced-motion` (animations disabled for users who ask).
- Fonts load from Google Fonts (Archivo + JetBrains Mono); to self-host, download them into a `fonts/` folder and update the `@import` in `styles.css`.
