import type { ContentSection } from "@emails/aei-connect";
import { SectionEditor } from "./SectionEditor";

const sectionTypeLabels: Record<ContentSection["type"], string> = {
  "article-grid": "Article Grid",
  feature: "Feature",
  news: "News List",
};

function getSectionHeading(section: ContentSection): string {
  switch (section.type) {
    case "article-grid":
      return section.heading || "Untitled";
    case "feature":
      return section.sectionHeading || "Untitled";
    case "news":
      return section.heading || "Untitled";
  }
}

function isSectionMissing(section: ContentSection): boolean {
  switch (section.type) {
    case "article-grid":
      return (
        !section.heading.trim() ||
        section.articles.some(
          (a) => !a.description.trim() || !a.imageUrl.trim() || !a.imageAlt.trim(),
        )
      );
    case "feature":
      return !section.sectionHeading.trim() || !section.feature.description.trim();
    case "news":
      return (
        !section.heading.trim() ||
        section.items.some((item) => !item.text.trim())
      );
  }
}

function createEmptySection(type: ContentSection["type"]): ContentSection {
  const id = crypto.randomUUID();
  switch (type) {
    case "article-grid":
      return {
        id,
        type: "article-grid",
        heading: "",
        articles: [],
        borderColor: "border-l-aei-purple",
        startWith: "text",
      };
    case "feature":
      return {
        id,
        type: "feature",
        sectionHeading: "",
        borderColor: "border-l-aei-blue",
        feature: {
          title: "",
          description: "",
          ctaText: "",
          ctaUrl: "",
          ctaStyle: "button",
          imageUrl: "",
          imageAlt: "",
        },
      };
    case "news":
      return {
        id,
        type: "news",
        heading: "",
        items: [],
      };
  }
}

export function SectionListEditor({
  sections,
  onUpdate,
  onReorder,
  onRemove,
  onAdd,
}: {
  sections: ContentSection[];
  onUpdate: (index: number, section: ContentSection) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onRemove: (index: number) => void;
  onAdd: (section: ContentSection) => void;
}) {
  return (
    <div>
      {sections.map((section, i) => (
        <details key={section.id} className={isSectionMissing(section) ? "details-missing" : undefined}>
          <summary className="section-summary">
            <span className="section-summary-text">
              <span className="section-type-badge">
                {sectionTypeLabels[section.type]}
              </span>
              {getSectionHeading(section)}
            </span>
            <span className="section-controls" onClick={(e) => e.stopPropagation()}>
              <button
                className="btn btn-section-control"
                disabled={i === 0}
                onClick={() => onReorder(i, i - 1)}
                title="Move up"
              >
                &#x25B2;
              </button>
              <button
                className="btn btn-section-control"
                disabled={i === sections.length - 1}
                onClick={() => onReorder(i, i + 1)}
                title="Move down"
              >
                &#x25BC;
              </button>
              <button
                className="btn btn-remove"
                onClick={() => onRemove(i)}
                title="Remove section"
              >
                &times;
              </button>
            </span>
          </summary>
          <div className="section-content">
            <SectionEditor
              section={section}
              onChange={(updated) => onUpdate(i, updated)}
            />
          </div>
        </details>
      ))}

      <div className="add-section-area">
        <span className="add-section-label">Add Section:</span>
        {(Object.keys(sectionTypeLabels) as ContentSection["type"][]).map((type) => (
          <button
            key={type}
            className="btn btn-add"
            onClick={() => onAdd(createEmptySection(type))}
          >
            + {sectionTypeLabels[type]}
          </button>
        ))}
      </div>
    </div>
  );
}
