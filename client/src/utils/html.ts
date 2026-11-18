/**
 * CMS rich-text content commonly uses h4-h6 for body subheadings. When such
 * content is rendered under an h2 section title it produces an invalid heading
 * order (h2 -> h4), which Lighthouse/axe flag. Demote h4-h6 by one level so the
 * document outline stays sequential.
 */
export function normalizeHeadingLevels(html: string): string {
  return html
    .replace(/<h4(\s[^>]*)?>/gi, '<h3$1>')
    .replace(/<\/h4\s*>/gi, '</h3>')
    .replace(/<h5(\s[^>]*)?>/gi, '<h4$1>')
    .replace(/<\/h5\s*>/gi, '</h4>')
    .replace(/<h6(\s[^>]*)?>/gi, '<h5$1>')
    .replace(/<\/h6\s*>/gi, '</h5>');
}