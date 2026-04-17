import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Type definitions
export interface DocFrontmatter {
  class?: string;
  category?: string;
  clearance?: string;
  tags?: string[];
  title?: string;
  subtitle?: string;
  'sidebar-hidden'?: boolean;
  'sidebar-title'?: string;
  'sidebar-group'?: string;
  order?: number;
  description?: string;
}

export interface DocEntry {
  slug: string; // URL-safe slug
  filePath: string; // Relative path from CLASSIFIED
  fullPath: string; // Absolute file path
  title: string; // Display title
  subtitle?: string; // Display subtitle (overrides title for page rendering)
  frontmatter: DocFrontmatter;
  level: number; // Nesting level
  parent?: string; // Parent folder slug
  children?: DocEntry[];
}

export interface DocNode {
  name: string; // Folder/file name
  slug: string; // URL-safe slug
  isDirectory: boolean;
  fullPath: string;
  level: number;
  children?: DocNode[];
  file?: DocEntry; // For leaf nodes (markdown files)
}

/**
 * Converts a file/folder name to a URL-safe slug
 */
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-') // spaces to hyphens
    .replace(/[^\w-]/g, '') // remove non-word chars except hyphens
    .replace(/-+/g, '-') // collapse multiple hyphens
    .replace(/^-|-$/g, ''); // trim hyphens
}

/**
 * Extracts and parses YAML frontmatter from markdown
 */
function parseFrontmatter(content: string): { frontmatter: DocFrontmatter; body: string } {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterText = match[1];
  const body = match[2];
  const frontmatter: DocFrontmatter = {};

  // Simple YAML parser for common fields
  const lines = frontmatterText.split('\n');
  let inTagsArray = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    if (trimmed.startsWith('tags:')) {
      inTagsArray = true;
      const tagsValue = trimmed.substring('tags:'.length).trim();
      if (tagsValue === '') continue; // Array starts on next line
      if (tagsValue.startsWith('[')) {
        // Inline array: [tag1, tag2]
        frontmatter.tags = tagsValue
          .slice(1, -1)
          .split(',')
          .map(t => t.trim().replace(/["']/g, ''));
        inTagsArray = false;
      }
    } else if (inTagsArray) {
      if (trimmed.startsWith('-')) {
        if (!frontmatter.tags) frontmatter.tags = [];
        frontmatter.tags.push(trimmed.substring(1).trim().replace(/["']/g, ''));
      } else if (trimmed === '') {
        inTagsArray = false;
      }
    } else if (trimmed.includes(':')) {
      const [key, ...valueParts] = trimmed.split(':');
      const value = valueParts.join(':').trim();

      switch (key.trim()) {
        case 'title':
          frontmatter.title = value.replace(/["']/g, '');
          break;
        case 'subtitle':
          frontmatter.subtitle = value.replace(/["']/g, '');
          break;
        case 'class':
          frontmatter.class = value.replace(/["']/g, '');
          break;
        case 'category':
          frontmatter.category = value.replace(/["']/g, '');
          break;
        case 'clearance':
          frontmatter.clearance = value.replace(/["']/g, '');
          break;
        case 'sidebar-hidden':
          frontmatter['sidebar-hidden'] = value.toLowerCase() === 'true';
          break;
        case 'sidebar-title':
          frontmatter['sidebar-title'] = value.replace(/["']/g, '');
          break;
        case 'sidebar-group':
          frontmatter['sidebar-group'] = value.replace(/["']/g, '');
          break;
        case 'order':
          frontmatter.order = parseInt(value, 10);
          break;
        case 'description':
          frontmatter.description = value.replace(/["']/g, '');
          break;
      }
    }
  }

  return { frontmatter, body };
}

/**
 * Extracts first heading from markdown body as fallback title
 */
function extractFirstHeading(content: string): string | null {
  const match = content.match(/^#+\s+(.+?)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Recursively scans directory and builds tree structure
 */
async function scanDirectory(
  dirPath: string,
  relativePath: string = '',
  level: number = 0
): Promise<DocNode[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const nodes: DocNode[] = [];

  for (const entry of entries) {
    // Skip hidden files and common ignore patterns
    if (entry.name.startsWith('.') || entry.name === 'node_modules') {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);
    const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
    const slug = toSlug(entry.name);

    if (entry.isDirectory()) {
      // Recursively scan subdirectory
      const children = await scanDirectory(fullPath, relPath, level + 1);
      nodes.push({
        name: entry.name,
        slug,
        isDirectory: true,
        fullPath,
        level,
        children: children.length > 0 ? children : undefined,
      });
    } else if (entry.name.endsWith('.md')) {
      // Parse markdown file
      const content = await fs.readFile(fullPath, 'utf-8');
      const { frontmatter, body } = parseFrontmatter(content);

      // Skip if explicitly hidden
      if (frontmatter['sidebar-hidden']) {
        continue;
      }

      // Determine title: use sidebar-title override, then frontmatter title, then first heading, then filename
      let title = frontmatter['sidebar-title'] || frontmatter.title;
      if (!title) {
        title = extractFirstHeading(body) || entry.name.replace('.md', '');
      }

      const fileSlug = toSlug(entry.name.replace(/\.md$/, ''));
      const doc: DocEntry = {
        slug: fileSlug,
        filePath: relPath,
        fullPath,
        title,
        subtitle: frontmatter.subtitle,
        frontmatter,
        level,
      };

      nodes.push({
        name: entry.name,
        slug: fileSlug,
        isDirectory: false,
        fullPath,
        level,
        file: doc,
      });
    }
  }

  // Sort: mix directories and files together by order (if set), then by name
  nodes.sort((a, b) => {
    const aOrder = a.file?.frontmatter.order ?? Number.POSITIVE_INFINITY;
    const bOrder = b.file?.frontmatter.order ?? Number.POSITIVE_INFINITY;
    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    return a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  });

  return nodes;
}

/**
 * Converts tree structure to flat array of DocEntry with breadcrumbs
 */
function flattenTree(nodes: DocNode[], parentSlug: string = ''): DocEntry[] {
  const result: DocEntry[] = [];

  for (const node of nodes) {
    if (!node.isDirectory && node.file) {
      const fullSlug = parentSlug ? `${parentSlug}/${node.slug}` : node.slug;
      result.push({
        ...node.file,
        slug: fullSlug,
        parent: parentSlug || undefined,
      });
    }

    if (node.children) {
      const childParentSlug = parentSlug ? `${parentSlug}/${node.slug}` : node.slug;
      result.push(...flattenTree(node.children, childParentSlug));
    }
  }

  return result;
}

/**
 * Main scanner function - scans CLASSIFIED directory and returns tree + flat list
 */
export async function scanDocs() {
  // Resolve CLASSIFIED directory from workspace root
  // DummyCorp/src/lib -> workspace root is ../../../ (DummyCorp/src -> DummyCorp -> workspace)
  const workspaceRoot = path.resolve(__dirname, '../../..');
  const classifiedPath = path.join(workspaceRoot, 'CLASSIFIED');

  try {
    const tree = await scanDirectory(classifiedPath);
    const flatList = flattenTree(tree);

    return {
      tree,
      docs: flatList,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Failed to scan docs at ${classifiedPath}:`, error);
    return { tree: [], docs: [], timestamp: new Date().toISOString() };
  }
}

/**
 * Builds a lookup map from various page references to full slugs
 * Helps resolve wikilinks like [[Page Name]] to the correct full path slug
 */
export function buildSlugLookupFromDocs(docs: DocEntry[]): Map<string, string> {
  const lookup = new Map<string, string>();

  for (const doc of docs) {
    // Add by filename (without .md)
    const filename = path.basename(doc.filePath, '.md');
    const filenameSlug = toSlug(filename);
    lookup.set(filenameSlug, doc.slug);

    // Add by title
    const titleSlug = toSlug(doc.title);
    lookup.set(titleSlug, doc.slug);

    // Also add the full slug itself (for exact matches)
    lookup.set(doc.slug, doc.slug);
  }

  return lookup;
}

/**
 * Builds a lookup map from various page references to full slugs
 * Helps resolve wikilinks like [[Page Name]] to the correct full path slug
 */
export async function buildSlugLookup(): Promise<Map<string, string>> {
  const { docs } = await scanDocs();
  return buildSlugLookupFromDocs(docs);
}
