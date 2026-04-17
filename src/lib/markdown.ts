/**
 * Converts a file/folder/page name to a URL-safe slug
 */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-#]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Converts Obsidian-style wikilinks to standard markdown links
 * Supports formats:
 * - [[page]] -> [page](/docs/page)
 * - [[page|display text]] -> [display text](/docs/page)
 * - [[page#heading]] -> [page](/docs/page#heading)
 * - [[page#heading|display text]] -> [display text](/docs/page#heading)
 *
 * @param markdown The markdown content with wikilinks
 * @param slugLookup Optional map from page references to full slugs
 */
export function convertWikilinks(markdown: string, slugLookup?: Map<string, string>): string {
  // Match wikilinks: [[target]] or [[target|text]]
  return markdown.replace(/\[\[([^\]]+?)\]\]/g, (match, content) => {
    const [rawTarget, rawLabel] = content.split('|');
    const target = (rawTarget || '').trim();
    const displayText = (rawLabel || target).trim();

    const [pageRaw, headingRaw] = target.split('#');
    const pageSlug = pageRaw ? toSlug(pageRaw.trim()) : '';
    const headingSlug = headingRaw ? toSlug(headingRaw.trim()) : '';

    let pagePath = pageSlug;
    if (slugLookup && pageSlug) {
      pagePath = slugLookup.get(pageSlug) || pageSlug;
    }

    const anchor = headingSlug ? `#${headingSlug}` : '';

    // Build the URL
    let url: string;
    if (pagePath) {
      url = `/docs/${pagePath}${anchor}`;
    } else {
      // Same-page heading link
      url = anchor || '#';
    }

    return `[${displayText}](${url})`;
  });
}

interface Heading {
  level: number;
  text: string;
  slug: string;
}

/**
 * Extracts headings from markdown content
 */
function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (!match) continue;

    const level = match[1].length;
    const text = match[2].trim();

    if (!text) continue;

    const slug = toSlug(text);
    headings.push({ level, text, slug });
  }

  return headings;
}

/**
 * Generates nested HTML list for table of contents
 */
function generateTOCHTML(headings: Heading[]): string {
  if (headings.length === 0) {
    return '';
  }

  let html = '<nav class="toc-nav">\n<ul>\n';
  const stack: number[] = [];

  for (const heading of headings) {
    // Close deeper levels
    while (stack.length > 0 && stack[stack.length - 1] >= heading.level) {
      stack.pop();
      html += '</ul>\n</li>\n';
    }

    // Open new level if needed
    if (stack.length > 0) {
      html += '<ul>\n';
    }

    html += `<li><a href="#${heading.slug}">${heading.text}</a>`;
    stack.push(heading.level);
  }

  // Close remaining levels
  while (stack.length > 0) {
    stack.pop();
    html += '</li>\n';
    if (stack.length > 0) {
      html += '</ul>\n';
    }
  }

  html += '</ul>\n</nav>';
  return html;
}

/**
 * Processes TOC code blocks and replaces them with generated HTML
 * Supports ```toc and ```table-of-contents syntax
 */
export function processTOC(markdown: string): string {
  const tocRegex = /```(?:toc|table-of-contents)\n[\s\S]*?```/g;
  
  return markdown.replace(tocRegex, () => {
    const headings = extractHeadings(markdown);
    return generateTOCHTML(headings);
  });
}
