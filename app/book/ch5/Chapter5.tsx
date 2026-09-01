import Intro from "./sections/Intro";
import HttpFundamentals from "./sections/HttpFundamentals";
import RouteHandlers from "./sections/RouteHandlers";
import ClientFetch from "./sections/ClientFetch";
import ServerFetch from "./sections/ServerFetch";
import ServerActions from "./sections/ServerActions";
import SeparateServer from "./sections/SeparateServer";
import RenderDeploy from "./sections/RenderDeploy";
import Exercises from "./sections/Exercises";
import CheckUnderstanding from "./sections/CheckUnderstanding";
import KambazHttp from "./sections/KambazHttp";
import Delivery from "./sections/Delivery";

/**
 * Chapter 5 book content — HTTP, Route Handlers, a separate Node
 * server on Render, fetch, and Kambaz APIs, with live lab components
 * instead of screenshots.
 */
export default function Chapter5() {
  return (
    <article className="mx-auto max-w-3xl">
      <Intro />
      <HttpFundamentals />
      <RouteHandlers />
      <ClientFetch />
      <ServerFetch />
      <ServerActions />
      <SeparateServer />
      <RenderDeploy />
      <Exercises />
      <CheckUnderstanding />
      <KambazHttp />
      <Delivery />
    </article>
  );
}
