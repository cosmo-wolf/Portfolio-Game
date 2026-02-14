# Vercel Deployment Setup

This project is a static Canvas app (`index.html` + `css/` + `js/`), so Vercel deployment is straightforward.

## Option 1: Deploy via Vercel Dashboard

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Go to `https://vercel.com/new`.
3. Import the repository.
4. Use these settings:
   - Framework Preset: `Other`
   - Build Command: *(leave empty)*
   - Output Directory: *(leave empty / `.`)*
5. Click `Deploy`.

Vercel will serve `index.html` as the entry page.

## Option 2: Deploy via Vercel CLI

## Prerequisite

```powershell
npm i -g vercel
```

## Deploy

```powershell
cd e:\Codes\Portfolio
vercel
```

Follow prompts:
- Set scope/team
- Link to existing project or create new
- Confirm current directory as project root

For production deployment:

```powershell
vercel --prod
```

## Optional `vercel.json`

You can keep defaults, but if you want explicit static routing, add:

```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

## Post-Deploy Checklist

1. Load homepage and verify canvas renders.
2. Validate keyboard controls (`WASD`, `F`, `T`, `L`).
3. Confirm terminal transition and command execution.
4. Confirm biome switching via `PORTAL_GATE`.

## Notes

- No server runtime is required.
- No API routes are required.
- Assets are procedural; deployment payload is lightweight.
