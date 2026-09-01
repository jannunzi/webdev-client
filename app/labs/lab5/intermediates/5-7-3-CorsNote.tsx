export default function CorsNote() {
  return (
    <div id="wd-lab5-cors">
      <h4>CORS</h4>
      <p>
        A page on <code>http://localhost:3000</code> calling{" "}
        <code>http://localhost:4000</code> is a{" "}
        <strong>cross-origin</strong> request. The browser asks the
        Express server for permission with an OPTIONS preflight. Without{" "}
        <code>Access-Control-Allow-Origin</code>, the response is hidden
        even if Express ran the handler.
      </p>
      <p>
        Same-origin <code>/api/...</code> Route Handlers do not need
        CORS. A Render URL does.
      </p>
      <hr />
    </div>
  );
}
