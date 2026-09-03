import Environment from "./intermediates/5-2-1-Environment";
import PathParameters from "./intermediates/5-2-2-1-PathParameters";
import QueryParameters from "./intermediates/5-2-2-2-QueryParameters";
import WorkingWithObjects from "./intermediates/5-2-3-WorkingWithObjects";
import WorkingWithArrays from "./intermediates/5-2-4-WorkingWithArrays";
import HttpClient from "./intermediates/5-2-5-HttpClient";
import WorkingWithObjectsAsynchronously from "./intermediates/5-2-5-WorkingWithObjectsAsync";
import WorkingWithArraysAsynchronously from "./intermediates/5-2-6-WorkingWithArraysAsync";
import HelloRoute from "./intermediates/5-3-1-HelloRoute";
import CalculatorNextWebApiClient from "./intermediates/5-3-1-Calculator";

export default function Lab5() {
  return (
    <div id="wd-lab5">
      <h2>Lab 5</h2>
      <p>
        Run <code>npm run dev</code> in the Next.js folder and, in a
        second terminal,{" "}
        <code>cd kambaz-node-server-app && npm run dev</code>{" "}
        (<code>nodemon</code>) so Express LiveDemos reach{" "}
        <code>http://localhost:4000</code>. No remote host is required.
        The Next.js calculator at the bottom uses same-origin{" "}
        <code>/api/lab5/calculator</code>.
      </p>
      <Environment />
      <PathParameters />
      <QueryParameters />
      <WorkingWithObjects />
      <WorkingWithArrays />
      <HttpClient />
      <WorkingWithObjectsAsynchronously />
      <WorkingWithArraysAsynchronously />
      <HelloRoute />
      <CalculatorNextWebApiClient />
    </div>
  );
}
