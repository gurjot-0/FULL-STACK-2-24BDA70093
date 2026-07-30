export default function TopBar({ sessionActive }) {
  return (
    <div className="topbar">
      <div className="brand">
        <div className="brand-mark">JWT</div>
        <div className="brand-text">
          <h1>Access Control Lab</h1>
          <p>Experiment 1.3.1 — Stateless Authentication</p>
        </div>
      </div>
      <div className="badge">
        <span className={`dot ${sessionActive ? "on" : "off"}`}></span>
        {sessionActive ? "Session active" : "No active session"}
      </div>
    </div>
  );
}
