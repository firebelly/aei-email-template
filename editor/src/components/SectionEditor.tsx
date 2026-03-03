import type { ContentSection, BorderColor } from "@emails/aei-connect";
import { TextField } from "./fields/TextField";
import { SelectField } from "./fields/SelectField";
import { ArticleListEditor } from "./fields/ArticleListEditor";
import { FeatureEditor } from "./fields/FeatureEditor";
import { NewsItemListEditor } from "./fields/NewsItemListEditor";

const borderColorOptions: { label: string; value: BorderColor }[] = [
  { label: "Purple", value: "border-l-aei-purple" },
  { label: "Green", value: "border-l-aei-green" },
  { label: "Teal", value: "border-l-aei-teal" },
  { label: "Blue", value: "border-l-aei-blue" },
  { label: "Yellow", value: "border-l-aei-yellow" },
  { label: "Red", value: "border-l-aei-red" },
];

const startWithOptions = [
  { label: "Text", value: "text" },
  { label: "Image", value: "image" },
];

export function SectionEditor({
  section,
  onChange,
}: {
  section: ContentSection;
  onChange: (updated: ContentSection) => void;
}) {
  switch (section.type) {
    case "article-grid":
      return (
        <div>
          <TextField
            label="Heading"
            value={section.heading}
            onChange={(v) => onChange({ ...section, heading: v })}
            required
          />
          <SelectField
            label="Border Color"
            value={section.borderColor}
            options={borderColorOptions}
            onChange={(v) => onChange({ ...section, borderColor: v as BorderColor })}
          />
          <SelectField
            label="Start With"
            value={section.startWith}
            options={startWithOptions}
            onChange={(v) => onChange({ ...section, startWith: v as "text" | "image" })}
          />
          <ArticleListEditor
            articles={section.articles}
            onChange={(articles) => onChange({ ...section, articles })}
          />
        </div>
      );
    case "feature":
      return (
        <div>
          <TextField
            label="Section Heading"
            value={section.sectionHeading}
            onChange={(v) => onChange({ ...section, sectionHeading: v })}
            required
          />
          <SelectField
            label="Border Color"
            value={section.borderColor}
            options={borderColorOptions}
            onChange={(v) => onChange({ ...section, borderColor: v as BorderColor })}
          />
          <FeatureEditor
            feature={section.feature}
            onChange={(feature) => onChange({ ...section, feature })}
          />
        </div>
      );
    case "news":
      return (
        <div>
          <TextField
            label="Heading"
            value={section.heading}
            onChange={(v) => onChange({ ...section, heading: v })}
            required
          />
          <NewsItemListEditor
            items={section.items}
            onChange={(items) => onChange({ ...section, items })}
          />
        </div>
      );
  }
}
