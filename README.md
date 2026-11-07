# Lead Response Desk (portfolio demo)

Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4.
Version 1 is front-end only: no n8n call is made.

    npm install
    npm run dev      # http://localhost:3000
    npm run build    # production build check

When connecting n8n, edit `src/lib/submitLead.ts` and add `src/app/api/leads/route.ts`.
