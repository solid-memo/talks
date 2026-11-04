// SPDX-FileCopyrightText: 2026 Anton Wiklund and Solid Memo contributors
//
// SPDX-License-Identifier: MIT

// `npm run check:slides`: what a talk needs so that someone else can give
// it, and everyone can follow it (CONTRIBUTING.md#a-talks-rules):
// - a title and a description in its front matter;
// - speaker notes on every slide (an HTML comment that is not a Marp
//   directive);
// - a description on every picture, beyond Marp's sizing keywords;
// - every picture it shows in its own images/ folder.
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { talks } from './talks.mjs';

// Marp's image keywords (https://marpit.marp.app/image-syntax), which are
// not a description.
const keyword =
  /^(bg|left|right|contain|cover|fit|auto|vertical|\d+%|(left|right):\d+%|(w|h|width|height):\S+|(blur|brightness|contrast|drop-shadow|grayscale|hue-rotate|invert|opacity|saturate|sepia)(:\S+)?)$/;
// A directive comment sets Marp's options, such as `_class: lead`.
const directive = /^\s*_?[a-zA-Z]+\s*:/;

const problems = [];
for (const talk of talks()) {
  const say = (slide, message) => problems.push(`${talk.name}/slides.md, slide ${slide}: ${message}`);
  if (!/^---\n[\s\S]*?^title:/m.test(talk.source)) say(0, 'the front matter has no title:');
  if (!/^---\n[\s\S]*?^description:/m.test(talk.source)) say(0, 'the front matter has no description:');
  const body = talk.source.replace(/^---\n[\s\S]*?\n---\n/, '');
  const slides = body.split(/^---$/m);
  slides.forEach((slide, index) => {
    const number = index + 1;
    const comments = [...slide.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1]);
    if (!comments.some((c) => c.trim() && !directive.test(c))) say(number, 'it has no speaker notes');
    for (const [, alt, src] of slide.matchAll(/!\[([^\]]*)\]\(([^)\s]+)[^)]*\)/g)) {
      const words = alt.split(/\s+/).filter((w) => w && !keyword.test(w));
      if (words.join(' ').length < 10) say(number, `the picture ${src} has no description`);
      if (!/^images\/(?!(.*\/)?\.\.(\/|$))/.test(src)) say(number, `the picture ${src} is not in the talk's images/ folder`);
      else if (!existsSync(join(dirname(talk.path), src))) say(number, `the picture ${src} does not exist`);
    }
  });
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`Every talk's slides have notes, and every picture a description.`);
