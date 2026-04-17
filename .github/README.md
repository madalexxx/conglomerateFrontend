# Paradigm Solutions

A corporate front masquerading as a communications technology startup. Beneath the polished interface lies a comprehensive scaffold for the expansion of the Cthulhu Mythos by Mad Alex.

**Status:** Active. Not for public eyes.

![Paradigm Solutions](https://img.shields.io/badge/Status-Operational-darkred) ![Classification](https://img.shields.io/badge/Classification-CONFIDENTIAL-black) ![Built](https://img.shields.io/badge/Built%20with-Astro%20%2B%20Madness-purple)

## Purpose

This repository serves as a live website for Paradigm Solutions, a fictitious enterprise communications company. Behind the bland corporate veneer exists a carefully organized system for documenting and expanding the Cthulhu Mythos.

The site allows for:

- Public-facing documentation disguised as company resources
- Seamless integration with the CLASSIFIED directory structure
- Referenced materials from the Miskatonic Archive
- Operational protocols buried in policy pages
- Knowledge dissemination masked as corporate communications

## Directory Structure

```bash
workspace/
├── Paradigm Solutions/          # The public-facing corporate facade
│   ├── src/
│   │   ├── components/         # UI components (Astro + React)
│   │   ├── layouts/            # Layout templates
│   │   ├── lib/                # Documentation scanner & utils
│   │   └── pages/              # Routable pages (about, privacy, terms, etc.)
│   └── README.md              # This file
│
├── CLASSIFIED/                  # Primary containment archive
│   ├── DOSSIER/                # Operational dossiers
│   ├── INITIATIVE/             # Active initiatives
│   ├── MEMORANDUM/             # Classified communications
│   └── PROTOCOL/               # Operational protocols
│
├── Miskatonic Archive/          # Literary reference library
│   ├── works/                  # Canonical texts & grimoires
│   ├── bibliography.md         # Source material index
│   └── templates/              # Documentation templates
│
├── An'ras/                      # Supplementary materials
│   ├── ebooks/
│   ├── graphics/
│   └── changelog/
│
└── [Various workspace documentation files]
```

## Architecture

The website is built on **Astro** with React components. It includes:

- **Auto-scanning documentation** - The `/CLASSIFIED` directory is automatically scanned and integrated into the site structure via `src/lib/doc-scanner.ts`
- **Theme toggle** - Dark/light mode with localStorage persistence
- **Responsive design** - Mobile-first approach with Tailwind CSS
- **Type safety** - Full TypeScript support

### Key Files

- [src/layouts/main.astro](src/layouts/main.astro) - Primary layout wrapper
- [src/lib/doc-scanner.ts](src/lib/doc-scanner.ts) - Automatically discovers and indexes CLASSIFIED documentation
- [src/components/Header.tsx](src/components/Header.tsx) - Navigation & branding
- [src/components/Footer.tsx](src/components/Footer.tsx) - Footer with links & copyright

## Licensing & Use

**The Paradigm Solutions website and all proprietary content are not licensed for distribution or modification.**

**The CLASSIFIED directory, however, is available for community creators:**

The Cthulhu Mythos universe expansion framework in `/CLASSIFIED` is licensed for other creators to:

- Write original stories in this fictional universe
- Create derivative artworks and graphics
- Develop supplementary documentation
- Contribute to the broader mythos

For contributions to the CLASSIFIED section, please see the CLASSIFIED directory guidelines.

## Tech Stack

- **[Astro 5.16](https://astro.build/)** - Static site generator & framework
- **[React 19](https://react.dev/)** - Component library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Styling framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Accessible component library
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide Icons](https://lucide.dev/)** - Icon set
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI primitives

## Project Credits

**Created by:** [Mad Alex](https://backstage.carnivalofcalamity.xyz)
**Purpose:** Cthulhu Mythos Expansion Framework
**Status:** Active Development
**Classification:** CONFIDENTIAL

---

*Paradigm Solutions exists. Its operations are transparent. You understand.*
