import { httpServer } from "@/app/lib/httpServer";

export default function Environment() {
  const HTTP_SERVER = httpServer();
  return (
    <div id="wd-lab5-environment">
      <h4>Environment</h4>
      <p>
        <code>NEXT_PUBLIC_HTTP_SERVER</code> = <code>{HTTP_SERVER}</code>
      </p>
      <a
        id="wd-welcome-link"
        className="text-blue-700 underline"
        href={`${HTTP_SERVER}/lab5/welcome`}
      >
        Welcome
      </a>
      <hr />
    </div>
  );
}
