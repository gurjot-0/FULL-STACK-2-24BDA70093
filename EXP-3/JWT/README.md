# JWT Access Control Lab

A self-contained, interactive demo of stateless authentication with JSON Web Tokens (JWT) — built for **Experiment 1.3.1: Secure Authentication using JWT**.

Everything runs client-side in the browser. No backend, no build step — open `index.html` and go.

## Live demo

Enable GitHub Pages for this repo (Settings → Pages → Deploy from branch → `main` / root) and it will be served at:

```
https://<your-username>.github.io/<repo-name>/
```

Or just open `index.html` locally in any modern browser.

## What it demonstrates

| Concept | Where to see it |
|---|---|
| Credential validation | Log in with one of the mock accounts below |
| JWT issuance (HS256) | Token is signed in real time with the WebCrypto `SubtleCrypto` API |
| Token structure (header / payload / signature) | Color-coded token inspector panel |
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

- React 18 + Babel Standalone (via CDN, no build tooling)
- Browser `crypto.subtle` for real HMAC-SHA256 signing/verification
- No dependencies to install, no `npm run` required

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
