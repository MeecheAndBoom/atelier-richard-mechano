import * as React from "react";

/**
 * Minimal markdown renderer for blog bodies — headings, paragraphs, lists,
 * blockquotes, horizontal rules and inline emphasis only. No raw HTML
 * passthrough, so seeded/authored content can't inject markup.
 */

function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Matches **bold**, *italic* and `code`
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    const key = `${keyBase}-${i++}`;
    if (token.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-ink">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded-md bg-alt px-1.5 py-0.5 font-mono text-[0.9em]"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      nodes.push(
        <em key={key} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "hr" };

function parse(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "p", text: paragraph.join(" ") });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push({ type: list.ordered ? "ol" : "ul", items: list.items });
      list = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }
    if (/^---+$/.test(trimmed)) {
      flushParagraph();
      flushList();
      blocks.push({ type: "hr" });
      continue;
    }
    if (trimmed.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h3", text: trimmed.slice(4) });
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h2", text: trimmed.slice(3) });
      continue;
    }
    if (trimmed.startsWith("> ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "quote", text: trimmed.slice(2) });
      continue;
    }
    const unordered = trimmed.match(/^[-*] (.+)$/);
    const ordered = trimmed.match(/^\d+[.)] (.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      const orderedNow = Boolean(ordered);
      if (!list || list.ordered !== orderedNow) {
        flushList();
        list = { ordered: orderedNow, items: [] };
      }
      list.items.push((ordered ?? unordered)![1]);
      continue;
    }
    flushList();
    paragraph.push(trimmed);
  }
  flushParagraph();
  flushList();
  return blocks;
}

export function PostBody({ markdown }: { markdown: string }) {
  const blocks = parse(markdown);

  return (
    <div className="prose-arm">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={i}
                className="mt-12 mb-4 text-[24px] font-semibold tracking-[-0.015em] text-ink first:mt-0"
              >
                {renderInline(block.text, `h2-${i}`)}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={i}
                className="mt-8 mb-3 text-[19px] font-semibold tracking-[-0.01em] text-ink"
              >
                {renderInline(block.text, `h3-${i}`)}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="mb-5 text-[16.5px] leading-[1.75] text-ink-soft">
                {renderInline(block.text, `p-${i}`)}
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="mb-5 space-y-2.5 pl-1">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex gap-3 text-[16.5px] leading-[1.7] text-ink-soft"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    />
                    <span>{renderInline(item, `li-${i}-${j}`)}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="mb-5 space-y-2.5 pl-5">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="list-decimal marker:text-muted marker:font-medium text-[16.5px] leading-[1.7] text-ink-soft"
                  >
                    {renderInline(item, `oli-${i}-${j}`)}
                  </li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="my-6 rounded-card border-l-2 border-accent bg-alt px-5 py-4 text-[16px] leading-relaxed text-ink-soft italic"
              >
                {renderInline(block.text, `q-${i}`)}
              </blockquote>
            );
          case "hr":
            return <hr key={i} className="my-10 border-line-soft" />;
        }
      })}
    </div>
  );
}
