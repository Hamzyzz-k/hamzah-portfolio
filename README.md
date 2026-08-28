# Hamzah K. — Portfolio

A pixel-art personal portfolio. One long scroll through a boot screen, a
character sheet, an inventory of skills, and a top-down city map you walk
through to see the projects — each stop opens into a write-up with the stack,
links, and a repo button.

Live: https://hamzah-k-portfolio.vercel.app

## Stack

Vite + React 18 + TypeScript. No animation library or UI kit — the scroll
tracking, walk cycle, and camera pan are hand-rolled with
`requestAnimationFrame`. The walking sprite is a hand-authored pixel grid
(`src/sprites/poses.ts`), painted to canvas rather than loaded as an image.

## Running locally

```bash
npm install
npm run dev
```

`npm run build` type-checks and produces a production build in `dist/`.

## Structure

- `src/data/portfolio.ts` — all real content (profile, skills, projects,
  history, socials). The single place to edit if something changes.
- `src/components/ProjectMap/` — the walkable map: path following, camera,
  project stops, and the mobile fallback.
- `src/companion/` — the character that follows you down the page and hands
  off to the map when it's on screen.
- `src/styles/tokens.css` — day/night theme tokens.
