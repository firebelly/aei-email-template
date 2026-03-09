export function TextField({
  label,
  value,
  onChange,
  required,
  helpText,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  helpText?: string;
}) {
  const empty = required && !value.trim();
  return (
    <div className={`field${empty ? " field-required" : ""}`}>
      <label>{label}{required && <span className="required-mark"> *</span>}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {helpText && <span className="help-text">{helpText}</span>}
    </div>
  );
}
