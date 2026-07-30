export const FLOW_STEPS = [
  { label: "Submit credentials", detail: "Login form sends username + password" },
  { label: "Server validates user", detail: "Checked against the user store" },
  { label: "JWT generated", detail: "Header + payload signed with HS256" },
  { label: "Token stored client-side", detail: "storageType" },
  { label: "Ready for requests", detail: "Attach as Authorization: Bearer <token>" },
];

export default function FlowSteps({ step, storageType }) {
  const steps = FLOW_STEPS.map((s, i) => (i === 3 ? { ...s, detail: storageType } : s));

  return (
    <div className="flow">
      {steps.map((s, i) => (
        <div key={i} className={`flow-step ${step > i ? "done" : step === i + 1 ? "active" : ""}`}>
          <div className="flow-num">{step > i ? "✓" : i + 1}</div>
          <div className="flow-body">
            <b>{s.label}</b>
            <span>{s.detail}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
