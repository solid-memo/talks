# Solid Memo talks

Talks about [Solid Memo](https://solid-memo.com/), spaced-repetition
flashcards that live in your own Solid Pod. Each talk is Markdown,
built with [Marp](https://marp.app/) into a web page, a PDF and a
PowerPoint file, with speaker notes on every slide, so that anyone can
give it.

The talks are published at <https://solid-memo.github.io/talks/>.

| Talk | For | Length |
| --- | --- | --- |
| [Build the app, let users keep the data](2026-solid-memo/slides.md) | Developers who don't know Solid | 40 minutes |

## Give a talk

The talks are under [CC BY 4.0](LICENSES/CC-BY-4.0.txt): give them,
translate them or change them, and say where they came from, such as
"From Solid Memo's talks, github.com/solid-memo/talks, CC BY 4.0".

Each slide's speaker notes are in its HTML comment, and in the
`-notes.txt` file beside each build. Before a talk, check the figures
the notes say to check: they are true on the day the talk was written,
and the app keeps growing.

## Build

You need Node.js (the version in [.nvmrc](.nvmrc)) and Chrome or
Chromium, which draws the PDF and the PowerPoint file.

```sh
npm ci
npm run check
```

`npm run check` checks the slides (`npm run check:slides`) and builds
every talk into `dist/` (`npm run build`). Marp finds an installed
Chrome by itself; to use another browser, set `CHROME_PATH` to it:

```sh
CHROME_PATH=~/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome npm run check
```

To see a talk while you write it, preview it with Marp, its themes
given: `npx marp --preview --theme-set themes <talk>/slides.md`. The
preview uses your system's fonts; `npm run build` embeds the theme's.

The other checks CI runs need Python's linters:
`pip install -r scripts/requirements-lint.txt`, then
`npm run lint:reuse` (every file states its license) and
`npm run lint:workflows` (the workflows, with actionlint and zizmor).

## How it is made

- **A talk** is a folder at the root, named after its year and subject,
  with its `slides.md` and its pictures in `images/`.
- **The theme**, [themes/solid-memo.css](themes/solid-memo.css), is the
  app's own look: its Standard palette and its fonts, Fredoka and
  Bangers. Every text color meets WCAG AA. The fonts come from npm
  (`@fontsource`) and are embedded in each build, so a talk loads
  nothing from anywhere else.
- **The screenshots** are the website's
  ([apps/web/public/screenshots/](https://github.com/solid-memo/website/tree/main/apps/web/public/screenshots)),
  copied with its license, MIT. The website's `npm run screenshots`
  takes them again from the app.
- **The QR codes** were made with `npx qrcode@1.5.4 -t svg -e M`.

### Publishing

CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) checks and
builds every pull request, and on `main` publishes `dist/` to GitHub
Pages. The repository's Pages source is "GitHub Actions"
(Settings → Pages).

### Dependencies

Marp is the only dependency besides the fonts, pinned to an exact
version, and Renovate keeps it current. `package.json`'s `overrides`
lift three of Marp's dependencies to versions with their advisories
fixed. `npm audit` still reports `extract-zip`, which has no fixed
version: Puppeteer uses it only to download a browser, which the build
never does, as it draws in the Chrome already installed.

## Licenses

- The talks (`*/slides.md`) and their drawings: [CC BY 4.0](LICENSES/CC-BY-4.0.txt).
- The screenshots and the logo, from the website: [MIT](LICENSES/MIT.txt).
- Everything else, the theme, scripts and configuration: [MIT](LICENSE).

[REUSE.toml](REUSE.toml) says which applies to each file, and
`npm run lint:reuse` checks it.

## Contributing

A new talk, a translation or a fix is welcome: see
[CONTRIBUTING.md](CONTRIBUTING.md).
