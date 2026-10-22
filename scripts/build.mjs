// SPDX-FileCopyrightText: 2026 Anton Wiklund and Solid Memo contributors
//
// SPDX-License-Identifier: MIT

// `npm run build`: every talk to dist/<talk>/, as a web page (index.html)
// with its pictures, a PDF and a PowerPoint file, and its speaker notes as
// text; and dist/index.html, which lists the talks. GitHub Pages serves
// dist/ (README.md#publishing).
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { marpCli } from '@marp-team/marp-cli';
import { root, talks } from './talks.mjs';

const dist = join(root, 'dist');
rmSync(dist, { recursive: true, force: true });

// The themes, each font they name by its npm package's path
// (url('@fontsource…')) put in as the font file itself, so that a talk's
// page, PDF and PowerPoint file load nothing from anywhere else.
const require = createRequire(import.meta.url);
const themes = mkdtempSync(join(tmpdir(), 'solid-memo-themes-'));
for (const name of readdirSync(join(root, 'themes')).filter((file) => file.endsWith('.css'))) {
  const css = readFileSync(join(root, 'themes', name), 'utf8').replace(
    /url\('(@fontsource[^']+\.woff2)'\)/g,
    (_, font) => `url('data:font/woff2;base64,${readFileSync(require.resolve(font)).toString('base64')}')`,
  );
  writeFileSync(join(themes, name), css);
}

const escape = (text) =>
  text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const marp = async (args) => {
  const status = await marpCli([...args, '--config-file', join(root, '.marprc.yml'), '--theme-set', themes]);
  if (status !== 0) throw new Error(`marp ${args.join(' ')} exited with ${status}`);
};

const all = talks();
for (const talk of all) {
  const out = join(dist, talk.name);
  mkdirSync(out, { recursive: true });
  const images = join(root, talk.name, 'images');
  if (existsSync(images)) cpSync(images, join(out, 'images'), { recursive: true });
  await marp([talk.path, '--output', join(out, 'index.html')]);
  // The PDF and the PowerPoint file are drawn in Chromium, which reads the
  // talk's own pictures from disk.
  await marp([talk.path, '--pdf', '--pdf-outlines', '--allow-local-files', '--output', join(out, `${talk.name}.pdf`)]);
  await marp([talk.path, '--pptx', '--allow-local-files', '--output', join(out, `${talk.name}.pptx`)]);
  await marp([talk.path, '--notes', '--output', join(out, `${talk.name}-notes.txt`)]);
}

rmSync(themes, { recursive: true, force: true });

const items = all
  .map(
    (talk) => `      <li>
        <h2><a href="${talk.name}/">${escape(talk.title)}</a></h2>
        <p>${escape(talk.description)}</p>
        <p class="files"><a href="${talk.name}/${talk.name}.pdf">PDF</a> · <a href="${talk.name}/${talk.name}.pptx">PowerPoint</a> · <a href="${talk.name}/${talk.name}-notes.txt">Speaker notes</a> · <a href="https://github.com/solid-memo/talks/blob/main/${talk.name}/slides.md">Source</a></p>
      </li>`,
  )
  .join('\n');

writeFileSync(
  join(dist, 'index.html'),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Solid Memo talks</title>
    <style>
      :root { color-scheme: light dark; --bg: #f7f6f1; --text: #16202a; --muted: #545c68; --link: #25603a; }
      @media (prefers-color-scheme: dark) { :root { --bg: #11171e; --text: #ecebe4; --muted: #aab4bf; --link: #74cc8e; } }
      body { margin: 0; background: var(--bg); color: var(--text); font: 1.125rem/1.6 system-ui, sans-serif; }
      main { max-width: 44rem; margin: 0 auto; padding: 2rem 1rem; }
      a { color: var(--link); }
      ul { list-style: none; padding: 0; }
      li { margin-block: 2rem; }
      h2 { margin-block-end: 0.25rem; font-size: 1.375rem; }
      p { margin-block: 0.25rem; }
      .files { color: var(--muted); }
    </style>
  </head>
  <body>
    <main>
      <h1>Solid Memo talks</h1>
      <p>Talks about <a href="https://solid-memo.com/">Solid Memo</a>, spaced-repetition flashcards that live in your own Solid Pod. Each can be given by anyone, under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>; the source is on <a href="https://github.com/solid-memo/talks">GitHub</a>.</p>
      <ul>
${items}
      </ul>
    </main>
  </body>
</html>
`,
);
