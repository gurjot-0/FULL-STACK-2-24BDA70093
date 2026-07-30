import { fmtTime } from "../lib/jwt.js";

export default function SessionCard({
  decoded,
  isExpired,
  now,
  storageType,
  onAccessResource,
  onTamper,
  onLogout,
}) {
  return (
    <div className="session-card">
      <div className="session-top">
        <div>
          <p className="session-name">{decoded.payload.name}</p>
          <p className="session-role">{decoded.payload.role}</p>
        </div>
        <span className={`pill ${isExpired ? "expired" : "valid"}`}>
          <span className={`dot ${isExpired ? "off" : "on"}`}></span>
          {isExpired ? "expired" : "valid"}
        </span>
      </div>
      <div className="kv">
        <span>Subject (sub)</span>
        <b>{decoded.payload.sub}</b>
      </div>
      <div className="kv">
        <span>Issued at</span>
        <b>{fmtTime(decoded.payload.iat)}</b>
      </div>
      <div className="kv">
        <span>Expires at</span>
        <b>{fmtTime(decoded.payload.exp)}</b>
      </div>
      <div className="kv">
        <span>Time remaining</span>
        <b style={{ color: isExpired ? "var(--red)" : "var(--green)" }}>
          {isExpired ? "0s" : `${Math.max(0, decoded.payload.exp - now)}s`}
        </b>
      </div>
      <div className="kv">
        <span>Stored in</span>
        <b>{storageType}</b>
      </div>

      <div className="actions-row">
        <button className="primary" onClick={onAccessResource} disabled={isExpired}>
          Call protected route
        </button>
      </div>
      <button className="ghost" onClick={onTamper} disabled={isExpired}>
        Simulate tampering with token
      </button>
      <button className="ghost danger" onClick={onLogout}>
        Log out (clear token)
      </button>
    </div>
  );
}
