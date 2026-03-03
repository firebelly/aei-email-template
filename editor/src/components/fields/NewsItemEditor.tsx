import type { NewsItem } from "@emails/aei-connect";
import { TextAreaField } from "./TextAreaField";

export function NewsItemEditor({
  item,
  index,
  onChange,
  onRemove,
}: {
  item: NewsItem;
  index: number;
  onChange: (updated: NewsItem) => void;
  onRemove: () => void;
}) {
  return (
    <div className="array-item">
      <div className="array-item-header">
        <span>News Item {index + 1}</span>
        <button className="btn btn-remove" onClick={onRemove} title="Remove">
          &times;
        </button>
      </div>
      <TextAreaField
        label="Text (use [link text](url) for links)"
        value={item.text}
        onChange={(v) => onChange({ text: v })}
        rows={3}
        required
      />
    </div>
  );
}
