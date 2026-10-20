import ServerTimeDemo from "./ServerTimeDemo";
import OsDemo from "./OsDemo";
import EnvDemo from "./EnvDemo";
import RequestHeadersDemo from "./RequestHeadersDemo";
import WeatherDemo from "./WeatherDemo";
import VisitCounterDemo from "./VisitCounterDemo";
import ChildProcessDemo from "./ChildProcessDemo";

export default function ServerApis() {
  return (
    <div id="wd-server-apis">
      <h2>Server-Only APIs</h2>
      <ServerTimeDemo />
      <OsDemo />
      <EnvDemo />
      <RequestHeadersDemo />
      <WeatherDemo />
      <VisitCounterDemo />
      <ChildProcessDemo />
    </div>
  );
}
