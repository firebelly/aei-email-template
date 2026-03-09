import type { Feature } from "@emails/aei-connect";
import { TextField } from "./TextField";
import { TextAreaField } from "./TextAreaField";
import { SelectField } from "./SelectField";

export function FeatureEditor({
  feature,
  onChange,
}: {
  feature: Feature;
  onChange: (updated: Feature) => void;
}) {
  const update = (field: keyof Feature, value: string) => {
    onChange({ ...feature, [field]: value });
  };

  return (
    <div>
      <TextField
        label="Label"
        value={feature.label ?? ""}
        onChange={(v) => update("label", v)}
      />
      <TextField
        label="Title"
        value={feature.title}
        onChange={(v) => update("title", v)}
      />
      <TextAreaField
        label="Description (use [link text](url) for links)"
        value={feature.description}
        onChange={(v) => update("description", v)}
        rows={4}
        required
      />
      <TextField
        label="CTA Text"
        value={feature.ctaText}
        onChange={(v) => update("ctaText", v)}
      />
      <TextField
        label="CTA URL"
        value={feature.ctaUrl}
        onChange={(v) => update("ctaUrl", v)}
      />
      <SelectField
        label="CTA Style"
        value={feature.ctaStyle}
        options={[
          { label: "Button", value: "button" },
          { label: "Link", value: "link" },
        ]}
        onChange={(v) => update("ctaStyle", v)}
      />
      <TextField
        label="Image URL"
        value={feature.imageUrl}
        onChange={(v) => update("imageUrl", v)}
        required
        helpText="Aspect ratio: 2:1"
      />
      <TextField
        label="Image Alt"
        value={feature.imageAlt}
        onChange={(v) => update("imageAlt", v)}
        required
      />
    </div>
  );
}
