export default function RequestLog({ logs }) {
  return (
    <div className="console">
      {logs.length === 0 ? (
        <div className="line">Waiting for activity…</div>
      ) : (
        logs.map((l) => (
          <div key={l.id} className={`line ${l.kind}`}>
            <span className="ts">{l.t.toLocaleTimeString([], { hour12: false })}</span>
            {l.msg}
          </div>
        ))
      )}
    </div>
  );
}
