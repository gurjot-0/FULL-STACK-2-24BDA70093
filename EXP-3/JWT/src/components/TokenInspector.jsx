export default function TokenInspector({ token, decoded }) {
  if (!token) {
    return (
      <div className="empty-state">
        <div className="glyph">◇</div>
        <p>
          No token issued yet. Log in on the left to generate a signed JWT and see it decoded here
          in real time.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="token-strip">
        <span className="seg-header">{decoded.headerB64}</span>
        <span className="dot-sep">.</span>
        <span className="seg-payload">{decoded.payloadB64}</span>
        <span className="dot-sep">.</span>
        <span className="seg-sig">{decoded.sigB64}</span>
      </div>
      <div className="decode-grid">
        <div className="decode-block h">
          <span className="tag">Header</span>
          <pre>{JSON.stringify(decoded.header, null, 2)}</pre>
        </div>
        <div className="decode-block p">
          <span className="tag">Payload (claims)</span>
          <pre>{JSON.stringify(decoded.payload, null, 2)}</pre>
        </div>
      </div>
      <p className="hint" style={{ marginTop: 14 }}>
        Signature = HMAC-SHA256(header + "." + payload, server secret). Re-computed on every
        request to confirm the token wasn't altered after issue.
      </p>
    </>
  );
}
