This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Utviklet med Opencode og oh-my-openagents

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deploy

Appen kjorer pa [Coolify](https://coolify.io) hostet pa [Hetzner](https://www.hetzner.com/).

## Varsler (ntfy)

Appen bruker [ntfy](https://ntfy.sh) for push-varsler. Serveren kjorer pa `https://ntfy.utdanningsplattformen.online` med topic `o-landsleir-2026`.

Send en testmelding med curl:

```bash
curl -H 'Title: Middag kl 18' -H 'Priority: default' -H 'Tags: fork_and_knife' -d 'Husk at middagen starter kl 18 i kantina' 'https://ntfy.utdanningsplattformen.online/o-landsleir-2026'
```

Tilgjengelige parametere:

- **Title**: Overskrift pa meldingen
- **Priority**: `min`, `low`, `default`, `high`, `max`
- **Tags**: Emoji-tags, f.eks. `warning`, `tada`, `loudspeaker`, `bell`, `calendar`, `runner`, `trophy`, `fork_and_knife`, `sun`, `rain_cloud`

Eksempel med hoy prioritet:

```bash
curl -H 'Title: Endring i programmet' -H 'Priority: high' -H 'Tags: warning,loudspeaker' -d 'Kveldsaktivieten er flyttet til kl 20' 'https://ntfy.utdanningsplattformen.online/o-landsleir-2026'
```
