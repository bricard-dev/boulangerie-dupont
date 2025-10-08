This is a [Next.js](https://nextjs.org) project integrated with [Sanity CMS](https://www.sanity.io/).

## 🚀 Quick Start - Revalidation Sanity

Pour activer la revalidation automatique de vos posts Sanity, consultez **[QUICK_START_REVALIDATION.md](./QUICK_START_REVALIDATION.md)** (5 minutes).

### Documentation disponible

- 📘 **[QUICK_START_REVALIDATION.md](./QUICK_START_REVALIDATION.md)** - Guide de démarrage rapide
- 📘 **[REVALIDATION_SETUP.md](./REVALIDATION_SETUP.md)** - Configuration détaillée
- 📘 **[WEBHOOK_EXAMPLES.md](./WEBHOOK_EXAMPLES.md)** - Exemples de webhooks Sanity
- 📘 **[CHANGELOG_REVALIDATION.md](./CHANGELOG_REVALIDATION.md)** - Résumé des modifications
- 📘 **[app/api/revalidate/README.md](./app/api/revalidate/README.md)** - Documentation des routes API

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

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-09-25
NEXT_PUBLIC_SANITY_STUDIO_URL=http://localhost:3333

# Sanity Token (for draft mode and live preview)
SANITY_API_READ_TOKEN=your-read-token

# Sanity Revalidation Secret
# Generate with: openssl rand -base64 32
SANITY_REVALIDATE_SECRET=your-secret-here
```

## Revalidation

This project includes automatic revalidation when content changes in Sanity:

- **Tag-based revalidation**: `/api/revalidate/tag`
- **Path-based revalidation**: `/api/revalidate/path`
- **Test route** (dev only): `/api/revalidate/test`

See **[QUICK_START_REVALIDATION.md](./QUICK_START_REVALIDATION.md)** for setup instructions.

## Learn More

To learn more about Next.js and Sanity, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Sanity Documentation](https://www.sanity.io/docs) - learn about Sanity CMS.
- [next-sanity Documentation](https://github.com/sanity-io/next-sanity) - learn about the Next.js + Sanity integration.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
