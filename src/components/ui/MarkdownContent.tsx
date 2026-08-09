import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

interface MarkdownContentProps {
  content: string
  className?: string
}

/**
 * Renders LLM-produced Markdown (bold, headings, lists, links, tables) as
 * proper HTML instead of raw "**bold**"/"### heading" syntax.
 *
 * Styling is done via child selectors rather than a Tailwind typography
 * plugin, since none is installed — only spacing/weight/size needed for a
 * compact chat bubble, not full prose.
 */
export default function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div
      className={cn(
        "space-y-2 break-words",
        "[&_strong]:font-semibold",
        "[&_em]:italic",
        "[&_h1]:text-[13px] [&_h1]:font-semibold [&_h1]:mt-2",
        "[&_h2]:text-[13px] [&_h2]:font-semibold [&_h2]:mt-2",
        "[&_h3]:text-[12px] [&_h3]:font-semibold [&_h3]:mt-2",
        "[&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-0.5",
        "[&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:space-y-0.5",
        "[&_a]:underline [&_a]:underline-offset-2",
        "[&_code]:rounded [&_code]:bg-black/5 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[11px]",
        "[&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-black/5 [&_pre]:p-2",
        "[&_blockquote]:border-l-2 [&_blockquote]:pl-2 [&_blockquote]:opacity-80",
        "[&_hr]:border-[var(--color-border)] [&_hr]:my-2",
        "[&_table]:w-full [&_table]:text-[11px]",
        "[&_th]:text-left [&_th]:border-b [&_th]:pb-1",
        "[&_td]:border-b [&_td]:py-1",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
