export function TextField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
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
    </div>
  );
}
