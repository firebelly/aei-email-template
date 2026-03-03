import type { NewsItem } from "@emails/aei-connect";
import { NewsItemEditor } from "./NewsItemEditor";

const emptyNewsItem: NewsItem = {
  text: "",
};

export function NewsItemListEditor({
  items,
  onChange,
}: {
  items: NewsItem[];
  onChange: (items: NewsItem[]) => void;
}) {
  const updateAt = (index: number, updated: NewsItem) => {
    const next = [...items];
    next[index] = updated;
    onChange(next);
  };

  const removeAt = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([...items, { ...emptyNewsItem }]);
  };

  return (
    <div>
      {items.map((item, i) => (
        <NewsItemEditor
          key={i}
          item={item}
          index={i}
          onChange={(updated) => updateAt(i, updated)}
          onRemove={() => removeAt(i)}
        />
      ))}
      <button className="btn btn-add" onClick={add}>
        + Add News Item
      </button>
    </div>
  );
}
