import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { DocNode } from '@/lib/doc-scanner';
import { withBase } from '@/lib/utils';

interface DocsSidebarProps {
  tree: DocNode[];
  currentSlug: string;
}

function DocTreeNode({
  node,
  currentSlug,
  parentSlug = ''
}: {
  node: DocNode;
  currentSlug: string;
  parentSlug?: string;
}) {
  const fullSlug = parentSlug ? `${parentSlug}/${node.slug}` : node.slug;
  const hasChildren = node.children && node.children.length > 0;
  const isFileNode = !node.isDirectory;
  const isActive = isFileNode && (fullSlug === currentSlug || currentSlug.startsWith(fullSlug + '/'));
  const isOpenByDefault = currentSlug.startsWith(fullSlug + '/');
  const [isOpen, setIsOpen] = useState(isOpenByDefault || hasChildren);
  const label = isFileNode ? (node.file?.title ?? node.name) : node.name;

  return (
    <div>
      <div className="flex items-center gap-2">
        {hasChildren && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-muted rounded transition-colors"
            title={isOpen ? 'Collapse' : 'Expand'}
          >
            <ChevronDown
              size={16}
              className={`transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`}
            />
          </button>
        )}
        {!hasChildren && <div className="w-6" />}

        {isFileNode ? (
          <a
            href={withBase(`/docs/${fullSlug}`)}
            className={`flex-1 px-2 py-1.5 rounded-md text-sm transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            {label}
          </a>
        ) : (
          <span className="flex-1 px-2 py-1.5 text-xs uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="ml-4 mt-1 space-y-1 border-l border-border pl-4 my-2">
          {node.children!.map(child => (
            <DocTreeNode
              key={`${fullSlug}/${child.slug}`}
              node={child}
              currentSlug={currentSlug}
              parentSlug={fullSlug}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DocsSidebar({ tree, currentSlug }: DocsSidebarProps) {
  return (
    <div className="space-y-2">
      <a
        href={withBase('/docs')}
        className={`block px-2 py-1.5 rounded-md text-sm font-semibold transition-colors ${
          currentSlug === ''
            ? 'bg-primary text-primary-foreground'
            : 'text-foreground hover:bg-muted'
        }`}
      >
        Documentation
      </a>

      <div className="space-y-2 mt-4">
        {tree.map(node => (
          <DocTreeNode
            key={node.slug}
            node={node}
            currentSlug={currentSlug}
          />
        ))}
      </div>
    </div>
  );
}
