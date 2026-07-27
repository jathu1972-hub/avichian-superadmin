# AVICHIAN Super Admin Portal

College administration console for **Avichi Arts and Science College**.

Super Admins manage students, reset temporary passwords, moderate content, run communities and campus events, and view platform analytics. Student passwords are never visible in plain text (Argon2 hashes only).

> **Related repositories**
>
> - API: [avichian-backend](https://github.com/jathu1972-hub/avichian-backend)
> - Student app: [avichian-student-app](https://github.com/jathu1972-hub/avichian-student-app)

---

## Tech stack

| Layer | Technology |
|--------|------------|
| UI | React 19, TypeScript, Vite 6 |
| Styling | Tailwind CSS 4 |
| Motion | Framer Motion |
| Routing | React Router 7 |
| Shared types | `@avichian/shared` (workspace package) |
| Deploy | Netlify (static SPA) |

---

## Features

- Dashboard & analytics
- Student management (create, edit, suspend, activate, lock/unlock)
- Temporary password reset & force password change
- Create Super Admin accounts
- Communities CRUD
- Campus events
- Reports & complaints moderation
- Staff management
- Settings & audit-friendly security actions
- Login history (via student profile)

---

## Folder structure

```text
avichian-superadmin/
├── shared/                 # Shared types & validation
├── src/
│   ├── components/
│   ├── context/
│   ├── lib/                # API client
│   ├── pages/
│   │   └── super-admin/    # Dashboard, students, reports, …
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── vite.config.ts
├── netlify.toml
├── .env.example
└── package.json
```

---

## Prerequisites

- Node.js **20+**
- Running [avichian-backend](https://github.com/jathu1972-hub/avichian-backend)
- A Super Admin account (bootstrap via backend scripts)

---

## Installation

```bash
git clone https://github.com/jathu1972-hub/avichian-superadmin.git
cd avichian-superadmin
npm install
cp .env.example .env
```

---

## Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Production API URL. Leave empty locally (Vite proxies `/api` → `:4000`). |

```env
# Production example
VITE_API_URL=https://api.avichian.in
```

---

## Development

```bash
# Backend
cd avichian-backend && npm run dev

# Portal
cd avichian-superadmin && npm run dev
```

Open **http://localhost:5174/**

```bash
npm run lint
npm run build
npm run preview
```

---

## Production / deployment

1. Set `VITE_API_URL` to the public API.
2. `npm run build` → deploy `dist/`.
3. Allow this origin in backend `FRONTEND_URLS` / CORS.
4. Never expose Super Admin credentials in the frontend build.

---

## Password policy (students)

Super Admin issues temporary passwords (e.g. `Temp@4582`). Students must change password on first login.  
Admins **cannot** view, recover, or download password hashes.

---

## Screenshots

| Dashboard | Students | Security |
|-----------|----------|----------|
| _Add screenshot_ | _Add screenshot_ | _Add screenshot_ |

---

## License

Private college project — All rights reserved © Avichi Arts and Science College.

---

## Support

College IT / platform maintainers only.
