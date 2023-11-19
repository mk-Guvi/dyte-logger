## Getting Started


#### Dependency Setup

- Next Js
- React
- Typescript
- node version: ^18.14.2

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

---

## Branching Conventions

- `main` - Stable code for release.
- `release/[version-number]` - Base branch for development release.
- `feature/[feature-name]` - Feature branch derived from **release/[version-number]**.
- `fix/[feature-name]` - Hotfix branch after the `release` branch has been merged to **main**.

> <span style="color:#228BE6"> NOTE: feature-name should be beacon cased to avoid multi level slashes on branching. </span>

---

## Commit Message Conventions

#### Commit Tags

- `init` - when initializing a feature with base setup.
- `wip` - When the work in progress and checking out to different branch on uncircumstance situations.
- `feature` - added new features/modules.
- `improvements` - updates on existing features.
- `revamp` - when improved an existing code either logic wise or feature wise.
- `fix` - when fixing bugs/issues
- `ui` - when worked majorly on style changes for an feature.
- `test` - when test cases are added.
- `config` - when worked on config level changes like env, lang updates.

> <span style="color:#228BE6"> NOTE: Keep these commit tags in your commit message and don't mispell. </span>
