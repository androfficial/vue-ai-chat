import type { Tokens } from 'marked';

import { marked } from 'marked';
import { computed, h, type Ref, type VNode } from 'vue';

import CodeBlock from '@/components/chat/CodeBlock.vue';

/**
 * Parsed markdown block types
 */
export type MarkdownBlockType = 'code' | 'html';

/**
 * Parsed code block
 */
export interface CodeBlockData {
  code: string;
  language: string;
  type: 'code';
}

/**
 * Parsed HTML content block
 */
export interface HtmlBlockData {
  html: string;
  type: 'html';
}

/**
 * Union type for all parsed blocks
 */
export type ParsedBlock = CodeBlockData | HtmlBlockData;

/**
 * Return type for useMarkdownRenderer
 */
export interface UseMarkdownRendererReturn {
  parsedBlocks: Ref<ParsedBlock[]>;
  renderBlock: (block: ParsedBlock, index: number) => VNode;
}

/**
 * Placeholder for code blocks during parsing
 */
const CODE_BLOCK_PLACEHOLDER = '___CODE_BLOCK_PLACEHOLDER___';

/**
 * Configure marked globally with base options (runs once on module load)
 */
marked.use({
  breaks: true,
  gfm: true,
});

/**
 * Parse markdown content and extract code blocks separately
 */
function parseMarkdownWithCodeBlocks(content: string): ParsedBlock[] {
  const codeBlocks: CodeBlockData[] = [];
  let placeholderIndex = 0;

  // Create a custom renderer for this parse call
  const renderer = {
    code({ lang, text }: Tokens.Code): string {
      codeBlocks.push({
        code: text,
        language: lang || '',
        type: 'code',
      });
      return `${CODE_BLOCK_PLACEHOLDER}${placeholderIndex++}${CODE_BLOCK_PLACEHOLDER}`;
    },
  };

  // Parse markdown with custom renderer for this call
  const html = marked.use({ renderer }).parse(content) as string;

  // Split by placeholders and reconstruct blocks
  const parts = html.split(new RegExp(`${CODE_BLOCK_PLACEHOLDER}(\\d+)${CODE_BLOCK_PLACEHOLDER}`));
  const blocks: ParsedBlock[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part === undefined) continue;

    if (i % 2 === 0) {
      // HTML content
      const htmlContent = part.trim();
      if (htmlContent) {
        blocks.push({
          html: htmlContent,
          type: 'html',
        });
      }
    } else {
      // Code block reference
      const codeBlockIndex = parseInt(part, 10);
      if (codeBlocks[codeBlockIndex]) {
        blocks.push(codeBlocks[codeBlockIndex]);
      }
    }
  }

  return blocks;
}

/**
 * Composable for rendering markdown content with code blocks as Vue components
 */
export function useMarkdownRenderer(content: Ref<string>): UseMarkdownRendererReturn {
  const parsedBlocks = computed(() => {
    if (!content.value) {
      return [];
    }
    return parseMarkdownWithCodeBlocks(content.value);
  });

  /**
   * Render a parsed block as a VNode
   */
  function renderBlock(block: ParsedBlock, index: number): VNode {
    if (block.type === 'code') {
      return h(CodeBlock, {
        code: block.code,
        key: `code-${index}`,
        language: block.language,
      });
    }

    return h('div', {
      class: 'markdown-content',
      innerHTML: block.html,
      key: `html-${index}`,
    });
  }

  return {
    parsedBlocks,
    renderBlock,
  };
}

export type { UseMarkdownRendererReturn as MarkdownRendererReturn };
