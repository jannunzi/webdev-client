import type { LectureDiagramId } from "@/lib/lectures/types";
import ClientServerDiagram from "./ClientServerDiagram";
import CourseStackDiagram from "./CourseStackDiagram";
import CsrDiagram from "./CsrDiagram";
import DomTreeDiagram from "./DomTreeDiagram";
import GithubCreateRepoMock from "./GithubCreateRepoMock";
import NetworkOfNetworksDiagram from "./NetworkOfNetworksDiagram";
import NpmRunDevMock from "./NpmRunDevMock";
import SsrDiagram from "./SsrDiagram";
import VercelAuthMock from "./VercelAuthMock";
import VercelDeployMock from "./VercelDeployMock";
import VercelImportMock from "./VercelImportMock";
import VercelProtectMock from "./VercelProtectMock";
import VercelSuccessMock from "./VercelSuccessMock";

export default function LectureDiagram({ id }: { id: LectureDiagramId }) {
  switch (id) {
    case "network-of-networks":
      return <NetworkOfNetworksDiagram />;
    case "client-server":
      return <ClientServerDiagram />;
    case "ssr":
      return <SsrDiagram />;
    case "csr":
      return <CsrDiagram />;
    case "course-stack":
      return <CourseStackDiagram />;
    case "dom-tree":
      return <DomTreeDiagram />;
    case "npm-run-dev-mock":
      return <NpmRunDevMock />;
    case "github-create-repo-mock":
      return <GithubCreateRepoMock />;
    case "vercel-import-mock":
      return <VercelImportMock />;
    case "vercel-deploy-mock":
      return <VercelDeployMock />;
    case "vercel-success-mock":
      return <VercelSuccessMock />;
    case "vercel-protect-mock":
      return <VercelProtectMock />;
    case "vercel-auth-mock":
      return <VercelAuthMock />;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}
