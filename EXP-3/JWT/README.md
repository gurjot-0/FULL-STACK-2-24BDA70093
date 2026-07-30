# JWT Access Control Lab

A self-contained, interactive demo of stateless authentication with JSON Web Tokens (JWT) — built for **Experiment 1.3.1: Secure Authentication using JWT**.

Now structured as a standard React + Vite `src` project (previously a single `index.html` file).

## Project structure

```
jwt-access-control-lab/
├── index.html              # Vite entry HTML (loads src/main.jsx)
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx             # React root render
│   ├── App.jsx               # Top-level app: state + handlers
│   ├── styles.css            # All app styling
│   ├── components/
│   │   ├── TopBar.jsx          # Header + session status badge
│   │   ├── LoginForm.jsx       # Username/password + storage toggle
│   │   ├── SessionCard.jsx     # Active session summary + actions
│   │   ├── FlowSteps.jsx       # "Conceptual flow" step tracker
│   │   ├── TokenInspector.jsx  # Header/payload/signature decode view
│   │   └── RequestLog.jsx      # Scrolling request/auth console
│   ├── lib/
│   │   └── jwt.js              # HS256 sign/verify/decode via WebCrypto
│   └── data/
│       └── users.js            # Mock user directory
└── LICENSE
```

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To produce a static production build:

```bash
npm run build
npm run preview   # serve the built dist/ locally to sanity-check it
```

The build output lands in `dist/` and is fully static — no backend required.

## Deploying

`dist/` can be hosted anywhere that serves static files (GitHub Pages, Netlify, Vercel, S3, etc).

For GitHub Pages specifically:
1. `npm run build`
2. Push the contents of `dist/` to a `gh-pages` branch (or use an action such as `peaceiris/actions-gh-pages`)
3. Enable Pages in Settings → Pages → Deploy from branch

## What it demonstrates

| Concept | Where to see it |
|---|---|
| Credential validation | Log in with one of the mock accounts below |
| JWT issuance (HS256) | Token is signed in real time with the WebCrypto `SubtleCrypto` API (`src/lib/jwt.js`) |
| Token structure (header / payload / signature) | Color-coded token inspector panel (`src/components/TokenInspector.jsx`) |
| Token storage | Toggle between `localStorage` and `sessionStorage` before logging in |
| Stateless session resume | Reload the page — the session restores from the stored token, no server session needed |
| Attaching tokens to requests | "Call protected route" sends `Authorization: Bearer <token>` and re-verifies it |
| Integrity / tamper detection | "Simulate tampering" flips a byte in the payload and shows signature verification fail |
| Expiry | Tokens expire after 90 seconds — watch the countdown and the subsequent `401` |

## Mock accounts

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | Administrator |
| `student` | `student123` | Student |

## Tech

- React 18 (via `react` / `react-dom` npm packages)
- Vite for dev server + bundling (no more in-browser Babel transform)
- Browser `crypto.subtle` for real HMAC-SHA256 signing/verification
- Plain CSS (`src/styles.css`), no CSS framework

## ⚠️ Note on security

This demo signs and verifies JWTs **entirely in the browser** so the whole flow — signing, verification, expiry, tamper detection — is visible and inspectable for learning purposes.

In a real application:
- The signing secret must **never** live in client-side code.
- Token issuance and verification happen **server-side only**.
- The client only ever holds and forwards the opaque token.

## Experiment reference

**Aim:** Design and implement a secure authentication system using JWT for user login and session management.

**Objectives:**
- Understand authentication mechanisms in web applications
- Implement token-based authentication using JWT
- Manage user sessions in a stateless architecture
- Handle token storage and validation securely

**Conceptual flow implemented:**
1. User logs in with credentials
2. Server (simulated) validates the user
3. JWT is generated and signed
4. Token is stored on the client (`localStorage` / `sessionStorage`)
5. Token is attached to each outgoing request
6. Token is decoded and verified to extract/authorize the user

## License

MIT — see [LICENSE](LICENSE).
