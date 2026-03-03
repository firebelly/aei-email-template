export function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  required?: boolean;
}) {
  const empty = required && !value.trim();
  return (
    <div className={`field${empty ? " field-required" : ""}`}>
      <label>{label}{required && <span className="required-mark"> *</span>}</label>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
