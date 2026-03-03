import type { AEIConnectProps, ContentSection } from "@emails/aei-connect";
import { TextField } from "./fields/TextField";
import { TextAreaField } from "./fields/TextAreaField";
import { SectionListEditor } from "./SectionListEditor";

export function EditorForm({
  props,
  updateProps,
  updateSection,
  reorderSections,
  removeSection,
  addSection,
}: {
  props: AEIConnectProps;
  updateProps: <K extends keyof AEIConnectProps>(
    key: K,
    value: AEIConnectProps[K],
  ) => void;
  updateSection: (index: number, section: ContentSection) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  removeSection: (index: number) => void;
  addSection: (section: ContentSection) => void;
}) {
  const heroMissing =
    !props.previewText.trim() ||
    !props.issueTitle.trim() ||
    !props.heroImageUrl.trim() ||
    !props.introText.trim();

  return (
    <div>
      {/* Header & Intro */}
      <details open className={heroMissing ? "details-missing" : undefined}>
        <summary>Header &amp; Intro</summary>
        <div className="section-content">
          <TextField
            label="Preview Text"
            value={props.previewText}
            onChange={(v) => updateProps("previewText", v)}
            required
          />
          <TextField
            label="Issue Title"
            value={props.issueTitle}
            onChange={(v) => updateProps("issueTitle", v)}
            required
          />
          <TextField
            label="Hero Image URL"
            value={props.heroImageUrl}
            onChange={(v) => updateProps("heroImageUrl", v)}
            required
          />
          <TextAreaField
            label="Intro Text (use [link text](url) for links)"
            value={props.introText}
            onChange={(v) => updateProps("introText", v)}
            rows={3}
            required
          />
        </div>
      </details>

      {/* Dynamic content sections */}
      <SectionListEditor
        sections={props.sections}
        onUpdate={updateSection}
        onReorder={reorderSections}
        onRemove={removeSection}
        onAdd={addSection}
      />

      {/* Footer */}
      <details>
        <summary>Footer</summary>
        <div className="section-content">
          <TextField
            label="Address"
            value={props.footerAddress}
            onChange={(v) => updateProps("footerAddress", v)}
          />
          <TextField
            label="Unsubscribe URL"
            value={props.unsubscribeUrl}
            onChange={(v) => updateProps("unsubscribeUrl", v)}
          />
          <TextField
            label="Update Profile URL"
            value={props.updateProfileUrl}
            onChange={(v) => updateProps("updateProfileUrl", v)}
          />
          <TextField
            label="Data Notice URL"
            value={props.dataNoticeUrl}
            onChange={(v) => updateProps("dataNoticeUrl", v)}
          />
        </div>
      </details>
    </div>
  );
}
