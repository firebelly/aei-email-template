import type { Article } from "@emails/aei-connect";
import { TextField } from "./TextField";
import { TextAreaField } from "./TextAreaField";

export function ArticleEditor({
  article,
  index,
  onChange,
  onRemove,
}: {
  article: Article;
  index: number;
  onChange: (updated: Article) => void;
  onRemove: () => void;
}) {
  const update = (field: keyof Article, value: string) => {
    onChange({ ...article, [field]: value });
  };

  return (
    <div className="array-item">
      <div className="array-item-header">
        <span>Article {index + 1}</span>
        <button className="btn btn-remove" onClick={onRemove} title="Remove">
          &times;
        </button>
      </div>
      <TextField
        label="Heading"
        value={article.heading ?? ""}
        onChange={(v) => update("heading", v)}
      />
      <TextAreaField
        label="Description"
        value={article.description}
        onChange={(v) => update("description", v)}
        rows={4}
        required
      />
      <TextField
        label="Image URL"
        value={article.imageUrl}
        onChange={(v) => update("imageUrl", v)}
        required
      />
      <TextField
        label="Image Alt"
        value={article.imageAlt}
        onChange={(v) => update("imageAlt", v)}
        required
      />
      <TextField
        label="Read More URL"
        value={article.readMoreUrl ?? ""}
        onChange={(v) => update("readMoreUrl", v)}
      />
      <TextField
        label="Read More Text"
        value={article.readMoreText ?? ""}
        onChange={(v) => update("readMoreText", v)}
      />
    </div>
  );
}
