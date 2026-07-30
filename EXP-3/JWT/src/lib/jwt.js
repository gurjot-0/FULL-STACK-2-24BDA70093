// ---------- JWT (HS256) signing & verification via WebCrypto ----------
//
// NOTE: this signs and verifies entirely in the browser so the flow is
// visible for learning purposes. In a real application the signing secret
// must never live in client-side code — issuance and verification happen
// server-side only, and the client only ever holds the opaque token.

export const SECRET = "lab-1.3.1-mock-server-secret"; // demo only
export const TOKEN_TTL_SECONDS = 90; // short TTL so expiry is easy to observe

/* ---------- base64url helpers ---------- */
export function b64urlEncode(bytes) {
  let str = "";
  const arr = bytes instanceof Uint8Array ? bytes : new TextEncoder().encode(bytes);
  arr.forEach((b) => (str += String.fromCharCode(b)));
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function b64urlDecodeToString(b64url) {
  let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  return atob(b64);
}

/* ---------- HMAC-SHA256 ---------- */
export async function hmacSha256(message, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return b64urlEncode(new Uint8Array(sig));
}

/* ---------- issue ---------- */
export async function issueToken(user) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: user.username,
    name: user.name,
    role: user.role,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  };
  const headerB64 = b64urlEncode(JSON.stringify(header));
  const payloadB64 = b64urlEncode(JSON.stringify(payload));
  const signingInput = `${headerB64}.${payloadB64}`;
  const signature = await hmacSha256(signingInput, SECRET);
  return { token: `${signingInput}.${signature}`, header, payload };
}

/* ---------- decode (no verification) ---------- */
export function decodeToken(token) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    return {
      headerB64: parts[0],
      payloadB64: parts[1],
      sigB64: parts[2],
      header: JSON.parse(b64urlDecodeToString(parts[0])),
      payload: JSON.parse(b64urlDecodeToString(parts[1])),
    };
  } catch (e) {
    return null;
  }
}

/* ---------- verify signature + expiry, as a resource server would ---------- */
export async function verifyToken(token) {
  const parts = token.split(".");
  if (parts.length !== 3) return { valid: false, reason: "Malformed token structure" };
  const [headerB64, payloadB64, sigB64] = parts;
  const expectedSig = await hmacSha256(`${headerB64}.${payloadB64}`, SECRET);
  if (expectedSig !== sigB64) {
    return { valid: false, reason: "Signature mismatch — token has been tampered with" };
  }
  let payload;
  try {
    payload = JSON.parse(b64urlDecodeToString(payloadB64));
  } catch (e) {
    return { valid: false, reason: "Payload could not be decoded" };
  }
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && now > payload.exp) return { valid: false, reason: "Token expired" };
  return { valid: true, payload };
}

export function fmtTime(ts) {
  return new Date(ts * 1000).toLocaleTimeString([], { hour12: false });
}
