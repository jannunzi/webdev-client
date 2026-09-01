import HttpMethods from "./intermediates/5-2-1-HttpMethods";
import StatusCodes from "./intermediates/5-2-2-StatusCodes";
import GetHandler from "./intermediates/5-3-1-GetHandler";
import QueryHandler from "./intermediates/5-3-2-QueryHandler";
import PathHandler from "./intermediates/5-3-3-PathHandler";
import PostHandler from "./intermediates/5-3-4-PostHandler";
import PutDelete from "./intermediates/5-3-5-PutDelete";
import ClientGet from "./intermediates/5-4-1-ClientGet";
import ClientPost from "./intermediates/5-4-2-ClientPost";
import ClientCrud from "./intermediates/5-4-3-ClientCrud";
import ServerFetch from "./intermediates/5-5-1-ServerFetch";
import ServerActionDemo from "./intermediates/5-6-1-ServerAction";
import TwoServers from "./intermediates/5-7-1-TwoServers";
import RemoteHello from "./intermediates/5-7-2-RemoteHello";
import CorsNote from "./intermediates/5-7-3-CorsNote";
import RemoteTodos from "./intermediates/5-7-4-RemoteTodos";

export default function Lab5() {
  return (
    <div id="wd-lab5">
      <h2>Lab 5</h2>
      <HttpMethods />
      <StatusCodes />
      <GetHandler />
      <QueryHandler />
      <PathHandler />
      <PostHandler />
      <PutDelete />
      <ClientGet />
      <ClientPost />
      <ClientCrud />
      <ServerFetch />
      <ServerActionDemo />
      <TwoServers />
      <RemoteHello />
      <CorsNote />
      <RemoteTodos />
    </div>
  );
}
