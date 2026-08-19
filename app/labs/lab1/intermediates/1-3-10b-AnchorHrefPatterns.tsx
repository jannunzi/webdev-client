/** Section 1.3.10 — Illustrative href patterns (absolute, relative, hash, target) */
export default function AnchorHrefPatterns() {
  return (
    <div>
      <h5>Absolute URL (another site)</h5>
      <a href="https://www.lipsum.com" id="wd-lipsum-demo">
        lipsum.com
      </a>
      <h5>Relative URL (same site)</h5>
      <a href="/labs">Back to Labs</a>
      <h5>Same-page fragment (hash)</h5>
      <a href="#wd-anchor-bottom">Jump to bottom of this demo</a>
      <h5>Open in a new tab</h5>
      <a
        href="https://github.com/jannunzi"
        target="_blank"
        rel="noreferrer"
      >
        GitHub (new tab)
      </a>
      <p id="wd-anchor-bottom" style={{ marginTop: "2rem" }}>
        You landed on this paragraph via the hash link above (
        <code>#wd-anchor-bottom</code>).
      </p>
    </div>
  );
}
