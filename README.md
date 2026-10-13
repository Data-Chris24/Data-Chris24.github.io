# data-chris24.github.io

![DataChris24](assets/img/logo-lockup.png)

Personal portfolio site for Christopher (Chris) Mims: data engineering, analytics engineering, and internal application work, with case studies from Keplr Vision and Performance Systems Integration.

Live at <https://data-chris24.github.io/>.

## How it is built

Hand-written static HTML, CSS, and JavaScript. There is no build step and no framework.

- `index.html` is the single-page home (about, skills, resume, case-study cards, public analysis, testimonials).
- `case-studies/*.html` are one page per project, each with an inline SVG architecture diagram, an ownership section that separates personally authored work from AI-assisted work, a verified-scale table, and a status callout.
- `assets/css/style.css` holds the whole stylesheet. `assets/js/main.js` handles the sidebar, section highlighting, reveal animations, and the typed hero titles. `assets/js/hero.js` draws the animated hero background on a canvas and stays static when the visitor prefers reduced motion.
- `assets/js/typed.umd.js` is the only third-party script (Typed.js, MIT). Fonts come from Google Fonts. There are no analytics or trackers.

## Preview locally

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080/>.

## Content

Every figure on the site traces back to a maintained source record of the underlying work. Please do not edit facts, dates, or metrics on the site without updating that record first.

## Credits

- Typed.js by Matt Boldt (MIT).
- Logo, hero animation, icons, and all page code are original work.
