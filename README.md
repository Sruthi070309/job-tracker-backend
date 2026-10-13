# JobTrack Backend (v2.1)

Express + MongoDB Atlas + Mongoose API with JWT authentication, role based access (user / admin), openings, personal job applications and an admin area.

## Endpoints
| Method | URL | Access |
|---|---|---|
| POST | /api/auth/register | public (creates a normal user) |
| POST | /api/auth/login | public |
| GET | /api/auth/me | logged in |
| GET | /api/openings (?type= &q= &location=) | public |
| POST, PUT, DELETE | /api/openings, /api/openings/:id | admin only |
| GET | /api/admin/stats | admin only |
| GET, POST | /api/jobs | logged in (own applications) |
| GET, PUT, DELETE | /api/jobs/:id | logged in (own applications) |

Errors: 400 bad input, 401 not logged in, 403 not allowed, 404 not found, 409 email taken, 500 server error.

## Run
```bash
npm install
# copy .env.example to .env and fill it in
npm run seed          # fills the openings (resets them)
npm run create-admin  # creates or promotes the admin from ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev
```
