import PeopleTable from "./PeopleTable";

export default async function PeopleTablePage({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  return <PeopleTable cid={cid} />;
}
