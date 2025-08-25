import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats blog content by converting plain text with markdown-like syntax into HTML
 * Supports:
 * - Line breaks (double newlines become paragraphs)
 * - Headings (# ## ###)
 * - Bold text (**text**)
 * - Italic text (*text*)
 * - Code blocks (```code```)
 * - Inline code (`code`)
 * - Lists (- item)
 * - Links [text](url)
 */
export function formatBlogContent(content: string): string {
  if (!content) return "";

  let formatted = content
    // Convert markdown headings
    .replace(
      /^### (.*$)/gim,
      '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>'
    )
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-6">$1</h1>')

    // Convert code blocks
    .replace(
      /```([\s\S]*?)```/g,
      '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code>$1</code></pre>'
    )

    // Convert inline code
    .replace(
      /`([^`]+)`/g,
      '<code class="bg-muted px-2 py-1 rounded text-sm">$1</code>'
    )

    // Convert bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')

    // Convert italic text
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

    // Convert links
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
    )

    // Convert unordered lists (match consecutive - items)
    .replace(
      /(?:^|\n)(- .+(?:\n- .+)*)/g,
      (match) =>
        `<ul class="list-disc ml-6 my-4">${match
          .trim()
          .split("\n")
          .map((line) => line.replace(/^- (.*)/, '<li class="ml-4">$1</li>'))
          .join("")}</ul>`
    )

    // Convert ordered lists (match consecutive 1. 2. 3.)
    .replace(
      /(?:^|\n)(\d+\. .+(?:\n\d+\. .+)*)/g,
      (match) =>
        `<ol class="list-decimal ml-6 my-4">${match
          .trim()
          .split("\n")
          .map((line) =>
            line.replace(/^\d+\. (.*)/, '<li class="ml-4">$1</li>')
          )
          .join("")}</ol>`
    );

  // Convert paragraphs (double newlines)
  formatted = formatted
    .split("\n\n")
    .map((paragraph) => {
      paragraph = paragraph.trim();
      if (!paragraph) return "";

      // Skip if already wrapped
      if (paragraph.match(/^<h|^<ul|^<ol|^<pre/)) {
        return paragraph;
      }

      return `<p class="mb-4 leading-relaxed">${paragraph}</p>`;
    })
    .join("");

  return formatted;
}
