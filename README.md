# yuanhaozhang.xyz

Personal academic website of Yuanhao Zhang, served by GitHub Pages as a plain static site (no build step).

- `index.html`: all page content (bio, research focus, news, publications, background, service)
- `assets/site.css`, `assets/site.js`: styles, theme toggle, publication filters
- `images/avatar.jpg`: profile photo; `images/pubs/`: publication thumbnails
- `Resume.pdf`: CV linked from the site

## Updating

- **Add a paper:** copy an `<article class="pub">` block in `index.html`. Set `data-y` to its year group and
  `data-t` to one or more research thrusts (`dyad`, `group`, `comm`). Add `data-first` if you are first author.
  Without a thumbnail, use `<div class="fig ph">` and a short label in place of the image.
- **Add news:** add an `<li>` at the top of the `.news` list; give older items `class="extra hidden"` to fold them.

## Preview locally

```bash
python3 -m http.server 4000
```
