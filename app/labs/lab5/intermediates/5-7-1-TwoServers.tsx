import { apiBaseLabel, apiUrl } from "@/app/lib/apiUrl";

export default function TwoServers() {
  return (
    <div id="wd-lab5-two-servers">
      <h4>Two HTTP servers</h4>
      <p>
        <strong>Same-app Route Handlers</strong> live in this Next.js
        process at paths such as <code>/api/lab5/hello</code>.
      </p>
      <p>
        <strong>A separate Node/Express process</strong> listens on
        another host (locally <code>http://localhost:4000</code>, later
        Render). The UI picks it with{" "}
        <code>NEXT_PUBLIC_API_BASE</code>.
      </p>
      <p>
        Current <code>apiUrl(&quot;/api/lab5/hello&quot;)</code> ={" "}
        <code>{apiUrl("/api/lab5/hello")}</code>
        <br />
        Base: {apiBaseLabel()}
      </p>
      <hr />
    </div>
  );
}
