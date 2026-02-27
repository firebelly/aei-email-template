# AEI Email Template

## Project Overview
Email template for Affiliated Engineers, Inc. (AEI) called "AEI Connect" — a monthly newsletter. Built with React Email by Resend.

## Deliverables
1. **Required**: Compiled HTML template + instructions for the client to modify template code directly. The client will copy-paste the compiled HTML into Constant Contact as a custom template.
2. **Nice-to-have**: A simple content editor UI where the client can update text/images within the fixed template layout and export modified HTML. This is NOT a design tool — no typography controls, no spacing adjustments. Just content swapping and HTML export.

## Tech Stack
- **React Email** (`@react-email/components`) — component-based email templates
- **React 19** + **TypeScript**
- **pnpm** — package manager (specified in package.json via `packageManager` field)
- **Tailwind via React Email** — using `pixelBasedPreset` (email clients don't support rem)

## Key Commands
- `pnpm dev` — local preview server at http://localhost:3000
- `pnpm build` — build for production
- `pnpm export` — compile templates to static HTML

## Project Structure
- `emails/` — email templates (.tsx) and shared config
- `emails/static/` — images (PNG/JPG only, no SVG/WEBP)
- `emails/tailwind.config.ts` — shared Tailwind config with AEI brand colors
- `.claude/skills/react-email/` — React Email Claude Code skill (component docs, patterns, styling guide)

## Design Reference
- `AEI newsletter_concept.pdf` — the client-provided design comp

## Email Client Constraints
- No flexbox/grid — use `Row`/`Column` components (table-based)
- No SVG or WEBP images
- No CSS media queries (sm:, md:, lg:) or dark mode selectors
- Always specify border style (`border-solid`, `border-dashed`, etc.)
- Always use `box-border` on `Button` components
- Keep compiled HTML under 102KB (Gmail clips larger emails)
- Max width ~600px

## Architecture Decisions
- **React Email over MJML**: The prop-based component model maps naturally to a content editor UI. Form fields set props → component re-renders → export HTML.
- **Props-driven template**: All content (text, images, links) is passed as props so the same component serves both the static export and the future editor UI.
- **Shared Tailwind config**: `emails/tailwind.config.ts` centralizes brand colors so templates stay consistent.
