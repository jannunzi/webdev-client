export default function HttpMethods() {
  return (
    <div id="wd-http-methods">
      <h4>HTTP methods</h4>
      <ul>
        <li>
          <strong>GET</strong> — retrieve a resource. Safe and idempotent.
        </li>
        <li>
          <strong>POST</strong> — create a resource. Not idempotent.
        </li>
        <li>
          <strong>PUT</strong> — replace a resource. Idempotent.
        </li>
        <li>
          <strong>DELETE</strong> — remove a resource. Idempotent.
        </li>
      </ul>
      <hr />
    </div>
  );
}
