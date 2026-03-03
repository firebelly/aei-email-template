import type { Article } from "@emails/aei-connect";
import { ArticleEditor } from "./ArticleEditor";

const emptyArticle: Article = {
  heading: "",
  description: "",
  imageUrl: "",
  imageAlt: "",
  readMoreUrl: "",
  readMoreText: "",
};

export function ArticleListEditor({
  articles,
  onChange,
}: {
  articles: Article[];
  onChange: (articles: Article[]) => void;
}) {
  const updateAt = (index: number, updated: Article) => {
    const next = [...articles];
    next[index] = updated;
    onChange(next);
  };

  const removeAt = (index: number) => {
    onChange(articles.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([...articles, { ...emptyArticle }]);
  };

  return (
    <div>
      {articles.map((article, i) => (
        <ArticleEditor
          key={i}
          article={article}
          index={i}
          onChange={(updated) => updateAt(i, updated)}
          onRemove={() => removeAt(i)}
        />
      ))}
      <button className="btn btn-add" onClick={add}>
        + Add Article
      </button>
    </div>
  );
}
