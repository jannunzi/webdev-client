import type { ComponentType } from "react";
import HttpMethods from "../5-2-1-HttpMethods";
import StatusCodes from "../5-2-2-StatusCodes";
import GetHandler from "../5-3-1-GetHandler";
import QueryHandler from "../5-3-2-QueryHandler";
import PathHandler from "../5-3-3-PathHandler";
import PostHandler from "../5-3-4-PostHandler";
import PutDelete from "../5-3-5-PutDelete";
import ClientGet from "../5-4-1-ClientGet";
import ClientPost from "../5-4-2-ClientPost";
import ClientCrud from "../5-4-3-ClientCrud";
import ServerFetch from "../5-5-1-ServerFetch";
import ServerActionDemo from "../5-6-1-ServerAction";
import TwoServers from "../5-7-1-TwoServers";
import RemoteHello from "../5-7-2-RemoteHello";
import CorsNote from "../5-7-3-CorsNote";
import RemoteTodos from "../5-7-4-RemoteTodos";
import { notFound } from "next/navigation";

const STEPS: Record<string, ComponentType> = {
  "5-2-1-HttpMethods": HttpMethods,
  "5-2-2-StatusCodes": StatusCodes,
  "5-3-1-GetHandler": GetHandler,
  "5-3-2-QueryHandler": QueryHandler,
  "5-3-3-PathHandler": PathHandler,
  "5-3-4-PostHandler": PostHandler,
  "5-3-5-PutDelete": PutDelete,
  "5-4-1-ClientGet": ClientGet,
  "5-4-2-ClientPost": ClientPost,
  "5-4-3-ClientCrud": ClientCrud,
  "5-5-1-ServerFetch": ServerFetch,
  "5-6-1-ServerAction": ServerActionDemo,
  "5-7-1-TwoServers": TwoServers,
  "5-7-2-RemoteHello": RemoteHello,
  "5-7-3-CorsNote": CorsNote,
  "5-7-4-RemoteTodos": RemoteTodos,
};

export default async function IntermediateStepPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const Step = STEPS[slug];
  if (!Step) notFound();
  return <Step />;
}
