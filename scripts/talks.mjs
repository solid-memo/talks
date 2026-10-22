// SPDX-FileCopyrightText: 2026 Anton Wiklund and Solid Memo contributors
//
// SPDX-License-Identifier: MIT

// The talks: every folder at the repository's root with a slides.md, and
// what its front matter says about it.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const root = join(import.meta.dirname, '..');

export const talks = () =>
  readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(root, entry.name, 'slides.md')))
    .map((entry) => {
      const path = join(root, entry.name, 'slides.md');
      const source = readFileSync(path, 'utf8');
      const front = source.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? '';
      const field = (name) => front.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1].replace(/^['"]|['"]$/g, '');
      return {
        name: entry.name,
        path,
        source,
        title: field('title') ?? entry.name,
        description: field('description') ?? '',
      };
    })
    .sort((a, b) => b.name.localeCompare(a.name));
