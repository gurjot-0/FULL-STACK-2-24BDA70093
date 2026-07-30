import { useState, useEffect, useRef, useCallback } from "react";
import TopBar from "./components/TopBar.jsx";
import LoginForm from "./components/LoginForm.jsx";
import SessionCard from "./components/SessionCard.jsx";
import FlowSteps from "./components/FlowSteps.jsx";
import TokenInspector from "./components/TokenInspector.jsx";
import RequestLog from "./components/RequestLog.jsx";
import { USERS } from "./data/users.js";
import { issueToken, decodeToken, verifyToken } from "./lib/jwt.js";

const TOKEN_STORAGE_KEY = "jwt_lab_token";

export default function App() {
  const [storageType, setStorageType] = useState("sessionStorage");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [token, setToken] = useState(null);
  const [decoded, setDecoded] = useState(null);
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [logs, setLogs] = useState([]);
  const [step, setStep] = useState(0); // 0 idle, 1 submitted, 2 validated, 3 issued, 4 stored
  const logIdRef = useRef(0);

  const pushLog = useCallback((msg, kind = "info") => {
    logIdRef.current += 1;
    setLogs((l) => [...l.slice(-30), { id: logIdRef.current, msg, kind, t: new Date() }]);
  }, []);

  // tick for live expiry countdown
  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  // restore session on load (demonstrates stateless resume from stored token)
  useEffect(() => {
    const stores = [
      ["sessionStorage", window.sessionStorage],
      ["localStorage", window.localStorage],
    ];
    for (const [name, store] of stores) {
      const existing = store.getItem(TOKEN_STORAGE_KEY);
      if (existing) {
        setStorageType(name);
        setToken(existing);
        setDecoded(decodeToken(existing));
        pushLog(`Restored existing token from ${name} on page load.`, "info");
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isExpired = decoded && decoded.payload.exp <= now;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const user = USERS.find((u) => u.username === username);
    setStep(1);
    pushLog(`POST /login  { username: "${username}" }`, "info");
    await new Promise((r) => setTimeout(r, 250)); // simulate network latency
    if (!user || user.password !== password) {
      setError("Invalid username or password.");
      pushLog("401 Unauthorized — credential check failed", "fail");
      setStep(0);
      return;
    }
    setStep(2);
    pushLog("Credentials validated against user store.", "ok");
    setBusy(true);
    try {
      const { token: newToken } = await issueToken(user);
      setStep(3);
      pushLog("HS256 JWT signed and issued by server.", "ok");
      const store = storageType === "localStorage" ? window.localStorage : window.sessionStorage;
      store.setItem(TOKEN_STORAGE_KEY, newToken);
      setStep(4);
      pushLog(`Token persisted to ${storageType}.`, "ok");
      setToken(newToken);
      setDecoded(decodeToken(newToken));
      setPassword("");
    } catch (err) {
      setError("Token generation failed: " + err.message);
      pushLog("Token signing failed.", "fail");
      setStep(0);
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setDecoded(null);
    setStep(0);
    pushLog("Client cleared token — session ended (server holds no session state).", "info");
  };

  const handleAccessResource = async () => {
    if (!token) return;
    pushLog(`GET /api/profile  Authorization: Bearer ${token.slice(0, 18)}…`, "info");
    await new Promise((r) => setTimeout(r, 200));
    const result = await verifyToken(token);
    if (result.valid) {
      pushLog(`200 OK — access granted to "${result.payload.sub}" (${result.payload.role})`, "ok");
    } else {
      pushLog(`401 Unauthorized — ${result.reason}`, "fail");
    }
  };

  const handleTamper = () => {
    if (!token) return;
    const parts = token.split(".");
    // flip a character in the payload to simulate client-side tampering
    const chars = parts[1].split("");
    const idx = Math.min(3, chars.length - 1);
    chars[idx] = chars[idx] === "A" ? "B" : "A";
    const tampered = [parts[0], chars.join(""), parts[2]].join(".");
    setToken(tampered);
    setDecoded(decodeToken(tampered));
    const store = storageType === "localStorage" ? window.localStorage : window.sessionStorage;
    store.setItem(TOKEN_STORAGE_KEY, tampered);
    pushLog("Payload byte flipped client-side to simulate tampering.", "fail");
  };

  return (
    <div className="wrap">
      <TopBar sessionActive={Boolean(token && !isExpired)} />

      <div className="grid">
        {/* LEFT: login + session control */}
        <div>
          <div className="panel">
            <h2>
              <span className="num">01</span> Sign in
            </h2>

            {!token || isExpired ? (
              <LoginForm
                username={username}
                password={password}
                error={error}
                busy={busy}
                storageType={storageType}
                onUsernameChange={setUsername}
                onPasswordChange={setPassword}
                onStorageTypeChange={setStorageType}
                onSubmit={handleLogin}
              />
            ) : (
              <SessionCard
                decoded={decoded}
                isExpired={isExpired}
                now={now}
                storageType={storageType}
                onAccessResource={handleAccessResource}
                onTamper={handleTamper}
                onLogout={handleLogout}
              />
            )}
          </div>

          <div className="panel">
            <h2>
              <span className="num">02</span> Conceptual flow
            </h2>
            <FlowSteps step={step} storageType={storageType} />
          </div>
        </div>

        {/* RIGHT: token inspector + console */}
        <div>
          <div className="panel">
            <h2>
              <span className="num">03</span> Token inspector
            </h2>
            <TokenInspector token={token} decoded={decoded} />
          </div>

          <div className="panel">
            <h2>
              <span className="num">04</span> Request / auth log
            </h2>
            <RequestLog logs={logs} />
          </div>
        </div>
      </div>

      <div className="foot-note">
        NOTE — this lab signs tokens with WebCrypto entirely in the browser so the HS256 signature,
        expiry, and tamper-detection are real and observable. In a production system the signing key
        never leaves the server: issuance and verification happen server-side, and the client only
        ever holds the opaque token.
      </div>
    </div>
  );
}
