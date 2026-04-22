/**
 * Transforms a full HTML email document into a CC-ready fragment:
 * style blocks from <head> + <body>...</body> with a tracking pixel
 * injected after the opening body tag.
 *
 * Shared between scripts/cc-export.mjs and the editor's Export button
 * so both produce identical output.
 */
export function toCcHtml(html) {
  const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
  const styleBlocks = [];
  if (headMatch) {
    const styleRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
    let match;
    while ((match = styleRegex.exec(headMatch[1])) !== null) {
      if (match[1].trim()) {
        styleBlocks.push(`<style>${match[1]}</style>`);
      }
    }
  }

  const bodyMatch = html.match(/(<body[^>]*>[\s\S]*<\/body>)/i);
  if (!bodyMatch) {
    throw new Error("Could not find <body> in HTML");
  }

  const bodyWithTags = bodyMatch[1].replace(
    /(<body[^>]*>)/i,
    "$1[[trackingImage]]"
  );

  return [...styleBlocks, bodyWithTags].join("\n");
}
