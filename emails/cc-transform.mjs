/**
 * Prepares React Email output for Constant Contact while keeping the file
 * valid as a standalone HTML document.
 *
 * Strips React Email's extra head scaffolding (preload links, MSO office
 * settings, extra meta tags, SSR stream comments) and wraps the body in a
 * minimal <html><head><style></head><body> shell. CC tolerates this and
 * replaces the wrappers server-side; outside CC it renders in any browser.
 * We don't embed [[trackingImage]] — CC injects its own pixel when absent.
 *
 * Shared between scripts/cc-export.mjs and the editor's Export button.
 */
export function toCcHtml(html) {
  const headMatch = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);
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

  const bodyMatch = html.match(/<body\b[^>]*>[\s\S]*<\/body>/i);
  if (!bodyMatch) {
    throw new Error("Could not find <body> in HTML");
  }

  const body = bodyMatch[0].replace(/<!--\/?\$-->|<!--(?:html|head|body)-->/g, "");

  return `<!DOCTYPE html>
<html>
<head>
${styleBlocks.join("\n")}
</head>
${body}
</html>
`;
}
