# Khezez — website for khezez.com

Portfolio site for **Mohammed Khezez**, Creative Director & Cinematographer, Baghdad.
Static site: plain HTML/CSS/JS, no build step, no server code.

The interaction model follows unveil.fr: a light page, frosted-glass chrome, one size of type, and a WebGL stack of glass frames seen through a long lens. Everything is written from scratch (no Three.js, no code, fonts or text from Unveil). All content is Khezez's.

```
index.html                the site
assets/css/style.css      all styles
assets/js/data.js         ALL content: text, projects, images, links
assets/js/app.js          the engine (WebGL stack, transitions, routing, pages)
assets/js/vendor/         GSAP 3.13, Lenis 1.3
assets/fonts/             Inter Tight 400/500 (self-hosted, OFL)
dist/khezez-preview.html  single-file version for quick previews / sending for review
tools/                    image download + build helpers
```

## Preview

- **Quickest:** double-click `dist/khezez-preview.html` (one file, needs internet for the photos).
- **Full folder:** from this folder run `python3 -m http.server 8000` (or `npx serve .`) and open http://localhost:8000

## Put it live on khezez.com

1. Upload `index.html` and the `assets/` folder to any static host: Netlify (drag and drop), Vercel, Cloudflare Pages, or `public_html` on cPanel.
2. Point the khezez.com DNS to that host (today the domain points to Adobe Portfolio).
3. **Before cancelling Adobe Portfolio**, run `tools/download-images.command` (double-click on Mac, or `bash tools/download-images.command`).
   The photos currently load from Khezez's Adobe Portfolio CDN; the script saves all 72 frames (three sizes each) into `assets/media/` and switches the site to them. Upload `assets/media/` too.

## Edit content: `assets/js/data.js`

- Name, bio, services, email, WhatsApp and social links are at the top.
- Projects show in array order. Per project: `title`, `category`, `client`, `year`, `lead`, `body` (extra paragraphs behind "Read more"), `images`, optional `films`.
- Titles appear as `TITLE / CATEGORY` on hover, on the project page and in the next-project link.
- `cards` = how many of the project's first images go into the 3D stack on the home page.
- Image formats: Adobe CDN `uuid|hash600|hash1200|hash1920|ratio`, any URL `https://…/x.jpg|1.78`, or a local file `assets/media/my-project/01.jpg|1.5`. Ratio = width ÷ height; frames keep their real shape in the stack.
- `films`: embed URLs, e.g. `https://player.vimeo.com/video/123456789` or `https://www.youtube.com/embed/ID`. They show as a "Play film" tile and load only when clicked.
- After adding Adobe CDN images: `node tools/make-manifest.js`. After any edit, rebuild the single file: `node tools/build-preview.js`.

**To fill in:** Sky Baghdad, Fiber X TVC, Savana and Gilgamesh University only have a one-line description (their Adobe pages have no text). Add Khezez's own words in `lead` / `body`.
Sky Baghdad's two films are the Adobe video players from the old page. Check they play after launch; swap for Vimeo/YouTube links if not.

## The experience

| View | URL | Interaction |
|---|---|---|
| Overview | `/` | A line of glass frames through a 5° telephoto lens, trailing edge frosted. Scroll, drag or arrow keys move along it. Hover slides a frame out sideways, clears its glass and shows `TITLE / CATEGORY` at the cursor. Click: the frame turns to face you while the rest rush past the lens. Scroll down (or click / Enter) opens the project and the frame settles into the first image of the page. Esc or scroll up returns. |
| Index | `#index` | Year / project / category table; hover shows the frame top-right. |
| Project | `#fiber-x-stills` … | Title and text centred in the first half-screen, then a gap-free two-column grid; click any frame for the lightbox; next project at the end. |
| Frames | `#frames` | Full-bleed seven-column contact sheet of every still, then the lightbox (arrows, swipe, Esc). |
| Studio | `#studio` | Bio, clients, services, links, and a dithered frame top-right that dissolves between shots. |
| Contact | overlay | Frosted overlay with email, WhatsApp, Instagram and studio; other socials bottom-left. |

Also: % preloader, "rack focus" intro, phone layout (the line stands up, drag follows the finger with momentum), keyboard support, `prefers-reduced-motion` and `prefers-reduced-transparency` respected, falls back to the Index if WebGL is unavailable.

Fonts are under the SIL Open Font License, Lenis under MIT (see `licenses/`); GSAP is free under its standard licence.
