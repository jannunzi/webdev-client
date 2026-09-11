/** Serialize contenteditable HTML back to the slide markdown dialect. */
export function htmlToSlideText(html: string): string {
  let s = html;
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<\/(div|p|li)>/gi, "\n");
  s = s.replace(/<(strong|b)>([\s\S]*?)<\/\1>/gi, "**$2**");
  s = s.replace(/<code>([\s\S]*?)<\/code>/gi, "`$1`");
  s = s.replace(/<a href="([^"]+)">([\s\S]*?)<\/a>/gi, "[$2]($1)");
  s = s.replace(/<[^>]+>/g, "");
  return decodeMarkup(s).replace(/\s+/g, " ").trim();
}

export function slideTextToHtml(text: string): string {
  const escaped = escapeMarkup(text);
  return escaped
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2">$1</a>',
    );
}

function escapeMarkup(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function decodeMarkup(text: string): string {
  return text
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"');
}

export function lectureSearchIsEdit(search: string): boolean {
  return (
    new URLSearchParams(search.startsWith("?") ? search.slice(1) : search).get(
      "edit",
    ) === "1"
  );
}

export function lectureEditHref({
  href,
  edit,
}: {
  href: string;
  edit: boolean;
}): string {
  const url = new URL(href, "https://webdev-client.vercel.app");
  if (edit) url.searchParams.set("edit", "1");
  else url.searchParams.delete("edit");
  return `${url.pathname}${url.search}${url.hash}`;
}
