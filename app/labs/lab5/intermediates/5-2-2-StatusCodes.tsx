export default function StatusCodes() {
  return (
    <div id="wd-http-status-codes">
      <h4>HTTP status codes</h4>
      <ul>
        <li>
          <code>200 OK</code> — the request succeeded.
        </li>
        <li>
          <code>201 Created</code> — a new resource was created.
        </li>
        <li>
          <code>400 Bad Request</code> — the body or query was invalid.
        </li>
        <li>
          <code>404 Not Found</code> — no resource matches the URL.
        </li>
        <li>
          <code>500 Internal Server Error</code> — the server threw.
        </li>
      </ul>
      <hr />
    </div>
  );
}
