import type { AEIConnectProps } from "@emails/aei-connect";

/** Returns human-readable error strings for any missing required fields. */
export function getValidationErrors(props: AEIConnectProps): string[] {
  const errors: string[] = [];

  // Hero / intro fields (all marked required in EditorForm)
  if (!props.previewText?.trim()) errors.push("Preview text is required");
  if (!props.issueTitle?.trim()) errors.push("Issue title is required");
  if (!props.heroImageUrl?.trim()) errors.push("Hero image URL is required");
  if (!props.introText?.trim()) errors.push("Intro text is required");

  props.sections.forEach((section, si) => {
    const n = si + 1;
    switch (section.type) {
      case "article-grid":
        if (!section.heading?.trim())
          errors.push(`Section ${n} (Article Grid): heading is required`);
        section.articles.forEach((a, ai) => {
          if (!a.description?.trim())
            errors.push(
              `Section ${n} (Article Grid), article ${ai + 1}: description is required`,
            );
          if (!a.imageUrl?.trim())
            errors.push(
              `Section ${n} (Article Grid), article ${ai + 1}: image URL is required`,
            );
          if (!a.imageAlt?.trim())
            errors.push(
              `Section ${n} (Article Grid), article ${ai + 1}: image alt is required`,
            );
        });
        break;
      case "feature":
        if (!section.sectionHeading?.trim())
          errors.push(`Section ${n} (Feature): heading is required`);
        if (!section.feature.description?.trim())
          errors.push(`Section ${n} (Feature): description is required`);
        if (!section.feature.imageUrl?.trim())
          errors.push(`Section ${n} (Feature): image URL is required`);
        if (!section.feature.imageAlt?.trim())
          errors.push(`Section ${n} (Feature): image alt is required`);
        break;
      case "news":
        if (!section.heading?.trim())
          errors.push(`Section ${n} (News): heading is required`);
        section.items.forEach((item, ii) => {
          if (!item.text?.trim())
            errors.push(
              `Section ${n} (News), item ${ii + 1}: text is required`,
            );
        });
        break;
    }
  });

  return errors;
}
