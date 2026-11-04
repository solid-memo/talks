# Contributing

A new talk, a translation of one, or a fix to a slide is welcome. The
project's way of working, its code of conduct and how to report a
security issue are the website's: see its
[CONTRIBUTING.md](https://github.com/solid-memo/website/blob/main/CONTRIBUTING.md)
and [GOVERNANCE.md](https://github.com/solid-memo/website/blob/main/GOVERNANCE.md).
What follows is what is particular to the talks.

## Open an issue first

For a new talk, open an issue that says who it is for, how long it is
and what the audience should do afterwards, with an outline of its
slides. A fix to a slide can go straight to a pull request.

## A talk's rules

`npm run check:slides` checks them:

- **The front matter** has a `title:` and a `description:`, which the
  list of talks shows.
- **Every slide has speaker notes**, in an HTML comment, so that someone
  else can give the talk. A comment that starts with a word and a colon
  is read by Marp as a directive, not a note: start a note otherwise.
- **Every picture has a description**, in its alt text beside Marp's
  sizing keywords (`w:300`), saying what it shows.
- **Every picture is in the talk's `images/` folder**, so that the talk
  loads nothing from anywhere else.

And the checks can't see these:

- **Facts come with their source.** A figure about the app (decks,
  languages, servers) is checked against the website's `main` the day it
  is written, and the notes say to check it again before the talk.
- **Plain words** for the audience the talk names, in American English.
- **A new talk is listed** in the README's table, and its license is
  CC BY 4.0, as [REUSE.toml](REUSE.toml) gives every `*/slides.md`.

## Commits

Commits follow [Conventional Commits](https://www.conventionalcommits.org/),
as the website's do: `type(scope): subject`, with a body that says why.
The scope is the talk's folder, such as `feat(2026-solid-memo): add the
slide on courses`.
