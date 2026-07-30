export default function LoginForm({
  username,
  password,
  error,
  busy,
  storageType,
  onUsernameChange,
  onPasswordChange,
  onStorageTypeChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit}>
      <label>Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        placeholder="admin"
        className={error ? "field-err" : ""}
        autoComplete="off"
      />
      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        placeholder="••••••••"
        className={error ? "field-err" : ""}
      />

      <label>Token storage</label>
      <div className="storage-toggle">
        <button
          type="button"
          className={storageType === "sessionStorage" ? "active" : ""}
          onClick={() => onStorageTypeChange("sessionStorage")}
        >
          sessionStorage
        </button>
        <button
          type="button"
          className={storageType === "localStorage" ? "active" : ""}
          onClick={() => onStorageTypeChange("localStorage")}
        >
          localStorage
        </button>
      </div>

      {error && <div className="err-msg">{error}</div>}

      <button className="primary" type="submit" disabled={busy}>
        {busy ? "Issuing token…" : "Log in"}
      </button>

      <div className="creds-box">
        Mock accounts —<br />
        <b>admin / admin123</b> (Administrator)
        <br />
        <b>student / student123</b> (Student)
      </div>
    </form>
  );
}
