const WD_ID_RE = /id=["']wd-[a-z0-9-]+["']/i;

export function htmlHasWdHooks(html: string): boolean {
  return WD_ID_RE.test(html);
}

export function htmlHasLabsNavigation(html: string): boolean {
  const lower = html.toLowerCase();
  return (
    lower.includes('id="wd-lab1-link"') ||
    lower.includes("id='wd-lab1-link'") ||
    lower.includes('id="wd-labs"') ||
    lower.includes("id='wd-labs'") ||
    lower.includes('id="wd-kambaz-link"') ||
    lower.includes("id='wd-kambaz-link'") ||
    lower.includes('href="/labs/lab1"') ||
    lower.includes("href='/labs/lab1'")
  );
}

export function htmlHasA1LabMarkers(html: string): boolean {
  const lower = html.toLowerCase();
  if (
    lower.includes('id="wd-github"') ||
    lower.includes("id='wd-github'") ||
    htmlHasLabsNavigation(html)
  ) {
    return true;
  }
  return htmlHasWdHooks(html);
}
